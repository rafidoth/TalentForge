import { useState } from "react";
import { useParams, useNavigate } from "react-router";
import { usePosition } from "~/hooks/usePositions";
import { Container, Title, Text, Stack, Loader, Center, Group, Badge, Button, Tabs, ActionIcon, Menu, Modal, Table } from "@mantine/core";
import { ArrowLeftIcon, GlobeHemisphereEastIcon, GlobeSimpleIcon, LockKeyIcon } from "@phosphor-icons/react";
import { OverviewTab } from "~/components/positions/positionDetails/OverviewTab";
import { AttributesTab } from "~/components/positions/positionDetails/AttributesTab";
import { TechnologyTagsTab } from "~/components/positions/positionDetails/TechnologyTagsTab";

export default function PositionDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: position, isLoading, isError } = usePosition(id!);
  const [accessModalOpened, setAccessModalOpened] = useState(false);

  if (isLoading) return <Center p="xl"><Loader /></Center>;
  if (isError || !position) return <Center p="xl"><Text c="red">Failed to load position</Text></Center>;

  return (
    <Container size="xl" py="xl">
      <Stack gap="md">
        <Group>
          <Button variant="subtle" leftSection={<ArrowLeftIcon />} onClick={() => navigate("/app/positions")}>
            Back to Positions
          </Button>
        </Group>
        <Group justify="start" align="center">
          <Title>{position.title}</Title>
          <Menu shadow="md" width={300} position="bottom-start">
            <Menu.Target>
              <ActionIcon
                variant="transparent"
                style={{ width: 'auto', height: 'auto', padding: '4px' }}
              >
                {position.isPublic ? <GlobeSimpleIcon size={36} /> : <Text size="lg" fw={500} c="dimmed">Private</Text>}
              </ActionIcon>
            </Menu.Target>
            <Menu.Dropdown>
              <Menu.Item>
                <Stack gap="xs" p="xs">
                  <div>
                    <Badge color={position.isPublic ? "green" : "red"}>
                      {position.isPublic ? "Public" : "Private"}
                    </Badge>
                  </div>
                  <Text size="sm" c="dimmed">
                    {position.isPublic
                      ? "This position is accessible by everyone."
                      : "This position is private and restricted."}
                  </Text>
                </Stack>
              </Menu.Item>
              <Menu.Divider />
              <Menu.Item onClick={() => setAccessModalOpened(true)}>
                Manage access rules
              </Menu.Item>
            </Menu.Dropdown>
          </Menu>
        </Group>

        {position.shortDescription && (
          <Text fw={500} c="dimmed">
            {position.shortDescription}
          </Text>
        )}

        <Tabs defaultValue="overview">
          <Tabs.List>
            <Tabs.Tab value="overview">Overview</Tabs.Tab>
            <Tabs.Tab value="attributes">Attributes</Tabs.Tab>
            <Tabs.Tab value="tags">Tags</Tabs.Tab>
          </Tabs.List>

          <Tabs.Panel value="overview" pt="md">
            <OverviewTab positionId={id!} position={position} />
          </Tabs.Panel>

          <Tabs.Panel value="attributes" pt="md">
            <AttributesTab positionId={id!} position={position} />
          </Tabs.Panel>

          <Tabs.Panel value="tags" pt="md">
            <TechnologyTagsTab positionId={id!} position={position} />
          </Tabs.Panel>
        </Tabs>

        <Modal
          opened={accessModalOpened}
          onClose={() => setAccessModalOpened(false)}
          title={<Title order={4}>Manage Access Rules</Title>}
          size="lg"
          centered
        >
          {!position.isPublic ? (
            <Center p="xl" style={{ flexDirection: 'column' }}>
              <LockKeyIcon size={48} color="gray" opacity={0.5} />
              <Text c="dimmed" mt="md" ta="center">
                This position is currently private. There are no active access rules to display.
              </Text>
            </Center>
          ) : (
            <Table>
              <Table.Thead>
                <Table.Tr>
                  <Table.Th>Rule Type</Table.Th>
                  <Table.Th>Description</Table.Th>
                  <Table.Th>Status</Table.Th>
                </Table.Tr>
              </Table.Thead>
              <Table.Tbody>
                <Table.Tr>
                  <Table.Td>Default Access</Table.Td>
                  <Table.Td>Accessible by everyone globally</Table.Td>
                  <Table.Td><Badge color="green" variant="light">Active</Badge></Table.Td>
                </Table.Tr>
              </Table.Tbody>
            </Table>
          )}
        </Modal>
      </Stack>
    </Container>
  );
}
