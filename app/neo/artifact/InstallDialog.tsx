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
  DialogTrigger,
  Spinner
} from '@axonivy/ui-components';
import { IvyIcons } from '@axonivy/ui-icons';
import { ReactNode, useEffect, useMemo, useState } from 'react';
import { useProductJson, useProductVersions } from '~/data/market-api';
import { ProjectIdentifier } from '~/data/project-api';
import { useInstallProduct } from '~/data/workspace-api';
import { ProjectSelect } from './ProjectSelect';

type Installer = { id?: string };
type ProductJson = { installers?: Installer[] };

type InstallDialogProps = { children: ReactNode; name: string; installAction: () => { id: string } };
export const InstallDialog = ({ children, name, installAction }: InstallDialogProps) => {
  const id = installAction().id;
  const { data, isPending } = useProductVersions(id);
  const { installProduct } = useInstallProduct();
  const versions = useMemo(() => data ?? [], [data]);
  const [version, setVersion] = useState<string>();
  const { productJson } = useProductJson();
  const [json, setJson] = useState<string>();
  const [project, setProject] = useState<ProjectIdentifier>();
  const [needDependency, setNeedDependency] = useState(false);
  const [disabledInstall, setDisabledInstall] = useState(true);

  useEffect(() => {
    if (versions.length > 0) {
      setVersion(versions[0].version ?? '');
    }
  }, [versions]);

  useEffect(() => {
    if (version) {
      productJson(id, version).then(ps => {
        setDisabledInstall(true);
        setJson(JSON.stringify(ps));
        console.log(json);
        setNeedDependency((ps as ProductJson)?.installers?.some(i => i.id === 'maven-dependency') ?? false);
        setDisabledInstall(!needDependency || (needDependency && project ? false : true));
      });
    }
  });

  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Install {name}</DialogTitle>
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
              onValueChange={value => setVersion(value)}
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
              onClick={() => installProduct(id, json ?? '', project)}
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
