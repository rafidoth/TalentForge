import { useState } from "react";
import { Navigate, useNavigate, Link } from "react-router";
import { useMutation } from "@tanstack/react-query";
import {
  Container,
  Title,
  TextInput,
  PasswordInput,
  Button,
  Divider,
  Stack,
  Text,
  Box,
  Anchor,
} from "@mantine/core";
import { login, loginWithGoogle } from "../api/auth";
import { useCheckAuth, useIsAuthenticated } from "../auth/store";
import type { LoginRequest } from "../api/types";
import { AuthLayout } from "../components/AuthLayout";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const checkAuth = useCheckAuth();
  const isAuthenticated = useIsAuthenticated();
  const navigate = useNavigate();
  const mutation = useMutation({
    mutationFn: (data: LoginRequest) => login(data),
    onSuccess: async () => {
      await checkAuth();
      navigate("/app");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutation.mutate({ email, password });
  };

  if (isAuthenticated) {
    return <Navigate to="/app" replace />;
  }

  return (
    <AuthLayout>
      <Container size={460} w="100%">
        <Title ta="center" order={2} fw={700} c="dark.9">
          Welcome to Talent
          <Text component="span" c="blue.6" inherit>
            Forge
          </Text>
        </Title>
        <Text c="dimmed" size="sm" ta="center" mt={5}>
          Don't have an account?{" "}
          <Anchor
            component={Link}
            to="/register"
            size="sm"
            c="blue.6"
            fw={600}
          >
            Sign up
          </Anchor>
        </Text>

        <Box mt={30} bg="white">
          <form onSubmit={handleSubmit}>
            <Stack>
              <TextInput
                label="Email"
                placeholder="you@email.com"
                required
                value={email}
                onChange={(e) => setEmail(e.currentTarget.value)}
              />
              <PasswordInput
                label="Password"
                placeholder="Your password"
                required
                value={password}
                onChange={(e) => setPassword(e.currentTarget.value)}
              />
              {mutation.isError && (
                <Text c="red" size="sm">
                  Login failed. Please check your credentials.
                </Text>
              )}
              <Button
                type="submit"
                fullWidth
                mt="xl"
                loading={mutation.isPending}
              >
                Sign in
              </Button>
            </Stack>
          </form>

          <Divider
            label="Or continue with"
            labelPosition="center"
            my="lg"
          />

          <Button variant="default" fullWidth onClick={loginWithGoogle}>
            Google
          </Button>
        </Box>
      </Container>
    </AuthLayout>
  );
}
