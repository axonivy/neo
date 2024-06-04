import { EnableInscriptionAction } from '@axonivy/process-editor-inscription';
import { EnableViewportAction, ShowGridAction, UpdatePaletteItems } from '@axonivy/process-editor-protocol';
import {
  EnableToolPaletteAction,
  GLSPActionDispatcher,
  IDiagramStartup,
  NavigationTarget,
  SelectAction,
  TYPES
} from '@eclipse-glsp/client';
import { ContainerModule, inject, injectable } from 'inversify';
import { IvyDiagramOptions } from './di.config';

import './index.css';

@injectable()
export class StandaloneDiagramStartup implements IDiagramStartup {
  @inject(GLSPActionDispatcher)
  protected actionDispatcher: GLSPActionDispatcher;

  @inject(TYPES.IDiagramOptions)
  protected options: IvyDiagramOptions;

  async preRequestModel(): Promise<void> {
    this.actionDispatcher.dispatch(EnableToolPaletteAction.create());
    this.actionDispatcher.dispatch(EnableViewportAction.create());
  }

  async postRequestModel(): Promise<void> {
    this.actionDispatcher.dispatch(ShowGridAction.create({ show: true }));
    this.actionDispatcher.dispatch(UpdatePaletteItems.create());
  }

  async postModelInitialization(): Promise<void> {
    this.actionDispatcher.dispatch(
      EnableInscriptionAction.create({
        connection: { server: this.options.inscriptionContext.server },
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
