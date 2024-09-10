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

type InstallDialogProps = { children: ReactNode; name: string; installAction: () => { id: string } };
export const InstallDialog = ({ children, name, installAction }: InstallDialogProps) => {
  const id = installAction().id;
  const { data, isPending } = useProductVersions(id);
  const versions = useMemo(() => data ?? [], [data]);
  const [version, setVersion] = useState<string>();
  const { productJson } = useProductJson();
  useEffect(() => {
    if (versions.length > 0) {
      setVersion(versions[0].version ?? '');
    }
  }, [versions]);
  useEffect(() => {
    if (version) {
      productJson(id, version).then(r => console.log(JSON.stringify(r)));
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
        <DialogFooter>
          <Button disabled={!version} variant='primary' size='large' icon={IvyIcons.Close}>
            Continue
          </Button>
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
