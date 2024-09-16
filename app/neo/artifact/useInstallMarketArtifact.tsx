import {
  BasicField,
  BasicSelect,
  Button,
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  Spinner
} from '@axonivy/ui-components';
import { IvyIcons } from '@axonivy/ui-icons';
import { useParams } from '@remix-run/react';
import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { ProductModel } from '~/data/generated/openapi-market';
import { useProductJson, useProductVersions } from '~/data/market-api';
import { ProjectIdentifier } from '~/data/project-api';
import { useInstallProduct } from '~/data/workspace-api';
import { ProjectSelect } from './ProjectSelect';

type InstallMarketArtifactDialogState = {
  open: (product: ProductModel) => void;
  dialogState: boolean;
};

type Installer = { id?: string };
type ProductJson = { installers?: Installer[] };

const InstallMarketArtifactDialogContext = createContext<InstallMarketArtifactDialogState | undefined>(undefined);

export const InstallMarketArtifactDialogProvider = ({ children }: { children: React.ReactNode }) => {
  const [dialogState, setDialogState] = useState(false);
  const [product, setProduct] = useState<ProductModel>();
  const open = (product: ProductModel) => {
    setDialogState(true);
    setProduct(product);
  };
  const close = () => setDialogState(false);
  return (
    <InstallMarketArtifactDialogContext.Provider value={{ open, dialogState }}>
      {children}
      {product && <InstallDialog dialogState={dialogState} product={product} close={close}></InstallDialog>}
    </InstallMarketArtifactDialogContext.Provider>
  );
};

const InstallDialog = ({ dialogState, product, close }: { dialogState: boolean; product: ProductModel; close: () => void }) => {
  const [version, setVersion] = useState<string>();
  const [project, setProject] = useState<ProjectIdentifier>();
  const [needDependency, setNeedDependency] = useState(false);
  return (
    <Dialog open={dialogState} onOpenChange={() => close()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Install {product.names?.en ?? ''}</DialogTitle>
          <DialogDescription>{product.shortDescriptions?.en ?? ''}</DialogDescription>
        </DialogHeader>

        <DialogDescription>Select the version to be installed</DialogDescription>

        {product.id && <VersionSelect id={product.id} setVersion={setVersion}></VersionSelect>}

        {needDependency && <ProjectSelect setProject={setProject} />}

        <DialogFooter>
          {product.id && version && (
            <InstallButton id={product.id} version={version} setNeedDependency={setNeedDependency} project={project}></InstallButton>
          )}
          <DialogClose asChild>
            <Button variant='outline' size='large' icon={IvyIcons.Close}>
              Cancel
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

const VersionSelect = ({ id, setVersion }: { id: string; setVersion: (version: string) => void }) => {
  const { data, isPending } = useProductVersions(id);
  const versions = useMemo(() => data ?? [], [data]);
  useEffect(() => {
    if (versions && versions.length > 0 && versions[0].version) {
      setVersion(versions[0].version);
    }
  }, [setVersion, versions]);
  return (
    <BasicField label='Version'>
      {isPending ? (
        <Spinner size='small' />
      ) : (
        <BasicSelect
          placeholder={isPending && <Spinner size='small' />}
          items={versions.map(v => ({
            value: v.version ?? '',
            label: v.version ?? ''
          }))}
          defaultValue={versions[0].version}
          onValueChange={value => setVersion(value)}
        />
      )}
    </BasicField>
  );
};

type InstallButtonProps = {
  id: string;
  version: string;
  setNeedDependency: (needDependency: boolean) => void;
  project?: ProjectIdentifier;
};

const InstallButton = ({ id, version, project, setNeedDependency }: InstallButtonProps) => {
  const ws = useParams().ws ?? 'designer';
  const { installProduct } = useInstallProduct();
  const { data } = useProductJson(id, version);
  const [disabledInstall, setDisabledInstall] = useState(true);

  useEffect(() => {
    setDisabledInstall(true);
    const needDependency = (data as ProductJson)?.installers?.some(i => i.id === 'maven-dependency') ?? false;
    setNeedDependency(needDependency);
    setDisabledInstall(needDependency ? (project ? false : true) : false);
  }, [data, project, setNeedDependency]);

  return (
    <DialogClose asChild>
      <Button
        disabled={disabledInstall}
        variant='primary'
        size='large'
        icon={IvyIcons.Play}
        onClick={() => installProduct(ws, JSON.stringify(data), project)}
      >
        Install
      </Button>
    </DialogClose>
  );
};

export const useInstallMarketArtifact = () => {
  const context = useContext(InstallMarketArtifactDialogContext);
  if (context === undefined) throw new Error('useInstallMarketArtifact must be used within a InstallMarketArtifactDialogProvider');
  return context.open;
};
