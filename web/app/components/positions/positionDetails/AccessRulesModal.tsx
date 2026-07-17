import { useState, useMemo } from "react";
import { Modal, Title, Stack, Text } from "@mantine/core";
import { usePositionAccessRules, useCreatePositionAccessRule, useDeletePositionAccessRule } from "~/hooks/usePositionAccessRules";
import { useQuery } from "@tanstack/react-query";
import { fetchAttributes } from "~/api/attributes";
import { RuleOperator } from "~/api/types";

import { AccessRulesEmptyState } from "./AccessRulesModal/AccessRulesEmptyState";
import { AccessRulesTable } from "./AccessRulesModal/AccessRulesTable";
import { AddAccessRuleView } from "./AccessRulesModal/AddAccessRuleView";

interface Props {
  positionId: string;
  isPublic: boolean;
  opened: boolean;
  onClose: () => void;
}

const operatorLabels: Record<RuleOperator, string> = {
  [RuleOperator.Equals]: "Equals",
  [RuleOperator.NotEquals]: "Not Equals",
  [RuleOperator.GreaterThan]: "Greater Than",
  [RuleOperator.GreaterThanOrEqual]: "Greater Than Or Equal",
  [RuleOperator.LessThan]: "Less Than",
  [RuleOperator.LessThanOrEqual]: "Less Than Or Equal",
  [RuleOperator.Contains]: "Contains",
};

const OPERATORS_BY_TYPE: Record<string, RuleOperator[]> = {
  String: [RuleOperator.Equals, RuleOperator.Contains],
  Numeric: [
    RuleOperator.Equals,
    RuleOperator.NotEquals,
    RuleOperator.GreaterThan,
    RuleOperator.GreaterThanOrEqual,
    RuleOperator.LessThan,
    RuleOperator.LessThanOrEqual,
  ],
  Boolean: [RuleOperator.Equals],
};

const SUPPORTED_TYPES = Object.keys(OPERATORS_BY_TYPE);

function serializeExpectedValue(typeName: string | undefined, operator: RuleOperator, expectedValue: string) {
  if (typeName === "Boolean") {
    return expectedValue === "true" ? "true" : "false";
  }
  if (typeName === "Numeric" || typeName === "Rating") {
    return expectedValue.toString();
  }
  return `"${expectedValue}"`;
}

export function PositionAccessRulesModal({ positionId, isPublic, opened, onClose }: Props) {
  const { data: rules = [], isLoading } = usePositionAccessRules(positionId, opened && !isPublic);
  const deleteRule = useDeletePositionAccessRule(positionId);
  const createRule = useCreatePositionAccessRule(positionId);

  const { data: attributesData } = useQuery({
    queryKey: ["attributes", "all"],
    queryFn: () => fetchAttributes("", 1, 100),
    enabled: opened,
  });

  const [addingRule, setAddingRule] = useState(false);
  const [attributeId, setAttributeId] = useState<string | null>(null);
  const [operator, setOperator] = useState<RuleOperator | null>(null);
  const [expectedValue, setExpectedValue] = useState<string>("");
  const [submitError, setSubmitError] = useState<string | null>(null);

  const availableAttributes = useMemo(
    () => attributesData?.data.filter((a) => SUPPORTED_TYPES.includes(a.typeName)) ?? [],
    [attributesData]
  );

  const selectedAttribute = availableAttributes.find((a) => a.id === attributeId);

  const availableOperators = useMemo(() => {
    if (!selectedAttribute) return [];
    const allowedKeys = OPERATORS_BY_TYPE[selectedAttribute.typeName] ?? [];
    return allowedKeys.map((key) => ({ value: key.toString(), label: operatorLabels[key] }));
  }, [selectedAttribute]);

  const handleAttributeChange = (val: string | null) => {
    setAttributeId(val);
    setOperator(null);
    setExpectedValue("");
    setSubmitError(null);
  };

  const handleOperatorChange = (val: string | null) => {
    setOperator(val !== null ? (parseInt(val, 10) as RuleOperator) : null);
  };

  const handleAddSubmit = () => {
    if (!attributeId || operator === null || expectedValue === "") return;

    setSubmitError(null);
    createRule.mutate(
      {
        attributeId,
        operator,
        expectedValue: serializeExpectedValue(selectedAttribute?.typeName, operator, expectedValue),
      },
      {
        onSuccess: () => setAddingRule(false),
        onError: () => setSubmitError("Failed to add rule. Please try again."),
      }
    );
  };

  const handleCancelAdd = () => {
    setAddingRule(false);
    setSubmitError(null);
  };

  return (
    <Modal opened={opened} onClose={onClose} size="xl" centered>
      {!addingRule ? (
        <Stack>
          {isLoading ? (
            <Text>Loading rules...</Text>
          ) : rules.length === 0 ? (
            <AccessRulesEmptyState isPublic={isPublic} onAddRule={() => setAddingRule(true)} />
          ) : (
            <AccessRulesTable
              rules={rules}
              isPublic={isPublic}
              operatorLabels={operatorLabels}
              onAddRule={() => setAddingRule(true)}
              onDeleteRule={(id) => deleteRule.mutate(id)}
            />
          )}
        </Stack>
      ) : (
        <Stack>
          {submitError && <Text c="red">{submitError}</Text>}
          <AddAccessRuleView
            availableAttributes={availableAttributes}
            selectedAttribute={selectedAttribute}
            attributeId={attributeId}
            onAttributeChange={handleAttributeChange}
            availableOperators={availableOperators}
            operator={operator?.toString() ?? null}
            onOperatorChange={handleOperatorChange}
            expectedValue={expectedValue}
            onExpectedValueChange={setExpectedValue}
            isSubmitDisabled={!attributeId || operator === null || expectedValue === "" || createRule.isPending}
            onSubmit={handleAddSubmit}
            onCancel={handleCancelAdd}
          />
        </Stack>
      )}
    </Modal>
  );
}