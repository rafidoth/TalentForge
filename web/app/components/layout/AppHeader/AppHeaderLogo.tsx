import { Burger, Group, Text } from "@mantine/core";
import { Link } from "react-router";

interface AppHeaderLogoProps {
  opened: boolean;
  toggle: () => void;
}

export function AppHeaderLogo({ opened, toggle }: AppHeaderLogoProps) {
  return (
    <Group>
      <Burger opened={opened} onClick={toggle} hiddenFrom="sm" size="sm" aria-label="Toggle navigation" />
      <Link to={"/"} style={{ textDecoration: "none", color: "inherit" }}>
        <Group gap={0}>
          <Text size="xl" fw={700}>Talent</Text>
          <Text size="xl" fw={700} c="blue">Forge</Text>
        </Group>
      </Link>
    </Group>
  );
}
