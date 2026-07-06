import { Group, ActionIcon, Menu, Tooltip, Loader } from '@mantine/core';
import { LockKey, LockOpen, Trash, UserCircleGear } from '@phosphor-icons/react';

interface UsersToolbarProps {
  selectedCount: number;
  onBlock: () => void;
  onUnblock: () => void;
  onDelete: () => void;
  onAssignRole: (role: string) => void;
  isLoading?: boolean;
}

export function UsersToolbar({ 
  selectedCount, 
  onBlock, 
  onUnblock, 
  onDelete, 
  onAssignRole,
  isLoading
}: UsersToolbarProps) {
  const disabled = selectedCount === 0 || isLoading;

  return (
    <Group gap="sm">
      <Tooltip label="Block selected users" withArrow>
        <ActionIcon 
          variant="light" 
          color="orange" 
          disabled={disabled} 
          onClick={onBlock}
          size="lg"
        >
          {isLoading ? <Loader size="xs" color="orange" /> : <LockKey size={20} weight="duotone" />}
        </ActionIcon>
      </Tooltip>

      <Tooltip label="Unblock selected users" withArrow>
        <ActionIcon 
          variant="light" 
          color="teal" 
          disabled={disabled} 
          onClick={onUnblock}
          size="lg"
        >
          {isLoading ? <Loader size="xs" color="teal" /> : <LockOpen size={20} weight="duotone" />}
        </ActionIcon>
      </Tooltip>

      <Tooltip label="Delete selected users" withArrow>
        <ActionIcon 
          variant="light" 
          color="red" 
          disabled={disabled} 
          onClick={onDelete}
          size="lg"
        >
          {isLoading ? <Loader size="xs" color="red" /> : <Trash size={20} weight="duotone" />}
        </ActionIcon>
      </Tooltip>

      <Menu shadow="md" width={200} position="bottom-end">
        <Menu.Target>
          <Tooltip label="Assign Role" withArrow>
            <ActionIcon 
              variant="light" 
              color="blue" 
              disabled={disabled} 
              size="lg"
            >
               {isLoading ? <Loader size="xs" color="blue" /> : <UserCircleGear size={20} weight="duotone" />}
            </ActionIcon>
          </Tooltip>
        </Menu.Target>

        <Menu.Dropdown>
          <Menu.Label>Select Role</Menu.Label>
          <Menu.Item onClick={() => onAssignRole('Candidate')}>Candidate</Menu.Item>
          <Menu.Item onClick={() => onAssignRole('Recruiter')}>Recruiter</Menu.Item>
          <Menu.Item onClick={() => onAssignRole('Administrator')}>Administrator</Menu.Item>
        </Menu.Dropdown>
      </Menu>
    </Group>
  );
}
