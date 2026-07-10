import { Card, Stack, TextInput, NumberInput, Checkbox, Group, Button } from "@mantine/core";
import { useForm } from "@mantine/form";
import { useEffect } from "react";
import { useUpdatePosition } from "~/hooks/usePositions";
import type { PositionDto } from "~/api/positions";

interface OverviewTabProps {
  positionId: string;
  position: PositionDto;
}

export function OverviewTab({ positionId, position }: OverviewTabProps) {
  const updateMutation = useUpdatePosition();

  const form = useForm({
    initialValues: {
      title: "",
      shortDescription: "",
      maxProjects: 0,
      isPublic: false,
    }
  });

  useEffect(() => {
    form.setValues({
      title: position.title,
      shortDescription: position.shortDescription || "",
      maxProjects: position.maxProjects,
      isPublic: position.isPublic,
    });
  }, [position]);

  const handleSave = (values: typeof form.values) => {
    updateMutation.mutate({ id: positionId, dto: values });
  };

  return (
    <Card withBorder radius="md" padding="xl">
      <form onSubmit={form.onSubmit(handleSave)}>
        <Stack gap="md">
          <TextInput label="Title" {...form.getInputProps("title")} required />
          <TextInput label="Short Description" {...form.getInputProps("shortDescription")} />
          <NumberInput label="Max Projects" {...form.getInputProps("maxProjects")} />
          <Checkbox label="Is Public" {...form.getInputProps("isPublic", { type: 'checkbox' })} />
          <Group justify="flex-end">
            <Button type="submit" loading={updateMutation.isPending}>Save Overview</Button>
          </Group>
        </Stack>
      </form>
    </Card>
  );
}
