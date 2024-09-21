import { fetchAuthSession } from 'aws-amplify/auth';

export abstract class ApiClient {
    protected baseUrl: string | undefined;
  
    constructor() {
      this.baseUrl = process.env.API_URL;
    }
  
    // Fetch the JWT token for authenticated requests
    protected async getToken(): Promise<string | null> {
      const { tokens } = await fetchAuthSession();

      if (tokens) {
        const { idToken } = tokens;
        if (idToken) {
          return idToken.toString();
        }
      }

      return null;    
    }

    private buildQueryParams(queryParams: Record<string, string | number> = {}): string {
      const query = new URLSearchParams(
        Object.entries(queryParams).reduce((acc, [key, value]) => {
          acc[key] = String(value); // Ensure all values are strings
          return acc;
        }, {} as Record<string, string>)
      ).toString();
    
      return query ? `?${query}` : '';
    }
  
    protected async fetchAuthenticated(
      endpoint: string,
      method: string = 'GET',
      json_body: object | null = null,
      query_params: Record<string, string | number> = {},
      options: RequestInit = {}
    ): Promise<object> {
      const token = await this.getToken();
    
      if (!token) {
        throw new Error('Unauthorized: Token not found');
      }
    
      const headers = {
        ...options.headers,
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      };
    
      const body = json_body ? JSON.stringify(json_body) : null;
    
      const response = await fetch(
        `${this.baseUrl}${endpoint}${this.buildQueryParams(query_params)}`,
        {
          ...options,
          method,
          headers,
          body,
        }
      );
    
      return this.handleResponse(response);
    }
    
    protected async fetchUnauthenticated(
      endpoint: string,
      method: string = 'GET',
      json_body: object | null = null,
      query_params: Record<string, string | number> = {},
      options: RequestInit = {}
    ): Promise<object> {
      const headers = {
        'Content-Type': 'application/json',
        ...options.headers,
      };
    
      const body = json_body ? JSON.stringify(json_body) : null;
    
      const response = await fetch(
        `${this.baseUrl}${endpoint}${this.buildQueryParams(query_params)}`,
        {
          ...options,
          method,
          headers,
          body,
        }
      );
    
      return this.handleResponse(response);
    }

    // Handle the response and convert to JSON
    private async handleResponse(response: Response): Promise<object> {
      if (!response.ok) {
        const error = await response.json();
        throw new Error(`Error: ${response.status} ${error.message}`);
      }
  
      return response.json();
    }
  }
  