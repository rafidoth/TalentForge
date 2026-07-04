import type { Route } from "./+types/home";
import { loginWithGoogle } from "../api/auth";
import { Button } from "@mantine/core";
import { useNavigate } from "react-router";

export function meta({ }: Route.MetaArgs) {
  return [
    { title: "New React Router App" },
    { name: "description", content: "Welcome to React Router!" },
  ];
}

export default function Home() {
  const navigate = useNavigate();

  return (
    <div>
      <Button variant="filled" onClick={() =>
        loginWithGoogle()
      } >Sign in with Google</Button>

      <Button variant="light" onClick={() =>
        navigate("/login")
      } >Sign in</Button>
    </div>
  );
}
