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

// Add dynamic menu interface
interface DynamicMenu {
  id: number;
  created_at: number;
  shops_id: string;
  name: string;
  seq: number;
  display_name: string;
  is_visible: boolean;
  custom_url: string;
  Open_new_window: boolean;
}

//products
interface Product {
  id: number;
  shops_id: string;
  item_type: string;
  Is_disabled: boolean;
  created_at: number;
  title: string;
  description: string;
  SEO_Tags?: string;
  tags?: string;
  _item_images_of_items?: {
    items?: ProductImage[];
  };
  _shops?: {
    id: string;
    name: string;
    description: string;
    logo: string;
    custom_domain: string;
    Is_visible: boolean;
    slug: string;
  };
  _users?: {
    id: number;
    name: string;
    email: string;
    role: string;
  };
}

interface ProductImage {
  id: number;
  display_image?: string;
  seq: number;
  image_type: string;
  Is_disabled: boolean;
}

interface ProductFilters {
  search?: string;
  shopId?: string;
  item_type?: string;
}

class ApiService {
  private api: AxiosInstance;
  private baseURL = "https://x8ki-letl-twmt.n7.xano.io/api:2duosZ1Y";
  private elegantAuthKey = "9a6f1d3e-2c4b-4f8a-8e7d-3b2c9f1a6d5e";
  private publicAuthToken: string | null = null;
  private currentDomain: string | null = null; // Store domain from response header

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
        // Add domain header with port (ONLY CHANGE from your working code)
        if (typeof window !== "undefined") {
          const domain = this.extractDomainWithPort();
          config.headers["X-Elegant-Domain"] = domain;
        }

        // For events, reviews, menus, and products endpoints, use public auth token
        if (
          config.url?.includes("/events") ||
          config.url?.includes("/reviews") ||
          config.url?.includes("/menus") ||
          config.url?.includes("/products")
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

    // Handle 401 errors (keeping your exact working logic)
    this.api.interceptors.response.use(
      (response) => response,
      async (error) => {
        if (error.response?.status === 401) {
          // If it's an events, reviews, menus, or products request that failed, try to refresh public token
          if (
            error.config?.url?.includes("/events") ||
            error.config?.url?.includes("/reviews") ||
            error.config?.url?.includes("/menus") ||
            error.config?.url?.includes("/products")
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

  // ===== DOMAIN EXTRACTION (NEW METHOD) =====
  private extractDomainWithPort(): string {
    if (typeof window === "undefined") return "";

    let domain = window.location.hostname;

    // Add port if it's not the default ports (80 for http, 443 for https)
    if (
      window.location.port &&
      window.location.port !== "80" &&
      window.location.port !== "443"
    ) {
      domain += `:${window.location.port}`;
    }

    return domain;
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
      // Add domain header to auth/me request as well
      const headers: Record<string, string> = {
        "X-Elegant-Auth": this.elegantAuthKey,
        "Content-Type": "application/json",
      };

      // Add domain header to auth/me request
      if (typeof window !== "undefined") {
        headers["X-Elegant-Domain"] = this.extractDomainWithPort();
      }

      const response = await axios.get(`${this.baseURL}/auth/me`, {
        headers,
        timeout: 10000,
      });

      // Extract domain from response headers
      const responseDomain =
        response.headers["x-elegant-domain"] ||
        response.headers["X-Elegant-Domain"];
      if (responseDomain) {
        this.currentDomain = responseDomain;
        console.log("Domain received from server:", responseDomain);
      }

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

  // ===== DOMAIN GETTER =====
  public getCurrentDomain(): string | null {
    return this.currentDomain;
  }

  // Method to manually set domain (if needed)
  public setCurrentDomain(domain: string): void {
    this.currentDomain = domain;
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
  async getMenus(shopId?: string): Promise<DynamicMenu[]> {
    try {
      const endpoint = shopId ? `/menus/${shopId}` : "/menus";
      const res = await this.api.get(endpoint);
      return res.data;
    } catch (err) {
      console.error("Failed to fetch menus", err);
      return [];
    }
  }

  // ===== DYNAMIC MENUS (New method specifically for dynamic menus) =====
  async getDynamicMenus(shopId?: string): Promise<DynamicMenu[]> {
    try {
      const menus = await this.getMenus(shopId);
      // Filter visible menus and sort by sequence
      return menus
        .filter((menu) => menu.is_visible)
        .sort((a, b) => a.seq - b.seq);
    } catch (err) {
      console.error("Failed to fetch dynamic menus", err);
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

  // products function
  async getProducts(filters?: ProductFilters): Promise<Product[]> {
    try {
      const params = new URLSearchParams();

      if (filters?.search) params.append("search", filters.search);
      if (filters?.shopId) params.append("shops_id", filters.shopId);
      if (filters?.item_type) params.append("item_type", filters.item_type);

      const res = await this.api.get(`/products?${params.toString()}`);
      return res.data;
    } catch (err) {
      console.error("Failed to fetch products", err);
      return [];
    }
  }

  async getProductById(id: number | string): Promise<Product | null> {
    try {
      const res = await this.api.get(`/products/${id}`);
      return res.data;
    } catch (err) {
      console.error("Failed to fetch product", err);
      return null;
    }
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
