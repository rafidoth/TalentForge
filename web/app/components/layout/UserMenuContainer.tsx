import { useNavigate } from 'react-router';
import { useAuthStore, useLogout } from '~/auth/store';
import { useMeSection } from '~/hooks/useProfileData';
import { getDisplayName, getProfileImageUrl } from '~/components/profile/profileUtils';
import { UserMenu } from './UserMenu';
import { useQueryClient } from "@tanstack/react-query";

export function UserMenuContainer() {
    const logout = useLogout();
    const navigate = useNavigate();
    const { data: meSection, isLoading } = useMeSection();
    const queryClient = useQueryClient();
    const email = useAuthStore((state) => state.email) || '';

    const displayName = meSection?.meAttributes
        ? getDisplayName(meSection.meAttributes)
        : 'User';

    const avatarUrl = meSection?.meAttributes
        ? getProfileImageUrl(meSection.meAttributes)
        : '';

    const handleLogout = async () => {
        queryClient.clear();
        await logout();
        navigate('/login');
    };

    return (
        <UserMenu
            avatarUrl={avatarUrl}
            displayName={displayName}
            email={email}
            isLoading={isLoading}
            onLogout={handleLogout}
        />
    );
}
