// Define a type for the object stored in localStorage (adjust according to your app's data structure)
interface StoredData {
  [key: string]: any; // You can specify more precise types if you know the shape of the object
}

/**
 * Get data from localStorage
 * @param key - The key for the data in localStorage
 * @returns {Promise<any[]>} - A promise that resolves to the parsed data or an empty array
 */
export async function getFromLocalStorage(key: string): Promise<any[]> {
  return new Promise((resolve) => {
    const data = localStorage.getItem(key);
    resolve(data ? JSON.parse(data) : []);
  });
}

/**
 * Set data to localStorage
 * @param key - The key for storing the data in localStorage
 * @param object - The object to store in localStorage
 * @returns {Promise<void>} - A promise that resolves when data is saved
 */
export async function setToLocalStorage(
  key: string,
  object: StoredData
): Promise<void> {
  return new Promise((resolve) => {
    localStorage.setItem(key, JSON.stringify(object));
    resolve();
  });
}
