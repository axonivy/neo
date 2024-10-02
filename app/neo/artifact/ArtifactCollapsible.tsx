import { Collapsible, CollapsibleContent, CollapsibleTrigger, Flex } from '@axonivy/ui-components';
import { ReactNode } from 'react';

export const ArtifactCollapsible = ({ title, children }: { title: string; children: ReactNode }) => (
  <Collapsible defaultOpen={true} style={{ width: '100%' }}>
    <CollapsibleTrigger>{title}</CollapsibleTrigger>
    <CollapsibleContent>
      <Flex gap={4} style={{ flexWrap: 'wrap' }}>
        {children}
      </Flex>
    </CollapsibleContent>
  </Collapsible>
);
