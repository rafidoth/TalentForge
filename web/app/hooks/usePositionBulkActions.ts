import { useState } from "react";
import { useDeletePosition, useDuplicatePosition } from "~/hooks/usePositions";
import { usePositionStore } from "~/store/positionStore";

export function usePositionBulkActions() {
  const [isDeletingBulk, setIsDeletingBulk] = useState(false);
  const [isDuplicatingBulk, setIsDuplicatingBulk] = useState(false);

  const deleteMutation = useDeletePosition();
  const duplicateMutation = useDuplicatePosition();
  const { selectedIds, clearSelection } = usePositionStore();

  const handleBulkDelete = async () => {
    if (selectedIds.size === 0) return;
    if (confirm(`Are you sure you want to delete ${selectedIds.size} position(s)?`)) {
      setIsDeletingBulk(true);
      try {
        const promises = Array.from(selectedIds).map((id) =>
          deleteMutation.mutateAsync(id)
        );
        await Promise.all(promises);
        clearSelection();
      } catch (error) {
        console.error("Failed to delete some positions.", error);
      } finally {
        setIsDeletingBulk(false);
      }
    }
  };

  const handleBulkDuplicate = async () => {
    if (selectedIds.size === 0) return;
    setIsDuplicatingBulk(true);
    try {
      const promises = Array.from(selectedIds).map((id) =>
        duplicateMutation.mutateAsync(id)
      );
      await Promise.all(promises);
      clearSelection();
    } catch (error) {
      console.error("Failed to duplicate some positions.", error);
    } finally {
      setIsDuplicatingBulk(false);
    }
  };

  return {
    handleBulkDelete,
    handleBulkDuplicate,
    isDeletingBulk,
    isDuplicatingBulk,
    hasSelection: selectedIds.size > 0,
  };
}
