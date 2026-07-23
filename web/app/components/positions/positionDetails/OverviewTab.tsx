import { Card, Stack, TextInput, NumberInput, Group, Button } from "@mantine/core";
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
    },
  });

  useEffect(() => {
    const values = {
      title: position.title,
      shortDescription: position.shortDescription || "",
      maxProjects: position.maxProjects,
      isPublic: position.isPublic,
    };
    form.setValues(values);
    form.resetDirty(values);
  }, [position]);

  const handleSave = (values: typeof form.values) => {
    updateMutation.mutate({ id: positionId, dto: values });
  };

  return (
    <Card withBorder={false}>
      <form onSubmit={form.onSubmit(handleSave)}>
        <Stack gap="md">
          <TextInput label="Title" {...form.getInputProps("title")} required />
          <TextInput label="Short Description" {...form.getInputProps("shortDescription")} />
          <NumberInput label="Max Projects" {...form.getInputProps("maxProjects")} />
          <Group justify="flex-end">
            {form.isDirty() && (
              <Button variant="light" type="submit" loading={updateMutation.isPending}>
                Save
              </Button>
            )}
          </Group>
        </Stack>
      </form>
    </Card>
  );
}

