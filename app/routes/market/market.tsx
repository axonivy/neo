import { BasicDialog, BasicField, BasicSelect, Button, DialogClose, Flex, Spinner, useHotkeyLocalScopes } from '@axonivy/ui-components';
import { IvyIcons } from '@axonivy/ui-icons';
import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import type { LinksFunction, MetaFunction } from 'react-router';
import { Link, useParams } from 'react-router';
import { NEO_DESIGNER } from '~/constants';
import { useEngineVersion } from '~/data/engine-info-api';
import type { MarketInstallResult, ProjectBean } from '~/data/generated/ivy-client';
import type { FindProductJsonContent200, ProductModel } from '~/data/generated/market-client';
import { MARKET_URL, useBestMatchingVersion, useProductJson, useProducts, useProductVersions } from '~/data/market-api';
import type { ProjectIdentifier } from '~/data/project-api';
import { useInstallProduct } from '~/data/workspace-api';
import { cardStylesLink } from '~/neo/artifact/ArtifactCard';
import { ProjectSelect } from '~/neo/artifact/ProjectSelect';
import { Breadcrumbs } from '~/neo/Breadcrumb';
import { useCreateEditor } from '~/neo/editors/useCreateEditor';
import { useEditors } from '~/neo/editors/useEditors';
import { Overview } from '~/neo/overview/Overview';
import { OverviewContent } from '~/neo/overview/OverviewContent';
import { OverviewFilter, useOverviewFilter } from '~/neo/overview/OverviewFilter';
import { OverviewTitle } from '~/neo/overview/OverviewTitle';

export const links: LinksFunction = () => [cardStylesLink];

export const meta: MetaFunction = ({ params }) => {
  return [{ title: `Axon Ivy Market - ${params.ws} - ${NEO_DESIGNER}` }, { name: 'description', content: 'Axon Ivy Market Overview' }];
};

export default function Index() {
  const { t } = useTranslation();
  const overviewFilter = useOverviewFilter();
  const { data, isPending, isFetchingNextPage, fetchNextPage, hasNextPage } = useProducts();
  const { activateLocalScopes, restoreLocalScopes } = useHotkeyLocalScopes(['installDialog']);
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
  const [dialogState, setDialogState] = useState(false);
  const onDialogOpenChange = (open: boolean) => {
    setDialogState(open);
    if (open) {
      activateLocalScopes();
    } else {
      restoreLocalScopes();
    }
  };

  return (
    <Overview>
      <Breadcrumbs items={[{ name: t('market.title') }]} />
      <OverviewTitle title={t('market.title')} description={t('market.description')} helpUrl={MARKET_URL} />
      <OverviewFilter {...overviewFilter} />
      <OverviewContent isPending={isPending}>
        <InstallDialog product={product} dialogState={dialogState} setDialogState={onDialogOpenChange} />
        {products.map(p => (
          <ProductCard key={p.id} product={p} setProduct={setProduct} setDialogState={onDialogOpenChange} />
        ))}
      </OverviewContent>
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
  const { t } = useTranslation();
  const [version, setVersion] = useState<string>();
  const [project, setProject] = useState<ProjectBean>();
  const [needDependency, setNeedDependency] = useState(false);
  if (product?.id === undefined) {
    return;
  }
  return (
    <BasicDialog
      open={dialogState}
      onOpenChange={() => setDialogState(false)}
      contentProps={{
        title: t('market.install', { component: product.names?.en ?? '' }),
        description: (
          <>
            {product.shortDescriptions?.en ?? ''}{' '}
            <Link target='_blank' to={`${MARKET_URL}/${product.id}`} rel='noreferrer'>
              {t('market.showDetails')}
            </Link>
          </>
        ),
        buttonClose: (
          <Button variant='outline' size='large'>
            {t('common.label.cancel')}
          </Button>
        ),
        buttonCustom: (
          <InstallButton id={product.id} version={version} setNeedDependency={setNeedDependency} project={project?.id}></InstallButton>
        )
      }}
    >
      {t('market.selectVersion')}
      <VersionSelect id={product.id} setVersion={setVersion} version={version}></VersionSelect>
      {needDependency && (
        <ProjectSelect setProject={setProject} setDefaultValue={true} label={t('neo.addDependency')} projectFilter={p => !p.id.isIar} />
      )}
    </BasicDialog>
  );
};

const VersionSelect = ({ id, setVersion, version }: { id: string; setVersion: (version?: string) => void; version?: string }) => {
  const { data, isPending } = useProductVersions(id);
  const versions = useMemo(() => data ?? [], [data]);
  const engineVersion = useEngineVersion();
  const bestMatchingVersion = useBestMatchingVersion(id, engineVersion.data);
  const { t } = useTranslation();
  useEffect(() => {
    setVersion(bestMatchingVersion.data);
  }, [bestMatchingVersion.data, setVersion]);
  return (
    <BasicField label={t('common.label.version')}>
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
  const { t } = useTranslation();
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
        {t('common.label.install')}
      </Button>
    </DialogClose>
  );
};
