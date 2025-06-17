// src/utils/formatters.ts

export const convertEpochToDateString = (
  epochOrIsoString: string | number | null | undefined,
  format: string = "P p" // Default date-fns format: 'MM/dd/yyyy HH:mm:ss'
): string => {
  if (!epochOrIsoString) {
    return "N/A"; // Handle null, undefined, or empty string early
  }

  try {
    let dateInstance: Date;
    if (typeof epochOrIsoString === 'number') {
      // Assuming it's a Unix timestamp (seconds or milliseconds)
      // If it's seconds, multiply by 1000 for JavaScript Date
      dateInstance = new Date(epochOrIsoString * (String(epochOrIsoString).length === 10 ? 1000 : 1));
    } else if (typeof epochOrIsoString === 'string') {
      dateInstance = new Date(epochOrIsoString);
    } else {
      return "Invalid Date Input";
    }

    // Check if the date is valid after parsing
    if (isNaN(dateInstance.getTime())) {
      console.warn("convertEpochToDateString: Invalid date created from input:", epochOrIsoString);
      return "Invalid Date";
    }
    
    // Using a simpler, more common date format for now.
    // Replace with date-fns formatting if you have it installed and prefer it.
    return dateInstance.toLocaleDateString('en-BE', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      // second: '2-digit', // Optional: include seconds
    });

    // If you were using date-fns:
    // import { format as formatDateFn, isValid } from 'date-fns';
    // if (!isValid(dateInstance)) {
    //   console.warn("convertEpochToDateString: Invalid date created from input:", epochOrIsoString);
    //   return "Invalid Date";
    // }
    // return formatDateFn(dateInstance, format);

  } catch (error) {
    console.error("Error formatting date:", epochOrIsoString, error);
    return "Date Error";
  }
};

// ... other formatters