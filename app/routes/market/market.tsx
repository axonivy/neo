import {
  BasicDialogContent,
  BasicField,
  BasicSelect,
  Button,
  Dialog,
  DialogContent,
  Spinner,
  useDialogHotkeys
} from '@axonivy/ui-components';
import { IvyIcons } from '@axonivy/ui-icons';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import type { MetaFunction } from 'react-router';
import { Link, useParams } from 'react-router';
import { NEO_DESIGNER } from '~/constants';
import { useEngineVersion } from '~/data/engine-info-api';
import type { MarketInstallResult, ProjectBean } from '~/data/generated/ivy-client';
import type { FindProductJsonContent200, ProductModel } from '~/data/generated/market-client';
import { MARKET_URL, useBestMatchingVersion, useProductJson, useProducts, useProductVersions } from '~/data/market-api';
import type { ProjectIdentifier } from '~/data/project-api';
import { useInstallProduct } from '~/data/workspace-api';
import { ProjectSelect } from '~/neo/artifact/ProjectSelect';
import { Breadcrumbs } from '~/neo/Breadcrumb';
import { useCreateEditor } from '~/neo/editors/useCreateEditor';
import { useEditors } from '~/neo/editors/useEditors';
import { ArtifactCard } from '~/neo/overview/artifact/ArtifactCard';
import { InfoPopover } from '~/neo/overview/InfoPopover';
import { Overview } from '~/neo/overview/Overview';
import { OverviewContent } from '~/neo/overview/OverviewContent';
import { OverviewFilter, useOverviewFilter } from '~/neo/overview/OverviewFilter';
import { OverviewTitle } from '~/neo/overview/OverviewTitle';

export const meta: MetaFunction = ({ params }) => {
  return [{ title: `Axon Ivy Market - ${params.ws} - ${NEO_DESIGNER}` }, { name: 'description', content: 'Axon Ivy Market Overview' }];
};

export default function Index() {
  const { t } = useTranslation();
  const overviewFilter = useOverviewFilter();
  const { data, isPending, isFetchingNextPage, fetchNextPage, hasNextPage } = useProducts();
  const { open, onOpenChange } = useDialogHotkeys(['installDialog']);
  const products =
    data?.pages
      .flatMap(page => page)
      ?.filter(product => {
        const lowerCaseSearch = overviewFilter.search.toLocaleLowerCase();
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

  return (
    <Overview>
      <Breadcrumbs items={[{ name: t('market.title') }]} />
      <OverviewTitle title={t('market.title')} description={t('market.description')}>
        <Button size='large' style={{ color: 'var(--P300)' }} icon={IvyIcons.Help} onClick={() => window.open(MARKET_URL, '_blank')} />
      </OverviewTitle>
      <OverviewFilter {...overviewFilter} />
      <OverviewContent isPending={isPending}>
        <InstallDialog product={product} dialogState={open} setDialogState={onOpenChange} />
        {products.map(p => (
          <ProductCard
            key={p.id}
            product={p}
            openProductDialog={product => {
              setProduct(product);
              onOpenChange(true);
            }}
          />
        ))}
      </OverviewContent>
    </Overview>
  );
}

type ProductCardProps = {
  product: ProductModel;
  openProductDialog: (product: ProductModel) => void;
};

export const ProductCard = ({ product, openProductDialog }: ProductCardProps) => {
  const preview = <img src={product.logoUrl} width={70} alt={'product logo'} />;
  const title = product.names?.en ?? '';
  return <ArtifactCard name={title} preview={preview} onClick={() => openProductDialog(product)} />;
};

type InstallDialogProps = {
  product?: ProductModel;
  dialogState: boolean;
  setDialogState: (s: boolean) => void;
};

const InstallDialog = ({ product, dialogState, setDialogState }: InstallDialogProps) => {
  if (product?.id === undefined) {
    return;
  }
  return (
    <Dialog open={dialogState} onOpenChange={setDialogState}>
      <DialogContent>
        <InstallDialogContent product={product} />
      </DialogContent>
    </Dialog>
  );
};

const InstallDialogContent = ({ product }: { product: ProductModel }) => {
  const { t } = useTranslation();
  const { version, setVersion, versions, isPending } = useInstallVersion(product.id);
  const [project, setProject] = useState<ProjectBean>();
  const { needDependency, isInstallDisabled, install } = useInstallButton(product.id, version, project?.id);
  if (product?.id === undefined) {
    return;
  }
  return (
    <BasicDialogContent
      title={t('market.install', { component: product.names?.en ?? '' })}
      description={
        <>
          {product.shortDescriptions?.en ?? ''}
          <Link target='_blank' to={`${MARKET_URL}/${product.id}`} rel='noreferrer'>
            {t('market.showDetails')}
          </Link>
        </>
      }
      cancel={
        <Button variant='outline' size='large'>
          {t('common.label.cancel')}
        </Button>
      }
      submit={
        <Button disabled={isInstallDisabled} variant='primary' size='large' icon={IvyIcons.Play} onClick={install}>
          {t('common.label.install')}
        </Button>
      }
    >
      <BasicField label={t('common.label.version')} control={<InfoPopover info={t('market.selectVersion')} />}>
        {isPending ? (
          <Spinner size='small' />
        ) : (
          <BasicSelect
            items={versions.map(v => ({
              value: v.version ?? '',
              label: v.version ?? ''
            }))}
            value={version}
            onValueChange={value => setVersion(value)}
          />
        )}
      </BasicField>
      {needDependency && (
        <ProjectSelect setProject={setProject} setDefaultValue={true} label={t('neo.addDependency')} projectFilter={p => !p.id.isIar} />
      )}
    </BasicDialogContent>
  );
};

const useInstallVersion = (id?: string) => {
  const [version, setVersion] = useState<string>();
  const { data: versions, isPending, isError } = useProductVersions(id);
  const engineVersion = useEngineVersion();
  const bestMatchingVersion = useBestMatchingVersion(id, engineVersion.data);
  useEffect(() => {
    setVersion(bestMatchingVersion.data);
  }, [bestMatchingVersion.data, setVersion]);
  if (isError) {
    return { version, setVersion, versions: [], isPending: false };
  }
  if (isPending) {
    return { version, setVersion, versions: [], isPending: true };
  }
  return { version, setVersion, versions, isPending: false };
};

type ProductJson = { installers?: { id?: string }[] };

const useInstallButton = (id?: string, version?: string, project?: ProjectIdentifier) => {
  const [needDependency, setNeedDependency] = useState(false);
  const [isInstallDisabled, setInstallDisabled] = useState(true);
  const { installProduct } = useInstallProduct();
  const ws = useParams().ws ?? 'designer';
  const { data } = useProductJson(id, version);
  const { openEditor } = useEditors();
  const { createProcessEditor } = useCreateEditor();
  const openDemos = (result: MarketInstallResult) => {
    result.demoProcesses.forEach(process => openEditor(createProcessEditor(process)));
  };
  useEffect(() => {
    setInstallDisabled(true);
    if (!data) {
      return;
    }
    const needDependency = (data as ProductJson)?.installers?.some(i => i.id === 'maven-dependency') ?? false;
    setNeedDependency(needDependency);
    setInstallDisabled(isDisabled(needDependency, version, project, data));
  }, [data, project, setNeedDependency, version]);
  return { needDependency, isInstallDisabled, install: () => installProduct(ws, JSON.stringify(data), project).then(openDemos) };
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
