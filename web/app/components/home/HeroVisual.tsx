import { Badge, Box, Paper } from "@mantine/core";

const CHIPS = [
    { label: "React", top: "6%", left: "4%", delay: "0s" },
    { label: "IELTS 7.5", top: "28%", left: "62%", delay: "1.1s" },
    { label: "Senior", top: "58%", left: "10%", delay: "2.3s" },
    { label: "Remote", top: "78%", left: "56%", delay: "0.6s" },
    { label: "PostgreSQL", top: "12%", left: "74%", delay: "1.8s" },
    { label: "Team Lead", top: "48%", left: "30%", delay: "2.9s" },
];


export default function HeroVisual() {
    return (
        <Box pos="relative" h={{ base: 260, md: 420 }}>
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

