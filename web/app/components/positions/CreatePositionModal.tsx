import { Modal, Text, TextInput, Group, Button, Stack } from "@mantine/core";
import { useForm } from "@mantine/form";
import { useCreatePosition } from "~/hooks/usePositions";
import { usePositionStore } from "~/store/positionStore";

export function CreatePositionModal() {
  const { isCreateModalOpen, closeCreateModal } = usePositionStore();
  const createMutation = useCreatePosition();

  const form = useForm({
    initialValues: {
      title: "",
    },
    validate: {
      title: (value) =>
        value.length < 3 ? "Title must have at least 3 characters" : null,
    },
  });

  const handleClose = () => {
    closeCreateModal();
    form.reset();
  };

  const handleSubmit = (values: { title: string }) => {
    createMutation.mutate(values, {
      onSuccess: () => {
        handleClose();
      },
    });
  };

  return (
    <Modal
      opened={isCreateModalOpen}
      onClose={handleClose}
      title={<Text size="xl">Create a Position</Text>}
      centered
      overlayProps={{ blur: 3, opacity: 0.55 }}
    >
      <form onSubmit={form.onSubmit(handleSubmit)}>
        <Stack gap="md">
          <TextInput
            label="Position Title"
            placeholder="e.g. Senior Software Engineer"
            required
            data-autofocus
            {...form.getInputProps("title")}
          />
          <Group justify="flex-end" mt="md">
            <Button variant="subtle" color="gray" onClick={handleClose}>
              Cancel
            </Button>
            <Button type="submit" loading={createMutation.isPending}>
              Create
            </Button>
          </Group>
        </Stack>
      </form>
    </Modal>
  );
}
