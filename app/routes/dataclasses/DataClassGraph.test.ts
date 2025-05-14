import type { DataClassBean } from '~/data/generated/ivy-client';
import { mapDataClassesToGraphNodes } from './DataClassGraph';

const dataclasses: Partial<DataClassBean>[] = [
  {
    name: 'neo.test.project.Address',
    simpleName: 'Address',
    dataClassIdentifier: {
      project: {
        app: 'Developer-neo-test-project',
        pmv: 'neo-test-anotherProject',
        isIar: false
      },
      name: 'neo.test.anotherProject.Address'
    },
    fields: [
      { name: 'country', type: 'String' },
      { name: 'street', type: 'String' }
    ]
  },
  {
    name: 'neo.test.project.Data',
    simpleName: 'Data',
    dataClassIdentifier: {
      project: {
        app: 'Developer-neo-test-project',
        pmv: 'neo-test-project',
        isIar: false
      },
      name: 'neo.test.project.Data'
    },
    fields: [{ name: 'person', type: 'neo.test.project.Person' }]
  },
  {
    name: 'neo.test.project.Person',
    simpleName: 'Person',
    dataClassIdentifier: {
      project: {
        app: 'Developer-neo-test-project',
        pmv: 'neo-test-project',
        isIar: false
      },
      name: 'neo.test.project.Person'
    },
    fields: [
      { name: 'name', type: 'String' },
      { name: 'age', type: 'Number' }
    ]
  }
];

test('maps all nodes when selectedProject is "all"', () => {
  const result = mapDataClassesToGraphNodes(dataclasses as DataClassBean[], 'all');
  expect(result).toHaveLength(3);
  expect(result.map(r => r.label)).toEqual(['Address', 'Data', 'Person']);
});

test('filters nodes by project', () => {
  const result = mapDataClassesToGraphNodes(dataclasses as DataClassBean[], 'neo-test-project');
  expect(result).toHaveLength(2); // All are from neo-test-project
});

test('filters out all nodes if project does not match', () => {
  const result = mapDataClassesToGraphNodes(dataclasses as DataClassBean[], 'some-other-project');
  expect(result).toHaveLength(0);
});

test('correctly maps node structure for Data', () => {
  const result = mapDataClassesToGraphNodes(dataclasses as DataClassBean[], 'all');
  const dataNode = result.find(node => node.label === 'Data');
  expect(dataNode).toBeDefined();
  expect(dataNode?.target).toEqual([{ id: 'neo.test.project.Person' }]);
});
