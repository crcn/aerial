export * from "./diff-patch";

export function toArray(value) {
  return Array.isArray(value) ? value : value == null ? [] : [value];
}