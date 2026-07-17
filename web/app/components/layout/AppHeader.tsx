import { AppShell, Burger, Button, Container, Group, Title } from "@mantine/core";
import { UserMenuContainer } from "./UserMenuContainer";
import { Link } from "react-router";
import { useUserRole } from "~/auth/store";

interface AppHeaderProps {
  opened: boolean;
  toggle: () => void;
}

export function AppHeader({ opened, toggle }: AppHeaderProps) {
  const role = useUserRole();
  return (
    <AppShell.Header>
      <Container size="md" h="100%">
        <Group h="100%" align="center" justify="space-between">
          <Group>
            <Burger opened={opened} onClick={toggle} hiddenFrom="sm" size="sm" />
            <Link to={"/"} style={{ textDecoration: "none", color: "inherit" }}>
              <Title order={4}>TalentForge</Title>
            </Link>
          </Group>
          <Group>
            {role === "Administrator" && (
              <Link to="/app/users" style={{ textDecoration: "none" }}>
                <Button variant="subtle">Manage Users</Button>
              </Link>
            )}
            <UserMenuContainer />
          </Group>
        </Group>
      </Container>
    </AppShell.Header>
  );
}
