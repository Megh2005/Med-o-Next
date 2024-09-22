export function formatMongoDate(mongoDateStr: string) {
  // Parse the MongoDB date string into a JavaScript Date object
  const date = new Date(mongoDateStr);

  // Extract hours, minutes, and adjust for AM/PM
  const hours = date.getHours() % 12 || 12; // Convert to 12-hour format (12 for midnight)
  const minutes = date.getMinutes().toString().padStart(2, "0");
  const ampm = date.getHours() >= 12 ? "PM" : "AM";

  // Format the time string
  return `${hours}:${minutes} ${ampm}`;
}
