import { createContext, useContext, useState } from 'react';
import { ProjectIdentifier } from '~/data/project-api';
import { NewArtifactDialog } from './NewArtifactDialog';

export type DialogContext = {
  title: string;
  defaultName: string;
  create: (name: string, namespace: string, project?: ProjectIdentifier, pid?: string) => string | number;
  project?: ProjectIdentifier;
  pid?: string;
};

type NewArtifactDialogState = {
  open: (context: DialogContext) => void;
  close: () => void;
  dialogState: boolean;
  dialogContext?: DialogContext;
};

const NewArtifactDialogContext = createContext<NewArtifactDialogState | undefined>(undefined);

export const NewArtifactDialogProvider = ({ children }: { children: React.ReactNode }) => {
  const [dialogState, setDialogState] = useState(false);
  const [dialogContext, setDialogContext] = useState<DialogContext>();
  const open = (context: DialogContext) => {
    setDialogState(true);
    setDialogContext(context);
  };
  const close = () => setDialogState(false);
  return (
    <NewArtifactDialogContext.Provider value={{ open, close, dialogState, dialogContext }}>
      {children}
      <NewArtifactDialog />
    </NewArtifactDialogContext.Provider>
  );
};

export const useNewArtifactDialog = () => {
  const context = useContext(NewArtifactDialogContext);
  if (context === undefined) throw new Error('useNewArtifactDialog must be used within a NewArtifactDialogProvider');
  return context;
};
