import { useParams, Navigate, useNavigate } from 'react-router';
import { useState, useEffect } from 'react';
import {
    Container,
    Paper,
    Group,
    Loader,
    Center,
    Alert,
    Button,
    Tooltip
} from '@mantine/core';
import { IconAlertCircle, IconArrowLeft } from '@tabler/icons-react';
import { useMeSection, useCandidatePositionAttributes } from '~/hooks/useProfileData';
import { usePosition } from '~/hooks/usePositions';
import { useCv, useUpdateCv } from '~/hooks/useCvs';
import { useIsAuthenticated, useAuthLoading } from '~/auth/store';
import type { ProfileAttributeDto, AttributeDto } from '~/api/types';

import { CandidateCvHeader } from './CandidateCvHeader';
import { CandidateCvPositionAttributes } from './CandidateCvPositionAttributes';
import { CandidateCvProjects } from './CandidateCvProjects';
import classes from './CandidateCv.module.css';

export function CandidateCv() {
    const { positionId, cvId } = useParams();
    const navigate = useNavigate();

    const isAuthenticated = useIsAuthenticated();
    const authLoading = useAuthLoading();

    const {
        data: meSection,
        isLoading: isMeLoading,
        error: meError
    } = useMeSection();

    const {
        data: positionAttributes,
        isLoading: isPositionLoading,
        error: positionError
    } = useCandidatePositionAttributes(positionId);

    const { data: positionData, isLoading: isPositionDataLoading } = usePosition(positionId || '');
    const { data: cvData, isLoading: isCvLoading } = useCv(cvId);
    const { mutate: updateCv, isPending: isUpdatingCv } = useUpdateCv();

    const [selectedProjectIds, setSelectedProjectIds] = useState<string[]>([]);

    useEffect(() => {
        if (cvData?.projects) {
            setSelectedProjectIds(cvData.projects.map(p => p.id));
        }
    }, [cvData]);

    const handlePublish = () => {
        if (!cvId) return;
        updateCv({
            id: cvId,
            dto: {
                chosenProjectIds: selectedProjectIds,
                isPublished: true,
            }
        });
    };

    if (authLoading || isMeLoading || isPositionLoading || isPositionDataLoading || isCvLoading) {
        return (
            <Center h={400}>
                <Loader size="xl" />
            </Center>
        );
    }

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    if (meError || positionError) {
        return (
            <Container size="md" py="xl">
                <Alert icon={<IconAlertCircle size={16} />} title="Error" color="red">
                    Failed to load CV data. Please try again later.
                </Alert>
            </Container>
        );
    }

    const { meAttributes } = meSection || { meAttributes: [] };
    const { filledAttributes = [], missingAttributes = [] } = positionAttributes || {};

    const groupedAttributes: Record<string, { filled: ProfileAttributeDto[], missing: AttributeDto[] }> = {};

    filledAttributes.forEach(attr => {
        if (attr.isBuiltin) return;
        const cat = attr.categoryName || 'Other';
        if (!groupedAttributes[cat]) groupedAttributes[cat] = { filled: [], missing: [] };
        groupedAttributes[cat].filled.push(attr);
    });

    missingAttributes.forEach(attr => {
        if (attr.isBuiltin) return;
        const cat = attr.categoryName || 'Other';
        if (!groupedAttributes[cat]) groupedAttributes[cat] = { filled: [], missing: [] };
        groupedAttributes[cat].missing.push(attr);
    });

    return (
        <Container size="lg" py="xl">
            <Group mb="lg">
                <Button variant="subtle" leftSection={<IconArrowLeft size={16} />} onClick={() => navigate(-1)}>
                    Back
                </Button>
            </Group>

            <Paper
                shadow="0px -10px 12px rgba(0, 0, 0, 0.1)"
                p="xl"
                radius={"md"}
                className={classes.cvWrapper}
                style={{ minHeight: '800px', color: 'var(--mantine-color-text)' }}
            >
                <CandidateCvHeader cvId={cvId} meAttributes={meAttributes} />
                <CandidateCvPositionAttributes groupedAttributes={groupedAttributes} />
                <CandidateCvProjects
                    positionId={positionId || ''}
                    maxProjects={positionData?.maxProjects || 0}
                    selectedProjectIds={selectedProjectIds}
                    setSelectedProjectIds={setSelectedProjectIds}
                />
            </Paper>
            {
                !cvData?.isPublished && (
                    <Group justify="flex-end" mt="xl">
                        <Tooltip
                            label="Please fill in all missing attributes before publishing your CV"
                            disabled={missingAttributes.length === 0}
                            position="top-end"
                        >
                            <Button
                                color="blue"
                                onClick={handlePublish}
                                loading={isUpdatingCv}
                                disabled={missingAttributes.length > 0}
                            >
                                Publish CV
                            </Button>
                        </Tooltip>
                    </Group>

                )
            }
        </Container>
    );
}
