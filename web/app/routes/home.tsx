import type { Route } from "./+types/home";
import { loginWithGoogle } from "../api/auth";
import { Button } from "@mantine/core";

export function meta({ }: Route.MetaArgs) {
  return [
    { title: "New React Router App" },
    { name: "description", content: "Welcome to React Router!" },
  ];
}

export default function Home() {

  return (
    <div>
      <Button variant="filled" onClick={() =>
        loginWithGoogle()
      } >Sign in with Google</Button>
    </div>
  );
}
