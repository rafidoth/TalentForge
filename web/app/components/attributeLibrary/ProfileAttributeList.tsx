import {
  TextInput,
  Button,
  Group,
  Stack,
  Loader,
  Text,
  Center,
  Box,
  SimpleGrid,
  Title,
} from "@mantine/core";
import { MagnifyingGlassIcon, PlusIcon } from "@phosphor-icons/react";
import { useProfileAttributeList } from "./useProfileAttributeList";
import { ProfileAttributeCardContent } from "./ProfileAttributeCardContent";
import { ProfileAttributeCategoryTabs } from "./ProfileAttributeCategoryTabs";

export interface ProfileAttributeListProps {
  onCreate: () => void;
}

export function ProfileAttributeList({ onCreate }: ProfileAttributeListProps) {
  const {
    search,
    setSearch,
    activeTab,
    setActiveTab,
    isLoading,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
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
          {filteredAttributes.map((attr) => {
            if (attr.isBuiltin) return null;
            const isAddedToProfile = profileAttributeMap.has(attr.id);
            const isAddingThis = addingAttrId === attr.id;
            const isEditingThis = editingProfileAttrId === attr.id;

            return (
              <ProfileAttributeCardContent
                key={attr.id}
                attribute={attr}
                isAddedToProfile={isAddedToProfile}
                isAddingThis={isAddingThis}
                isEditingThis={isEditingThis}
                addValue={addValue}
                editValue={editValue}
                isAdding={isAdding}
                isUpdating={isUpdating}
                isRemoving={isRemoving}
                onAddValueChange={(val) => setAddValue(val)}
                onEditValueChange={(val) => setEditValue(val)}
                onCancelAdd={() => setAddingAttrId(null)}
                onCancelEdit={() => setEditingProfileAttrId(null)}
                onConfirmAdd={() => handleConfirmAdd(attr)}
                onConfirmEdit={() => handleConfirmEdit(attr)}
                onInitiateAdd={() => handleInitiateAdd(attr)}
                onInitiateEdit={() => handleInitiateEdit(attr)}
                onRemove={() => handleRemoveProfileAttribute(attr)}
              />
            );
          })}
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
        Attributes
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
        <ProfileAttributeCategoryTabs
          categories={categories}
          activeTab={activeTab}
          onTabChange={setActiveTab}
        />
      )}

      <Box style={{ minHeight: 300, position: "relative" }}>
        {renderContent()}
      </Box>
    </Stack>
  );
}
