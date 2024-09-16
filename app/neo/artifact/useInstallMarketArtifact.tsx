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
  const ws = useParams().ws ?? 'designer';
  const { data, isPending } = useProductVersions(product.id!);
  const { findProductJson } = useProductJson();
  const { installProduct } = useInstallProduct();
  const versions = useMemo(() => data ?? [], [data]);
  const [version, setVersion] = useState<string>();
  const [project, setProject] = useState<ProjectIdentifier>();
  const [needDependency, setNeedDependency] = useState(false);
  const [disabledInstall, setDisabledInstall] = useState(true);
  const [productJson, setProductJson] = useState<string>('');

  useEffect(() => {
    if (versions.length > 0) {
      setVersion(versions[0].version ?? '');
    }
  }, [versions]);

  useEffect(() => {
    if (version && product.id) {
      findProductJson(product.id, version).then(pj => {
        setProductJson(JSON.stringify(pj));
        setNeedDependency((pj as ProductJson)?.installers?.some(i => i.id === 'maven-dependency') ?? false);
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [version, product.id]);

  useEffect(() => {
    setDisabledInstall(needDependency ? (project ? false : true) : false);
  }, [needDependency, project]);

  return (
    <Dialog open={dialogState} onOpenChange={() => close()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Install {product.names?.en ?? ''}</DialogTitle>
          <DialogDescription>{product.shortDescriptions?.en ?? ''}</DialogDescription>
        </DialogHeader>

        <DialogDescription>Select the version to be installed</DialogDescription>
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
              onValueChange={value => {
                setVersion(value);
                setDisabledInstall(true);
              }}
            />
          )}
        </BasicField>

        {needDependency && <ProjectSelect setProject={setProject} />}

        <DialogFooter>
          <DialogClose asChild>
            <Button
              disabled={disabledInstall}
              variant='primary'
              size='large'
              icon={IvyIcons.Play}
              onClick={() => installProduct(ws, productJson, project)}
            >
              Install
            </Button>
          </DialogClose>
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

export const useInstallMarketArtifact = () => {
  const context = useContext(InstallMarketArtifactDialogContext);
  if (context === undefined) throw new Error('useInstallMarketArtifact must be used within a InstallMarketArtifactDialogProvider');
  return context.open;
};
