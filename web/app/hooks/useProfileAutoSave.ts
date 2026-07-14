import { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import type { ProfileAttributeDto, UpdateMeSectionDto } from '~/api/types';

interface UseProfileAutoSaveProps {
    attributes: ProfileAttributeDto[];
    mutate: (dto: UpdateMeSectionDto, options?: any) => void;
    autoSaveIntervalMs?: number;
}

export function useProfileAutoSave({ attributes, mutate, autoSaveIntervalMs = 5000 }: UseProfileAutoSaveProps) {
    const [localValues, setLocalValues] = useState<Record<string, string>>({});
    const lastSavedValues = useRef<Record<string, string>>({});

    useEffect(() => {
        const initialValues: Record<string, string> = {};
        attributes.forEach(attr => {
            initialValues[attr.id] = attr.value || '';
        });

        if (Object.keys(lastSavedValues.current).length === 0) {
            setLocalValues(initialValues);
            lastSavedValues.current = { ...initialValues };
        } else {
            attributes.forEach(attr => {
                if (lastSavedValues.current[attr.id] === undefined) {
                    setLocalValues(prev => ({ ...prev, [attr.id]: attr.value || '' }));
                    lastSavedValues.current[attr.id] = attr.value || '';
                }
            });
        }
    }, [attributes]);

    const getUpdates = useCallback(() => {
        if (Object.keys(localValues).length === 0) return [];
        return attributes
            .filter(attr => {
                const localVal = localValues[attr.id];
                const savedVal = lastSavedValues.current[attr.id];
                return localVal !== undefined && localVal !== savedVal;
            })
            .map(attr => ({
                profileAttributeId: attr.id,
                value: localValues[attr.id],
                version: attr.version
            }));
    }, [attributes, localValues]);

    const hasChanges = useMemo(() => {
        return getUpdates().length > 0;
    }, [getUpdates]);

    const handleSave = useCallback(() => {
        const updates = getUpdates();
        if (updates.length > 0) {
            const dto: UpdateMeSectionDto = { attributes: updates };
            mutate(dto, {
                onSuccess: () => {
                    updates.forEach(update => {
                        lastSavedValues.current[update.profileAttributeId] = update.value;
                    });
                }
            });
        }
    }, [getUpdates, mutate]);

    useEffect(() => {
        const intervalId = setInterval(() => {
            handleSave();
        }, autoSaveIntervalMs);

        return () => clearInterval(intervalId);
    }, [handleSave, autoSaveIntervalMs]);

    const handleChange = useCallback((id: string, value: string) => {
        setLocalValues(prev => ({ ...prev, [id]: value }));
    }, []);

    return {
        localValues,
        hasChanges,
        handleSave,
        handleChange
    };
}
