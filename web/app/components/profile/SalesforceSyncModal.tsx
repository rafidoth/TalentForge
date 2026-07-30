import { Modal, Button, TextInput, Stack, Notification, Group } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { useSalesforceStatus, useSyncSalesforce } from '~/hooks/useProfileData';
import { useForm } from '@mantine/form';
import { Check, CheckCircleIcon, CheckIcon, CloudArrowUp } from '@phosphor-icons/react';

export function SalesforceSyncModal() {
    const [opened, { open, close }] = useDisclosure(false);
    const { data: status, isLoading } = useSalesforceStatus();
    const syncMutation = useSyncSalesforce();

    const form = useForm({
        initialValues: {
            companyName: '',
            jobTitle: '',
            phoneNumber: '',
            industry: '',
        },
        validate: {
            companyName: (value) => (value.trim().length > 0 ? null : 'Company Name is required'),
        },
    });

    const handleSubmit = async (values: typeof form.values) => {
        try {
            await syncMutation.mutateAsync(values);
            close();
            form.reset();
        } catch (error) {
            console.error('Failed to sync to Salesforce:', error);
        }
    };

    if (isLoading) return null;

    const isSynced = status?.isSynced || false;

    return (
        <>
            {isSynced ?
                "" :
                <Button
                    variant={"outline"}
                    leftSection={<CheckCircleIcon size={16} />}
                    radius="xl"
                    onClick={open}
                >
                    Complete Your Profile
                </Button>
            }

            <Modal opened={opened} onClose={close} title="Let us know about your current workplace.">
                <form onSubmit={form.onSubmit(handleSubmit)}>
                    <Stack gap="md">
                        {syncMutation.isError && (
                            <Notification color="red" title="Error" onClose={() => syncMutation.reset()}>
                                {syncMutation.error?.message || 'Failed to sync to Salesforce'}
                            </Notification>
                        )}
                        <TextInput
                            withAsterisk
                            label="Company Name"
                            placeholder="Acme Corp"
                            {...form.getInputProps('companyName')}
                        />
                        <TextInput
                            label="Job Title"
                            placeholder="Software Engineer"
                            {...form.getInputProps('jobTitle')}
                        />
                        <TextInput
                            label="Phone Number"
                            placeholder="+1 234 567 8900"
                            {...form.getInputProps('phoneNumber')}
                        />
                        <TextInput
                            label="Industry"
                            placeholder="Technology"
                            {...form.getInputProps('industry')}
                        />
                        <Group justify="flex-end" mt="sm">
                            <Button variant="default" onClick={close}>Cancel</Button>
                            <Button type="submit" loading={syncMutation.isPending}>
                                Done
                            </Button>
                        </Group>
                    </Stack>
                </form>
            </Modal>
        </>
    );
}
