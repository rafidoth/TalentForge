import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
    Container,
    Title,
    Paper,
    Group,
    Pagination,
    Loader,
    Center,
    Alert,
    Box,
    Text,
    Badge
} from '@mantine/core';
import { useUserRole, useAuthLoading } from '~/auth/store';
import { getUsers, blockUsers, unblockUsers, deleteUsers, assignRoleToUsers } from '~/api/users';
import { UsersTable } from '~/components/users/UsersTable';
import { UsersToolbar } from '~/components/users/UsersToolbar';
import { PageSizes, Roles } from '~/Constants';

export default function UsersAdministratorPage() {
    const role = useUserRole();
    const authLoading = useAuthLoading();
    const navigate = useNavigate();
    const queryClient = useQueryClient();

    const [activePage, setActivePage] = useState(1);
    const [selectedIds, setSelectedIds] = useState<string[]>([]);
    const pageSize = PageSizes.UsersManagement;

    useEffect(() => {
        if (!authLoading && role !== 'Administrator') {
            navigate('/app', { replace: true });
        }
    }, [role, authLoading, navigate]);

    useEffect(() => {
        setSelectedIds([]);
    }, [activePage]);

    const { data, isLoading, isError, error } = useQuery({
        queryKey: ['users', activePage, pageSize],
        queryFn: () => getUsers(activePage, pageSize),
        enabled: role === 'Administrator' && !authLoading
    });

    const invalidateAndClear = () => {
        queryClient.invalidateQueries({ queryKey: ['users'] });
        setSelectedIds([]);
    };

    const blockMutation = useMutation({
        mutationFn: (ids: string[]) => blockUsers(ids),
        onSuccess: invalidateAndClear
    });

    const unblockMutation = useMutation({
        mutationFn: (ids: string[]) => unblockUsers(ids),
        onSuccess: invalidateAndClear
    });

    const deleteMutation = useMutation({
        mutationFn: (ids: string[]) => deleteUsers(ids),
        onSuccess: invalidateAndClear
    });

    const assignRoleMutation = useMutation({
        mutationFn: ({ ids, roleName }: { ids: string[], roleName: string }) => assignRoleToUsers(ids, roleName),
        onSuccess: invalidateAndClear
    });

    if (authLoading || role !== Roles.Administrator) {
        return (
            <Center style={{ height: '100vh' }}>
                <Loader type="dots" />
            </Center>
        );
    }

    const handleSelectAll = () => {
        if (!data?.data) return;
        if (selectedIds.length === data.data.length) {
            setSelectedIds([]);
        } else {
            setSelectedIds(data.data.map(u => u.id));
        }
    };

    const handleSelect = (id: string) => {
        setSelectedIds(prev =>
            prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
        );
    };

    const isMutating = blockMutation.isPending || unblockMutation.isPending || deleteMutation.isPending || assignRoleMutation.isPending;

    return (
        <Container size="xl" py="xl">
            <Group justify="space-between" mb="lg">
                <Group>
                    {selectedIds.length > 0 && (
                        <Badge variant="light" color="blue" size="lg">
                            {selectedIds.length} selected
                        </Badge>
                    )}
                </Group>

                <UsersToolbar
                    selectedCount={selectedIds.length}
                    isLoading={isMutating}
                    onBlock={() => blockMutation.mutate(selectedIds)}
                    onUnblock={() => unblockMutation.mutate(selectedIds)}
                    onDelete={() => {
                        if (window.confirm('Are you sure you want to delete the selected users?')) {
                            deleteMutation.mutate(selectedIds);
                        }
                    }}
                    onAssignRole={(roleName) => assignRoleMutation.mutate({ ids: selectedIds, roleName })}
                />
            </Group>

            <Box>
                {isLoading ? (
                    <Center p="xl">
                        <Loader type="dots" />
                    </Center>
                ) : isError ? (
                    <Alert color="red" title="Error loading users">
                        {error instanceof Error ? error.message : 'Unknown error occurred'}
                    </Alert>
                ) : (
                    <Box>
                        <UsersTable
                            data={data?.data || []}
                            selectedIds={selectedIds}
                            onSelect={handleSelect}
                            onSelectAll={handleSelectAll}
                            pageNumber={activePage}
                            pageSize={pageSize}
                        />
                        {data && data.totalPages > 1 && (
                            <Group justify="flex-end" mt="md">
                                <Pagination
                                    total={data.totalPages}
                                    value={activePage}
                                    onChange={setActivePage}
                                    color="blue"
                                    withEdges
                                />
                            </Group>
                        )}
                    </Box>
                )}
            </Box>
        </Container>
    );
}
