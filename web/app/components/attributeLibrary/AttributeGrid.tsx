import {
  Button,
  Loader,
  Text,
  Center,
  SimpleGrid,
  Stack,
} from "@mantine/core";
import type { AttributeDto, ProfileAttributeDto } from "../../api/types";
import type { AttributeValue, InlineFormState } from "./profileAttributeTypes";
import { ProfileAttributeCard } from "./ProfileAttributeCard";

// ---------------------------------------------------------------------------
// Props
// ---------------------------------------------------------------------------

interface AttributeGridProps {
  attributes: AttributeDto[];
  isLoading: boolean;
  profileAttributeMap: Map<string, ProfileAttributeDto>;
  inlineForm: InlineFormState;
  isMutating: boolean;
  isRemoving: boolean;
  isDeleting: boolean;
  hasNextPage: boolean;
  isFetchingNextPage: boolean;
  activeTab: string | null;
  onFetchNextPage: () => void;
  onInitiateAdd: (attr: AttributeDto) => void;
  onInitiateEdit: (attr: AttributeDto) => void;
  onConfirm: (attr: AttributeDto) => void;
  onCancel: () => void;
  onRemove: (attr: AttributeDto) => void;
  onValueChange: (value: AttributeValue) => void;
  onEditDefinition: (attr: AttributeDto) => void;
  onDeleteDefinition: (attr: AttributeDto) => void;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function AttributeGrid({
  attributes,
  isLoading,
  profileAttributeMap,
  inlineForm,
  isMutating,
  isRemoving,
  isDeleting,
  hasNextPage,
  isFetchingNextPage,
  activeTab,
  onFetchNextPage,
  onInitiateAdd,
  onInitiateEdit,
  onConfirm,
  onCancel,
  onRemove,
  onValueChange,
  onEditDefinition,
  onDeleteDefinition,
}: AttributeGridProps) {
  if (isLoading) {
    return (
      <Center h={300}>
        <Loader />
      </Center>
    );
  }

  if (attributes.length === 0) {
    return (
      <Center h={300}>
        <Text c="dimmed">No attributes found in this category.</Text>
      </Center>
    );
  }

  return (
    <Stack gap="xl">
      <SimpleGrid cols={{ base: 1, xs: 2, sm: 2, md: 3 }} spacing="md">
        {attributes.map((attr) => {
          if (attr.isBuiltin) return null;

          return (
            <ProfileAttributeCard
              key={attr.id}
              attribute={attr}
              profileAttribute={profileAttributeMap.get(attr.id)}
              inlineForm={inlineForm}
              isMutating={isMutating}
              isRemoving={isRemoving}
              isDeleting={isDeleting}
              onInitiateAdd={onInitiateAdd}
              onInitiateEdit={onInitiateEdit}
              onConfirm={onConfirm}
              onCancel={onCancel}
              onRemove={onRemove}
              onValueChange={onValueChange}
              onEditDefinition={onEditDefinition}
              onDeleteDefinition={onDeleteDefinition}
            />
          );
        })}
      </SimpleGrid>

      {hasNextPage && activeTab === "all" && (
        <Center>
          <Button
            variant="light"
            onClick={onFetchNextPage}
            loading={isFetchingNextPage}
          >
            Load More
          </Button>
        </Center>
      )}
    </Stack>
  );
}
