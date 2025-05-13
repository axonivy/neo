import { expect, test } from '@playwright/test';
import { Neo } from '../page-objects/neo';
import { ProcessEditor } from '../page-objects/process-editor';
import { RuntimeLogView } from '../page-objects/runtimelog-view';

test('logs', async ({ page }) => {
  const neo = await Neo.openWorkspace(page);
  await neo.controlBar.toggleBrowser();
  await neo.views.openView('Runtime Log');
  const logView = new RuntimeLogView(neo);
  await logView.expectOpen();
  await expect(logView.logs()).toHaveCount(0);

  await startLogProcess(neo);
  await logView.view.getByRole('button', { name: 'Refresh' }).click();
  await expect(logView.logs()).toHaveCount(3);
  await logView.clear();
});

const startLogProcess = async (neo: Neo) => {
  const processes = await neo.processes();
  await processes.card('runtimeLog').click();
  const editor = new ProcessEditor(neo, 'runtimeLog');
  await editor.expectOpen('19619B9BB7B9F741-f0');
  await neo.navigation.resetAnimation();
  await neo.navigation.disableAnimation();
  const start = editor.elementByPid('19619B9BB7B9F741-f0');
  await start.triggerQuickAction(/Start Process/);
  const end = editor.elementByPid('19619B9BB7B9F741-f1');
  await end.expectExecuted();
};
