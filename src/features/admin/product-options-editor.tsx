"use client";

import type { ProductOptionGroup } from "@/src/types";

export interface ProductOptionValueForm {
  value: string;
  priceOverride: string;
}

export interface ProductOptionGroupForm {
  group: string;
  values: ProductOptionValueForm[];
}

export function parseProductOptions(raw?: string): ProductOptionGroupForm[] {
  if (!raw) return [];

  try {
    const parsed = JSON.parse(raw) as ProductOptionGroup[];

    if (!Array.isArray(parsed)) {
      return [];
    }

    return parsed.map((group) => ({
      group: group.group ?? "",
      values: Array.isArray(group.values)
        ? group.values.map((value) => ({
            value: value.value ?? "",
            priceOverride:
              value.priceOverride === undefined ? "" : String(value.priceOverride),
          }))
        : [],
    }));
  } catch {
    return [];
  }
}

export function serializeProductOptions(groups: ProductOptionGroupForm[]) {
  const normalized = groups
    .map((group) => ({
      group: group.group.trim(),
      values: group.values
        .map((value) => {
          const nextValue = value.value.trim();
          const numericOverride =
            value.priceOverride.trim() === "" ? undefined : Number(value.priceOverride);

          if (!nextValue) {
            return null;
          }

          return {
            value: nextValue,
            ...(Number.isFinite(numericOverride) ? { priceOverride: numericOverride } : {}),
          };
        })
        .filter((value): value is { value: string; priceOverride?: number } => Boolean(value)),
    }))
    .filter((group) => group.group && group.values.length > 0);

  return normalized.length > 0 ? JSON.stringify(normalized) : undefined;
}

interface ProductOptionsEditorProps {
  value: ProductOptionGroupForm[];
  onChange: (value: ProductOptionGroupForm[]) => void;
}

export function ProductOptionsEditor({ value, onChange }: ProductOptionsEditorProps) {
  function updateGroup(index: number, nextGroup: ProductOptionGroupForm) {
    onChange(value.map((group, currentIndex) => (currentIndex === index ? nextGroup : group)));
  }

  function removeGroup(index: number) {
    onChange(value.filter((_, currentIndex) => currentIndex !== index));
  }

  function addGroup() {
    onChange([...value, { group: "", values: [{ value: "", priceOverride: "" }] }]);
  }

  return (
    <div className="space-y-3">
      <div>
        <p className="text-sm font-medium text-slate-700">Product options</p>
        <p className="mt-1 text-xs text-slate-500">
          Add option groups like Weight, Pack Size, or Variant. Each value can optionally set its
          own selling price.
        </p>
      </div>

      <div className="space-y-4 rounded-[1.5rem] border border-slate-200 bg-slate-50 p-4">
        {value.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-5 py-6 text-sm text-slate-500">
            No options added. Use this only if the product has selectable variants.
          </div>
        ) : null}

        {value.map((group, groupIndex) => (
          <div key={groupIndex} className="rounded-3xl border border-slate-200 bg-white p-4">
            <div className="flex items-center justify-between gap-4">
              <label className="block flex-1 space-y-2">
                <span className="text-sm font-medium text-slate-700">Option group</span>
                <input
                  value={group.group}
                  onChange={(event) =>
                    updateGroup(groupIndex, { ...group, group: event.target.value })
                  }
                  className="w-full rounded-2xl border border-slate-300 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-900"
                  placeholder="Weight"
                />
              </label>

              <button
                type="button"
                onClick={() => removeGroup(groupIndex)}
                className="rounded-full border border-red-200 px-4 py-2 text-sm font-medium text-red-700 hover:bg-red-50"
              >
                Remove group
              </button>
            </div>

            <div className="mt-4 space-y-3">
              {group.values.map((optionValue, valueIndex) => (
                <div
                  key={valueIndex}
                  className="grid gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-3 md:grid-cols-[minmax(0,1fr)_12rem_auto]"
                >
                  <label className="block space-y-2">
                    <span className="text-sm font-medium text-slate-700">Value</span>
                    <input
                      value={optionValue.value}
                      onChange={(event) =>
                        updateGroup(groupIndex, {
                          ...group,
                          values: group.values.map((valueItem, currentIndex) =>
                            currentIndex === valueIndex
                              ? { ...valueItem, value: event.target.value }
                              : valueItem,
                          ),
                        })
                      }
                      className="w-full rounded-2xl border border-slate-300 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-900"
                      placeholder="500g"
                    />
                  </label>

                  <label className="block space-y-2">
                    <span className="text-sm font-medium text-slate-700">Selling price</span>
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={optionValue.priceOverride}
                      onChange={(event) =>
                        updateGroup(groupIndex, {
                          ...group,
                          values: group.values.map((valueItem, currentIndex) =>
                            currentIndex === valueIndex
                              ? { ...valueItem, priceOverride: event.target.value }
                              : valueItem,
                          ),
                        })
                      }
                      className="w-full rounded-2xl border border-slate-300 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-900"
                      placeholder="Optional variant price"
                    />
                  </label>

                  <div className="flex items-end">
                    <button
                      type="button"
                      onClick={() =>
                        updateGroup(groupIndex, {
                          ...group,
                          values: group.values.filter(
                            (_, currentIndex) => currentIndex !== valueIndex,
                          ),
                        })
                      }
                      className="rounded-full border border-red-200 px-4 py-3 text-sm font-medium text-red-700 hover:bg-red-50"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}

              <button
                type="button"
                onClick={() =>
                  updateGroup(groupIndex, {
                    ...group,
                    values: [...group.values, { value: "", priceOverride: "" }],
                  })
                }
                className="rounded-full border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100"
              >
                Add value
              </button>
            </div>
          </div>
        ))}

        <button
          type="button"
          onClick={addGroup}
          className="rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-800"
        >
          Add option group
        </button>
      </div>
    </div>
  );
}
