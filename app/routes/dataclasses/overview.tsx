import type { LinksFunction, MetaFunction } from 'react-router';
import { useCreateDataClass, useDeleteDataClass, useGroupedDataClasses } from '~/data/data-class-api';
import type { DataClassBean } from '~/data/generated/ivy-client';
import type { ProjectIdentifier } from '~/data/project-api';
import { overviewMetaFunctionProvider } from '~/metaFunctionProvider';
import { dataClassDescription } from '~/neo/artifact/artifact-description';
import { ArtifactCard, cardStylesLink, NewArtifactCard } from '~/neo/artifact/ArtifactCard';
import { ArtifactGroup } from '~/neo/artifact/ArtifactGroup';
import { useFilteredGroups } from '~/neo/artifact/useFilteredGroups';
import { useNewArtifact, type NewArtifactIdentifier } from '~/neo/artifact/useNewArtifact';
import type { Editor } from '~/neo/editors/editor';
import { useCreateEditor } from '~/neo/editors/useCreateEditor';
import { useEditors } from '~/neo/editors/useEditors';
import { Overview } from '~/neo/Overview';
import PreviewSVG from './dataclass-preview.svg?react';

export const links: LinksFunction = () => [cardStylesLink];

export const meta: MetaFunction = overviewMetaFunctionProvider('Data Classes');

export default function Index() {
  const { data, isPending } = useGroupedDataClasses();
  const { filteredGroups, search, setSearch } = useFilteredGroups(data ?? [], (d: DataClassBean) => d.name);
  const { createDataClassEditor } = useCreateEditor();
  return (
    <Overview title='Data Classes' description={dataClassDescription} search={search} onSearchChange={setSearch} isPending={isPending}>
      {filteredGroups.map(({ project, artifacts }) => (
        <ArtifactGroup project={project} newArtifactCard={<NewDataClassCard />} key={project}>
          {artifacts.map(dc => {
            const editor = createDataClassEditor(dc);
            return <DataClassCard key={editor.id} dataClass={dc} {...editor} />;
          })}
        </ArtifactGroup>
      ))}
    </Overview>
  );
}

const DataClassCard = ({ dataClass, ...editor }: Editor & { dataClass: DataClassBean }) => {
  const { deleteDataClass } = useDeleteDataClass();
  const { openEditor, removeEditor } = useEditors();
  const open = () => {
    openEditor(editor);
  };
  const deleteAction = {
    run: () => {
      removeEditor(editor.id);
      deleteDataClass(dataClass.dataClassIdentifier);
    },
    isDeletable: editor.project.isIar === false,
    message: 'The dataclass cannot be deleted as the project to which it belongs is packaged.'
  };
  const tagLabel = dataClass.isEntityClass ? 'Entity' : dataClass.isBusinessCaseData ? 'Business Data' : '';
  return (
    <ArtifactCard
      name={editor.name}
      type='dataclass'
      preview={<PreviewSVG />}
      tooltip={editor.path}
      onClick={open}
      actions={{ delete: deleteAction }}
      tagLabel={tagLabel}
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
  const { data } = useGroupedDataClasses();
  const exists = ({ name, namespace, project }: NewArtifactIdentifier) =>
    data
      ?.find(group => group?.project === project?.pmv)
      ?.artifacts.some(dc => dc.name.toLowerCase() === `${namespace.toLowerCase()}.${name.toLowerCase()}`) ?? false;
  const title = 'Create new Data Class';
  return <NewArtifactCard title={title} open={() => open({ create, exists, type: 'Data Class', namespaceRequired: true })} />;
};
