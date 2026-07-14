import { Paper, SimpleGrid } from '@mantine/core';
import { UserIcon } from '@phosphor-icons/react';
import type { ProfileAttributeDto } from '~/api/types';
import { useUpdateMeSection } from '~/hooks/useProfileData';
import { useProfileAutoSave } from '~/hooks/useProfileAutoSave';
import { AutoSaveHeader } from './AutoSaveHeader';
import { ProfileAttributeInput } from './ProfileAttributeInput';

interface MeSectionEditorProps {
    attributes: ProfileAttributeDto[];
}

export function MeSectionEditor({ attributes }: MeSectionEditorProps) {
    const { mutate, isPending, isSuccess, isError } = useUpdateMeSection();

    const {
        localValues,
        hasChanges,
        handleSave,
        handleChange
    } = useProfileAutoSave({ attributes, mutate });

    return (
        <Paper p="xl" withBorder shadow="sm" radius="md">
            <AutoSaveHeader
                title="Me"
                icon={<UserIcon size={20} />}
                isPending={isPending}
                isSuccess={isSuccess}
                isError={isError}
                hasChanges={hasChanges}
                onSave={handleSave}
            />

            <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="md">
                {attributes.map(attr => (
                    <ProfileAttributeInput
                        key={attr.id}
                        attribute={attr}
                        value={localValues[attr.id] || ''}
                        onChange={handleChange}
                    />
                ))}
            </SimpleGrid>
        </Paper>
    );
}
