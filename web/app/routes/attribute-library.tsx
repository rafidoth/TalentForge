import { Container, Paper } from "@mantine/core";
import { useState } from "react";
import { BaseAttributeList } from "~/components/attributeLibrary/BaseAttributeList";
import { AttributeForm } from "~/components/attributeLibrary/AttributeForm";
import type { AttributeDto } from "~/api/types";

export default function AttributeLibraryPage() {
    const [view, setView] = useState<"list" | "create" | "edit">("list");
    const [editingAttribute, setEditingAttribute] = useState<AttributeDto | null>(null);

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