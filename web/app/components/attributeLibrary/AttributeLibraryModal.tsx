import { Modal, Text } from "@mantine/core";
import { useState } from "react";
import { BaseAttributeList } from "./BaseAttributeList";
import { ProfileAttributeList } from "./ProfileAttributeList";
import { AttributeForm } from "./AttributeForm";
import type { AttributeDto } from "../../api/types";

export interface AttributeLibraryModalProps {
  opened: boolean;
  onClose: () => void;
  positionId?: string;
}

export function AttributeLibraryModal({
  opened,
  onClose,
  positionId,
}: AttributeLibraryModalProps) {
  const [view, setView] = useState<"list" | "create" | "edit">("list");
  const [editingAttribute, setEditingAttribute] = useState<AttributeDto | null>(
    null,
  );

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

  const renderFormView = () => {
    if (!positionId) {
      return <Text>No Attributes found</Text>;
    }
    return (
      <AttributeForm
        key={editingAttribute?.id ?? "new"}
        attribute={editingAttribute}
        onCancel={handleBackToList}
        onSuccess={handleBackToList}
      />
    );
  };

  const renderListView = () => {
    if (positionId) {
      return (
        <BaseAttributeList
          mode="position"
          positionId={positionId}
          onCreate={handleCreate}
          onEdit={handleEdit}
        />
      );
    }
    return <ProfileAttributeList />;
  };

  return (
    <Modal
      opened={opened}
      onClose={handleClose}
      centered
      size="70%"
      padding="lg"
    >
      {view === "list" ? renderListView() : renderFormView()}
    </Modal>
  );
}
