import { createContext, useContext, useState } from 'react';
import { ProjectIdentifier } from '~/data/project-api';

export type DialogContext = {
  title: string;
  defaultName: string;
  create: (name: string, namespace: string, project?: ProjectIdentifier, pid?: string) => string | number;
  project?: ProjectIdentifier;
  pid?: string;
};

type NewArtifactDialogState = {
  openState: boolean;
  setOpenState: (openState: boolean) => void;
  dialogContext?: DialogContext;
  setDialogContext: (context: DialogContext) => void;
};

const NewArtifactDialogContext = createContext<NewArtifactDialogState | undefined>(undefined);

export const NewArtifactDialogProvider = ({ children }: { children: React.ReactNode }) => {
  const [openState, setOpenState] = useState(false);
  const [dialogContext, setDialogContext] = useState<DialogContext>();
  return (
    <NewArtifactDialogContext.Provider value={{ openState, setOpenState, dialogContext, setDialogContext }}>
      {children}
    </NewArtifactDialogContext.Provider>
  );
};

export const useNewArtifactDialog = () => {
  const context = useContext(NewArtifactDialogContext);
  if (context === undefined) throw new Error('useNewDialog must be used within a NewArtifactDialogProvider');
  const { openState, setOpenState, setDialogContext, dialogContext } = context;
  const open = (context: DialogContext) => {
    setDialogContext(context);
    setOpenState(true);
  };
  const close = () => setOpenState(false);
  return { open, close, openState, dialogContext };
};
