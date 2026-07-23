import { useParams, useNavigate } from "react-router";
import { Container, Title, Text, Stack, Loader, Center, Group, ActionIcon, Divider, Button } from "@mantine/core";
import { ArrowLeftIcon } from "@phosphor-icons/react";
import { IconHeartFilled } from "@tabler/icons-react";
import { useFullCv } from "~/hooks/useCvs";
import { FullCv } from "~/components/CandidateCv/FullCv";

export default function CvDetailsPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { data: cv, isLoading, isError } = useFullCv(id);

    if (isLoading) {
        return <Center p="xl" h={400}><Loader /></Center>;
    }

    if (isError || !cv) {
        return <Center p="xl" h={400}><Text c="red">Failed to load CV</Text></Center>;
    }

    return (
        <Container size="lg" py="xl">
            <Stack gap="xl">
                <Group>
                    <Button variant="subtle" onClick={() => navigate(-1)}>
                        <ArrowLeftIcon size={20} />
                        Back
                    </Button>
                </Group>

                <Group justify="space-between" align="flex-start">
                    <Stack gap="xs">
                        <Title order={3} c="dimmed">{cv.positionTitle}</Title>
                        <Title order={1}>{cv.candidateName}</Title>
                    </Stack>

                    <Group gap={4} align="center">
                        <Text fw={600} size="xl">{cv.likeCount}</Text>
                        <IconHeartFilled size={32} color="red" />
                    </Group>
                </Group>


                <FullCv cv={cv} />
            </Stack>
        </Container>
    );
}
