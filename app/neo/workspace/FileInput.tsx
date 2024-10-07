import { BasicField, Input } from '@axonivy/ui-components';

export const FileInput = ({ setFile }: { setFile: (file: File) => void }) => (
  <BasicField label='Select an .iar file or a .zip file that contains .iar files'>
    <Input
      accept='.zip,.iar'
      type='file'
      onChange={e => {
        if (e.target.files && e.target.files.length > 0) {
          setFile(e.target.files[0]);
        }
      }}
    />
  </BasicField>
);
