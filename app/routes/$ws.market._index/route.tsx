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
  Flex,
  Spinner
} from '@axonivy/ui-components';
import { IvyIcons } from '@axonivy/ui-icons';
import type { MetaFunction } from '@remix-run/node';
import { Link, useParams } from '@remix-run/react';
import { useEffect, useMemo, useState } from 'react';
import type { FindProductJsonContent200, ProductModel } from '~/data/generated/openapi-market';
import { MARKET_URL, useProductJson, useProducts, useProductVersions } from '~/data/market-api';
import type { ProjectIdentifier } from '~/data/project-api';
import { useInstallProduct } from '~/data/workspace-api';
import { cardLinks } from '~/neo/artifact/ArtifactCard';
import { ProjectSelect } from '~/neo/artifact/ProjectSelect';
import { Overview } from '~/neo/Overview';

export const links = cardLinks;

export const meta: MetaFunction = () => {
  return [{ title: 'Axon Ivy Market' }, { name: 'description', content: 'Axon Ivy Market Overview' }];
};

export default function Index() {
  const [search, setSearch] = useState('');
  const { data, isPending, isFetchingNextPage, fetchNextPage, hasNextPage } = useProducts();
  const products =
    data?.pages
      .flatMap(page => page)
      ?.filter(product => {
        const lowerCaseSearch = search.toLocaleLowerCase();
        return (
          product.names?.en.toLocaleLowerCase().includes(lowerCaseSearch) ||
          product.shortDescriptions?.en.includes(lowerCaseSearch) ||
          product.type?.includes(lowerCaseSearch)
        );
      }) ?? [];
  useEffect(() => {
    if (!isFetchingNextPage && hasNextPage) {
      fetchNextPage();
    }
  });
  const [product, setProduct] = useState<ProductModel>();
  const [dialogState, setDialogState] = useState(false);
  return (
    <Overview title='Axon Ivy Market' search={search} onSearchChange={setSearch} isPending={isPending}>
      <InstallDialog product={product} dialogState={dialogState} setDialogState={setDialogState} />
      {products.map(p => (
        <ProductCard key={p.id} product={p} setProduct={setProduct} setDialogState={setDialogState} />
      ))}
    </Overview>
  );
}

type ProductCardProps = {
  product: ProductModel;
  setProduct: (p: ProductModel) => void;
  setDialogState: (s: boolean) => void;
};

export const ProductCard = ({ product, setProduct, setDialogState }: ProductCardProps) => {
  const preview = <img src={product.logoUrl} width={70} alt={'product logo'} />;
  const title = product.names?.en ?? '';
  const openDialog = () => {
    setProduct(product);
    setDialogState(true);
  };
  return (
    <div className='artifact-card'>
      <button className='card' onClick={openDialog}>
        <Flex direction='column' justifyContent='space-between' gap={2} className='card-content'>
          <Flex alignItems='center' justifyContent='center' className='card-preview'>
            {preview}
          </Flex>
          <Flex alignItems='center' justifyContent='space-between' gap={1}>
            <span className='card-name'>{title}</span>
          </Flex>
        </Flex>
      </button>
    </div>
  );
};

type InstallDialogProps = {
  product?: ProductModel;
  dialogState: boolean;
  setDialogState: (s: boolean) => void;
};

const InstallDialog = ({ product, dialogState, setDialogState }: InstallDialogProps) => {
  const [version, setVersion] = useState<string>();
  const [project, setProject] = useState<ProjectIdentifier>();
  const [needDependency, setNeedDependency] = useState(false);
  if (product?.id === undefined) {
    return;
  }
  return (
    <Dialog open={dialogState} onOpenChange={() => setDialogState(false)}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Install {product.names?.en ?? ''}</DialogTitle>
          <DialogDescription>
            {product.shortDescriptions?.en ?? ''}{' '}
            <Link target='_blank' to={`${MARKET_URL}/${product.id}`} rel='noreferrer'>
              See details
            </Link>
          </DialogDescription>
        </DialogHeader>
        <DialogDescription>Select the version to be installed</DialogDescription>
        <VersionSelect id={product.id} setVersion={setVersion}></VersionSelect>
        {needDependency && (
          <ProjectSelect
            setProject={setProject}
            setDefaultValue={true}
            label='Add as dependency to project'
            projectFilter={p => !p.id.isIar}
          />
        )}
        <DialogFooter>
          <InstallButton id={product.id} version={version} setNeedDependency={setNeedDependency} project={project}></InstallButton>
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

const VersionSelect = ({ id, setVersion }: { id: string; setVersion: (version?: string) => void }) => {
  const { data, isPending } = useProductVersions(id);
  const versions = useMemo(() => data ?? [], [data]);
  useEffect(() => {
    if (versions && versions.length > 0 && versions[0].version) {
      setVersion(versions[0].version);
      return;
    }
    setVersion(undefined);
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
  setNeedDependency: (needDependency: boolean) => void;
  version?: string;
  project?: ProjectIdentifier;
};

const isDisabled = (needDependency: boolean, version?: string, project?: ProjectIdentifier, data?: FindProductJsonContent200) => {
  if (version === undefined) {
    return true;
  }
  if (data === undefined) {
    return true;
  }
  if (!needDependency) {
    return false;
  }
  if (project === undefined) {
    return true;
  }
  return false;
};

type ProductJson = { installers?: { id?: string }[] };

const InstallButton = ({ id, version, project, setNeedDependency }: InstallButtonProps) => {
  const ws = useParams().ws ?? 'designer';
  const { installProduct } = useInstallProduct();
  const { data } = useProductJson(id, version);
  const [disabledInstall, setDisabledInstall] = useState(true);
  useEffect(() => {
    setDisabledInstall(true);
    const needDependency = (data as ProductJson)?.installers?.some(i => i.id === 'maven-dependency') ?? false;
    setNeedDependency(needDependency);
    setDisabledInstall(isDisabled(needDependency, version, project, data));
  }, [data, project, setNeedDependency, version]);

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
