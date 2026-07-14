import { Modal, Text, Title } from "@mantine/core";
import { useState } from "react";
import { PositionAttributeList } from "./AttributeList";
import { AttributeForm } from "./AttributeForm";
import type { AttributeDto } from "../../api/types";

export interface AttributeLibraryModalProps {
  opened: boolean;
  onClose: () => void;
  positionId?: string;
}

export function AttributeLibraryModal(
  { opened, onClose, positionId }: AttributeLibraryModalProps
) {
  const [view, setView] = useState<"list" | "create" | "edit">("list");
  const [editingAttribute, setEditingAttribute] = useState<AttributeDto | null>(null);

  const handleClose = () => {
    setView("list");
    setEditingAttribute(null);
    onClose();
  };

  const handleEdit = (attribute: AttributeDto) => {
    setEditingAttribute(attribute);
    setView("edit");
  };

  const handleCreate = () => {
    setEditingAttribute(null);
    setView("create");
  };

  const handleBackToList = () => {
    setView("list");
    setEditingAttribute(null);
  };


  const PositionAttributeListComponent = (view: string) => (view === "list" ? (
    <PositionAttributeList
      positionId={positionId}
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
  ));

  return (
    <Modal
      opened={opened}
      onClose={handleClose}
      centered
      size="70%"
      padding="lg"
    >
      {positionId ? PositionAttributeListComponent(view) : (
        <Text>
          Attribute list for candidate profile
        </Text>
      )}
    </Modal>
  );
}
