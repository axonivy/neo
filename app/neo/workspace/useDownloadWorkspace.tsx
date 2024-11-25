import { useParams } from 'react-router';
import { useExportWorkspace } from '~/data/workspace-api';

export const useDownloadWorkspace = (workspace?: string) => {
  const { ws } = useParams();
  const wsName = workspace ?? ws ?? '';
  const { exportWorkspace } = useExportWorkspace();
  return () => {
    exportWorkspace(wsName).then(zip => {
      if (!(zip instanceof Blob)) {
        return;
      }
      const url = window.URL.createObjectURL(zip);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${wsName}.zip`;
      link.click();
    });
  };
};
