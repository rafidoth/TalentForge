import { useState } from "react";
import type { RouteHandle } from "~/auth/types";

export const handle: RouteHandle = {
  allowedRoles: ["Administrator", "Recruiter"]
};
import {
  Container,
  Stack,
  Modal,
  TextInput,
  Button,
  Group,
  Pagination,
  Flex,
  Text,
  Loader,
  Center,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { useForm } from "@mantine/form";
import { Navigate } from "react-router";
import { useAuthStore } from "~/auth/store";
import {
  usePositions,
  useCreatePosition,
  useDeletePosition,
  useDuplicatePosition,
} from "~/hooks/usePositions";
import { PositionGrid, PositionsToolbar } from "~/components/positions";
import { Roles } from "~/Constants";

export default function PositionsPage() {

  const [page, setPage] = useState(1);
  const pageSize = 8; // Adjust for nice 4-column grid layout (2 rows)

  const { data: pagedData, isLoading, isError } = usePositions(page, pageSize);
  const createMutation = useCreatePosition();
  const deleteMutation = useDeletePosition();
  const duplicateMutation = useDuplicatePosition();

  const [opened, { open, close }] = useDisclosure(false);

  const form = useForm({
    initialValues: {
      title: "",
    },
    validate: {
      title: (value) =>
        value.length < 3 ? "Title must have at least 3 characters" : null,
    },
  });



  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this position?")) {
      deleteMutation.mutate(id);
    }
  };

  const handleDuplicate = (id: string) => {
    duplicateMutation.mutate(id);
  };

  const handleCardClick = (id: string) => {
    // Navigate or open drawer to edit/view details
    console.log("Navigate to details of position: ", id);
  };

  const handleCreate = (values: { title: string }) => {
    createMutation.mutate(values, {
      onSuccess: () => {
        close();
        form.reset();
      },
    });
  };

  return (
    <Container size="xl" py="xl">
      <Stack gap="xl">
        <PositionsToolbar onAdd={open} />

        {isLoading ? (
          <Center p="xl" mih={300}>
            <Loader variant="bars" color="blue" />
          </Center>
        ) : isError ? (
          <Center p="xl" mih={300}>
            <Text c="red">Failed to load positions.</Text>
          </Center>
        ) : (
          <Stack gap="xl">
            <PositionGrid
              data={pagedData?.data || []}
              onDelete={handleDelete}
              onDuplicate={handleDuplicate}
              onClick={handleCardClick}
            />

            {(pagedData?.totalPages || 0) > 1 && (
              <Flex justify="center" mt="md">
                <Pagination
                  total={pagedData!.totalPages}
                  value={page}
                  onChange={setPage}
                  color="blue"
                  radius="md"
                  withEdges
                />
              </Flex>
            )}
          </Stack>
        )}
      </Stack>

      <Modal
        opened={opened}
        onClose={close}
        title="Create Position"
        centered
        radius="md"
        overlayProps={{ blur: 3, opacity: 0.55 }}
      >
        <form onSubmit={form.onSubmit(handleCreate)}>
          <Stack gap="md">
            <TextInput
              label="Position Title"
              placeholder="e.g. Senior Software Engineer"
              required
              data-autofocus
              {...form.getInputProps("title")}
            />
            <Group justify="flex-end" mt="md">
              <Button variant="subtle" color="gray" onClick={close}>
                Cancel
              </Button>
              <Button
                type="submit"
                loading={createMutation.isPending}
                radius="md"
              >
                Create
              </Button>
            </Group>
          </Stack>
        </form>
      </Modal>
    </Container>
  );
}
