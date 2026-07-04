import { useEffect } from 'react';
import { useNavigate } from 'react-router';
import { Center, Loader } from '@mantine/core';
import { useCheckAuth } from '../auth/store';

export default function LoginSuccess() {
  const checkAuth = useCheckAuth();
  const navigate = useNavigate();

  useEffect(() => {
    checkAuth().then(() => {
      navigate('/app', { replace: true });
    });
  }, [checkAuth, navigate]);

  return (
    <Center h="100vh">
      <Loader size="lg" />
    </Center>
  );
}
