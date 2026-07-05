import { useQuery } from '@tanstack/react-query';
import { fetchMeSection } from '~/api/profile';

export function useMeSection() {
    return useQuery({
        queryKey: ['profile', 'me'],
        queryFn: fetchMeSection,
    });
}
