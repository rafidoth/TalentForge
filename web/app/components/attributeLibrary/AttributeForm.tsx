import { TextInput, Text, Select, Button, Group, Stack, Textarea, Title, Modal, Box, Alert, Badge } from "@mantine/core";
import { useForm } from "@mantine/form";
import type { AttributeDto, CreateAttributeDto, UpdateAttributeDto } from "../../api/types";
import { useCreateAttribute, useUpdateAttribute, useAttributeTypesAndCategories } from "./useAttributes";
import { useState } from "react";

export interface AttributeFormProps {
  attribute: AttributeDto | null;
  onCancel: () => void;
  onSuccess: () => void;
}

export function AttributeForm({ attribute, onCancel, onSuccess }: AttributeFormProps) {
  const [conflict, setConflict] = useState<AttributeDto | null>(null);
  console.log(conflict, "conflict");

  const { data: typesAndCategories, isLoading: isLoadingTypes } = useAttributeTypesAndCategories();
  const { mutate: createAttribute, isPending: isCreating } = useCreateAttribute();
  const conflictHandler = (latestData: AttributeDto) => {
    setConflict(latestData);
  }
  const { mutate: updateAttribute, isPending: isUpdating } = useUpdateAttribute(conflictHandler);

  const isEditing = !!attribute;

  const form = useForm({
    initialValues: {
      name: attribute?.name || "",
      categoryId: attribute?.categoryId?.toString() || "",
      typeId: attribute?.typeId?.toString() || "",
      value: "",
      description: "",
    },
    validate: {
      name: (value) => (value.trim().length > 0 ? null : "Name is required"),
      categoryId: (value) => (value ? null : "Category is required"),
      typeId: (value) => (value ? null : "Type is required"),
    },
  });



  const handleSubmit = (values: typeof form.values) => {
    if (isEditing) {
      const dto: UpdateAttributeDto = {
        name: values.name,
        categoryId: parseInt(values.categoryId),
        typeId: parseInt(values.typeId),
        version: attribute.version,
      };
      updateAttribute(
        { id: attribute.id, dto },
        { onSuccess }
      );
    } else {
      const dto: CreateAttributeDto = {
        name: values.name,
        categoryId: parseInt(values.categoryId),
        typeId: parseInt(values.typeId),
        value: values.value,
        description: values.description,
      };
      createAttribute(dto, { onSuccess });
    }
  };

  const categoryOptions = typesAndCategories?.categories.map((c) => ({
    value: c.id.toString(),
    label: c.name,
  })) || [];

  const typeOptions = typesAndCategories?.types.map((t) => ({
    value: t.id.toString(),
    label: t.name,
  })) || [];

  return (
    <>
      <form onSubmit={form.onSubmit(handleSubmit)}>
        <Stack gap="md" px="xl">
          <Title size="h3" mb="md">
            New Attribute
          </Title>
          <TextInput
            withAsterisk
            label="Attribute Name"
            placeholder="e.g. JavaScript, Presentation Skill, Remote"
            {...form.getInputProps("name")}
          />

          <Group grow>
            <Select
              withAsterisk
              label="Category"
              placeholder="Select a category"
              data={categoryOptions}
              disabled={isLoadingTypes}
              {...form.getInputProps("categoryId")}
            />

            <Select
              withAsterisk
              label="Type"
              placeholder="Select a type"
              data={typeOptions}
              disabled={isLoadingTypes}
              {...form.getInputProps("typeId")}
            />
          </Group>

          {!isEditing && (
            <>
              <Textarea
                label="Description"
                placeholder="Optional description"
                {...form.getInputProps("description")}
                radius="md"
              />
            </>
          )}

          <Group justify="flex-end" mt="md">
            <Button variant="default" onClick={onCancel}>
              Cancel
            </Button>
            <Button type="submit" loading={isCreating || isUpdating}>
              {isEditing ? "Save Changes" : "Create Attribute"}
            </Button>
          </Group>
        </Stack>
      </form>

      <Modal
        opened={!!conflict}
        onClose={() => setConflict(null)}
        title={<Title order={4}>Update Conflict</Title>}
        centered
        size="lg"
      >
        <Stack gap="md">
          Someone from similar you made changes to this attribute while you were working on it.

          <Box>
            <Stack gap="xs" p="sm" style={{ borderRadius: 8 }}>
              {conflict?.name !== attribute?.name && (
                <Text size="sm">
                  <Badge>Name</Badge> changed from <Text span c="dimmed">"{attribute?.name}"</Text> to <Text span fw={600}>"{conflict?.name}"</Text>
                </Text>
              )}
              {conflict?.categoryId !== attribute?.categoryId && (
                <Text size="sm">
                  <b>Category:</b> Changed from <Text span c="dimmed">"{attribute?.categoryName}"</Text> to <Text span fw={600}>"{conflict?.categoryName}"</Text>
                </Text>
              )}
              {conflict?.typeId !== attribute?.typeId && (
                <Text size="sm">
                  <b>Type:</b> Changed from <Text span c="dimmed">"{attribute?.typeName}"</Text> to <Text span fw={600}>"{conflict?.typeName}"</Text>
                </Text>
              )}
              {conflict?.description !== attribute?.description && (
                <Text size="sm">
                  <b>Description:</b> Changed from <Text span c="dimmed">"{attribute?.description || 'N/A'}"</Text> to <Text span fw={600}>"{conflict?.description || 'N/A'}"</Text>
                </Text>
              )}
              {conflict?.name === attribute?.name && conflict?.categoryId === attribute?.categoryId && conflict?.typeId === attribute?.typeId && conflict?.description === attribute?.description && (
                <Text size="sm" c="dimmed">They only updated background details, none of the text fields were changed.</Text>
              )}
            </Stack>
          </Box>

          <Group justify="flex-end" mt="md">
            <Button variant="default" onClick={() => setConflict(null)}>
              Cancel
            </Button>
            <Button
              color="red"
              loading={isUpdating}
              onClick={() => {
                if (!conflict || !attribute) return;
                const dto: UpdateAttributeDto = {
                  name: form.values.name,
                  categoryId: parseInt(form.values.categoryId),
                  typeId: parseInt(form.values.typeId),
                  version: conflict.version,
                };
                updateAttribute(
                  { id: attribute.id, dto },
                  {
                    onSuccess: () => {
                      setConflict(null);
                      onSuccess();
                    },
                  }
                );
              }}
            >
              Save My Changes Anyway
            </Button>
          </Group>
        </Stack>
      </Modal>
    </>
  );
}
