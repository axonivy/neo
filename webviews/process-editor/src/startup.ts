import { EnableInscriptionAction } from '@axonivy/process-editor-inscription';
import { EnableViewportAction, UpdatePaletteItems } from '@axonivy/process-editor-protocol';
import {
  EnableToolPaletteAction,
  GLSPActionDispatcher,
  IDiagramStartup,
  NavigationTarget,
  SelectAction,
  SetUIExtensionVisibilityAction,
  ShowGridAction,
  TYPES
} from '@eclipse-glsp/client';
import { ContainerModule, inject, injectable } from 'inversify';
import type { IvyDiagramOptions } from './di.config';

import { NotificationToasterId } from '@axonivy/process-editor';
import './index.css';
import { createWebSocketConnection } from './ws-connection';

@injectable()
export class StandaloneDiagramStartup implements IDiagramStartup {
  @inject(GLSPActionDispatcher) protected actionDispatcher!: GLSPActionDispatcher;
  @inject(TYPES.IDiagramOptions) protected options!: IvyDiagramOptions;

  async preRequestModel(): Promise<void> {
    this.actionDispatcher.dispatch(EnableToolPaletteAction.create());
    this.actionDispatcher.dispatch(EnableViewportAction.create());
    this.actionDispatcher.dispatch(SetUIExtensionVisibilityAction.create({ extensionId: NotificationToasterId, visible: true }));
  }

  async postRequestModel(): Promise<void> {
    this.actionDispatcher.dispatch(ShowGridAction.create({ show: true }));
    this.actionDispatcher.dispatch(UpdatePaletteItems.create());
  }

  async postModelInitialization(): Promise<void> {
    const server = this.options.inscriptionContext.server;
    const url = new URL('ivy-inscription-lsp', server);
    const inscription = await createWebSocketConnection(url);
    this.actionDispatcher.dispatch(
      EnableInscriptionAction.create({
        connection: { inscription, server },
        inscriptionContext: this.options.inscriptionContext
      })
    );
    if (this.options.select) {
      const elementIds = this.options.select.split(NavigationTarget.ELEMENT_IDS_SEPARATOR);
      this.actionDispatcher.dispatch(SelectAction.create({ selectedElementsIDs: elementIds }));
    }
  }
}

export const ivyStartupDiagramModule = new ContainerModule(bind => {
  bind(TYPES.IDiagramStartup).to(StandaloneDiagramStartup).inSingletonScope();
});
