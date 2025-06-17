import { DataProvider, HttpError as RefineHttpError } from "@refinedev/core";
import queryString from "query-string";
import { supabaseBrowserClient } from "@utils/supabase/client";

// Define a type for the error structure if needed, or use Partial<RefineHttpError>
interface CustomHttpError extends Error {
  statusCode?: number;
  errors?: any; // The original response body
}

const fetchDataProvider: DataProvider = {
  getApiUrl: () => "", // This might need to return your base API URL if used by other methods

  custom: async ({ url, method, payload, query, headers: initialHeaders }) => {
    let requestUrl = url;
    if (query) {
      requestUrl = `${requestUrl}?${queryString.stringify(query)}`;
    }

    // Prepare headers
    const requestHeaders = new Headers(initialHeaders || {}); // Initialize with any headers passed from useCustom

    // Add Content-Type if there's a payload and it's not already set
    if (payload && !requestHeaders.has("Content-Type")) {
      requestHeaders.set("Content-Type", "application/json");
    }

    // Get Supabase session and token
    const { data: { session } } = await supabaseBrowserClient.auth.getSession();
    const token = session?.access_token;

    if (token) {
      requestHeaders.set("Authorization", `Bearer ${token}`);
    }
    
    // Add Supabase anon key - Edge Functions typically expect this in addition to the JWT
    // The JWT is used *inside* the function to get the user session.
    if (process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
        requestHeaders.set("apikey", process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
    } else {
        console.warn("Supabase anon key (NEXT_PUBLIC_SUPABASE_ANON_KEY) is not defined. API calls to Edge Functions might fail.");
    }


    let responseBody;
    try {
      const response = await fetch(requestUrl, {
        method: method.toUpperCase(),
        headers: requestHeaders,
        body: payload ? JSON.stringify(payload) : undefined,
      });

      // Try to parse JSON, but handle cases where body might be empty or not JSON
      const contentType = response.headers.get("content-type");
      if (response.status === 204 || !contentType || !contentType.includes("application/json")) {
        // No content or not JSON, use a placeholder or handle as success with no data
        responseBody = { data: {} }; // Or specific handling for 204
        if (!response.ok && response.status !== 204) { // Still an error if not ok and not 204
            const error: CustomHttpError = new Error(response.statusText || `HTTP error ${response.status}`);
            error.statusCode = response.status;
            throw error;
        }
      } else {
        responseBody = await response.json();
      }

      if (!response.ok) {
        const error: CustomHttpError = new Error(
          responseBody?.message || responseBody?.error?.message || response.statusText || `HTTP error ${response.status}`
        );
        error.statusCode = response.status;
        error.errors = responseBody; // Attach the full response body
        throw error;
      }
      
      return { data: responseBody }; 

    } catch (error) {
      // Ensure the thrown error has a structure Refine can understand (like HttpError)
      if (error instanceof Error && 'statusCode' in error) {
        throw error; // It's already a CustomHttpError or similar
      }
      // For other types of errors (e.g., network failure before response)
      const customError: CustomHttpError = new Error((error as Error).message || "Network request failed");
      // customError.statusCode = (error as any).statusCode || 0; // Or some default for network errors
      throw customError;
    }
  },

  getList: async () => { throw new Error("FetchDataProvider: getList not implemented"); },
  getOne: async () => { throw new Error("FetchDataProvider: getOne not implemented"); },
  create: async () => { throw new Error("FetchDataProvider: create not implemented"); },
  update: async () => { throw new Error("FetchDataProvider: update not implemented"); },
  deleteOne: async () => { throw new Error("FetchDataProvider: deleteOne not implemented"); },
};

export default fetchDataProvider;