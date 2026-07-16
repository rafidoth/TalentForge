import type { Route } from "./+types/home";
import { loginWithGoogle } from "../api/auth";
import {
  Container,
  Box,
} from "@mantine/core";
import HeaderNav from "~/components/home/HeroNav";
import HeroSection from "~/components/home/Hero";
import FeaturesSection from "~/components/home/Features";
import Footer from "~/components/home/Footer";

export function meta({ }: Route.MetaArgs) {
  return [
    { title: "TalentForge" },
    {
      name: "description",
      content:
        "Build reusable attributes, assemble position templates, and generate tailored CVs automatically.",
    },
  ];
}



export default function Home() {
  return (
    <Box bg="gray.0" c="dark.9" style={{ minHeight: "100vh", fontFamily: "Inter, system-ui, sans-serif" }}>

      <Container size="lg">
        <HeaderNav />
        <HeroSection />
        <FeaturesSection />
      </Container>
      <Footer />
    </Box>
  );
}
