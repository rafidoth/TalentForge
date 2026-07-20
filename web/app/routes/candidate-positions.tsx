import { useState } from 'react';
import { Container, Title, Table, Pagination, Text, Skeleton, Center, Paper, Tooltip, Modal, Button, Group, Stack } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { useCandidatePositions } from '~/hooks/usePositions';
import { useCreateCv, useCheckCvExists } from '~/hooks/useCvs';
import { useNavigate } from 'react-router';
import { formatDate } from '~/utils/date';

export default function CandidatePositions() {
    const [page, setPage] = useState(1);
    const pageSize = 10;
    const { data, isLoading } = useCandidatePositions(page, pageSize);
    const navigate = useNavigate();
    const [opened, { open, close }] = useDisclosure(false);
    const [selectedPosition, setSelectedPosition] = useState<any>(null);
    const createCvMutation = useCreateCv();
    const { data: cvExistsData, isLoading: isCheckingCv } = useCheckCvExists(selectedPosition?.id);

    const handleCreateCv = () => {
        if (!selectedPosition) return;
        createCvMutation.mutate({ positionId: selectedPosition.id }, {
            onSuccess: (res) => {
                close();
                navigate(`/app/c/cv/${selectedPosition.id}/${res.cvId}`);
            }
        });
    };
    return (
        <Container size="xl" py="xl">
            <Title order={2} mb="lg">Available Positions</Title>
            <Paper p="0" bg="transparent">
                <Table.ScrollContainer minWidth={500}>
                    <Table
                        highlightOnHover
                        highlightOnHoverColor='blue.0'
                        withTableBorder={false}
                        withColumnBorders={false}
                        withRowBorders
                    >
                        <Table.Thead bd={"bottom 2px solid black"}>
                            <Table.Tr >
                                <Table.Th >Title</Table.Th>
                                <Table.Th w={600}>Description</Table.Th>
                                <Table.Th ta="right">Posted</Table.Th>
                            </Table.Tr>
                        </Table.Thead>
                        <Table.Tbody>
                            {isLoading ? (
                                Array.from({ length: 5 }).map((_, index) => (
                                    <Table.Tr key={index}>
                                        <Table.Td><Skeleton height={16} width="70%" /></Table.Td>
                                        <Table.Td><Skeleton height={16} width="90%" /></Table.Td>
                                        <Table.Td><Skeleton height={16} width="60%" /></Table.Td>
                                    </Table.Tr>
                                ))
                            ) : data?.data?.length === 0 ? (
                                <Table.Tr>
                                    <Table.Td colSpan={3}>
                                        <Text ta="center" c="dimmed" py="xl">No positions available.</Text>
                                    </Table.Td>
                                </Table.Tr>
                            ) : (
                                data?.data?.map((position) => (
                                    <Tooltip
                                        key={position.id}
                                        label={`Create CV For ${position.title}`}
                                        position="top"
                                        withArrow
                                        openDelay={300}
                                    >
                                        <Table.Tr
                                            onClick={() => {
                                                setSelectedPosition(position);
                                                open();
                                            }}
                                            style={{ cursor: "pointer" }}
                                            tabIndex={0}
                                        >
                                            <Table.Td>
                                                <Text fw={500} lineClamp={1}>{position.title}</Text>
                                            </Table.Td>
                                            <Table.Td>
                                                <Text size="sm" lineClamp={4}>
                                                    {position.shortDescription || "No description available"}
                                                </Text>
                                            </Table.Td>
                                            <Table.Td ta="right">
                                                <Text size="sm" >
                                                    {formatDate(position.createdAt)}
                                                </Text>
                                            </Table.Td>
                                        </Table.Tr>
                                    </Tooltip>
                                ))
                            )}
                        </Table.Tbody>
                    </Table>
                </Table.ScrollContainer>
                {data?.totalPages && data.totalPages > 1 ? (
                    <Center mt="xl">
                        <Pagination value={page} onChange={setPage} total={data.totalPages} />
                    </Center>
                ) : null}
            </Paper>

            <Modal opened={opened} onClose={close} title="Position Details" size="lg" centered>
                {selectedPosition && (
                    <Stack>
                        <Title order={3}>{selectedPosition.title}</Title>
                        <Text size="sm" c="dimmed">
                            Posted on {formatDate(selectedPosition.createdAt)}
                        </Text>

                        <Text mt="md" style={{ whiteSpace: 'pre-line' }}>
                            {selectedPosition.description || selectedPosition.shortDescription || "No description available."}
                        </Text>

                        <Group justify="flex-end" mt="xl">
                            <Button variant="default" onClick={close}>Cancel</Button>
                            {cvExistsData?.exists ? (
                                <Button
                                    onClick={() => {
                                        close();
                                        navigate(`/app/c/cv/${selectedPosition.id}/${cvExistsData.cvId}`);
                                    }}
                                >
                                    View CV
                                </Button>
                            ) : (
                                <Button
                                    onClick={handleCreateCv}
                                    loading={createCvMutation.isPending || isCheckingCv}
                                    disabled={isCheckingCv}
                                >
                                    Create CV
                                </Button>
                            )}
                        </Group>
                    </Stack>
                )}
            </Modal>
        </Container>
    );
}