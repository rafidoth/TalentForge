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
  Pagination
} from "@mantine/core";
import { MagnifyingGlassIcon, PlusIcon } from "@phosphor-icons/react";
import { useMemo } from "react";
import { ProfileAttributeTable } from "./ProfileAttributeTable";
import { ProfileAttributeActionModal } from "./ProfileAttributeActionModal";
import type { AttributeDto } from "../../api/types";
import { useProfileAttributeStore, getDefaultValueForType } from "~/store/profileAttributeStore";
import { useAttributes, useAttributeTypesAndCategories } from "./useAttributes";
import {
  useProfileAttributes,
  useAddProfileAttribute,
  useUpdateProfileAttribute,
  useDeleteProfileAttribute,
} from "./useProfileAttributes";
export interface ProfileAttributeListProps { }

export function ProfileAttributeList({ }: ProfileAttributeListProps) {
  const {
    search, setSearch,
    activeTab, setActiveTab,
    page, setPage,
    selectedAttribute, setSelectedAttribute,
    modalValue, setModalValue,
  } = useProfileAttributeStore();

  const { data: globalAttributesData, isLoading: isLoadingGlobal } = useAttributes(search, page, 10);
  const { data: categoriesData } = useAttributeTypesAndCategories();
  const { data: profileAttributesData } = useProfileAttributes();

  const { mutate: addProfileAttribute, isPending: isAdding } = useAddProfileAttribute();
  const { mutate: updateProfileAttribute, isPending: isUpdating } = useUpdateProfileAttribute();
  const { mutate: deleteProfileAttribute, isPending: isRemoving } = useDeleteProfileAttribute();

  const categories = categoriesData?.categories || [];
  const attributes = globalAttributesData?.data || [];
  const totalPages = globalAttributesData?.totalPages || 1;

  const profileAttributeMap = useMemo(() => {
    const map = new Map<string, string>();
    if (profileAttributesData) {
      for (const pa of profileAttributesData) {
        map.set(pa.attributeId, pa.id);
      }
    }
    return map;
  }, [profileAttributesData]);

  const categoryOptions = useMemo(() => {
    return [
      { value: "all", label: "All Categories" },
      { value: "recent", label: "Recently Used" },
      ...categories.map(c => ({ value: c.name, label: c.name }))
    ];
  }, [categories]);

  const displayAttributes = useMemo(() => {
    let filtered = attributes;
    if (activeTab === "recent") {
      filtered = attributes.slice(0, 5);
    } else if (activeTab && activeTab !== "all") {
      filtered = attributes.filter(attr => attr.categoryName === activeTab);
    }
    return filtered.filter(a => !a.isBuiltin);
  }, [attributes, activeTab]);

  const handleRowClick = (attribute: AttributeDto) => {
    const isAdded = profileAttributeMap.has(attribute.id);
    if (isAdded) {
      const profileAttr = profileAttributesData?.find(pa => pa.attributeId === attribute.id);
      setSelectedAttribute(attribute, profileAttr?.value);
    } else {
      setSelectedAttribute(attribute, getDefaultValueForType(attribute.typeName));
    }
  };

  const handleModalClose = () => {
    setSelectedAttribute(null);
  };

  const handleModalConfirm = () => {
    if (!selectedAttribute) return;
    const profileAttrId = profileAttributeMap.get(selectedAttribute.id);
    if (profileAttrId) {
      const profileAttr = profileAttributesData?.find(pa => pa.id === profileAttrId);
      if (profileAttr) {
        updateProfileAttribute(
          { profileAttributeId: profileAttrId, value: modalValue, version: profileAttr.version },
          { onSuccess: () => setSelectedAttribute(null) }
        );
      }
    } else {
      addProfileAttribute(
        { attributeId: selectedAttribute.id, value: modalValue },
        { onSuccess: () => setSelectedAttribute(null) }
      );
    }
  };

  const handleModalRemove = () => {
    if (!selectedAttribute) return;
    const profileAttrId = profileAttributeMap.get(selectedAttribute.id);
    if (profileAttrId) {
      deleteProfileAttribute(profileAttrId, { onSuccess: () => setSelectedAttribute(null) });
    }
  };

  const renderContent = () => {
    if (isLoadingGlobal) {
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
          <Center>
            <Pagination
              total={totalPages}
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
        opened={!!selectedAttribute}
        onClose={handleModalClose}
        attribute={selectedAttribute}
        isAdded={selectedAttribute ? profileAttributeMap.has(selectedAttribute.id) : false}
        value={modalValue}
        onChange={setModalValue}
        onConfirm={handleModalConfirm}
        onRemove={handleModalRemove}
        isLoading={isAdding || isUpdating}
        isRemoving={isRemoving}
      />
    </Stack>
  );
}
