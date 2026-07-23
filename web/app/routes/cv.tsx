import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router";
import { Container, Title, Text, Stack, Loader, Center, Group, ActionIcon, Button } from "@mantine/core";
import { ArrowLeftIcon } from "@phosphor-icons/react";
import { IconHeartFilled, IconHeart } from "@tabler/icons-react";
import { useFullCv, useLikeCv, useUnlikeCv } from "~/hooks/useCvs";
import { FullCv } from "~/components/CandidateCv/FullCv";

export default function CvDetailsPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { data: cv, isLoading, isError } = useFullCv(id);
    const likeMutation = useLikeCv();
    const unlikeMutation = useUnlikeCv();

    const [isLiked, setIsLiked] = useState(false);

    useEffect(() => {
        if (id) {
            setIsLiked(localStorage.getItem(`liked_cv_${id}`) === 'true');
        }
    }, [id]);

    const handleToggleLike = async () => {
        if (!id) return;
        try {
            if (isLiked) {
                await unlikeMutation.mutateAsync(id);
                localStorage.setItem(`liked_cv_${id}`, 'false');
                setIsLiked(false);
            } else {
                await likeMutation.mutateAsync(id);
                localStorage.setItem(`liked_cv_${id}`, 'true');
                setIsLiked(true);
            }
        } catch (e) {
            // Ignore error (e.g. if already liked/unliked)
        }
    };

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
                        <ActionIcon 
                            variant="subtle" 
                            color="red" 
                            size="xl" 
                            onClick={handleToggleLike}
                            loading={likeMutation.isPending || unlikeMutation.isPending}
                        >
                            {isLiked ? <IconHeartFilled size={32} /> : <IconHeart size={32} />}
                        </ActionIcon>
                    </Group>
                </Group>


                <FullCv cv={cv} />
            </Stack>
        </Container>
    );
}
