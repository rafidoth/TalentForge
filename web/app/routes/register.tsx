import { useState } from 'react';
import { useNavigate, Link, Navigate } from 'react-router';
import { useMutation } from '@tanstack/react-query';
import {
  Container,
  Paper,
  Title,
  TextInput,
  PasswordInput,
  Button,
  Stack,
  Text,
  Select,
  Group,
  Anchor,
  Progress,
  Popover,
  Box,
  List,
} from '@mantine/core';
import { Check, CheckIcon, X, XIcon } from '@phosphor-icons/react';
import { register } from '../api/auth';
import type { RegisterRequest } from '../api/types';
import { useCheckAuth, useIsAuthenticated } from '~/auth/store';

const COUNTRIES = [
  'Afghanistan', 'Albania', 'Algeria', 'Andorra', 'Angola', 'Antigua and Barbuda',
  'Argentina', 'Armenia', 'Australia', 'Austria', 'Azerbaijan', 'Bahamas', 'Bahrain',
  'Bangladesh', 'Barbados', 'Belarus', 'Belgium', 'Belize', 'Benin', 'Bhutan',
  'Bolivia', 'Bosnia and Herzegovina', 'Botswana', 'Brazil', 'Brunei', 'Bulgaria',
  'Burkina Faso', 'Burundi', 'Cabo Verde', 'Cambodia', 'Cameroon', 'Canada',
  'Central African Republic', 'Chad', 'Chile', 'China', 'Colombia', 'Comoros',
  'Congo', 'Costa Rica', 'Croatia', 'Cuba', 'Cyprus', 'Czech Republic',
  'Democratic Republic of the Congo', 'Denmark', 'Djibouti', 'Dominica',
  'Dominican Republic', 'Ecuador', 'Egypt', 'El Salvador', 'Equatorial Guinea',
  'Eritrea', 'Estonia', 'Eswatini', 'Ethiopia', 'Fiji', 'Finland', 'France',
  'Gabon', 'Gambia', 'Georgia', 'Germany', 'Ghana', 'Greece', 'Grenada',
  'Guatemala', 'Guinea', 'Guinea-Bissau', 'Guyana', 'Haiti', 'Honduras', 'Hungary',
  'Iceland', 'India', 'Indonesia', 'Iran', 'Iraq', 'Ireland', 'Israel', 'Italy',
  'Jamaica', 'Japan', 'Jordan', 'Kazakhstan', 'Kenya', 'Kiribati', 'Kuwait',
  'Kyrgyzstan', 'Laos', 'Latvia', 'Lebanon', 'Lesotho', 'Liberia', 'Libya',
  'Liechtenstein', 'Lithuania', 'Luxembourg', 'Madagascar', 'Malawi', 'Malaysia',
  'Maldives', 'Mali', 'Malta', 'Marshall Islands', 'Mauritania', 'Mauritius',
  'Mexico', 'Micronesia', 'Moldova', 'Monaco', 'Mongolia', 'Montenegro', 'Morocco',
  'Mozambique', 'Myanmar', 'Namibia', 'Nauru', 'Nepal', 'Netherlands', 'New Zealand',
  'Nicaragua', 'Niger', 'Nigeria', 'North Korea', 'North Macedonia', 'Norway', 'Oman',
  'Pakistan', 'Palau', 'Palestine', 'Panama', 'Papua New Guinea', 'Paraguay', 'Peru',
  'Philippines', 'Poland', 'Portugal', 'Qatar', 'Romania', 'Russia', 'Rwanda',
  'Saint Kitts and Nevis', 'Saint Lucia', 'Saint Vincent and the Grenadines', 'Samoa',
  'San Marino', 'Sao Tome and Principe', 'Saudi Arabia', 'Senegal', 'Serbia',
  'Seychelles', 'Sierra Leone', 'Singapore', 'Slovakia', 'Slovenia', 'Solomon Islands',
  'Somalia', 'South Africa', 'South Korea', 'South Sudan', 'Spain', 'Sri Lanka',
  'Sudan', 'Suriname', 'Sweden', 'Switzerland', 'Syria', 'Taiwan', 'Tajikistan',
  'Tanzania', 'Thailand', 'Timor-Leste', 'Togo', 'Tonga', 'Trinidad and Tobago',
  'Tunisia', 'Turkey', 'Turkmenistan', 'Tuvalu', 'Uganda', 'Ukraine',
  'United Arab Emirates', 'United Kingdom', 'United States', 'Uruguay', 'Uzbekistan',
  'Vanuatu', 'Vatican City', 'Venezuela', 'Vietnam', 'Yemen', 'Zambia', 'Zimbabwe',
];

function getPasswordStrength(password: string) {
  const requirements = [
    { label: 'At least 6 characters', test: (p: string) => p.length >= 6 },
    { label: 'Contains a lowercase letter', test: (p: string) => /[a-z]/.test(p) },
    { label: 'Contains an uppercase letter', test: (p: string) => /[A-Z]/.test(p) },
    { label: 'Contains a digit', test: (p: string) => /\d/.test(p) },
    { label: 'Contains a special character (!@#$…)', test: (p: string) => /[^a-zA-Z0-9]/.test(p) },
  ];

  const passed = requirements.filter((r) => r.test(password)).length;
  return { requirements, passed, total: requirements.length };
}

function validateEmail(email: string): string | null {
  if (!email) return null;
  const re = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
  if (!re.test(email)) return 'Please enter a valid email address';
  return null;
}

function PasswordRequirement({ meets, label }: { meets: boolean; label: string }) {
  return (
    <List.Item
      icon={
        meets ? (
          <CheckIcon size={14} weight="bold" color="var(--mantine-color-teal-6)" />
        ) : (
          <XIcon size={14} weight="bold" color="var(--mantine-color-red-6)" />
        )
      }
    >
      <Text size="xs" c={meets ? 'teal' : 'red'}>
        {label}
      </Text>
    </List.Item>
  );
}

export default function Register() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [location, setLocation] = useState<string | null>(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [popoverOpened, setPopoverOpened] = useState(false);
  const [touched, setTouched] = useState({
    firstName: false,
    lastName: false,
    location: false,
    email: false,
    password: false,
    confirmPassword: false,
  });

  const isAuthenticated = useIsAuthenticated();
  if (isAuthenticated) {
    return <Navigate to="/app" replace />;
  }

  const navigate = useNavigate();

  const { requirements, passed, total } = getPasswordStrength(password);
  const emailError = touched.email ? validateEmail(email) : null;
  const confirmError =
    touched.confirmPassword && confirmPassword && confirmPassword !== password
      ? 'Passwords do not match'
      : null;

  const allValid =
    firstName.trim() !== '' &&
    lastName.trim() !== '' &&
    location !== null &&
    !validateEmail(email) &&
    passed === total &&
    password === confirmPassword;

  const checkAuth = useCheckAuth();
  const strengthPercent = (passed / total) * 100;
  const strengthColor = strengthPercent < 40 ? 'red' : strengthPercent < 80 ? 'yellow' : 'teal';

  const mutation = useMutation({
    mutationFn: (data: RegisterRequest) => register(data),
    onSuccess: async () => {
      await checkAuth();
      navigate('/app');
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!allValid) return;
    mutation.mutate({
      email,
      password,
      firstName,
      lastName,
      location: location!,
    });
  };

  // Extract server-side error message from axios error
  const serverError = mutation.isError
    ? (() => {
      const err = mutation.error as any;
      const data = err?.response?.data;
      if (typeof data === 'string') return data;
      if (data?.message) return data.message;
      if (Array.isArray(data)) {
        return data.map((e: any) => e.description || e.code).join('. ');
      }
      return 'Registration failed. Please try again.';
    })()
    : null;

  return (
    <Container size={460} my={40}>
      <Title ta="center" order={2}>
        Create your account
      </Title>
      <Text c="dimmed" size="sm" ta="center" mt={5}>
        Already have an account?{' '}
        <Anchor component={Link} to="/login" size="sm">
          Sign in
        </Anchor>
      </Text>

      <Paper withBorder shadow="md" p={30} mt={30} radius="md">
        <form onSubmit={handleSubmit}>
          <Stack>
            <Group grow>
              <TextInput
                label="First name"
                placeholder="John"
                required
                value={firstName}
                onChange={(e) => setFirstName(e.currentTarget.value)}
                onBlur={() => setTouched((t) => ({ ...t, firstName: true }))}
                error={touched.firstName && !firstName.trim() ? 'First name is required' : null}
              />
              <TextInput
                label="Last name"
                placeholder="Doe"
                required
                value={lastName}
                onChange={(e) => setLastName(e.currentTarget.value)}
                onBlur={() => setTouched((t) => ({ ...t, lastName: true }))}
                error={touched.lastName && !lastName.trim() ? 'Last name is required' : null}
              />
            </Group>

            <Select
              label="Location"
              placeholder="Select your country"
              data={COUNTRIES}
              searchable
              required
              value={location}
              onChange={setLocation}
              onBlur={() => setTouched((t) => ({ ...t, location: true }))}
              error={touched.location && !location ? 'Please select your country' : null}
              maxDropdownHeight={200}
            />

            <TextInput
              label="Email"
              placeholder="you@email.com"
              required
              value={email}
              onChange={(e) => setEmail(e.currentTarget.value)}
              onBlur={() => setTouched((t) => ({ ...t, email: true }))}
              error={emailError}
            />

            <Popover
              opened={popoverOpened}
              position="bottom"
              width="target"
              transitionProps={{ transition: 'pop' }}
            >
              <Popover.Target>
                <div
                  onFocusCapture={() => setPopoverOpened(true)}
                  onBlurCapture={() => {
                    setPopoverOpened(false);
                    setTouched((t) => ({ ...t, password: true }));
                  }}
                >
                  <PasswordInput
                    label="Password"
                    placeholder="Create a strong password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.currentTarget.value)}
                    error={touched.password && passed < total ? ' ' : null}
                  />
                </div>
              </Popover.Target>
              <Popover.Dropdown>
                <Progress color={strengthColor} value={strengthPercent} size={5} mb="xs" />
                <List spacing={4} size="sm" listStyleType="none">
                  {requirements.map((req) => (
                    <PasswordRequirement
                      key={req.label}
                      label={req.label}
                      meets={req.test(password)}
                    />
                  ))}
                </List>
              </Popover.Dropdown>
            </Popover>

            <PasswordInput
              label="Confirm password"
              placeholder="Re-enter your password"
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.currentTarget.value)}
              onBlur={() => setTouched((t) => ({ ...t, confirmPassword: true }))}
              error={confirmError}
            />

            {serverError && (
              <Text c="red" size="sm">
                {serverError}
              </Text>
            )}

            <Button
              type="submit"
              fullWidth
              mt="xl"
              loading={mutation.isPending}
              disabled={!allValid}
            >
              Create account
            </Button>
          </Stack>
        </form>
      </Paper>
    </Container>
  );
}
