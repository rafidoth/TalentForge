import type { Route } from "./+types/home";
import { loginWithGoogle } from "../api/auth";
import {
  Button,
  Container,
  Group,
  Text,
  Title,
  SimpleGrid,
  Box,
  Anchor,
  Badge,
  Paper,
} from "@mantine/core";
import { useNavigate } from "react-router";
import { useIsAuthenticated } from "~/auth/store";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "TalentForge" },
    {
      name: "description",
      content:
        "Build reusable attributes, assemble position templates, and generate tailored CVs automatically.",
    },
  ];
}

const CHIPS = [
  { label: "React", top: "6%", left: "4%", delay: "0s" },
  { label: "IELTS 7.5", top: "28%", left: "62%", delay: "1.1s" },
  { label: "Senior", top: "58%", left: "10%", delay: "2.3s" },
  { label: "Remote", top: "78%", left: "56%", delay: "0.6s" },
  { label: "PostgreSQL", top: "12%", left: "74%", delay: "1.8s" },
  { label: "Team Lead", top: "48%", left: "30%", delay: "2.9s" },
];

const FEATURES = [
  {
    title: "Attribute Library",
    body: "Define a skill, score, or certification once. Reuse it across every position and every profile.",
  },
  {
    title: "Position Templates",
    body: "Recruiters assemble positions from attributes and access rules — no duplicated forms, no busywork.",
  },
  {
    title: "Automatic CVs",
    body: "Candidates fill their profile once. A tailored CV is generated for every position they qualify for.",
  },
];

function HeaderNav() {
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

function HeroVisual() {
  return (
    <Box pos="relative" h={{ base: 260, md: 420 }}>
      <Paper
        shadow="0 30px 60px -20px rgba(0,0,0,0.15)"
        radius="md"
        p={22}
        bg="white"
        withBorder
        style={{
          position: "absolute",
          left: "50%",
          top: "50%",
          transform: "translate(-50%, -50%)",
          width: 220,
          height: 280,
          borderColor: "var(--mantine-color-gray-3)",
        }}
      >
        <Box
          w={40}
          h={40}
          style={{ borderRadius: "50%", background: "linear-gradient(135deg, var(--mantine-color-blue-5), var(--mantine-color-blue-8))" }}
          mb={16}
        />
        <Box h={8} style={{ borderRadius: 3 }} bg="gray.2" mb={12} w="70%" />
        <Box h={8} style={{ borderRadius: 3 }} bg="gray.2" mb={12} w="45%" />
        <Box h={8} style={{ borderRadius: 3 }} bg="gray.2" mb={12} w="85%" />
        <Box h={8} style={{ borderRadius: 3 }} bg="gray.2" mb={12} w="60%" />
        <Box h={8} style={{ borderRadius: 3 }} bg="gray.2" mb={12} w="75%" />
      </Paper>
      
      {CHIPS.map((chip) => (
        <Badge
          key={chip.label}
          className="tf-drift"
          color="gray.4"
          variant="outline"
          size="lg"
          style={{
            position: "absolute",
            top: chip.top,
            left: chip.left,
            animationDelay: chip.delay,
            background: "white",
            color: "var(--mantine-color-dark-7)",
            border: "1px solid var(--mantine-color-gray-3)",
            textTransform: "none",
            fontWeight: 500,
          }}
        >
          {chip.label}
        </Badge>
      ))}
    </Box>
  );
}

function HeroSection() {
  const navigate = useNavigate();
  const isAuthenticated = useIsAuthenticated();

  return (
    <SimpleGrid cols={{ base: 1, md: 2 }} spacing={{ base: 48, md: 64 }} py={{ base: 56, md: 88 }} align="center">
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

function FeaturesSection() {
  return (
    <SimpleGrid cols={{ base: 1, sm: 3 }} spacing="xl" pb={80}>
      {FEATURES.map((f) => (
        <Box key={f.title} style={{ borderTop: "2px solid var(--mantine-color-blue-6)" }} pt="md">
          <Title order={3} ff="Fraunces, serif" fw={600} fz={18} mb={8} c="dark.9">
            {f.title}
          </Title>
          <Text fz="sm" lh={1.6} c="dimmed">
            {f.body}
          </Text>
        </Box>
      ))}
    </SimpleGrid>
  );
}

function Footer() {
  return (
    <Box style={{ borderTop: "1px solid var(--mantine-color-gray-2)" }} py={24} pb={40}>
      <Container size="lg">
        <Text fz="sm" c="dimmed">
          © {new Date().getFullYear()} TalentForge
        </Text>
      </Container>
    </Box>
  );
}

export default function Home() {
  return (
    <Box bg="gray.0" c="dark.9" style={{ minHeight: "100vh", fontFamily: "Inter, system-ui, sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,500;9..144,600&family=Inter:wght@400;500;600&display=swap');
        
        .tf-drift {
          animation: tf-drift 6s ease-in-out infinite;
        }

        @keyframes tf-drift {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }

        @media (prefers-reduced-motion: reduce) {
          .tf-drift { animation: none; }
        }
      `}</style>

      <Container size="lg">
        <HeaderNav />
        <HeroSection />
        <FeaturesSection />
      </Container>

      <Footer />
    </Box>
  );
}
