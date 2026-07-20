import {
  TextInput,
  Button,
  Group,
  Stack,
  Loader,
  Text,
  Center,
  Box,
  Title,
  Select,
  Pagination,
} from "@mantine/core";
import { MagnifyingGlassIcon, PlusIcon } from "@phosphor-icons/react";
import { useState, useMemo } from "react";
import { useProfileAttributeList } from "./useProfileAttributeList";
import { ProfileAttributeTable } from "./ProfileAttributeTable";
import { ProfileAttributeActionModal } from "./ProfileAttributeActionModal";
import type { AttributeDto } from "../../api/types";

export interface ProfileAttributeListProps { }

export function ProfileAttributeList({ }: ProfileAttributeListProps) {
  const {
    search,
    setSearch,
    activeTab,
    setActiveTab,
    isLoading,
    page,
    setPage,
    totalPages,
    categories,
    filteredAttributes,
    profileAttributeMap,
    addingAttrId,
    setAddingAttrId,
    addValue,
    setAddValue,
    editingProfileAttrId,
    setEditingProfileAttrId,
    editValue,
    setEditValue,
    isAdding,
    isUpdating,
    isRemoving,
    handleInitiateAdd,
    handleConfirmAdd,
    handleInitiateEdit,
    handleConfirmEdit,
    handleRemoveProfileAttribute,
  } = useProfileAttributeList();

  const [selectedAttribute, setSelectedAttribute] = useState<AttributeDto | null>(null);

  const categoryOptions = useMemo(() => {
    return [
      { value: "all", label: "All Categories" },
      { value: "recent", label: "Recently Used" },
      ...categories.map(c => ({ value: c.name, label: c.name }))
    ];
  }, [categories]);

  // Exclude builtins
  const displayAttributes = useMemo(() => {
    return filteredAttributes.filter(a => !a.isBuiltin);
  }, [filteredAttributes]);

  const handleRowClick = (attribute: AttributeDto) => {
    setSelectedAttribute(attribute);
    const isAdded = profileAttributeMap.has(attribute.id);
    if (isAdded) {
      handleInitiateEdit(attribute);
    } else {
      handleInitiateAdd(attribute);
    }
  };

  const handleModalClose = () => {
    setSelectedAttribute(null);
    setAddingAttrId(null);
    setEditingProfileAttrId(null);
  };

  const handleModalConfirm = () => {
    if (!selectedAttribute) return;
    const isAdded = profileAttributeMap.has(selectedAttribute.id);
    if (isAdded) {
      handleConfirmEdit(selectedAttribute);
    } else {
      handleConfirmAdd(selectedAttribute);
    }
    // Note: Wait for success to close modal, or let the hooks handle it.
    // The hook currently closes the forms on success automatically by setting ids to null.
    // We can observe addingAttrId and editingProfileAttrId to close the modal.
  };

  const isModalOpen = !!selectedAttribute && (addingAttrId === selectedAttribute.id || editingProfileAttrId === selectedAttribute.id);

  const handleModalRemove = () => {
    if (selectedAttribute) {
      handleRemoveProfileAttribute(selectedAttribute);
    }
  };

  const renderContent = () => {
    if (isLoading) {
      return (
        <Center h={300}>
          <Loader />
        </Center>
      );
    }

    if (displayAttributes.length === 0) {
      return (
        <Center h={300}>
          <Text c="dimmed">No attributes found in this category.</Text>
        </Center>
      );
    }

    return (
      <Stack gap="xl">
        <ProfileAttributeTable
          attributes={displayAttributes}
          profileAttributeMap={profileAttributeMap}
          onRowClick={handleRowClick}
        />

        {totalPages > 1 && activeTab === "all" && (
          <Center mt="md">
            <Pagination total={totalPages} value={page} onChange={setPage} />
          </Center>
        )}
      </Stack>
    );
  };

  return (
    <Stack gap="md">
      <Title size="h3" mb="md">
        Manage Profile Attributes
      </Title>
      <Group align="flex-end" justify="space-between">
        <Group flex={1} align="flex-end">
          <TextInput
            placeholder="Search by prefix..."
            leftSection={<MagnifyingGlassIcon size={16} />}
            value={search}
            onChange={(e) => setSearch(e.currentTarget.value)}
            style={{ flex: 1 }}
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
        </Group>
      </Group>

      <Box style={{ minHeight: 300, position: "relative" }}>
        {renderContent()}
      </Box>

      <ProfileAttributeActionModal
        opened={isModalOpen}
        onClose={handleModalClose}
        attribute={selectedAttribute}
        isAdded={selectedAttribute ? profileAttributeMap.has(selectedAttribute.id) : false}
        value={selectedAttribute && profileAttributeMap.has(selectedAttribute.id) ? editValue : addValue}
        onChange={selectedAttribute && profileAttributeMap.has(selectedAttribute.id) ? setEditValue : setAddValue}
        onConfirm={handleModalConfirm}
        onRemove={handleModalRemove}
        isLoading={isAdding || isUpdating}
        isRemoving={isRemoving}
      />
    </Stack>
  );
}
