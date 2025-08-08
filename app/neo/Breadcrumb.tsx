import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  Flex
} from '@axonivy/ui-components';
import { IvyIcons } from '@axonivy/ui-icons';
import type { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { NavLink, useParams } from 'react-router';
import { Fragment } from 'react/jsx-runtime';

type BreadcrumbItem = { name: string; href?: string; menu?: ReactNode };

type BreadcrumbProps = {
  style?: React.CSSProperties;
  items?: Array<BreadcrumbItem>;
};

export const Breadcrumbs = ({ style, items = [] }: BreadcrumbProps) => {
  const { t } = useTranslation();
  const { ws } = useParams();
  const workspacesItem: BreadcrumbItem = { name: t('neo.workspaces'), href: '' };
  const wsItem: BreadcrumbItem = { name: ws ?? '', href: ws };
  const breadcrumbItems = [workspacesItem, wsItem, ...items];
  const lastItem = breadcrumbItems.pop();
  return (
    <Breadcrumb style={style ?? { fontSize: 12 }}>
      <BreadcrumbList>
        {breadcrumbItems?.map(item => (
          <Fragment key={`${item.name}-${item.href}`}>
            <BreadcrumbItem>
              <BreadcrumbPart {...item} />
            </BreadcrumbItem>
            <BreadcrumbSeparator />
          </Fragment>
        ))}
        {lastItem && (
          <BreadcrumbItem>
            <BreadcrumbPage>
              <BreadcrumbPart {...lastItem} />
            </BreadcrumbPage>
          </BreadcrumbItem>
        )}
      </BreadcrumbList>
    </Breadcrumb>
  );
};

const BreadcrumbPart = ({ name, href, menu }: BreadcrumbItem) => {
  let item: ReactNode = name;
  if (href !== undefined) {
    item = (
      <BreadcrumbLink asChild>
        <NavLink to={`/${href ?? ''}`}>{name}</NavLink>
      </BreadcrumbLink>
    );
  }
  if (menu) {
    return (
      <Flex direction='row' alignItems='center' gap={1}>
        {item}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button icon={IvyIcons.Chevron} rotate={90} style={{ height: 16 }} />
          </DropdownMenuTrigger>
          <DropdownMenuContent>{menu}</DropdownMenuContent>
        </DropdownMenu>
      </Flex>
    );
  }
  return item;
};
