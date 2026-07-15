import { AppShell, Burger, Group, Title } from "@mantine/core";
import { UserMenuContainer } from "./UserMenuContainer";
import { Link } from "react-router";

interface AppHeaderProps {
  opened: boolean;
  toggle: () => void;
}

export function AppHeader({ opened, toggle }: AppHeaderProps) {
  return (
    <AppShell.Header>
      <Group h="100%" px="md" justify="space-between">
        <Group>
          <Burger opened={opened} onClick={toggle} hiddenFrom="sm" size="sm" />
          <Link to={"/"} style={{ textDecoration: "none", color: "inherit" }}>
            <Title order={4}>TalentForge</Title>
          </Link>
        </Group>
        <Group>
          <UserMenuContainer />
        </Group>
      </Group>
    </AppShell.Header>
  );
}
