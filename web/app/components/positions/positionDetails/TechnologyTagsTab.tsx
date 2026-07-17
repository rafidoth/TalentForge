import { useState, useEffect, useRef } from "react";
import { Card, Stack, Text, Center, Loader, Group, CheckIcon } from "@mantine/core";
import { TagsInput } from "~/components/common/TagsInput";
import { usePositionTags, useUpdatePositionTags } from "~/hooks/usePositions";
import type { TagDto } from "~/api/types";
import { Check, ChecksIcon } from "@phosphor-icons/react";

interface TechnologyTagsTabProps {
  positionId: string;
}

export function TechnologyTagsTab({ positionId }: TechnologyTagsTabProps) {
  const { data: selectedTags, isLoading } = usePositionTags(positionId);
  const updateTagsMutation = useUpdatePositionTags(positionId);

  const [localTags, setLocalTags] = useState<TagDto[]>([]);
  const saveTimerRef = useRef<NodeJS.Timeout | null>(null);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (selectedTags) {
      setLocalTags(selectedTags);
    }
  }, [selectedTags]);

  useEffect(() => {
    return () => {
      if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
    };
  }, []);

  const handleTagsChange = (newTags: TagDto[]) => {
    setLocalTags(newTags);

    if (saveTimerRef.current) {
      clearTimeout(saveTimerRef.current);
    }

    saveTimerRef.current = setTimeout(() => {
      updateTagsMutation.mutate({ tagIds: newTags.map(t => t.id) }, {
        onSuccess: () => {
          setSaved(true);
          setTimeout(() => setSaved(false), 2000);
        }
      });
    }, 1500);
  };

  if (isLoading) {
    return (
      <Card withBorder={false} w={400}>
        <Stack gap="md">
          <Text fw={600} size="xl">Technology Tags</Text>
          <Center><Loader size="sm" /></Center>
        </Stack>
      </Card>
    );
  }

  return (
    <Card withBorder={false} w={"50%"}>
      <Stack gap="md">
        <Group>
          <Text fw={600} size="xl">Technology Tags</Text>
          {saved && <ChecksIcon size={20} color="green" />}
        </Group>
        <TagsInput
          selectedTagsList={localTags}
          setSelectedTagsList={handleTagsChange}
          placeholder="Search and add tags..."
        />
      </Stack>
    </Card>
  );
}
