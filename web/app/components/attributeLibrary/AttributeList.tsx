import { TextInput, Button, Group, Stack, Loader, Text, Center, Box, Tabs, ScrollArea, SimpleGrid, Title } from "@mantine/core";
import { ClockCounterClockwiseIcon, MagnifyingGlassIcon, PlusIcon } from "@phosphor-icons/react";
import { useState, useMemo, useEffect } from "react";
import { useAttributes, usePositionAttributes } from "./useAttributes";
import { AttributeItem } from "./AttributeItem";
import type { AttributeDto } from "../../api/types";
import { useAttributeStore } from "~/store/attributeStore";

export interface AttributeListProps {
  positionId?: string;
  onCreate: () => void;
  onEdit: (attribute: AttributeDto) => void;
}

export function PositionAttributeList({ positionId, onCreate, onEdit }: AttributeListProps) {
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState<string | null>("all");

  const {
    data,
    isLoading,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage
  } = useAttributes(search);

  const { data: positionAttributesData } = usePositionAttributes(positionId);

  const { categories, fetchLookups } = useAttributeStore();

  useEffect(() => {
    fetchLookups();
  }, [fetchLookups]);

  const attributes = useMemo(() => {
    return data?.pages.flatMap((page) => page.data) || [];
  }, [data]);

  const filteredAttributes = useMemo(() => {
    if (!activeTab || activeTab === "all") return attributes;
    if (activeTab === "recent") {
      return attributes.slice(0, 5);
    }
    return attributes.filter(attr => attr.categoryName === activeTab);
  }, [attributes, activeTab]);

  const addedAttributeIds = useMemo(() => {
    return new Set<string>(
      positionAttributesData?.pages.flatMap((page) =>
        page.data.map((pa) => pa.attribute.id)
      ) ?? []
    );
  }, [positionAttributesData]);

  const renderContent = () => {
    if (isLoading) {
      return (
        <Center h={300}>
          <Loader />
        </Center>
      );
    }

    if (filteredAttributes.length === 0) {
      return (
        <Center h={300}>
          <Text c="dimmed">No attributes found in this category.</Text>
        </Center>
      );
    }

    return (
      <Stack gap="xl">
        <SimpleGrid cols={{ base: 1, xs: 2, sm: 2, md: 3 }} spacing="md">
          {filteredAttributes.map((attr) => (
            <AttributeItem
              key={attr.id}
              attribute={attr}
              positionId={positionId}
              isAddedToPosition={addedAttributeIds.has(attr.id)}
              onEdit={() => onEdit(attr)}
            />
          ))}
        </SimpleGrid>

        {hasNextPage && activeTab === "all" && (
          <Center>
            <Button
              variant="light"
              onClick={() => fetchNextPage()}
              loading={isFetchingNextPage}
            >
              Load More
            </Button>
          </Center>
        )}
      </Stack>
    );
  };

  return (
    <Stack gap="md">
      <Title size="h1" mb="md">
        Attribute Library
      </Title>
      <Group justify="space-between">
        <TextInput
          placeholder="Search by prefix..."
          leftSection={<MagnifyingGlassIcon size={16} />}
          value={search}
          onChange={(e) => setSearch(e.currentTarget.value)}
          flex={1}
        />
        <Button leftSection={<PlusIcon size={16} />} onClick={onCreate}>
          New
        </Button>
      </Group>

      {categories.length > 0 && (
        <ScrollArea type="never" pb="xs">
          <Tabs value={activeTab} onChange={setActiveTab}>
            <Tabs.List style={{ flexWrap: 'nowrap', whiteSpace: 'nowrap' }}>
              <Tabs.Tab value="recent" leftSection={<ClockCounterClockwiseIcon size={14} />}>Recently Used</Tabs.Tab>
              <Tabs.Tab value="all">All</Tabs.Tab>
              {categories.map(cat => (
                <Tabs.Tab key={cat.id} value={cat.name}>{cat.name}</Tabs.Tab>
              ))}
            </Tabs.List>
          </Tabs>
        </ScrollArea>
      )}

      <Box style={{ minHeight: 300, position: 'relative' }}>
        {renderContent()}
      </Box>
    </Stack>
  );
}
