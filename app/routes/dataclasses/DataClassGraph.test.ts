import type { DataClassBean } from '~/data/generated/ivy-client';
import { mapDataClassesToGraphNodes } from './DataClassGraph';

const dataclasses: Partial<DataClassBean>[] = [
  {
    name: 'neo.test.project.Data',
    simpleName: 'Data',
    dataClassIdentifier: {
      project: { app: 'Developer-neo-test-project', pmv: 'neo-test-project', isIar: false },
      name: 'neo.test.project.Data'
    },
    fields: [{ name: 'person', type: 'neo.test.project.Person' }]
  },
  {
    name: 'neo.test.project.Person',
    simpleName: 'Person',
    dataClassIdentifier: {
      project: { app: 'Developer-neo-test-project', pmv: 'neo-test-project', isIar: false },
      name: 'neo.test.project.Person'
    },
    fields: [
      { name: 'name', type: 'String' },
      { name: 'address', type: 'neo.test.anotherProject.Address' }
    ]
  },
  {
    name: 'neo.test.project.ExtendedData',
    simpleName: 'ExtendedData',
    dataClassIdentifier: {
      project: { app: 'Developer-neo-test-project', pmv: 'neo-test-project', isIar: false },
      name: 'neo.test.project.ExtendedData'
    },
    fields: [{ name: 'external', type: 'neo.test.external.ExternalType' }]
  },
  {
    name: 'neo.test.anotherProject.Address',
    simpleName: 'Address',
    dataClassIdentifier: {
      project: { app: 'Developer-neo-test-project', pmv: 'neo-test-anotherProject', isIar: false },
      name: 'neo.test.anotherProject.Address'
    },
    fields: [
      { name: 'country', type: 'String' },
      { name: 'zip', type: 'String' }
    ]
  },
  {
    name: 'neo.test.external.ExternalType',
    simpleName: 'ExternalType',
    dataClassIdentifier: {
      project: { app: 'Developer-neo-test-external', pmv: 'neo-test-external', isIar: false },
      name: 'neo.test.external.ExternalType'
    },
    fields: []
  },
  {
    name: 'neo.test.wrapper.Wrapper',
    simpleName: 'Wrapper',
    dataClassIdentifier: {
      project: { app: 'Developer-neo-test-wrapper', pmv: 'neo-test-unrelated', isIar: false },
      name: 'neo.test.wrapper.Wrapper'
    },
    fields: [{ name: 'wrappedData', type: 'neo.test.project.Data' }]
  },
  {
    name: 'neo.test.unused.Orphan',
    simpleName: 'Orphan',
    dataClassIdentifier: {
      project: { app: 'Developer-neo-test-unused', pmv: 'neo-test-unused', isIar: false },
      name: 'neo.test.unused.Orphan'
    },
    fields: [{ name: 'field', type: 'String' }]
  }
];

test('maps all nodes when selectedProject is "all"', () => {
  const result = mapDataClassesToGraphNodes(dataclasses as DataClassBean[], 'all');
  expect(result).toHaveLength(7);
  expect(result.map(r => r.label).sort()).toEqual(
    [
      'Address',
      'Data',
      'ExtendedData',
      'ExternalType',
      'Person',
      'Wrapper',
      'Orphan' // Orphan is also included with "all"
    ].sort()
  );
});

test('includes only selected project nodes and their references (in and out)', () => {
  const result = mapDataClassesToGraphNodes(dataclasses as DataClassBean[], 'neo-test-project');
  expect(result.map(n => n.label).sort()).toEqual(
    [
      'Address', // referenced by Person
      'Data', // in project
      'ExtendedData', // in project
      'ExternalType', // referenced by ExtendedData
      'Person', // in project
      'Wrapper' // refers to Data
    ].sort()
  );
});

test('excludes unrelated nodes when selected project is not matched', () => {
  const result = mapDataClassesToGraphNodes(dataclasses as DataClassBean[], 'some-other-project');
  expect(result).toHaveLength(0);
});

test('correctly maps node structure for Data', () => {
  const result = mapDataClassesToGraphNodes(dataclasses as DataClassBean[], 'neo-test-project');
  const dataNode = result.find(node => node.label === 'Data');
  expect(dataNode).toBeDefined();
  expect(dataNode?.target).toEqual([{ id: 'neo.test.project.Person' }]);
});
