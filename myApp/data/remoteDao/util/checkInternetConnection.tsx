export const checkInternetConnection = async (): Promise<boolean> => {
  // Step 1: Check if navigator.onLine reports the browser as online
  if (typeof navigator !== "undefined" && !navigator.onLine) {
    return false; // Browser reports offline
  }

  // Step 2: Verify connectivity with a lightweight request in no-cors mode
  try {
    const response = await fetch("https://www.gstatic.com/generate_204", {
      method: "HEAD", // Use HEAD to avoid downloading the body
      cache: "no-store", // Prevent caching of the request
      mode: "no-cors", // This disables CORS checks
    });

    // Since we can't access the response details in no-cors mode,
    // We just return true as long as the request does not throw an error
    return true;
  } catch (error) {
    // Fetch failed, so no internet connection
    return false;
  }
};
