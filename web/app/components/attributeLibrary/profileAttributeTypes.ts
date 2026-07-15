import type { ProfileAttributeDto } from "../../api/types";

// ---------------------------------------------------------------------------
// Attribute value – a union of every shape `ProfileAttributeInput` can produce.
//
// This replaces the previous bare `any`.  The union is intentionally loose
// because the backend stores `value` as a JSON column, and we cannot narrow
// further without runtime type-guards keyed on `typeName`.  It does, however,
// constrain values to the set of shapes actually produced by the UI inputs.
// ---------------------------------------------------------------------------

/** A single date‑period represented as a `[start, end]` tuple. */
export type PeriodValue = [string, string];

export type AttributeValue =
  | string        // text, image URL, date (ISO), dropdown ID
  | number        // numeric
  | boolean       // boolean
  | string[]      // "select‑one" multi‑value (legacy naming)
  | PeriodValue   // period
  | null;

// ---------------------------------------------------------------------------
// Inline form state – unified for both "add" and "edit" modes.
// ---------------------------------------------------------------------------

export interface InlineFormState {
  mode: "add" | "edit" | null;
  attrId: string | null;
  value: AttributeValue;
}

export const INLINE_FORM_IDLE: InlineFormState = {
  mode: null,
  attrId: null,
  value: null,
};

// ---------------------------------------------------------------------------
// Default value factory (moved here so it can be tested independently).
// ---------------------------------------------------------------------------

export function getDefaultValueForType(typeName: string): AttributeValue {
  const name = typeName.toLowerCase();
  if (name.includes("boolean")) return false;
  if (name.includes("numeric")) return 0;
  if (name.includes("date")) return new Date().toISOString().split("T")[0];
  if (name.includes("period")) {
    const today = new Date().toISOString().split("T")[0];
    return [today, today] as PeriodValue;
  }
  if (name.includes("one")) return [] as string[];
  // String, Text, Image
  return "";
}

// ---------------------------------------------------------------------------
// Lookup map helper
// ---------------------------------------------------------------------------

/**
 * Build a `Map<attributeId, ProfileAttributeDto>` from the flat array
 * returned by the API.  This replaces the previous `Map<string, string>`
 * (attributeId → profileAttributeId) *and* eliminates the repeated
 * `profileAttributesData?.find(…)` calls.
 */
export function buildProfileAttributeMap(
  data: ProfileAttributeDto[] | undefined,
): Map<string, ProfileAttributeDto> {
  const map = new Map<string, ProfileAttributeDto>();
  if (data) {
    for (const pa of data) {
      map.set(pa.attributeId, pa);
    }
  }
  return map;
}
