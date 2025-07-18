import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@axonivy/ui-components';
import { useTranslation } from 'react-i18next';
import { NavLink } from 'react-router';
import { Fragment } from 'react/jsx-runtime';

type BreadcrumbProps = {
  items?: Array<{ name: string; href?: string }>;
  page: string;
};

export const Breadcrumbs = ({ items, page }: BreadcrumbProps) => {
  const { t } = useTranslation();
  return (
    <Breadcrumb style={{ fontSize: 12 }}>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink asChild>
            <NavLink to='/'>{t('neo.workspaces')}</NavLink>
          </BreadcrumbLink>
        </BreadcrumbItem>
        {items?.map(({ name, href }) => (
          <Fragment key={name}>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              {href ? (
                <BreadcrumbLink asChild>
                  <NavLink to={href ?? '/'}>{name}</NavLink>
                </BreadcrumbLink>
              ) : (
                name
              )}
            </BreadcrumbItem>
          </Fragment>
        ))}
        <BreadcrumbPage>{page}</BreadcrumbPage>
      </BreadcrumbList>
    </Breadcrumb>
  );
};
