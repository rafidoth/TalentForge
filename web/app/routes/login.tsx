import { useState } from 'react';
import { useNavigate } from 'react-router';
import { useMutation } from '@tanstack/react-query';
import { Container, Paper, Title, TextInput, PasswordInput, Button, Divider, Stack, Text } from '@mantine/core';
import { login, loginWithGoogle } from '../api/auth';
import { useAuthStore, useLogin } from '../auth/store';
import type { LoginRequest, LoginResponse } from '../api/types';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const authLogin = useLogin();
  const navigate = useNavigate();

  const mutation = useMutation({
    mutationFn: (data: LoginRequest) => login(data),
    onSuccess: (data: LoginResponse) => {
      authLogin(data.userId, data.role);
      navigate('/app');
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutation.mutate({ email, password });
  };

  return (
    <Container size={420} my={40}>
      <Title ta="center" order={2}>
        Welcome back
      </Title>

      <Paper withBorder shadow="md" p={30} mt={30} radius="md">
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
            <Button type="submit" fullWidth mt="xl" loading={mutation.isPending}>
              Sign in
            </Button>
          </Stack>
        </form>

        <Divider label="Or continue with" labelPosition="center" my="lg" />

        <Button variant="default" fullWidth onClick={loginWithGoogle}>
          Google
        </Button>
      </Paper>
    </Container>
  );
}
