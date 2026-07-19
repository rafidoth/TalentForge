import { Group, Tabs } from "@mantine/core";
import classes from "./AppHeader.module.css";

interface TabItem {
  label: string;
  path: string;
  icon: any;
}

interface AppHeaderTabsProps {
  tabs: TabItem[];
  activeTab: string;
  onTabChange: (value: string) => void;
}

export function AppHeaderTabs({ tabs, activeTab, onTabChange }: AppHeaderTabsProps) {
  return (
    <Tabs
      value={activeTab}
      onChange={(val) => val && onTabChange(val)}
      variant="outline"
      visibleFrom="sm"
      classNames={{
        root: classes.tabs,
        list: classes.tabsList,
        tab: classes.tab,
      }}
    >
      <Tabs.List>
        {tabs.map((tab) => (
          <Tabs.Tab value={tab.path} key={tab.path}>
            <Group gap={5} align="center">
              {tab.icon}
              {tab.label}
            </Group>
          </Tabs.Tab>
        ))}
      </Tabs.List>
    </Tabs>
  );
}
