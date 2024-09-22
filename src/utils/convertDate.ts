import moment from "moment";

export function convertToReadableDate(dateString: string): string {
  const date = moment(dateString);
  const now = moment();

  const timeFormat = "h:mm A";

  if (date.isSame(now, "day")) {
    // Same day
    return date.format(timeFormat);
  } else if (date.isSame(now.subtract(1, "day"), "day")) {
    // Yesterday
    return `Yesterday`;
  } else {
    // Older messages
    return date.format("DD/MM/YY");
  }
}
