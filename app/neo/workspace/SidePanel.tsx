import { BasicInscriptionTabs, Flex, type InscriptionTabProps } from '@axonivy/ui-components';
import { IvyIcons } from '@axonivy/ui-icons';
import { useTranslation } from 'react-i18next';
import { WebBrowser } from '../browser/WebBrowser';
import { SmartNeo } from '../smart-neo/SmartNeo';
import { useSidePanel } from './useSidePanel';

type SidePanelProps = {
  firstSidePanelElement: React.Ref<HTMLDivElement>;
};

export const SidePanel = ({ firstSidePanelElement }: SidePanelProps) => {
  const { t } = useTranslation();

  const { sidePanel } = useSidePanel();

  const tabs: Array<InscriptionTabProps> = [
    {
      content: <WebBrowser />,
      icon: IvyIcons.WsStart,
      id: 'Browser',
      name: t('browser.simulate')
    },
    {
      content: <SmartNeo />,
      icon: IvyIcons.ChangeType,
      id: 'SmartNeo',
      name: t('smartNeo.name')
    }
  ];

  return (
    <Flex direction='column' style={{ height: '100%' }} ref={firstSidePanelElement} tabIndex={-1}>
      <BasicInscriptionTabs value={sidePanel.tab} onChange={sidePanel.setTab} tabs={tabs} />
    </Flex>
  );
};
