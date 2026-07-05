import { Center, Stack, Text, Button, ThemeIcon } from '@mantine/core';
import { WarningCircleIcon } from '@phosphor-icons/react';

interface ProfileErrorProps {
    message?: string;
    onRetry?: () => void;
}

export function ProfileError({ message, onRetry }: ProfileErrorProps) {
    return (
        <Center mih={400}>
            <Stack align="center" gap="md">
                <ThemeIcon size={60} radius="xl" color="red" variant="light">
                    <WarningCircleIcon size={36} weight="duotone" />
                </ThemeIcon>
                <Text fw={600} size="lg">
                    Failed to load profile
                </Text>
                <Text size="sm" c="dimmed" ta="center" maw={360}>
                    {message || 'Something went wrong. Please try again later.'}
                </Text>
                {onRetry && (
                    <Button variant="light" color="myColor" onClick={onRetry}>
                        Try again
                    </Button>
                )}
            </Stack>
        </Center>
    );
}
