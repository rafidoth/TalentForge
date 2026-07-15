import { Tabs, ScrollArea } from "@mantine/core";
import { ClockCounterClockwiseIcon } from "@phosphor-icons/react";

export interface ProfileAttributeCategoryTabsProps {
  categories: Array<{ id: string | number; name: string }>;
  activeTab: string | null;
  onTabChange: (value: string | null) => void;
}

export function ProfileAttributeCategoryTabs({
  categories,
  activeTab,
  onTabChange,
}: ProfileAttributeCategoryTabsProps) {
  return (
    <ScrollArea type="never" pb="xs">
      <Tabs value={activeTab} onChange={onTabChange}>
        <Tabs.List style={{ flexWrap: "nowrap", whiteSpace: "nowrap" }}>
          <Tabs.Tab
            value="recent"
            leftSection={<ClockCounterClockwiseIcon size={14} />}
          >
            Recently Used
          </Tabs.Tab>
          <Tabs.Tab value="all">All</Tabs.Tab>
          {categories.map((cat) => (
            <Tabs.Tab key={cat.id} value={cat.name}>
              {cat.name}
            </Tabs.Tab>
          ))}
        </Tabs.List>
      </Tabs>
    </ScrollArea>
  );
}
