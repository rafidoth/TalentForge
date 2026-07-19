import { TextInput, Kbd, Group } from "@mantine/core";
import { MagnifyingGlass } from "@phosphor-icons/react";

interface AppHeaderSearchProps {
  visibleFrom?: string;
  mb?: string;
  mx?: string;
  showShortcut?: boolean;
}

export function AppHeaderSearch({ visibleFrom, mb, mx, showShortcut }: AppHeaderSearchProps) {
  return (
    <TextInput
      placeholder="Search..."
      leftSection={<MagnifyingGlass size={16} />}
      rightSectionWidth={showShortcut ? 70 : undefined}
      rightSection={
        showShortcut ? (
          <Group gap={4}>
            <Kbd>Ctrl</Kbd>
            <Kbd>K</Kbd>
          </Group>
        ) : undefined
      }
      styles={{ input: { cursor: 'pointer' } }}
      visibleFrom={visibleFrom}
      mb={mb}
      mx={mx}
    />
  );
}
