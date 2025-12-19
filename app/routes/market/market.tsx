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
import { useEffect, useMemo, useState } from 'react';
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
import { useCreateEditor } from '~/neo/editors/useCreateEditor';
import { useEditors } from '~/neo/editors/useEditors';
import { Breadcrumbs } from '~/neo/navigation/Breadcrumb';
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
  const { data, isPending, isFetchingNextPage, fetchNextPage, hasNextPage } = useProducts();
  const { open, onOpenChange } = useDialogHotkeys(['installDialog']);
  const { filteredAritfacts, ...overviewFilter } = useOverviewFilter(data?.pages.flatMap(page => page) ?? [], (product, search) => {
    return (
      (product.names?.en?.toLocaleLowerCase().includes(search) ||
        product.shortDescriptions?.en?.toLocaleLowerCase().includes(search) ||
        product.type?.toLocaleLowerCase().includes(search)) ??
      false
    );
  });
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
        {filteredAritfacts.map(product => (
          <ProductCard
            key={product.id}
            product={product}
            openProductDialog={product => {
              setProduct(product);
              onOpenChange(true);
            }}
          />
        ))}
      </OverviewContent>
      <InstallDialog product={product} dialogState={open} setDialogState={onOpenChange} />
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
  return <ArtifactCard name={title} preview={preview} onClick={() => openProductDialog(product)} tooltip={product.shortDescriptions?.en} />;
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
  const { version, select } = useInstallVersion(product.id);
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
        {select}
      </BasicField>
      {needDependency && (
        <ProjectSelect
          onProjectChange={setProject}
          setDefaultValue={true}
          label={t('neo.addDependency')}
          projectFilter={p => !p.id.isIar}
        />
      )}
    </BasicDialogContent>
  );
};

const useInstallVersion = (id?: string) => {
  const [version, setVersion] = useState<string>();
  const productVersion = useProductVersions(id);
  const engineVersion = useEngineVersion();
  const bestMatchingVersion = useBestMatchingVersion(id, engineVersion.data);

  if (bestMatchingVersion.data && version === undefined) {
    setVersion(bestMatchingVersion.data);
  }

  if (productVersion.isPending || engineVersion.isPending || bestMatchingVersion.isPending) {
    return { version, select: <Spinner size='small' /> };
  }

  const select = (
    <BasicSelect
      items={
        productVersion.data?.map(v => ({
          value: v.version ?? '',
          label: v.version ?? ''
        })) ?? []
      }
      value={version}
      onValueChange={value => setVersion(value)}
    />
  );
  if (productVersion.isError || engineVersion.isError || bestMatchingVersion.isError) {
    return { version, select };
  }
  return { version, select };
};

type ProductJson = { installers?: { id?: string }[] };

const useInstallButton = (id?: string, version?: string, project?: ProjectIdentifier) => {
  const { installProduct } = useInstallProduct();
  const ws = useParams().ws ?? 'designer';
  const { data } = useProductJson(id, version);
  const { openEditor } = useEditors();
  const { createProcessEditor } = useCreateEditor();
  const openDemos = (result: MarketInstallResult) => {
    result.demoProcesses.forEach(process => openEditor(createProcessEditor(process)));
  };
  const needDependency = useMemo(() => (data as ProductJson)?.installers?.some(i => i.id === 'maven-dependency') ?? false, [data]);
  const isInstallDisabled = useMemo(() => isDisabled(needDependency, version, project, data), [needDependency, version, project, data]);
  return { needDependency, isInstallDisabled, install: () => installProduct(ws, JSON.stringify(data), project).then(openDemos) };
};

const isDisabled = (needDependency: boolean, version?: string, project?: ProjectIdentifier, data?: FindProductJsonContent200 | null) => {
  if (version === undefined) {
    return true;
  }
  if (data === undefined || data === null) {
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
