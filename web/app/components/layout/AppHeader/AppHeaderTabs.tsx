import { useState, useEffect } from "react";
import { Group, Tabs } from "@mantine/core";
import { Link } from "react-router";
import classes from "./AppHeader.module.css";

interface TabItem {
  label: string;
  path: string;
  icon: any;
}

interface AppHeaderTabsProps {
  tabs: TabItem[];
  activeTab: string;
}

export function AppHeaderTabs({ tabs, activeTab }: AppHeaderTabsProps) {
  const [localTab, setLocalTab] = useState(activeTab);

  useEffect(() => {
    setLocalTab(activeTab);
  }, [activeTab]);

  return (
    <Tabs
      value={localTab}
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
          <Tabs.Tab 
            value={tab.path} 
            key={tab.path} 
            component={Link} 
            to={tab.path}
            prefetch="intent"
            onClick={() => setLocalTab(tab.path)}
          >
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
