import { MetaFunction } from '@remix-run/node';
import { useParams } from '@remix-run/react';
import { useMemo, useState } from 'react';
import { useCreateDataClass, useDeleteDataClass, useGroupedDataClasses } from '~/data/data-class-api';
import { DataClassIdentifier } from '~/data/generated/openapi-dev';
import { ProjectIdentifier } from '~/data/project-api';
import { ArtifactCard, cardLinks, NewArtifactCard } from '~/neo/artifact/ArtifactCard';
import { ArtifactGroup } from '~/neo/artifact/ArtifactGroup';
import { filterArifacts, insertWorkspaceIfAbsent } from '~/neo/artifact/list-artifacts';
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
  const { ws } = useParams();
  const { data, isPending } = useGroupedDataClasses();
  const [search, setSearch] = useState('');
  const groups = useMemo(() => {
    return insertWorkspaceIfAbsent(data ?? [], ws);
  }, [data, ws]);
  const filteredGroups = useMemo(() => {
    return filterArifacts(groups, dc => dc.name.toLocaleLowerCase().includes(search.toLocaleLowerCase()));
  }, [groups, search]);
  const { createDataClassEditor } = useCreateEditor();
  return (
    <Overview title='Data Classes' search={search} onSearchChange={setSearch} isPending={isPending}>
      {filteredGroups.map(({ project, artifacts }) => {
        const cards = artifacts.map(dc => {
          const editor = createDataClassEditor(dc);
          return <DataClassCard key={editor.id} dataClassId={dc.dataClassIdentifier} {...editor} />;
        });
        return (
          <ArtifactGroup project={project} newArtifactCard={<NewDataClassCard />} key={project}>
            {cards}
          </ArtifactGroup>
        );
      })}
    </Overview>
  );
}

const DataClassCard = ({ dataClassId, ...editor }: Editor & { dataClassId: DataClassIdentifier }) => {
  const { deleteDataClass } = useDeleteDataClass();
  const { openEditor, removeEditor } = useEditors();
  const open = () => {
    openEditor(editor);
  };
  const deleteAction = () => {
    removeEditor(editor.id);
    deleteDataClass(dataClassId);
  };
  return (
    <ArtifactCard
      name={editor.name}
      type='dataclass'
      preview={<PreviewSVG />}
      tooltip={editor.path}
      onClick={open}
      actions={{ delete: deleteAction }}
    />
  );
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
