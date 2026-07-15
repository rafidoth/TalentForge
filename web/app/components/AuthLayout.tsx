import { Box, SimpleGrid, Title } from '@mantine/core';
import React from 'react';

interface AuthLayoutProps {
  children: React.ReactNode;
}

export function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <Box bg="white" style={{ minHeight: "100vh", display: "flex" }}>
      <style>{`
        .cv-doc {
          width: 280px;
          height: 360px;
          background: white;
          border-radius: 8px;
          padding: 24px;
          box-shadow: 0 20px 40px rgba(0,0,0,0.2);
          position: relative;
          overflow: hidden;
          z-index: 2;
        }
        .cv-line {
          height: 12px;
          border-radius: 4px;
          background: var(--mantine-color-gray-2);
          margin-bottom: 16px;
          animation: slideIn 2s ease-out infinite alternate;
        }
        .cv-line-1 { width: 40%; animation-delay: 0s; }
        .cv-line-2 { width: 80%; animation-delay: 0.2s; }
        .cv-line-3 { width: 60%; animation-delay: 0.4s; }
        .cv-line-4 { width: 90%; animation-delay: 0.6s; }
        .cv-line-5 { width: 50%; animation-delay: 0.8s; }
        
        @keyframes slideIn {
          0% { transform: translateX(-20px); opacity: 0; }
          20%, 100% { transform: translateX(0); opacity: 1; }
        }

        .bg-shape {
          position: absolute;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.1);
          animation: float 6s ease-in-out infinite;
        }

        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-20px); }
        }
      `}</style>
      <SimpleGrid cols={{ base: 1, lg: 2 }} spacing={0} w="100%">
        {/* Left Side: Animation */}
        <Box
          visibleFrom="lg"
          style={{
            background:
              "linear-gradient(135deg, var(--mantine-color-blue-6) 0%, var(--mantine-color-blue-9) 100%)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            position: "relative",
            overflow: "hidden",
          }}
          p={40}
        >
          <div
            className="bg-shape"
            style={{
              width: 300,
              height: 300,
              top: "-50px",
              left: "-50px",
              animationDelay: "0s",
            }}
          />
          <div
            className="bg-shape"
            style={{
              width: 200,
              height: 200,
              bottom: "50px",
              right: "-20px",
              animationDelay: "1s",
            }}
          />

          <div className="cv-doc">
            <Box
              w={48}
              h={48}
              style={{
                borderRadius: "50%",
                background:
                  "linear-gradient(135deg, var(--mantine-color-blue-5), var(--mantine-color-blue-8))",
              }}
              mb={24}
            />
            <div className="cv-line cv-line-1" />
            <div className="cv-line cv-line-2" />
            <div className="cv-line cv-line-3" />
            <div className="cv-line cv-line-4" />
            <div className="cv-line cv-line-5" />
          </div>

          <Title
            order={3}
            c="white"
            mt={40}
            ta="center"
            style={{ zIndex: 2 }}
            maw={400}
          >
            Build reusable attributes, assemble position templates, and generate
            tailored CVs automatically.
          </Title>
        </Box>

        {/* Right Side: Form Content */}
        <Box
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "white",
          }}
          py={40}
        >
          {children}
        </Box>
      </SimpleGrid>
    </Box>
  );
}
