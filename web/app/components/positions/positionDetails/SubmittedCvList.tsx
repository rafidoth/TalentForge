import { useState } from "react";
import { Card, Text, Center, Loader, Table, Pagination, Flex, Stack, Badge } from "@mantine/core";
import { usePositionCvs } from "~/hooks/useCvs";
import { formatDate } from "~/utils/date";
import { useNavigate } from "react-router";

interface SubmittedCvListProps {
  positionId: string;
}

export function SubmittedCvList({ positionId }: SubmittedCvListProps) {
  const [page, setPage] = useState(1);
  const pageSize = 10;
  const navigate = useNavigate();

  const { data: pagedData, isLoading, isError } = usePositionCvs(positionId, page, pageSize);

  if (isLoading) {
    return (
      <Card withBorder={false}>
        <Center p="xl"><Loader /></Center>
      </Card>
    );
  }

  if (isError) {
    return (
      <Card withBorder={false}>
        <Center p="xl"><Text c="red">Failed to load submitted CVs</Text></Center>
      </Card>
    );
  }

  const cvs = pagedData?.data || [];

  return (
    <Card withBorder={false}>
      <Stack gap="md">
        <Text fw={600} size="xl">Submitted CVs</Text>
        
        {cvs.length === 0 ? (
          <Center p="xl">
            <Text c="dimmed">No CVs have been submitted for this position yet.</Text>
          </Center>
        ) : (
          <Stack gap="xl">
            <Table.ScrollContainer minWidth={600}>
              <Table highlightOnHover withRowBorders withColumnBorders={false}>
                <Table.Thead>
                  <Table.Tr>
                    <Table.Th>Candidate</Table.Th>
                    <Table.Th>Submitted At</Table.Th>
                    <Table.Th>Status</Table.Th>
                    <Table.Th>Likes</Table.Th>
                  </Table.Tr>
                </Table.Thead>
                <Table.Tbody>
                  {cvs.map((cv) => (
                    <Table.Tr
                      key={cv.id}
                      style={{ cursor: "pointer" }}
                      onClick={() => navigate(`/app/cv/${cv.id}`)}
                    >
                      <Table.Td>
                        <Text fw={500}>{cv.candidateName}</Text>
                      </Table.Td>
                      <Table.Td>
                        <Text size="sm" c="dimmed">
                          {formatDate(cv.createdAt, 'MMM d, yyyy')}
                        </Text>
                      </Table.Td>
                      <Table.Td>
                        {cv.isPublished ? (
                          <Badge color="green" variant="light">Published</Badge>
                        ) : (
                          <Badge color="yellow" variant="light">Draft</Badge>
                        )}
                      </Table.Td>
                      <Table.Td>
                        <Text size="sm">{cv.likeCount}</Text>
                      </Table.Td>
                    </Table.Tr>
                  ))}
                </Table.Tbody>
              </Table>
            </Table.ScrollContainer>

            {(pagedData?.totalPages || 0) > 1 && (
              <Flex justify="center" mt="md">
                <Pagination
                  total={pagedData!.totalPages}
                  value={page}
                  onChange={setPage}
                  color="blue"
                  radius="md"
                  withEdges
                />
              </Flex>
            )}
          </Stack>
        )}
      </Stack>
    </Card>
  );
}
