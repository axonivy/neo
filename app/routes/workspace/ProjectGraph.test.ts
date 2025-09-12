import { mapProjectsToGraphNodes, type ProjectGraphBean } from './ProjectGraph';

test('maps projects correctly', () => {
  const projects: ProjectGraphBean[] = [
    {
      artifactId: 'my-artifact',
      id: { app: 'app1', pmv: 'project1' },
      version: '1.0.0',
      dependencies: [{ app: 'app2', pmv: 'project2' }]
    }
  ];

  const result = mapProjectsToGraphNodes(projects);
  expect(result).toHaveLength(1);
  expect(result[0]).toMatchObject({
    id: 'project1',
    label: 'project1',
    content: 'my-artifact - 1.0.0',
    target: [{ id: 'project2' }]
  });
  expect(result[0]?.options?.expandContent).toBe(true);
});

test('returns empty array when input is undefined', () => {
  expect(mapProjectsToGraphNodes(undefined)).toEqual([]);
});
