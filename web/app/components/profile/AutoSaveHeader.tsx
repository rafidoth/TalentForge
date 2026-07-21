import { Group, Title, Transition, Tooltip, ActionIcon, Button } from '@mantine/core';
import { CheckCircleIcon, CheckIcon, SpinnerGapIcon, WarningCircleIcon } from '@phosphor-icons/react';
import React from 'react';

interface AutoSaveHeaderProps {
    title: string;
    icon: React.ReactNode;
    isPending: boolean;
    isSuccess: boolean;
    isError: boolean;
    hasChanges: boolean;
    onSave: () => void;
}

export function AutoSaveHeader({
    title,
    icon,
    isPending,
    isSuccess,
    isError,
    hasChanges,
    onSave
}: AutoSaveHeaderProps) {
    return (
        <Group justify="space-between" mb="lg">
            <Group gap="xs">
                {icon}
                <Title order={3}>{title}</Title>
            </Group>
            <Group gap="xs">
                <Transition
                    mounted={isPending || (!isPending && isSuccess && !hasChanges) || (!isPending && isError)}
                    transition="fade"
                    duration={150}
                >
                    {(styles) => (
                        <div style={styles}>
                            {isPending && (
                                <Tooltip label="Saving..." withArrow position="bottom">
                                    <ActionIcon variant="subtle" color="gray" radius="xl" size="sm" style={{ cursor: 'default' }}>
                                        <SpinnerGapIcon size={16} style={{ animation: 'spin 1s linear infinite' }} />
                                    </ActionIcon>
                                </Tooltip>
                            )}
                            {!isPending && isSuccess && !hasChanges && (
                                <Tooltip label="Saved" withArrow position="bottom">
                                    <ActionIcon variant="subtle" color="green" radius="xl" size="sm" style={{ cursor: 'default' }}>
                                        <CheckCircleIcon size={18} weight="fill" />
                                    </ActionIcon>
                                </Tooltip>
                            )}
                            {!isPending && isError && (
                                <Tooltip label="Failed to save — click to retry" withArrow position="bottom">
                                    <ActionIcon variant="subtle" color="red" radius="xl" size="sm" onClick={onSave}>
                                        <WarningCircleIcon size={18} weight="fill" />
                                    </ActionIcon>
                                </Tooltip>
                            )}
                        </div>
                    )}
                </Transition>

                {hasChanges && (
                    <Tooltip label="Save changes" withArrow position="bottom">
                        <Button
                            onClick={onSave}
                            disabled={isPending}
                            loading={isPending}
                            variant="subtle"
                            radius="xl"
                            color="myColor"
                            size="sm"
                        >
                            Save Changes
                        </Button>
                    </Tooltip>
                )}
            </Group>
            <style>{`
                @keyframes spin {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }
            `}</style>
        </Group>
    );
}
