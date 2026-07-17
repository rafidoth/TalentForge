import { Card, Stack, Text, ActionIcon, Button, Group, Center, Loader, Badge, SimpleGrid, Paper } from "@mantine/core";
import { useState } from "react";
import { TrashIcon, PlusIcon } from "@phosphor-icons/react";
import type { PositionDto } from "~/api/positions";
import { AttributeLibraryModal } from "~/components/attributeLibrary";
import { usePositionAttributes, useRemovePositionAttribute } from "~/components/attributeLibrary/useAttributes";

interface AttributesTabProps {
  positionId: string;
  position: PositionDto;
}

export function AttributesTab({ positionId, position }: AttributesTabProps) {
  const [attributeLibraryOpened, setAttributeLibraryOpened] = useState(false);

  const { data, isLoading } = usePositionAttributes(positionId);
  const { mutate: removeAttribute, isPending: isRemoving } = useRemovePositionAttribute();

  const attributes = data?.pages.flatMap(page => page.data) || [];

  const sortedAttributes = [...attributes].sort((a, b) => a.order - b.order);

  const noAttributes = sortedAttributes.length === 0;
  return (
    <Card withBorder={false} >
      <Stack>
        <Group justify="space-between" align="center">
          <Text fw={600} size="xl">Attributes</Text>
          {!noAttributes && (
            <Button
              onClick={() => setAttributeLibraryOpened(true)}
              leftSection={<PlusIcon />}
              w={200}
            >
              Attribute Library
            </Button>
          )}
        </Group>

        {isLoading ? (
          <Center p="xl"><Loader /></Center>
        ) : noAttributes ? (
          <Center p="xl">
            <Stack align="center">
              <Text c="dimmed">No attributes added yet. Open the library to add some.</Text>
              <Button
                onClick={() => setAttributeLibraryOpened(true)}
                leftSection={<PlusIcon />}
                w={200}
              >
                Attribute Library
              </Button>
            </Stack>
          </Center>
        ) : (
          <SimpleGrid cols={{ base: 1, xs: 2, sm: 2, md: 3 }} spacing="md">
            {sortedAttributes.map((attr) => (
              <Paper
                key={attr.id}
                withBorder
                p="md"
                radius="md"
                style={{ display: 'flex', flexDirection: 'column', height: '100%' }}
              >
                <Group justify="space-between" align="flex-start" wrap="nowrap">
                  <div>
                    <Text fw={600} size="sm" lineClamp={2}>{attr.attribute.name}</Text>
                    <Text size="xs" c="dimmed" mt={2}>{attr.attribute.categoryName}</Text>
                  </div>

                  <ActionIcon
                    color="red"
                    variant="subtle"
                    size="sm"
                    loading={isRemoving}
                    onClick={() => removeAttribute({ positionId, attributeId: attr.attribute.id })}
                  >
                    <TrashIcon />
                  </ActionIcon>
                </Group>

                <Group gap="xs" mt="auto" pt="md">
                  <Badge variant="dot" color="gray" size="xs">{attr.attribute.typeName}</Badge>
                  {attr.attribute.isBuiltin && <Badge color="teal" size="xs">Built-in</Badge>}
                </Group>
              </Paper>
            ))}
          </SimpleGrid>
        )}
      </Stack>

      <AttributeLibraryModal
        opened={attributeLibraryOpened}
        onClose={() => setAttributeLibraryOpened(false)}
        positionId={positionId}
      />
    </Card>
  );
}
