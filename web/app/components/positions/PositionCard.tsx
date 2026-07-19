import { Card, Text, Group, Badge, ActionIcon, Menu, Stack, Box, ThemeIcon } from '@mantine/core';
import { DotsThreeIcon, CopyIcon, TrashIcon, CalendarBlankIcon, UsersIcon, CaretRightIcon } from '@phosphor-icons/react';
import type { PositionDto } from '~/api/positions';
import { formatDate } from '~/utils/date';

import classes from './PositionCard.module.css';

interface PositionCardProps {
  position: PositionDto;
  onDelete: () => void;
  onDuplicate: () => void;
  onClick: () => void;
}

export function PositionCard({ position, onDelete, onDuplicate, onClick }: PositionCardProps) {
  return (
    <Card
      withBorder
      padding="lg"
      radius="md"
      className={classes.card}
      onClick={onClick}
    >
      <div className={classes.cardBackground} />

      <Group justify="space-between" mb="xs" style={{ position: 'relative', zIndex: 2 }}>
        <Badge variant="light" color={position.isPublic ? 'teal' : 'gray'} size="sm" radius="xl">
          {position.isPublic ? 'Public' : 'Private'}
        </Badge>

        <Menu withinPortal position="bottom-end" shadow="sm">
          <Menu.Target>
            <ActionIcon variant="subtle" color="gray" onClick={(e) => e.stopPropagation()}>
              <DotsThreeIcon size={20} weight="bold" />
            </ActionIcon>
          </Menu.Target>
          <Menu.Dropdown onClick={(e) => e.stopPropagation()}>
            <Menu.Item leftSection={<CopyIcon size={16} />} onClick={(e) => { e.stopPropagation(); onDuplicate(); }}>
              Duplicate
            </Menu.Item>
            <Menu.Item leftSection={<TrashIcon size={16} />} color="red" onClick={(e) => { e.stopPropagation(); onDelete(); }}>
              Delete
            </Menu.Item>
          </Menu.Dropdown>

        </Menu>
      </Group>

      <Stack gap="xs" mt="md" style={{ position: 'relative', zIndex: 2 }}>
        <Text fz="xl" fw={700} className={classes.title}>
          {position.title}
        </Text>
        <Text fz="sm" c="dimmed" lineClamp={2} style={{ minHeight: 40 }}>
          {position.shortDescription || 'No description provided for this position.'}
        </Text>
      </Stack>

      <Stack gap="sm" mt="xl" style={{ position: 'relative', zIndex: 2 }}>
        <Group gap="xs">
          <ThemeIcon variant="light" color="blue" size="sm" radius="xl">
            <UsersIcon size={12} weight="bold" />
          </ThemeIcon>
          <Text fz="sm" c="dimmed">
            Max Projects: <Text span fw={600} c="var(--mantine-color-text)">{position.maxProjects}</Text>
          </Text>
        </Group>

        <Group gap="xs">
          <ThemeIcon variant="light" color="indigo" size="sm" radius="xl">
            <CalendarBlankIcon size={12} weight="bold" />
          </ThemeIcon>
          <Text fz="sm" c="dimmed">
            Created: <Text span fw={500} c="var(--mantine-color-text)">{formatDate(position.createdAt)}</Text>
          </Text>
        </Group>
      </Stack>

      <Box mt="xl" style={{ position: 'relative', zIndex: 2 }}>
        <Group justify="space-between" className={classes.footer}>
          <Text fz="sm" fw={600} c="blue" className={classes.viewDetails}>
            View Details
          </Text>
          <CaretRightIcon size={16} weight="bold" className={classes.arrowIcon} />
        </Group>
      </Box>
    </Card>
  );
}
