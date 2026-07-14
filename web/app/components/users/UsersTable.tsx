import { Table, Center, Text, Checkbox } from '@mantine/core';
import type { UserListDto } from '~/api/types';
import { UserTableRow } from './UserTableRow';

interface UsersTableProps {
  data: UserListDto[];
  selectedIds: string[];
  onSelect: (id: string) => void;
  onSelectAll: () => void;
  pageNumber: number;
  pageSize: number;
}

export function UsersTable({
  data,
  selectedIds,
  onSelect,
  onSelectAll,
  pageNumber,
  pageSize
}: UsersTableProps) {
  if (!data || data.length === 0) {
    return (
      <Center p="xl">
        <Text c="dimmed">No users found.</Text>
      </Center>
    );
  }

  const isAllSelected = data.length > 0 && selectedIds.length === data.length;
  const isIndeterminate = selectedIds.length > 0 && selectedIds.length < data.length;

  return (
    <Table.ScrollContainer minWidth={800}>
      <Table verticalSpacing="sm" striped highlightOnHover withTableBorder>
        <Table.Thead>
          <Table.Tr>
            <Table.Th w={40}>
              <Checkbox
                checked={isAllSelected}
                indeterminate={isIndeterminate}
                onChange={onSelectAll}
                aria-label="Select all rows"
              />
            </Table.Th>
            <Table.Th w={60}>SL</Table.Th>
            <Table.Th>Email</Table.Th>
            <Table.Th>Method</Table.Th>
            <Table.Th>Role</Table.Th>
            <Table.Th w={100}>Status</Table.Th>
            <Table.Th>Joined At</Table.Th>
            <Table.Th>Last Login</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {data.map((user, idx) => (
            <UserTableRow
              key={user.id}
              user={user}
              selected={selectedIds.includes(user.id)}
              onSelect={() => onSelect(user.id)}
              index={(pageNumber - 1) * pageSize + idx + 1}
            />
          ))}
        </Table.Tbody>
      </Table>
    </Table.ScrollContainer>
  );
}
