import type { MetaFunction } from '@remix-run/node';
import { useCreateDataClass, useDeleteDataClass, useGroupedDataClasses } from '~/data/data-class-api';
import type { DataClassBean, DataClassIdentifier } from '~/data/generated/openapi-dev';
import type { ProjectIdentifier } from '~/data/project-api';
import { dataClassDescription } from '~/neo/artifact/artifact-description';
import { ArtifactCard, cardLinks, NewArtifactCard } from '~/neo/artifact/ArtifactCard';
import { ArtifactGroup } from '~/neo/artifact/ArtifactGroup';
import { useFilteredGroups } from '~/neo/artifact/useFilteredGroups';
import { useNewArtifact } from '~/neo/artifact/useNewArtifact';
import type { Editor } from '~/neo/editors/editor';
import { useCreateEditor } from '~/neo/editors/useCreateEditor';
import { useEditors } from '~/neo/editors/useEditors';
import { Overview } from '~/neo/Overview';
import PreviewSVG from './dataclass-preview.svg?react';

export const links = cardLinks;

export const meta: MetaFunction = () => {
  return [{ title: 'Axon Ivy Data Classes' }, { name: 'description', content: 'Axon Ivy Data Classes Overview' }];
};

export default function Index() {
  const { data, isPending } = useGroupedDataClasses();
  const { filteredGroups, search, setSearch } = useFilteredGroups(data ?? [], (d: DataClassBean) => d.name);
  const { createDataClassEditor } = useCreateEditor();
  return (
    <Overview title='Data Classes' description={dataClassDescription} search={search} onSearchChange={setSearch} isPending={isPending}>
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
  const deleteAction = {
    run: () => {
      removeEditor(editor.id);
      deleteDataClass(dataClassId);
    },
    isDeletable: editor.project.isIar === false,
    message: 'The dataclass cannot be deleted as the project to which it belongs is packaged.'
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
  return <NewArtifactCard title={title} open={() => open({ create, type: 'Data Class', namespaceRequired: true })} />;
};
