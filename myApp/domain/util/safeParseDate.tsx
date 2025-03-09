// Safe date parser that returns null if the date is invalid
  export function safeParseDate(dateString: string | null): Date | null {
    if (!dateString) {
      return null; // Return null if the input is null or undefined
    }
    const parsedDate = new Date(dateString);
    return isNaN(parsedDate.getTime()) ? null : parsedDate; // Return null if the date is invalid
  }

  export function isSameDayFun(date1: Date, date2: Date): boolean {
    return (
      date1.getFullYear() === date2.getFullYear() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getDate() === date2.getDate()
    );
  }
