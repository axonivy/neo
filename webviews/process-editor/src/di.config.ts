import {
  createIvyDiagramContainer,
  IVY_ACCESSIBILITY_MODULES,
  ivyOpenDataClassModule,
  ivyOpenFormModule,
  ivyStandaloneCopyPasteModule
} from '@axonivy/process-editor';
import { ivyInscriptionModule } from '@axonivy/process-editor-inscription';
import { InscriptionContext } from '@axonivy/process-editor-inscription-protocol';
import { createDiagramOptionsModule, IDiagramOptions, standaloneSelectModule, undoRedoModule } from '@eclipse-glsp/client';
import { Container } from 'inversify';
import ivyAutoSaveModule from './auto-save/di.config';
import ivyNeoModule from './neo/di.config';
import { ivyStartupDiagramModule } from './startup';

export interface IvyDiagramOptions extends IDiagramOptions {
  select: string | null;
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

    // ivyNavigationModule is a replacement for navigationModule but it is already removed in the default IvyDiagramContainer
    ivyInscriptionModule,
    ivyStartupDiagramModule,
    ivyAutoSaveModule,
    ivyNeoModule,
    ivyOpenDataClassModule,
    ivyOpenFormModule,
    ...IVY_ACCESSIBILITY_MODULES
  );
  return container;
}
