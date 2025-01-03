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
import { useEffect, useMemo, useState } from 'react';
import type { LinksFunction, MetaFunction } from 'react-router';
import { Link, useParams } from 'react-router';
import { NEO_DESIGNER } from '~/constants';
import { useEngineVersion } from '~/data/engine-info-api';
import type { MarketInstallResult } from '~/data/generated/openapi-default';
import type { ProjectBean } from '~/data/generated/openapi-dev';
import type { FindProductJsonContent200, ProductModel } from '~/data/generated/openapi-market';
import { MARKET_URL, useBestMatchingVersion, useProductJson, useProducts, useProductVersions } from '~/data/market-api';
import type { ProjectIdentifier } from '~/data/project-api';
import { useInstallProduct } from '~/data/workspace-api';
import { cardStylesLink } from '~/neo/artifact/ArtifactCard';
import { ProjectSelect } from '~/neo/artifact/ProjectSelect';
import { useCreateEditor } from '~/neo/editors/useCreateEditor';
import { useEditors } from '~/neo/editors/useEditors';
import { Overview } from '~/neo/Overview';
import { useSearch } from '~/neo/useSearch';

export const links: LinksFunction = () => [cardStylesLink];

export const meta: MetaFunction = ({ params }) => {
  return [{ title: `Axon Ivy Market - ${params.ws} - ${NEO_DESIGNER}` }, { name: 'description', content: 'Axon Ivy Market Overview' }];
};

export default function Index() {
  const { search, setSearch } = useSearch();
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
    <Overview
      title='Axon Ivy Market'
      description='Here you can find and download reusable components, templates and solutions to accelerate development.'
      helpUrl={MARKET_URL}
      search={search}
      onSearchChange={setSearch}
      isPending={isPending}
    >
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
  const [project, setProject] = useState<ProjectBean>();
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
        <VersionSelect id={product.id} setVersion={setVersion} version={version}></VersionSelect>
        {needDependency && (
          <ProjectSelect
            setProject={setProject}
            setDefaultValue={true}
            label='Add as dependency to project'
            projectFilter={p => !p.id.isIar}
          />
        )}
        <DialogFooter>
          <InstallButton id={product.id} version={version} setNeedDependency={setNeedDependency} project={project?.id}></InstallButton>
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

const VersionSelect = ({ id, setVersion, version }: { id: string; setVersion: (version?: string) => void; version?: string }) => {
  const { data, isPending } = useProductVersions(id);
  const versions = useMemo(() => data ?? [], [data]);
  const engineVersion = useEngineVersion();
  const bestMatchingVersion = useBestMatchingVersion(id, engineVersion.data);
  useEffect(() => {
    setVersion(bestMatchingVersion.data);
  }, [bestMatchingVersion.data, setVersion]);
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
          value={version}
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
  const { openEditor } = useEditors();
  const { createProcessEditor } = useCreateEditor();
  const openDemos = (result: MarketInstallResult) => {
    result.demoProcesses.forEach(process => openEditor(createProcessEditor(process)));
  };
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
        onClick={() => installProduct(ws, JSON.stringify(data), project).then(openDemos)}
      >
        Install
      </Button>
    </DialogClose>
  );
};
