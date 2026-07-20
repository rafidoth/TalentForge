import { useState, useMemo, useEffect } from "react";
import {
  useAttributes,
  useProfileAttributes,
  useAddProfileAttribute,
  useUpdateProfileAttribute,
  useDeleteProfileAttribute,
} from "./useAttributes";
import type { AttributeDto } from "../../api/types";
import { useAttributeStore } from "~/store/attributeStore";

function getDefaultValueForType(typeName: string): any {
  const name = typeName.toLowerCase();
  if (name.includes("boolean")) return false;
  if (name.includes("numeric")) return 0;
  if (name.includes("date")) return new Date().toISOString().split("T")[0];
  if (name.includes("period"))
    return [
      new Date().toISOString().split("T")[0],
      new Date().toISOString().split("T")[0],
    ];
  if (name.includes("one")) return [];
  // String, Text, Image
  return "";
}

export function useProfileAttributeList() {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [activeTab, setActiveTab] = useState<string | null>("all");

  const { data, isLoading } = useAttributes(search, page, 10);

  const { data: profileAttributesData } = useProfileAttributes();
  const { mutate: addToProfile, isPending: isAdding } =
    useAddProfileAttribute();
  const { mutate: removeFromProfile, isPending: isRemoving } =
    useDeleteProfileAttribute();

  const { categories, fetchLookups } = useAttributeStore();

  useEffect(() => {
    fetchLookups();
  }, [fetchLookups]);

  const attributes = useMemo(() => {
    return data?.data || [];
  }, [data]);

  const filteredAttributes = useMemo(() => {
    if (!activeTab || activeTab === "all") return attributes;
    if (activeTab === "recent") {
      return attributes.slice(0, 5);
    }
    return attributes.filter((attr) => attr.categoryName === activeTab);
  }, [attributes, activeTab]);

  const profileAttributeMap = useMemo(() => {
    const map = new Map<string, string>();
    if (profileAttributesData) {
      for (const pa of profileAttributesData) {
        map.set(pa.attributeId, pa.id);
      }
    }
    return map;
  }, [profileAttributesData]);

  const [addingAttrId, setAddingAttrId] = useState<string | null>(null);
  const [addValue, setAddValue] = useState<any>(null);

  const [editingProfileAttrId, setEditingProfileAttrId] = useState<
    string | null
  >(null);
  const [editValue, setEditValue] = useState<any>(null);

  const { mutate: updateProfileAttribute, isPending: isUpdating } =
    useUpdateProfileAttribute();

  const handleInitiateAdd = (attr: AttributeDto) => {
    setAddingAttrId(attr.id);
    setAddValue(getDefaultValueForType(attr.typeName));
  };

  const handleConfirmAdd = (attr: AttributeDto) => {
    addToProfile(
      {
        attributeId: attr.id,
        value: addValue,
      },
      {
        onSuccess: () => {
          setAddingAttrId(null);
        },
      },
    );
  };

  const handleInitiateEdit = (attr: AttributeDto) => {
    const profileAttr = profileAttributesData?.find(
      (pa) => pa.attributeId === attr.id,
    );
    if (profileAttr) {
      setEditingProfileAttrId(attr.id);
      setEditValue(profileAttr.value);
    }
  };

  const handleConfirmEdit = (attr: AttributeDto) => {
    const profileAttr = profileAttributesData?.find(
      (pa) => pa.attributeId === attr.id,
    );
    if (profileAttr) {
      updateProfileAttribute(
        {
          profileAttributeId: profileAttr.id,
          value: editValue,
          version: profileAttr.version,
        },
        {
          onSuccess: () => setEditingProfileAttrId(null),
        },
      );
    }
  };

  const handleRemoveProfileAttribute = (attr: AttributeDto) => {
    const profileAttrId = profileAttributeMap.get(attr.id);
    if (profileAttrId) {
      removeFromProfile(profileAttrId);
    }
  };

  return {
    search,
    setSearch,
    activeTab,
    setActiveTab,
    page,
    setPage,
    totalPages: data?.totalPages || 1,
    isLoading,
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
  };
}
