import { Container, Title, Paper, Table, Text, Badge, Skeleton, ActionIcon } from "@mantine/core";
import { useNavigate } from "react-router";
import { useLatestPositions } from "~/hooks/usePositions";
import { useUserRole } from "~/auth/store";
import { formatDate } from "~/utils/date";

export default function AppHome() {
  const navigate = useNavigate();
  const { data: latestPositions, isLoading } = useLatestPositions();
  const role = useUserRole();

  return (
    <Container size="xl" py="xl">
      <Paper withBorder={false} radius="md">
        <Title order={4} mb="md">Latest Positions</Title>

        <Table.ScrollContainer minWidth={500}>
          <Table highlightOnHover verticalSpacing="sm">
            <Table.Thead>
              <Table.Tr>
                <Table.Th>Title</Table.Th>
                <Table.Th>Last Updated</Table.Th>
                <Table.Th>Visibility</Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {isLoading ? (
                Array.from({ length: 5 }).map((_, index) => (
                  <Table.Tr key={index}>
                    <Table.Td><Skeleton height={20} width="70%" /></Table.Td>
                    <Table.Td><Skeleton height={20} width="40%" /></Table.Td>
                    <Table.Td><Skeleton height={24} width={60} radius="xl" /></Table.Td>
                    <Table.Td><Skeleton height={30} width={30} circle /></Table.Td>
                  </Table.Tr>
                ))
              ) : latestPositions?.length === 0 ? (
                <Table.Tr>
                  <Table.Td colSpan={4}>
                    <Text ta="center" c="dimmed" py="sm">No positions found.</Text>
                  </Table.Td>
                </Table.Tr>
              ) : (
                latestPositions?.map((position) => (
                  <Table.Tr
                    key={position.id}
                    onClick={() => navigate(`/app/c/positions`)}
                    style={{ cursor: "pointer" }}
                  >
                    <Table.Td>
                      <Text fw={500} size="sm">{position.title}</Text>
                    </Table.Td>
                    <Table.Td>
                      <Text size="sm" >
                        {formatDate(position.updatedAt)}
                      </Text>
                    </Table.Td>
                    <Table.Td>
                      {position.isPublic ? (
                        <Badge color="green" variant="light">Public</Badge>
                      ) : (
                        <Badge color="gray" variant="light">Private</Badge>
                      )}
                    </Table.Td>
                  </Table.Tr>
                ))
              )}
            </Table.Tbody>
          </Table>
        </Table.ScrollContainer>
      </Paper>
    </Container>
  );
}