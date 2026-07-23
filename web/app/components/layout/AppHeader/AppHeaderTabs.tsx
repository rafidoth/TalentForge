import { useState, useEffect } from "react";
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
  const [localTab, setLocalTab] = useState(activeTab);

  useEffect(() => {
    setLocalTab(activeTab);
  }, [activeTab]);

  return (
    <Tabs
      value={localTab}
      onChange={(val) => {
        if (val) {
          setLocalTab(val); // Update visually instantly!
          onTabChange(val); // Then navigate
        }
      }}
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
