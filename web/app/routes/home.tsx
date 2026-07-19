import type { Route } from "./+types/home";
import { Navigate } from "react-router";

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
  return <Navigate to="/app" />
}
