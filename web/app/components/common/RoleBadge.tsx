import { Badge } from "@mantine/core";
import type { UserRole } from "~/auth/types";

function RoleBadge({ role }: { role: UserRole }) {
    const roleBadgeColor: Record<string, string> = {
        Candidate: 'blue',
        Recruiter: 'teal',
        Administrator: 'red',
    };

    return (
        <Badge
            size="lg"
            variant="light"
            color={roleBadgeColor[role] ?? 'gray'}
            radius="sm"
        >
            {role}
        </Badge>
    );
}

export default RoleBadge;