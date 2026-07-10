import { Modal, Text, Title } from "@mantine/core";
import { useState } from "react";
import { AttributeList } from "./AttributeList";
import { AttributeForm } from "./AttributeForm";
import type { AttributeDto } from "../../api/types";

export interface AttributeLibraryModalProps {
  opened: boolean;
  onClose: () => void;
  positionId?: string;
}

export function AttributeLibraryModal({ opened, onClose, positionId }: AttributeLibraryModalProps) {
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

  return (
    <Modal
      opened={opened}
      onClose={handleClose}
      centered
      size="70%"
      padding="lg"
    >
      {view === "list" ? (
        <AttributeList
          positionId={positionId}
          onCreate={handleCreate}
          onEdit={handleEdit}
        />
      ) : (
        <AttributeForm
          attribute={editingAttribute}
          onCancel={handleBackToList}
          onSuccess={handleBackToList}
        />
      )}
    </Modal>
  );
}
