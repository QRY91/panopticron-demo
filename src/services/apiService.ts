// src/services/apiService.ts

interface ApiServiceOptions {
  authToken?: string;
  defaultHeaders?: Record<string, string>;
}

export class ApiServiceError extends Error {
  status?: number;
  data?: any;

  constructor(message: string, status?: number, data?: any) {
    super(message);
    this.name = 'ApiServiceError';
    this.status = status;
    this.data = data;
    Object.setPrototypeOf(this, ApiServiceError.prototype);
  }
}

export class ApiService {
  private baseUrl: string;
  private authToken?: string;
  private defaultHeaders: Record<string, string>;

  constructor(baseUrl: string, options: ApiServiceOptions = {}) {
    if (!baseUrl) {
      throw new Error('ApiService: baseUrl is required.');
    }
    this.baseUrl = baseUrl.replace(/\/$/, ''); // Remove trailing slash if present
    this.authToken = options.authToken;
    this.defaultHeaders = {
      'Content-Type': 'application/json',
      ...options.defaultHeaders,
    };

    if (this.authToken) {
      this.defaultHeaders['Authorization'] = `Bearer ${this.authToken}`;
    }
  }

  private async handleResponse<T>(response: Response, requestUrl: string): Promise<T> {
    if (!response.ok) {
      let errorData: any = { message: response.statusText };
      try {
        // Attempt to parse error response as JSON
        const responseBody = await response.text();
        if (responseBody) {
            errorData = JSON.parse(responseBody);
            // If the parsed data has an 'error' object with a 'message', use that.
            if (errorData.error && typeof errorData.error.message === 'string') {
                errorData.message = errorData.error.message;
            } else if (typeof errorData.message !== 'string') {
                // Fallback if no clear message property
                errorData.message = response.statusText || "API request failed";
            }
        }
      } catch (e) {
        // JSON parsing failed or empty body, stick with statusText
        console.warn(`ApiService: Could not parse error response body for ${requestUrl}. Status: ${response.status}`);
      }
      console.error(`ApiService Error: ${response.status} ${response.statusText} from ${requestUrl}. Details:`, errorData);
      throw new ApiServiceError(errorData.message || `Request failed with status ${response.status}`, response.status, errorData);
    }

    // Handle cases where response might be empty (e.g., 204 No Content)
    const contentType = response.headers.get('content-type');
    if (response.status === 204 || !contentType || !contentType.includes('application/json')) {
        // If no content or not JSON, try to return response text or null/undefined based on status
        // For 204, it's conventional to return undefined or handle it as success without data
        if (response.status === 204) return undefined as T; // Or handle as appropriate for your use case
        const text = await response.text();
        // This might not be ideal if T expects an object, but it's better than failing to parse non-JSON
        return text as unknown as T;
    }

    return response.json() as Promise<T>;
  }

  async get<T>(endpoint: string, params?: URLSearchParams, options?: RequestInit): Promise<T> {
    const url = new URL(`${this.baseUrl}${endpoint}`);
    if (params) {
      url.search = params.toString();
    }
    const requestUrl = url.toString();
    console.log(`ApiService: GET ${requestUrl}`);

    const response = await fetch(requestUrl, {
      method: 'GET',
      headers: {
        ...this.defaultHeaders,
        ...options?.headers,
      },
      ...options,
    });
    return this.handleResponse<T>(response, requestUrl);
  }

  async post<T, U = any>(endpoint: string, body?: U, options?: RequestInit): Promise<T> {
    const requestUrl = `${this.baseUrl}${endpoint}`;
    console.log(`ApiService: POST ${requestUrl}`);

    const response = await fetch(requestUrl, {
      method: 'POST',
      headers: {
        ...this.defaultHeaders,
        ...options?.headers,
      },
      body: body ? JSON.stringify(body) : null,
      ...options,
    });
    return this.handleResponse<T>(response, requestUrl);
  }

  async put<T, U = any>(endpoint: string, body?: U, options?: RequestInit): Promise<T> {
    const requestUrl = `${this.baseUrl}${endpoint}`;
    console.log(`ApiService: PUT ${requestUrl}`);

    const response = await fetch(requestUrl, {
      method: 'PUT',
      headers: {
        ...this.defaultHeaders,
        ...options?.headers,
      },
      body: body ? JSON.stringify(body) : null,
      ...options,
    });
    return this.handleResponse<T>(response, requestUrl);
  }

  async delete<T>(endpoint: string, options?: RequestInit): Promise<T> {
    const requestUrl = `${this.baseUrl}${endpoint}`;
    console.log(`ApiService: DELETE ${requestUrl}`);

    const response = await fetch(requestUrl, {
      method: 'DELETE',
      headers: {
        ...this.defaultHeaders,
        ...options?.headers,
      },
      ...options,
    });
    return this.handleResponse<T>(response, requestUrl);
  }
}