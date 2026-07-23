import { Title, Stack, Table, Badge, Loader, Center, Text, Container } from '@mantine/core';
import { useNavigate } from 'react-router';
import { useCandidateCvs } from '~/hooks/useCvs';
import { formatDate } from '~/utils/date';
import { IconHeartFilled } from '@tabler/icons-react';

export default function CandidateCvs() {
  const navigate = useNavigate();
  const { data: pagedCvs, isLoading } = useCandidateCvs(1, 50);

  if (isLoading) {
    return (
      <Center h={400}>
        <Loader size="xl" />
      </Center>
    );
  }

  const cvs = pagedCvs?.data || [];

  return (
    <Container size="xl" py="xl">
      <Stack gap="lg">
        <Title order={2}>My CVs</Title>
        <Text c="dimmed">Manage all the CVs you have created for different positions.</Text>

        <Table.ScrollContainer minWidth={600}>
          <Table highlightOnHover withRowBorders withColumnBorders={false} verticalSpacing="sm">
            <Table.Thead>
              <Table.Tr>
                <Table.Th>Position</Table.Th>
                <Table.Th>Created</Table.Th>
                <Table.Th>Status</Table.Th>
                <Table.Th>Likes</Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {cvs.map((cv) => (
                <Table.Tr
                  key={cv.id}
                  onClick={() => navigate(`/app/c/cv/${cv.positionId}/${cv.id}`)}
                  style={{ cursor: 'pointer' }}
                >
                  <Table.Td>
                    <Text fw={500}>{cv.positionTitle}</Text>
                  </Table.Td>
                  <Table.Td>
                    <Text size="sm" c="dimmed">{formatDate(cv.createdAt)}</Text>
                  </Table.Td>
                  <Table.Td>
                    <Badge color={cv.isPublished ? "green" : "gray"} variant="light">
                      {cv.isPublished ? "Published" : "Draft"}
                    </Badge>
                  </Table.Td>
                  <Table.Td>
                    <Badge
                      leftSection={<IconHeartFilled size={12} />}
                      color="red"
                      variant="transparent"
                      size="lg"
                    >
                      {cv.likeCount}
                    </Badge>
                  </Table.Td>
                </Table.Tr>
              ))}
              {cvs.length === 0 && (
                <Table.Tr>
                  <Table.Td colSpan={4}>
                    <Text ta="center" c="dimmed" py="xl">
                      You haven't created any CVs yet. Check out the available positions to apply!
                    </Text>
                  </Table.Td>
                </Table.Tr>
              )}
            </Table.Tbody>
          </Table>
        </Table.ScrollContainer>
      </Stack>
    </Container>
  );
}
