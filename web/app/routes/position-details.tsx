import { useParams, useNavigate } from "react-router";
import { usePosition } from "~/hooks/usePositions";
import { Container, Title, Text, Stack, Loader, Center, Group, Badge, Button, Tabs } from "@mantine/core";
import { ArrowLeftIcon } from "@phosphor-icons/react";
import { OverviewTab } from "~/components/positions/positionDetails/OverviewTab";
import { AttributesTab } from "~/components/positions/positionDetails/AttributesTab";
import { AccessRulesTab } from "~/components/positions/positionDetails/AccessRulesTab";
import { TechnologyTagsTab } from "~/components/positions/positionDetails/TechnologyTagsTab";

export default function PositionDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: position, isLoading, isError } = usePosition(id!);

  if (isLoading) return <Center p="xl"><Loader /></Center>;
  if (isError || !position) return <Center p="xl"><Text c="red">Failed to load position</Text></Center>;

  return (
    <Container size="xl" py="xl">
      <Stack gap="xl">
        <Group>
          <Button variant="subtle" leftSection={<ArrowLeftIcon />} onClick={() => navigate("/app/positions")}>
            Back to Positions
          </Button>
        </Group>

        <Group justify="space-between">
          <Title>{position.title}</Title>
          <Badge color={position.isPublic ? 'teal' : 'gray'} size="lg">
            {position.isPublic ? 'Public' : 'Private'}
          </Badge>
        </Group>

        <Tabs defaultValue="overview">
          <Tabs.List>
            <Tabs.Tab value="overview">Overview</Tabs.Tab>
            <Tabs.Tab value="attributes">Attributes</Tabs.Tab>
            <Tabs.Tab value="rules">Access Rules</Tabs.Tab>
            <Tabs.Tab value="tags">Technology Tags</Tabs.Tab>
          </Tabs.List>

          <Tabs.Panel value="overview" pt="md">
            <OverviewTab positionId={id!} position={position} />
          </Tabs.Panel>

          <Tabs.Panel value="attributes" pt="md">
            <AttributesTab positionId={id!} position={position} />
          </Tabs.Panel>

          <Tabs.Panel value="rules" pt="md">
            <AccessRulesTab positionId={id!} position={position} />
          </Tabs.Panel>

          <Tabs.Panel value="tags" pt="md">
            <TechnologyTagsTab positionId={id!} position={position} />
          </Tabs.Panel>
        </Tabs>
      </Stack>
    </Container>
  );
}
