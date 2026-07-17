import { Center, Text, Button } from "@mantine/core";
import { LockKeyIcon, PlusIcon, GlobeSimpleIcon } from "@phosphor-icons/react";

interface Props {
  isPublic: boolean;
  onAddRule: () => void;
}

export function AccessRulesEmptyState({ isPublic, onAddRule }: Props) {
  return (
    <Center p="xl" style={{ flexDirection: "column" }}>
      <LockKeyIcon size={48} color="gray" opacity={0.5} />
      <Text c="dimmed" mt="md" ta="center">
        {isPublic
          ? "This position is public. It is accessible by everyone globally."
          : "No active access rules to display."}
      </Text>
      <Button variant="light" mt="md" leftSection={<PlusIcon />} onClick={onAddRule}>
        {isPublic ? "Add a rule to restrict access" : "Add your first rule"}
      </Button>
    </Center>
  );
}
