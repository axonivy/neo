import { MetaFunction } from '@remix-run/node';
import { useState } from 'react';
import { useCreateDataClass, useDataClasses, useDeleteDataClass } from '~/data/data-class-api';
import { DataClassIdentifier } from '~/data/generated/openapi-dev';
import { ProjectIdentifier } from '~/data/project-api';
import { ArtifactCard, cardLinks, NewArtifactCard } from '~/neo/artifact/ArtifactCard';
import { useNewArtifact } from '~/neo/artifact/useNewArtifact';
import { useCreateEditor } from '~/neo/editors/useCreateEditor';
import { Editor, useEditors } from '~/neo/editors/useEditors';
import { Overview } from '~/neo/Overview';
import PreviewSVG from './dataclass-preview.svg?react';

export const links = cardLinks;

export const meta: MetaFunction = () => {
  return [{ title: 'Axon Ivy Data Classes' }, { name: 'description', content: 'Axon Ivy Data Classes Overview' }];
};

export default function Index() {
  const [search, setSearch] = useState('');
  const { data, isPending } = useDataClasses();
  const { createDataClassEditor } = useCreateEditor();
  const dataClasses = data?.filter(dc => dc.name.toLocaleLowerCase().includes(search.toLocaleLowerCase())) ?? [];
  return (
    <Overview title='Data Classes' search={search} onSearchChange={setSearch} isPending={isPending}>
      <NewDataClassCard />
      {dataClasses.map(dc => {
        const editor = createDataClassEditor(dc);
        return <DataClassCard key={editor.id} dataClassId={dc.dataClassIdentifier} {...editor} />;
      })}
    </Overview>
  );
}

export const DataClassCard = ({ dataClassId, ...editor }: Editor & { dataClassId: DataClassIdentifier }) => {
  const { deleteDataClass } = useDeleteDataClass();
  const { openEditor, removeEditor } = useEditors();
  const open = () => {
    openEditor(editor);
  };
  const deleteAction = () => {
    removeEditor(editor.id);
    deleteDataClass(dataClassId);
  };
  return <ArtifactCard name={editor.name} type='dataclass' preview={<PreviewSVG />} onClick={open} actions={{ delete: deleteAction }} />;
};

const NewDataClassCard = () => {
  const open = useNewArtifact();
  const { createDataClass } = useCreateDataClass();
  const { openEditor } = useEditors();
  const { createDataClassEditor } = useCreateEditor();
  const create = (name: string, namespace: string, project?: ProjectIdentifier) =>
    createDataClass({ name: `${namespace}.${name}`, project }).then(dataClass => openEditor(createDataClassEditor(dataClass)));
  const title = 'Create new Data Class';
  return <NewArtifactCard title={title} open={() => open({ create, title, defaultName: 'MyNewDataClass' })} />;
};
