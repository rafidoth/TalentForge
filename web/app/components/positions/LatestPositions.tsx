import { Title, Paper, Table, Text, Badge, Skeleton } from "@mantine/core";
import { useNavigate } from "react-router";
import { useLatestPositions } from "~/hooks/usePositions";
import { formatDate } from "~/utils/date";

export function LatestPositions() {
  const navigate = useNavigate();
  const { data: latestPositions, isLoading } = useLatestPositions();

  return (
    <Paper withBorder={false} radius="md">
      <Title order={4} mb="md">Latest Positions</Title>

      <Table.ScrollContainer minWidth={500}>
        <Table highlightOnHover verticalSpacing="sm">
          <Table.Thead>
            <Table.Tr>
              <Table.Th>Title</Table.Th>
              <Table.Th>Last Updated</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {isLoading ? (
              Array.from({ length: 5 }).map((_, index) => (
                <Table.Tr key={index}>
                  <Table.Td><Skeleton height={20} width="70%" /></Table.Td>
                  <Table.Td><Skeleton height={20} width="40%" /></Table.Td>
                </Table.Tr>
              ))
            ) : latestPositions?.length === 0 ? (
              <Table.Tr>
                <Table.Td colSpan={2}>
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
                </Table.Tr>
              ))
            )}
          </Table.Tbody>
        </Table>
      </Table.ScrollContainer>
    </Paper>
  );
}
