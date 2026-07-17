import { useState } from "react";
import { useParams, useNavigate } from "react-router";
import { usePosition } from "~/hooks/usePositions";
import { Container, Title, Text, Stack, Loader, Center, Group, Badge, Button, Tabs, ActionIcon, Menu, Modal, Table, Card } from "@mantine/core";
import { ArrowLeftIcon, GlobeHemisphereEastIcon, GlobeSimpleIcon, LockIcon, LockKeyIcon } from "@phosphor-icons/react";
import { OverviewTab } from "~/components/positions/positionDetails/OverviewTab";
import { AttributesTab } from "~/components/positions/positionDetails/AttributesTab";
import { TechnologyTagsTab } from "~/components/positions/positionDetails/TechnologyTagsTab";
import { PositionAccessRulesModal } from "~/components/positions/positionDetails/AccessRulesModal";

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
                {position.isPublic ? <GlobeSimpleIcon size={36} /> : <LockIcon size={36} />}
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
                      : "This position is restricted."}
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

        <OverviewTab positionId={id!} position={position} />
        <TechnologyTagsTab positionId={id!} />
        <AttributesTab positionId={id!} position={position} />


        <PositionAccessRulesModal
          positionId={id!}
          isPublic={position.isPublic}
          opened={accessModalOpened}
          onClose={() => setAccessModalOpened(false)}
        />
      </Stack>
    </Container>
  );
}
