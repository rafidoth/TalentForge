import { useMatches, Navigate, useLocation } from "react-router";
import { useAuthStore } from "./store";
import { Center, Loader } from "@mantine/core";
import type { RouteHandle } from "~/auth/types";
import type { ReactNode } from "react";

export function RouteGuard({ children }: { children: ReactNode }) {
    const matches = useMatches();
    const location = useLocation();

    const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
    const role = useAuthStore((state) => state.role);
    const isLoading = useAuthStore((state) => state.isLoading);

    if (isLoading) {
        return (
            <Center h="100vh">
                <Loader />
            </Center>
        );
    }

    // Merge handles from matched routes. Child route handles will override parent route handles.
    const routeHandle: RouteHandle = matches
        .map((match) => (match.handle as RouteHandle) || {})
        .reduce((acc, handle) => ({ ...acc, ...handle }), {});

    if (routeHandle?.requireAuth && !isAuthenticated) {
        return <Navigate to={`/login?redirect=${encodeURIComponent(location.pathname + location.search)}`} replace />;
    }

    if (routeHandle?.allowedRoles && routeHandle.allowedRoles.length > 0) {
        if (!role || !routeHandle.allowedRoles.includes(role)) {
            // Unauthorized users are redirected to their profile
            return <Navigate to="/app/profile" replace />;
        }
    }

    return <>{children}</>;
}
