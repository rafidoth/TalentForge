import { useState } from "react";
import type { RouteHandle } from "~/auth/types";
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
  Title,
  ActionIcon,
  Tooltip,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { useForm } from "@mantine/form";
import { useNavigate } from "react-router";
import {
  usePositions,
  useCreatePosition,
  useDeletePosition,
  useDuplicatePosition,
} from "~/hooks/usePositions";
import { PositionTable } from "~/components/positions/PositionTable";
import { MagnifyingGlass, Plus, Copy, Trash } from "@phosphor-icons/react";

export const handle: RouteHandle = {
  allowedRoles: ["Administrator", "Recruiter"]
};

export default function PositionsPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const pageSize = 10;
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [isDeletingBulk, setIsDeletingBulk] = useState(false);
  const [isDuplicatingBulk, setIsDuplicatingBulk] = useState(false);

  const { data: pagedData, isLoading, isError } = usePositions(page, pageSize);
  const createMutation = useCreatePosition();
  const deleteMutation = useDeletePosition();
  const duplicateMutation = useDuplicatePosition();
  const navigate = useNavigate();

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

  const handleToggleSelect = (id: string) => {
    setSelectedIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const handleBulkDelete = async () => {
    if (selectedIds.size === 0) return;
    if (confirm(`Are you sure you want to delete ${selectedIds.size} position(s)?`)) {
      setIsDeletingBulk(true);
      try {
        const promises = Array.from(selectedIds).map(id => 
          deleteMutation.mutateAsync(id)
        );
        await Promise.all(promises);
        setSelectedIds(new Set());
      } catch (error) {
        console.error("Failed to delete some positions.", error);
      } finally {
        setIsDeletingBulk(false);
      }
    }
  };

  const handleBulkDuplicate = async () => {
    if (selectedIds.size === 0) return;
    setIsDuplicatingBulk(true);
    try {
      const promises = Array.from(selectedIds).map(id => 
        duplicateMutation.mutateAsync(id)
      );
      await Promise.all(promises);
      setSelectedIds(new Set());
    } catch (error) {
      console.error("Failed to duplicate some positions.", error);
    } finally {
      setIsDuplicatingBulk(false);
    }
  };

  const handleRowClick = (id: string) => {
    navigate(`/app/position/${id}`);
  };

  const handleClose = () => {
    close();
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
    <Container size="xl" py="xl">
      <Stack gap="md">
        <Group justify="space-between">
          <Title size="h1">Positions</Title>
        </Group>

        <Group align="flex-end" justify="space-between">
          <Group flex={1} align="flex-end">
            <TextInput
              placeholder="Search positions..."
              leftSection={<MagnifyingGlass size={16} />}
              value={search}
              onChange={(e) => setSearch(e.currentTarget.value)}
              w={250}
            />

            <Group gap="xs" align="center" ml="auto">
              <Tooltip label="New Position" withArrow>
                <ActionIcon variant="light" size="lg" color="gray" onClick={open}>
                  <Plus size={20} />
                </ActionIcon>
              </Tooltip>

              <Tooltip label="Duplicate Position" withArrow>
                <ActionIcon 
                  variant="light" 
                  size="lg" 
                  color="blue"
                  disabled={selectedIds.size === 0} 
                  onClick={handleBulkDuplicate}
                  loading={isDuplicatingBulk}
                >
                  <Copy size={20} />
                </ActionIcon>
              </Tooltip>

              <Tooltip label="Delete Position" withArrow>
                <ActionIcon 
                  variant="light" 
                  size="lg" 
                  color="red"
                  disabled={selectedIds.size === 0} 
                  onClick={handleBulkDelete}
                  loading={isDeletingBulk}
                >
                  <Trash size={20} />
                </ActionIcon>
              </Tooltip>
            </Group>
          </Group>
        </Group>

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
            <PositionTable
              positions={pagedData?.data || []}
              selectedIds={selectedIds}
              onToggleSelect={handleToggleSelect}
              onRowClick={handleRowClick}
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
              <Button
                type="submit"
                loading={createMutation.isPending}
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
