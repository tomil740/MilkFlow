/**
 * Retry a given async function with a limit and delay between attempts.
 * @param operation - The async function to retry.
 * @param retries - Maximum number of retries.
 * @param delay - Delay between retries in milliseconds.
 * @returns Promise resolving to the result of the operation.
 */
export const retryOperation = async <T,>(
  operation: () => Promise<T>,
  retries: number = 3,
  delay: number = 1000
): Promise<T> => {
  let attempts = 0;
  while (attempts < retries) {
    try {
      return await operation(); // Attempt the operation
    } catch (error) {
      attempts++;
      if (attempts >= retries) throw error; // Throw error after exceeding retries
      console.warn(`Retrying operation... (attempt ${attempts}/${retries})`);
      await new Promise((resolve) => setTimeout(resolve, delay)); // Wait before retrying
    }
  }
  throw new Error("Retry limit exceeded");
};
