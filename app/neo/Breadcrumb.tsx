import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@axonivy/ui-components';
import { useTranslation } from 'react-i18next';
import { NavLink, useParams } from 'react-router';
import { Fragment } from 'react/jsx-runtime';

type BreadcrumbProps = {
  items?: Array<{ name: string; href?: string }>;
};

export const Breadcrumbs = ({ items = [] }: BreadcrumbProps) => {
  const { t } = useTranslation();
  const { ws } = useParams();
  const workspacesItem = { name: t('neo.workspaces'), href: '' };
  const wsItem = { name: ws, href: ws };
  const breadcrumbItems = [workspacesItem, wsItem, ...items];
  const lastItem = breadcrumbItems.pop();
  return (
    <Breadcrumb style={{ fontSize: 12 }}>
      <BreadcrumbList>
        {breadcrumbItems?.map(({ name, href }) => (
          <Fragment key={name}>
            <BreadcrumbItem>
              {href !== undefined ? (
                <BreadcrumbLink asChild>
                  <NavLink to={`/${href ?? ''}`}>{name}</NavLink>
                </BreadcrumbLink>
              ) : (
                name
              )}
            </BreadcrumbItem>
            <BreadcrumbSeparator />
          </Fragment>
        ))}
        <BreadcrumbPage>{lastItem?.name}</BreadcrumbPage>
      </BreadcrumbList>
    </Breadcrumb>
  );
};
