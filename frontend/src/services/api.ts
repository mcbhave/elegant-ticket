import axios, { AxiosInstance } from "axios";
import {
  User,
  Event,
  AuthCredentials,
  SignupData,
  MenuItem,
  EventFilters,
} from "@/types";

// Add Review interface
interface Review {
  id: string;
  created_at: number;
  items_id: number;
  shops_id: string;
  Comments: string;
  Helpful_count: number;
  Is_visible: boolean;
  Rating: number;
  Title: string;
  item_images_id: number[];
  users_id: number;
  user_info?: {
    id: number;
    name: string;
  };
}

interface ReviewsResponse {
  itemsReceived: number;
  curPage: number;
  nextPage: number | null;
  prevPage: number | null;
  offset: number;
  perPage: number;
  itemsTotal: number;
  pageTotal: number;
  items: Review[];
  ratings_avg: {
    reviews_Rating1: number;
    Total_items: number;
  }[];
}

class ApiService {
  private api: AxiosInstance;
  private baseURL = "https://x8ki-letl-twmt.n7.xano.io/api:2duosZ1Y";
  private elegantAuthKey = "e3f9c2a4-7b1e-4d3a-9c8f-2a6f9e3b1d7c";
  private publicAuthToken: string | null = null;

  constructor() {
    this.api = axios.create({
      baseURL: this.baseURL,
      timeout: 10000,
      headers: {
        "Content-Type": "application/json",
      },
    });

    // Request interceptor to handle tokens
    this.api.interceptors.request.use(
      async (config) => {
        // For events endpoint, use public auth token
        if (
          config.url?.includes("/events") ||
          config.url?.includes("/reviews") ||
          config.url?.includes("/menus")
        ) {
          const publicToken = await this.getPublicAuthToken();
          if (publicToken) {
            config.headers.Authorization = `Bearer ${publicToken}`;
            return config;
          }
        }

        // For other endpoints, use stored user token
        const userToken = this.getStoredToken();
        if (userToken) {
          config.headers.Authorization = `Bearer ${userToken}`;
        }

        return config;
      },
      (error) => Promise.reject(error)
    );

    // Handle 401 errors
    this.api.interceptors.response.use(
      (response) => response,
      async (error) => {
        if (error.response?.status === 401) {
          // If it's an events or reviews request that failed, try to refresh public token
          if (
            error.config?.url?.includes("/events") ||
            error.config?.url?.includes("/reviews")
          ) {
            this.publicAuthToken = null; // Clear cached public token
            // Retry with fresh public token
            const publicToken = await this.getPublicAuthToken();
            if (publicToken) {
              error.config.headers.Authorization = `Bearer ${publicToken}`;
              return this.api.request(error.config);
            }
          } else {
            // For user-specific endpoints, clear user token and redirect if needed
            this.clearStoredToken();
            if (
              window.location.pathname.startsWith("/dashboard") ||
              window.location.pathname.startsWith("/profile")
            ) {
              window.location.href = "/auth";
            }
          }
        }
        return Promise.reject(error);
      }
    );

    // Initialize public auth token on startup
    this.initializePublicAuth();
  }

  // ===== PUBLIC AUTH TOKEN =====
  private async initializePublicAuth(): Promise<void> {
    try {
      await this.getPublicAuthToken();
    } catch (error) {
      console.warn("Failed to initialize public auth token:", error);
    }
  }

  private async getPublicAuthToken(): Promise<string | null> {
    // Return cached token if available
    if (this.publicAuthToken) {
      return this.publicAuthToken;
    }

    try {
      const response = await axios.get(`${this.baseURL}/auth/me`, {
        headers: {
          "X-Elegant-Auth": this.elegantAuthKey,
          "Content-Type": "application/json",
        },
        timeout: 10000,
      });

      if (response.data?.authToken) {
        this.publicAuthToken = response.data.authToken;
        console.log("Public auth token obtained successfully");
        return this.publicAuthToken;
      }
    } catch (error) {
      console.error("Failed to get public auth token:", error);
    }

    return null;
  }

  // ===== TOKEN STORAGE (for user authentication) =====
  private getStoredToken(): string | null {
    return localStorage.getItem("auth_token");
  }

  private setStoredToken(token: string): void {
    localStorage.setItem("auth_token", token);
  }

  private clearStoredToken(): void {
    localStorage.removeItem("auth_token");
    localStorage.removeItem("user_data");
  }

  // ===== ERROR HANDLING =====
  handleApiError(error: any): string {
    if (error.response) {
      // Server responded with error status
      const status = error.response.status;
      const message =
        error.response.data?.message ||
        error.response.data?.error ||
        error.message;

      switch (status) {
        case 400:
          return message || "Invalid request. Please check your input.";
        case 401:
          return "Authentication failed. Please log in again.";
        case 403:
          return "Access denied. You don't have permission to perform this action.";
        case 404:
          return "Resource not found.";
        case 422:
          return message || "Validation error. Please check your input.";
        case 500:
          return "Server error. Please try again later.";
        default:
          return message || `An error occurred (${status})`;
      }
    } else if (error.request) {
      // Network error
      return "Network error. Please check your internet connection.";
    } else {
      // Other error
      return error.message || "An unexpected error occurred.";
    }
  }

  // ===== AUTH (User Authentication) =====
  async login(credentials: AuthCredentials): Promise<User> {
    try {
      const res = await this.api.post(`/auth/login`, credentials);

      const user = res.data;
      if (user.authToken) {
        this.setStoredToken(user.authToken);
        localStorage.setItem("user_data", JSON.stringify(user));
      }

      return user;
    } catch (err: any) {
      throw new Error(err.response?.data?.message || "Login failed");
    }
  }

  async signup(userData: SignupData): Promise<User> {
    try {
      const res = await this.api.post(`/auth/signup`, userData);

      const user = res.data;
      if (user.authToken) {
        this.setStoredToken(user.authToken);
        localStorage.setItem("user_data", JSON.stringify(user));
      }

      return user;
    } catch (err: any) {
      throw new Error(err.response?.data?.message || "Signup failed");
    }
  }

  logout(): void {
    this.clearStoredToken();
  }

  // ===== EVENTS (Now using public auth token automatically) =====
  async getEvents(filters?: EventFilters): Promise<Event[]> {
    try {
      const params = new URLSearchParams();

      if (filters?.search) params.append("search", filters.search);
      if (filters?.location) params.append("location", filters.location);
      if (filters?.itemType) params.append("item_type", filters.itemType);
      if (filters?.shopId) params.append("shops_id", filters.shopId);

      const res = await this.api.get(`/events?${params.toString()}`);
      return res.data;
    } catch (err) {
      console.error("Failed to fetch events", err);
      return [];
    }
  }

  async getEventById(id: number | string): Promise<Event | null> {
    try {
      const res = await this.api.get(`/events/${id}`);
      return res.data;
    } catch (err) {
      console.error("Failed to fetch event", err);
      return null;
    }
  }

  // ===== REVIEWS =====
  async getReviewsByItemId(
    itemId: number | string
  ): Promise<ReviewsResponse | null> {
    try {
      const res = await this.api.get(`/reviews?items_id=${itemId}`);
      return res.data;
    } catch (err) {
      console.error("Failed to fetch reviews", err);
      return null;
    }
  }

  // ===== MENUS =====
  // async getMenus(shopId: string): Promise<MenuItem[]> {
  //   try {
  //     const res = await this.api.get(`/menus/${shopId}`);
  //     return res.data;
  //   } catch (err) {
  //     console.error("Failed to fetch menus", err);
  //     return [];
  //   }
  // }

  // ==menus==

  async getMenus(): Promise<MenuItem[]> {
    try {
      const res = await this.api.get(`/menus`);
      return res.data;
    } catch (err) {
      console.error("Failed to fetch menus", err);
      return [];
    }
  }

  // ===== USER =====
  getCurrentUser(): User | null {
    try {
      const data = localStorage.getItem("user_data");
      return data ? JSON.parse(data) : null;
    } catch {
      return null;
    }
  }

  isAuthenticated(): boolean {
    return !!this.getStoredToken();
  }

  // ===== UTILITY =====
  // Method to manually refresh public auth token if needed
  async refreshPublicAuthToken(): Promise<boolean> {
    this.publicAuthToken = null;
    const token = await this.getPublicAuthToken();
    return !!token;
  }
}

export const apiService = new ApiService();
export default apiService;
