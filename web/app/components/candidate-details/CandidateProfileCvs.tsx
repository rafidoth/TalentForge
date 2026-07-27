import { useNavigate } from 'react-router';
import { Stack, Group, Text, Badge, Table } from '@mantine/core';
import { HeartIcon } from '@phosphor-icons/react';
import type { CandidateCvSummaryDto } from '~/api/profile';

interface CandidateProfileCvsProps {
    cvs: CandidateCvSummaryDto[];
}

export function CandidateProfileCvs({ cvs }: CandidateProfileCvsProps) {
    const navigate = useNavigate();

    if (cvs.length === 0) {
        return <Text c="dimmed">No CVs submitted yet.</Text>;
    }

    return (
        <Table.ScrollContainer minWidth={500}>
            <Table highlightOnHover withRowBorders verticalSpacing="sm">
                <Table.Thead>
                    <Table.Tr>
                        <Table.Th>Position</Table.Th>
                        <Table.Th ta="center">Likes</Table.Th>
                        <Table.Th>Submitted</Table.Th>
                    </Table.Tr>
                </Table.Thead>
                <Table.Tbody>
                    {cvs.map(cv => (
                        <Table.Tr
                            key={cv.id}
                            onClick={() => navigate(`/app/cv/${cv.id}`)}
                            style={{ cursor: 'pointer' }}
                        >
                            <Table.Td>
                                <Text fw={500} size="sm">{cv.positionTitle}</Text>
                            </Table.Td>
                            <Table.Td ta="center">
                                <Group gap={4} justify="center">
                                    <HeartIcon size={14} />
                                    <Text size="sm">{cv.likeCount}</Text>
                                </Group>
                            </Table.Td>
                            <Table.Td>
                                <Text size="sm" c="dimmed">
                                    {new Date(cv.createdAt).toLocaleDateString('en-US', {
                                        year: 'numeric', month: 'short', day: 'numeric'
                                    })}
                                </Text>
                            </Table.Td>
                        </Table.Tr>
                    ))}
                </Table.Tbody>
            </Table>
        </Table.ScrollContainer>
    );
}
