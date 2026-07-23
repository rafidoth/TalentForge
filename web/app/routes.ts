import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
    index("routes/home.tsx"),
    route("login", "routes/login.tsx"),
    route("register", "routes/register.tsx"),
    route("login/success", "routes/login-success.tsx"),
    route("app", "routes/application.tsx", [
        index("routes/app-home.tsx"),
        route("profile", "routes/profile.tsx"),
        route("users", "routes/administrator/users.tsx"),
        route("positions", "routes/positions.tsx"),
        route("attributes", "routes/attribute-library.tsx"),
        route("cvs", "routes/cvs.tsx"),
        route("cv/:id", "routes/cv.tsx"),
        route("position/:id", "routes/position-details.tsx"),
        route("c/positions", "routes/candidate-positions.tsx"),
        route("c/projects", "routes/candidate-projects.tsx"),
        route("c/cvs", "routes/candidate-cvs.tsx"),
        route("c/cv/:positionId/:cvId", "routes/candidate-cv.tsx")
    ])
] satisfies RouteConfig;

