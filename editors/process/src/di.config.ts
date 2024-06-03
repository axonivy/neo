import { createIvyDiagramContainer, ivyThemeModule } from '@axonivy/process-editor';
import { ivyInscriptionModule } from '@axonivy/process-editor-inscription';
import { IDiagramOptions, createDiagramOptionsModule, standaloneSelectModule, undoRedoModule } from '@eclipse-glsp/client';
import { Container } from 'inversify';
import ivyStandaloneCopyPasteModule from './copy-paste/di.config';
import ivyNavigationModule from './navigate/di.config';
import { ThemeMode } from '@axonivy/process-editor-protocol';
import { InscriptionContext } from '@axonivy/inscription-protocol';
import { ivyStartupDiagramModule } from './startup';

export interface IvyDiagramOptions extends IDiagramOptions {
  select: string | null;
  theme: ThemeMode;
  inscriptionContext: InscriptionContext & { server: string };
}

export default function createContainer(options: IvyDiagramOptions): Container {
  const container = createIvyDiagramContainer(
    'sprotty',
    createDiagramOptionsModule(options),
    // standalone modules
    standaloneSelectModule,
    undoRedoModule,
    ivyStandaloneCopyPasteModule,
    ivyThemeModule,

    // ivyNavigationModule is a replacement for navigationModule but it is already removed in the default IvyDiagramContainer
    ivyNavigationModule,
    ivyInscriptionModule,
    ivyStartupDiagramModule
  );
  return container;
}
