import { useEffect } from "react";
import type { RouteHandle } from "~/auth/types";
import {
  Container,
  Stack,
  Pagination,
  Flex,
  Text,
  Loader,
  Center,
  Title,
} from "@mantine/core";
import { useNavigate } from "react-router";
import { usePositions } from "~/hooks/usePositions";
import { usePositionStore } from "~/store/positionStore";
import {
  PositionTable,
  PositionToolbar,
  CreatePositionModal,
} from "~/components/positions";

export const handle: RouteHandle = {
  allowedRoles: ["Administrator", "Recruiter"],
};

export default function PositionsPage() {
  const pageSize = 10;
  const { page, setPage, selectedIds, toggleSelection, resetStore } =
    usePositionStore();

  const { data: pagedData, isLoading, isError } = usePositions(page, pageSize);
  const navigate = useNavigate();

  useEffect(() => {
    return () => {
      resetStore();
    };
  }, [resetStore]);

  const handleRowClick = (id: string) => {
    navigate(`/app/position/${id}`);
  };

  return (
    <Container size="xl" py="xl">
      <Stack gap="md">
        <Title size="h1">Positions</Title>

        <PositionToolbar />

        {isLoading ? (
          <Center p="xl" mih={300}>
            <Loader variant="bars" color="blue" />
          </Center>
        ) : isError ? (
          <Center p="xl" mih={300}>
            <Text c="red">Failed to load positions.</Text>
          </Center>
        ) : (
          <Stack gap="xl">
            <PositionTable
              positions={pagedData?.data || []}
              selectedIds={selectedIds}
              onToggleSelect={toggleSelection}
              onRowClick={handleRowClick}
            />

            {(pagedData?.totalPages || 0) > 1 && (
              <Flex justify="center" mt="md">
                <Pagination
                  total={pagedData!.totalPages}
                  value={page}
                  onChange={setPage}
                  color="blue"
                  radius="md"
                  withEdges
                />
              </Flex>
            )}
          </Stack>
        )}
      </Stack>

      <CreatePositionModal />
    </Container>
  );
}
