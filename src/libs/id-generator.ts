import { v4 as uuidv4 } from "uuid";
import { nanoid } from "nanoid";
import dateTime from "./date-time";

export const generateUUID = () => {
  return uuidv4();
};

export const generateShortID = (length: number = 12) => {
  return nanoid(length);
};

export const generateNanoID = (length?: number) => {
  if (length) {
    return nanoid(length);
  }
  return nanoid();
};

function generateAlphaNumericSeries(
  prefix: string,
  sequenceNumber: number,
  includeDate: boolean = true
) {
  const formattedDate = dateTime.getIDFormatDate();
  // Pad sequence number with leading zeros
  const paddedSequenceNumber = sequenceNumber.toString().padStart(5, "0");

  if (!includeDate) {
    // Concatenate prefix, and padded sequence number
    return `${prefix}_${paddedSequenceNumber}`;
  }
  // Concatenate prefix, date, and padded sequence number
  return `${prefix}_${formattedDate}_${paddedSequenceNumber}`;
}

export default {
  generateUUID,
  generateShortID,
  generateNanoID,
  generateAlphaNumericSeries,
};
