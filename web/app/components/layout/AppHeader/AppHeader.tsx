import { AppShell, Container, Group, Stack } from "@mantine/core";
import { UserMenuContainer } from "../UserMenuContainer";
import { useNavigate, useLocation } from "react-router";
import { useUserRole } from "~/auth/store";
import { AppHeaderLogo } from "./AppHeaderLogo";
import { AppHeaderSearch } from "./AppHeaderSearch";
import { AppHeaderTabs } from "./AppHeaderTabs";
import { AppHeaderDrawer } from "./AppHeaderDrawer";
import classes from "./AppHeader.module.css";
import {
  HouseLineIcon,
  BriefcaseIcon,
  FolderSimpleIcon,
  FileTextIcon,
  TagIcon,
  FilesIcon,
  UsersThreeIcon,
} from "@phosphor-icons/react";

interface AppHeaderProps {
  opened: boolean;
  toggle: () => void;
}
const tabsConfig = {
  Candidate: [
    { label: "Home", path: "/app", icon: <HouseLineIcon /> },
    { label: "Positions", path: "/app/c/positions", icon: <BriefcaseIcon /> },
    { label: "My Projects", path: "/app/c/projects", icon: <FolderSimpleIcon /> },
    { label: "My CVs", path: "/app/c/cvs", icon: <FileTextIcon /> },
  ],
  Recruiter: [
    { label: "Home", path: "/app", icon: <HouseLineIcon /> },
    { label: "Attribute Library", path: "/app/attributes", icon: <TagIcon /> },
    { label: "Positions", path: "/app/positions", icon: <BriefcaseIcon /> },
  ],
  Administrator: [
    { label: "Home", path: "/app", icon: <HouseLineIcon /> },
    { label: "Positions", path: "/app/positions", icon: <BriefcaseIcon /> },
    { label: "Attribute Library", path: "/app/attributes", icon: <TagIcon /> },
    { label: "Users", path: "/app/users", icon: <UsersThreeIcon /> },
  ],
};
export function AppHeader({ opened, toggle }: AppHeaderProps) {
  const role = useUserRole();
  const navigate = useNavigate();
  const location = useLocation();

  const currentTabs = tabsConfig[role as keyof typeof tabsConfig] || tabsConfig.Candidate;

  const activeTab = currentTabs.find(tab =>
    location.pathname === tab.path
  )?.path || "";

  return (
    <AppShell.Header>
      <div className={classes.header}>
        <Container className={classes.mainSection} size="md">
          <Group justify="space-between">
            <AppHeaderLogo opened={opened} toggle={toggle} />
            <AppHeaderSearch visibleFrom="sm" showShortcut={true} />
            <UserMenuContainer />
          </Group>
        </Container>

        <Container size="md">
          <AppHeaderTabs
            tabs={currentTabs}
            activeTab={activeTab}
          />
        </Container>
      </div>

      <AppHeaderDrawer
        opened={opened}
        onClose={toggle}
        tabs={currentTabs}
      />
    </AppShell.Header>
  );
}
