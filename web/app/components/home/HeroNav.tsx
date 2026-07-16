import { Button, Group, Text } from "@mantine/core";
import { useNavigate } from "react-router";
import { useIsAuthenticated } from "~/auth/store";

export default function HeaderNav() {
    const navigate = useNavigate();
    const isAuthenticated = useIsAuthenticated();

    return (
        <Group justify="space-between" py={28}>
            <Text ff="Fraunces, serif" fw={600} fz={22} lts={0.2} c="dark.9">
                Talent<Text component="span" c="blue.6" inherit>Forge</Text>
            </Text>

            {isAuthenticated ? (
                <Button onClick={() => navigate("/app")}>
                    Go to App
                </Button>
            ) : (
                <Button variant="subtle" color="gray" onClick={() => navigate("/login")}>
                    Sign in
                </Button>
            )}
        </Group>
    );
}