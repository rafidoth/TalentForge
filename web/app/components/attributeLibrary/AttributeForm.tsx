import { TextInput, Select, Button, Group, Stack, Textarea, Title } from "@mantine/core";
import { useForm } from "@mantine/form";
import { useEffect } from "react";
import type { AttributeDto, CreateAttributeDto, UpdateAttributeDto } from "../../api/types";
import { useCreateAttribute, useUpdateAttribute, useAttributeTypesAndCategories } from "./useAttributes";

export interface AttributeFormProps {
  attribute: AttributeDto | null;
  onCancel: () => void;
  onSuccess: () => void;
}

export function AttributeForm({ attribute, onCancel, onSuccess }: AttributeFormProps) {
  const { data: typesAndCategories, isLoading: isLoadingTypes } = useAttributeTypesAndCategories();
  const { mutate: createAttribute, isPending: isCreating } = useCreateAttribute();
  const { mutate: updateAttribute, isPending: isUpdating } = useUpdateAttribute();

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

  useEffect(() => {
    if (attribute) {
      form.setValues({
        name: attribute.name,
        categoryId: attribute.categoryId.toString(),
        typeId: attribute.typeId.toString(),
        value: "",
        description: "",
      });
    } else {
      form.reset();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [attribute]);

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
  );
}
