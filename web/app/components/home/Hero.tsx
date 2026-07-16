import { Text, Box, SimpleGrid, Title, Group, Button, Anchor } from "@mantine/core";
import { useNavigate } from "react-router";
import { loginWithGoogle } from "~/api/auth";
import { useIsAuthenticated } from "~/auth/store";
import HeroVisual from "./HeroVisual";

export default function HeroSection() {
    const navigate = useNavigate();
    const isAuthenticated = useIsAuthenticated();

    return (
        <SimpleGrid cols={{ base: 1, md: 2 }} spacing={{ base: 48, md: 64 }} py={{ base: 56, md: 88 }}>
            <Box>
                <Text fz={12} lts="0.16em" tt="uppercase" c="blue.6" fw={600} mb={18}>
                    CV Management Platform
                </Text>

                <Title
                    order={1}
                    ff="Fraunces, serif"
                    fw={500}
                    fz={{ base: 34, md: 46 }}
                    lh={1.12}
                    style={{ letterSpacing: "-0.01em" }}
                    mb={20}
                    maw={560}
                    c="dark.9"
                >
                    Every position, <Text component="em" fs="normal" c="blue.6" inherit>its own CV.</Text> Forged from one profile.
                </Title>

                <Text fz="md" lh={1.6} c="dimmed" maw={460} mb={32}>
                    Define attributes once, assemble them into position templates, and
                    let TalentForge generate a tailored CV for every candidate —
                    automatically.
                </Text>

                {isAuthenticated ? (
                    <Group gap="sm">
                        <Button size="md" onClick={() => navigate("/app")}>
                            Go to App
                        </Button>
                    </Group>
                ) : (
                    <>
                        <Group gap="sm">
                            <Button size="md" onClick={() => loginWithGoogle()}>
                                Continue with Google
                            </Button>
                            <Button size="md" variant="default" onClick={() => navigate("/login")}>
                                Sign in with email
                            </Button>
                        </Group>
                        <Text mt="md" fz="sm" c="dimmed">
                            New here?{" "}
                            <Anchor component="button" type="button" c="blue.6" fw={500} onClick={() => navigate("/register")}>
                                Create an account
                            </Anchor>
                        </Text>
                    </>
                )}
            </Box>

            <HeroVisual />
        </SimpleGrid>
    );
}

