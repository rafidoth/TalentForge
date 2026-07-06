import { Table, Text, Badge, Checkbox } from '@mantine/core';
import type { UserListDto } from '~/api/types';

const formatDate = (isoString: string) => {
  return new Date(isoString).toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  });
};

interface UserTableRowProps {
  user: UserListDto;
  selected: boolean;
  onSelect: () => void;
  index: number;
}

export function UserTableRow({ user, selected, onSelect, index }: UserTableRowProps) {
  return (
    <Table.Tr bg={selected ? 'var(--mantine-color-blue-light)' : undefined}>
      <Table.Td>
        <Checkbox checked={selected} onChange={onSelect} aria-label="Select row" />
      </Table.Td>
      <Table.Td>
        <Text size="sm">{index}</Text>
      </Table.Td>
      <Table.Td>
        <Text size="sm" fw={500}>{user.email}</Text>
      </Table.Td>
      <Table.Td>
        <Badge color={user.method === 'Email' ? 'blue' : 'red'} variant="light">
          {user.method}
        </Badge>
      </Table.Td>
      <Table.Td>
        <Badge color={
          user.role === 'Administrator' ? 'grape' : 
          user.role === 'Recruiter' ? 'violet' : 'cyan'
        } variant="light">
          {user.role}
        </Badge>
      </Table.Td>
      <Table.Td>
        <Badge color={user.status === 'Active' ? 'green' : 'red'} variant="dot">
          {user.status}
        </Badge>
      </Table.Td>
      <Table.Td>
        <Text size="sm" c="dimmed">
          {formatDate(user.joinedAt)}
        </Text>
      </Table.Td>
      <Table.Td>
        <Text size="sm" c="dimmed">
          {formatDate(user.lastLoginAt)}
        </Text>
      </Table.Td>
    </Table.Tr>
  );
}
