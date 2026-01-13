
export function getShortText(description: string, maxLength = 150): string {
  if (!description) return "";
  return description.length > maxLength
    ? description.slice(0, maxLength) + "..."
    : description;
}