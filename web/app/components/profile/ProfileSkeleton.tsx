import { Center, Loader, Stack, Text } from '@mantine/core';

export function ProfileSkeleton() {
    return (
        <Center mih={400}>
            <Stack align="center" gap="md">
                <Loader size="lg" color="myColor" type="dots" />
                <Text size="sm" c="dimmed">
                    Loading your profile…
                </Text>
            </Stack>
        </Center>
    );
}
