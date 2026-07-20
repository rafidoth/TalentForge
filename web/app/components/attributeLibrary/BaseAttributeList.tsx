import { TextInput, Group, Stack, Loader, Text, Center, Box, Title, Select, ActionIcon, Tooltip, Button, Pagination } from "@mantine/core";
import { Plus, PencilSimpleIcon, TrashIcon, PlusCircle, MinusCircleIcon, MagnifyingGlassIcon } from "@phosphor-icons/react";
import { useState, useMemo, useEffect } from "react";
import { useAttributes, usePositionAttributes, useAddPositionAttribute, useRemovePositionAttribute, useDeleteAttribute } from "./useAttributes";
import { AttributeLibraryTable } from "./AttributeLibraryTable";
import type { AttributeDto, PaginatedResponse } from "../../api/types";
import { useAttributeStore } from "~/store/attributeStore";
import { useNavigate } from "react-router";

export interface BaseAttributeListProps {
  attributesData: PaginatedResponse<AttributeDto> | undefined;
  attributesLoading: boolean;
  mode: "global" | "position";
  positionId?: string;
  onCreate?: () => void;
  onEdit?: (attribute: AttributeDto) => void;
}

export function BaseAttributeList({ attributesData, attributesLoading, mode, positionId, onCreate, onEdit }: BaseAttributeListProps) {
  const {
    search, setSearch,
    page, setPage,
    activeTab, setActiveTab,
    selectedIds, toggleSelection, clearSelection,
    categories, fetchLookups
  } = useAttributeStore();

  const [isAddingBulk, setIsAddingBulk] = useState(false);
  const [isRemovingBulk, setIsRemovingBulk] = useState(false);
  const [isDeletingBulk, setIsDeletingBulk] = useState(false);

  const navigate = useNavigate();


  const { data: positionAttributesData } = usePositionAttributes(mode === "position" ? positionId : undefined);
  const addPositionAttributeMutation = useAddPositionAttribute();
  const removePositionAttributeMutation = useRemovePositionAttribute();
  const deleteAttributeMutation = useDeleteAttribute();

  useEffect(() => {
    fetchLookups();
  }, [fetchLookups]);

  const attributes = useMemo(() => {
    return attributesData?.data || [];
  }, [attributesData]);

  const filteredAttributes = useMemo(() => {
    let filtered = attributes;
    if (activeTab === "recent") {
      filtered = attributes.slice(0, 5);
    } else if (activeTab && activeTab !== "all") {
      filtered = attributes.filter(attr => attr.categoryName === activeTab);
    }
    return filtered.filter(a => !a.isBuiltin);
  }, [attributes, activeTab]);

  const addedAttributeIds = useMemo(() => {
    return new Set<string>(
      positionAttributesData?.pages.flatMap((page) =>
        page.data.map((pa) => pa.attribute.id)
      ) ?? []
    );
  }, [positionAttributesData]);

  const categoryOptions = useMemo(() => {
    return [
      { value: "all", label: "All Categories" },
      { value: "recent", label: "Recently Used" },
      ...categories.map(c => ({ value: c.name, label: c.name }))
    ];
  }, [categories]);

  const handleToggleSelect = (attributeId: string) => {
    toggleSelection(attributeId);
  };

  const selectedNotAdded = useMemo(() => {
    return Array.from(selectedIds).filter(id => !addedAttributeIds.has(id));
  }, [selectedIds, addedAttributeIds]);

  const selectedAdded = useMemo(() => {
    return Array.from(selectedIds).filter(id => addedAttributeIds.has(id));
  }, [selectedIds, addedAttributeIds]);

  const handleBulkAdd = async () => {
    if (mode !== "position" || !positionId || selectedNotAdded.length === 0) return;
    setIsAddingBulk(true);
    try {
      const promises = selectedNotAdded.map(attrId =>
        addPositionAttributeMutation.mutateAsync({
          positionId,
          dto: { attributeId: attrId }
        })
      );
      await Promise.all(promises);
      clearSelection();
    } catch (error) {
      console.error("Failed to add some attributes.", error);
    } finally {
      setIsAddingBulk(false);
    }
  };

  const handleBulkRemove = async () => {
    if (mode !== "position" || !positionId || selectedAdded.length === 0) return;
    setIsRemovingBulk(true);
    try {
      const promises = selectedAdded.map(attrId =>
        removePositionAttributeMutation.mutateAsync({
          positionId,
          attributeId: attrId
        })
      );
      await Promise.all(promises);
      clearSelection();
    } catch (error) {
      console.error("Failed to remove some attributes.", error);
    } finally {
      setIsRemovingBulk(false);
    }
  };

  const handleEdit = () => {
    if (selectedIds.size !== 1) return;
    const selectedId = Array.from(selectedIds)[0];
    const attribute = attributes.find(a => a.id === selectedId);
    if (attribute && onEdit) {
      onEdit(attribute);
    }
  };

  const handleBulkDelete = async () => {
    if (mode !== "global" || selectedIds.size === 0) return;

    if (!window.confirm(`Are you sure you want to delete ${selectedIds.size} attributes globally?`)) {
      return;
    }

    setIsDeletingBulk(true);
    try {
      const promises = Array.from(selectedIds).map(attrId =>
        deleteAttributeMutation.mutateAsync(attrId)
      );
      await Promise.all(promises);
      clearSelection();
    } catch (error) {
      console.error("Failed to delete some attributes.", error);
    } finally {
      setIsDeletingBulk(false);
    }
  };

  const renderContent = () => {
    if (attributesLoading) {
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
        <AttributeLibraryTable
          attributes={filteredAttributes}
          addedAttributeIds={mode === "position" ? addedAttributeIds : undefined}
          selectedIds={selectedIds}
          onToggleSelect={handleToggleSelect}
          hideStatus={mode === "global"}
        />

        {attributesData && attributesData.totalPages > 1 && activeTab === "all" && (
          <Center>
            <Pagination
              total={attributesData.totalPages}
              value={page}
              onChange={setPage}
              color="blue"
              withEdges
            />
          </Center>
        )}
      </Stack>
    );
  };

  return (
    <Stack gap="md">
      <Group justify="space-between">
        <Title size="h1">Attribute Library</Title>
        {mode === "position" && (
          <Button variant="light" onClick={() => navigate("/app/attributes")}>
            Manage Attributes
          </Button>
        )}
      </Group>

      <Group align="flex-end" justify="space-between">
        <Group flex={1} align="flex-end">
          <TextInput
            placeholder="Search by prefix..."
            leftSection={<MagnifyingGlassIcon size={16} />}
            value={search}
            onChange={(e) => setSearch(e.currentTarget.value)}
            w={250}
          />
          {categories.length > 0 && (
            <Select
              data={categoryOptions}
              value={activeTab}
              onChange={(val) => setActiveTab(val || "all")}
              allowDeselect={false}
              w={200}
            />
          )}

          <Group gap="xs" align="center" ml="auto">
            {mode === "global" && (
              <>
                <Tooltip label="New Attribute" withArrow>
                  <ActionIcon variant="light" size="lg" color="gray" onClick={onCreate} disabled={!onCreate}>
                    <Plus size={20} />
                  </ActionIcon>
                </Tooltip>

                <Tooltip label="Edit Attribute" withArrow>
                  <ActionIcon
                    variant="light"
                    size="lg"
                    color="blue"
                    disabled={selectedIds.size !== 1 || !onEdit}
                    onClick={handleEdit}
                  >
                    <PencilSimpleIcon size={20} />
                  </ActionIcon>
                </Tooltip>

                <Tooltip label="Delete Attribute" withArrow>
                  <ActionIcon
                    variant="light"
                    size="lg"
                    color="red"
                    disabled={selectedIds.size === 0}
                    onClick={handleBulkDelete}
                    loading={isDeletingBulk}
                  >
                    <TrashIcon size={20} />
                  </ActionIcon>
                </Tooltip>
              </>
            )}

            {mode === "position" && (
              <>
                <Tooltip label="Add to Position" withArrow>
                  <ActionIcon
                    variant="light"
                    size="lg"
                    color="teal"
                    disabled={selectedNotAdded.length === 0}
                    onClick={handleBulkAdd}
                    loading={isAddingBulk}
                  >
                    <PlusCircle size={20} />
                  </ActionIcon>
                </Tooltip>

                <Tooltip label="Remove from Position" withArrow>
                  <ActionIcon
                    variant="light"
                    size="lg"
                    color="orange"
                    disabled={selectedAdded.length === 0}
                    onClick={handleBulkRemove}
                    loading={isRemovingBulk}
                  >
                    <MinusCircleIcon size={20} />
                  </ActionIcon>
                </Tooltip>
              </>
            )}
          </Group>
        </Group>
      </Group>

      <Box style={{ minHeight: 300, position: 'relative' }}>
        {renderContent()}
      </Box>
    </Stack>
  );
}
