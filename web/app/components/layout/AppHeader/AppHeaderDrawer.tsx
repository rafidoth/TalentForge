import { Drawer, ScrollArea, Divider } from "@mantine/core";
import { Link } from "react-router";
import { AppHeaderSearch } from "./AppHeaderSearch";
import classes from "./AppHeader.module.css";

interface TabItem {
  label: string;
  path: string;
}

interface AppHeaderDrawerProps {
  opened: boolean;
  onClose: () => void;
  tabs: TabItem[];
}

export function AppHeaderDrawer({ opened, onClose, tabs }: AppHeaderDrawerProps) {
  return (
    <Drawer
      opened={opened}
      onClose={onClose}
      size="100%"
      padding="md"
      title="Navigation"
      hiddenFrom="sm"
      zIndex={1000000}
    >
      <ScrollArea h="calc(100vh - 80px)" mx="-md">
        <Divider my="sm" />
        <AppHeaderSearch mb="md" mx="md" showShortcut={false} />
        {tabs.map((tab) => (
          <Link
            to={tab.path}
            key={tab.path}
            className={classes.drawerLink}
            onClick={onClose}
          >
            {tab.label}
          </Link>
        ))}
      </ScrollArea>
    </Drawer>
  );
}
