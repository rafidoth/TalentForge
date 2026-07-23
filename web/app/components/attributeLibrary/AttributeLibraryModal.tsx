import { Modal, Text } from "@mantine/core";
import { BaseAttributeList } from "./BaseAttributeList";
import { ProfileAttributeList } from "./ProfileAttributeList";
import { useAttributes } from "./useAttributes";
import { useAttributeStore } from "~/store/attributeStore";

export interface AttributeLibraryModalProps {
  opened: boolean;
  onClose: () => void;
  positionId?: string;
}

function PositionAttributeList({ positionId }: { positionId: string }) {
  const { search, page, activeTab } = useAttributeStore();
  const categoryId = activeTab && activeTab !== "all" && activeTab !== "recent"
    ? parseInt(activeTab, 10)
    : null;
  const recent = activeTab === "recent";
  const { data: attributesData, isLoading: attributesLoading } = useAttributes(search, categoryId, recent, page, 10);

  return (
    <BaseAttributeList
      mode="position"
      positionId={positionId}
      attributesData={attributesData}
      attributesLoading={attributesLoading}
    />
  );
}

export function AttributeLibraryModal({
  opened,
  onClose,
  positionId,
}: AttributeLibraryModalProps) {

  const handleClose = () => {
    onClose();
  };

  const renderListView = () => {
    if (positionId) {
      return <PositionAttributeList positionId={positionId} />;
    }
    return <ProfileAttributeList />;
  };

  return (
    <Modal
      opened={opened}
      onClose={handleClose}
      centered
      padding="lg"
      size="100%"
    >
      {renderListView()}
    </Modal>
  );
}
