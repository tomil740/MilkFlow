// Safe date parser that returns null if the date is invalid
  export default function safeParseDate(dateString: string | null): Date | null {
    if (!dateString) {
      return null; // Return null if the input is null or undefined
    }
    const parsedDate = new Date(dateString);
    return isNaN(parsedDate.getTime()) ? null : parsedDate; // Return null if the date is invalid
  }