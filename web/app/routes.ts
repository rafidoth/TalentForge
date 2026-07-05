import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
    index("routes/home.tsx"),
    route("login", "routes/login.tsx"),
    route("register", "routes/register.tsx"),
    route("login/success", "routes/login-success.tsx"),
    route("app", "routes/application.tsx", [
        route("profile", "routes/profile.tsx")
    ])
] satisfies RouteConfig;

