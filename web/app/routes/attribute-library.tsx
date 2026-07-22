import { Container, Paper } from "@mantine/core";
import { useState } from "react";
import { BaseAttributeList } from "~/components/attributeLibrary/BaseAttributeList";
import { AttributeForm } from "~/components/attributeLibrary/AttributeForm";
import type { AttributeDto } from "~/api/types";
import { useAttributes } from "~/components/attributeLibrary/useAttributes";
import { useAttributeStore } from "~/store/attributeStore";

export default function AttributeLibraryPage() {
    const [view, setView] = useState<"list" | "create" | "edit">("list");
    const [editingAttribute, setEditingAttribute] = useState<AttributeDto | null>(null);
    const { search, page, activeTab } = useAttributeStore();
    const categoryId = activeTab && activeTab !== "all" && activeTab !== "recent"
        ? parseInt(activeTab, 10)
        : null;
    const recent = activeTab === "recent";
    const { data: attributes, isLoading } = useAttributes(search, categoryId, recent, page, 20);

    const handleCreate = () => {
        setEditingAttribute(null);
        setView("create");
    };

    const handleEdit = (attribute: AttributeDto) => {
        setEditingAttribute(attribute);
        setView("edit");
    };

    const handleBackToList = () => {
        setView("list");
        setEditingAttribute(null);
    };


    return (
        <Container size="xl" py="xl">
            {view === "list" ? (
                <BaseAttributeList
                    mode="global"
                    onCreate={handleCreate}
                    onEdit={handleEdit}
                    attributesData={attributes}
                    attributesLoading={isLoading}
                />
            ) : (
                <AttributeForm
                    key={editingAttribute?.id ?? "new"}
                    attribute={editingAttribute}
                    onCancel={handleBackToList}
                    onSuccess={handleBackToList}
                />
            )}
        </Container>
    );
}