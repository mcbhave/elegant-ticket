import axios, { AxiosInstance } from "axios";

// ===== USER & AUTH TYPES =====
export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  created_at: string;
  auth_token?: string;
}

export interface AuthCredentials {
  email: string;
  password: string;
}

export interface SignupData extends AuthCredentials {
  name: string;
}

// ===== LOCATION & SHOP TYPES =====
export interface LocationPoint {
  latitude: number;
  longitude: number;
}

export interface Shop {
  id: string;
  name: string;
  logo?: string;
  description?: string;
  website?: string;
}

// ===== EVENT TYPES =====
export interface EventImage {
  id: number;
  items_id: number;
  file_url: string;
  alt_text?: string;
  is_primary?: boolean;
  display_image?: string;
}

export interface EventDetails {
  start_time: number;
  end_time: number;
  event_status: "active" | "cancelled" | "postponed" | "completed";
  url?: string;
  price: string;
  currency: string;
  performer_name: string;
  organizer_name: string;
  address: string;
  location: LocationPoint;
}

export interface Event {
  id: number;
  shops_id: string;
  item_type: string;
  title: string;
  description: string;
  SEO_Tags: string;
  created_at?: string;
  updated_at?: string;
  _events_seo_of_items?: EventDetails;
  _item_images_of_items?: EventImage[];
  _shops?: Shop;
}

export interface EventFilters {
  search?: string;
  location?: string;
  dateFrom?: string;
  dateTo?: string;
  priceMin?: number;
  priceMax?: number;
  itemType?: string;
  shopId?: string;
}

interface EventCardProps {
  event: Event;
  className?: string;
}

// ===== MENU TYPES =====
export interface MenuItem {
  id: string;
  title: string;
  url: string;
  order: number;
  is_active: boolean;
  created_at: number;
  shops_id: string;
  name: string;
  seq: number;
  display_name: string;
  is_visible: boolean;
  custom_url: string;
  Open_new_window: boolean;
}

//Review interface
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

// Reviews Response
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

// dynamic menu interface
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
  category: string;
  placement: string;
  image_url: string;
  background_color: string;
  font_color: string;
  _shop_info: Shops_Info; // Nested object
}

interface Shops_Info {
  id: number;
  shops_id: string;
  title: string;
  description: string;
  logo: string;
  menu_header_background_color: string;
  menu_footer_background_color: string;
  copyright_text: string;
}
// Updated ShopInfo interface to match API response
interface ShopInfo {
  id: number;
  created_at: number;
  shops_id: string;
  title: string;
  description: string;
  logo: string;
  seo_script_text: string | null;
  home_image_url: string;
  hide_home_image_url: boolean;
  home_background_color: string;
  header_1: string;
  header_1_font_color: string;
  header_2: string;
  header_2_font_color: string;
  header_3: string;
  header_3_font_color: string;
  header_4: string;
  header_4_font_color: string;
  header_5: string;
  header_5_font_color: string;
  header_6: string;
  menu_header_background_color: string;
  menu_footer_background_color: string;
  Items_categories_title: string;
  Items_categories_description: string;
  copyright_text: string;
  menu_header_font_color: string;
  menu_footer_font_color: string;
  _shops: {
    id: string;
    created_at: number;
    name: string;
    description: string;
    logo: string;
    custom_domain: string;
    Is_visible: boolean;
    slug: string;
  };
}

interface ProductFilters {
  search?: string;
  shopId?: string;
  item_type?: string;
}

// shop info interface
interface ShopInfo {
  id: number;
  created_at: number;
  shops_id: string;
  title: string;
  description: string;
  logo: string;
  seo_script_text: string | null;
  home_image_url: string;
  hide_home_image_url: boolean;
  home_background_color: string;
  header_1: string;
  header_1_font_color: string;
  header_2: string;
  header_2_font_color: string;
  header_3: string;
  header_3_font_color: string;
  header_4: string;
  header_4_font_color: string;
  header_5: string;
  header_5_font_color: string;
  header_6: string;
  menu_header_background_color: string;
  menu_footer_background_color: string;
  Items_categories_title: string;
  Items_categories_description: string;
  copyright_text: string;
  menu_header_font_color: string;
  menu_footer_font_color: string;
  // Add the nested _shops object
  _shops: {
    id: string;
    created_at: number;
    name: string;
    description: string;
    logo: string;
    custom_domain: string;
    Is_visible: boolean;
    slug: string;
  };
}

interface SearchResponse {
  itemsReceived: number;
  curPage: number;
  nextPage: number | null;
  prevPage: number | null;
  offset: number;
  perPage: number;
  items: Event[];
}

// Related Items Interface
interface RelatedItem {
  id: number;
  created_at: number;
  shops_id: string;
  items_id: number;
  related_items_id: number;
  related_item_type: string;
  seq: number;
  title: string;
  description: string;
  display_image: string;
  open_in_new_window: boolean;
  is_visible: boolean;
}

// Related Items Response Interface
interface RelatedItemsResponse {
  itemsReceived: number;
  curPage: number;
  nextPage: number | null;
  prevPage: number | null;
  offset: number;
  perPage: number;
  itemsTotal: number;
  pageTotal: number;
  items: RelatedItem[];
}

type ActionButton = {
  id: number;
  name: string;
  sharable_link: string;
  background_color: string;
  font_color: string;
  Is_visible: boolean;
  seq: number;
  open_in_new_window: boolean;
};

// Review interface for API data
interface ReviewData {
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

// Product interface matching your API response
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
    itemsReceived?: number;
    curPage?: number;
    nextPage?: number | null;
    prevPage?: number | null;
    offset?: number | null;
    perPage?: number | null;
  };
  _shops?: {
    id: string;
    created_at?: number;
    name: string;
    description: string;
    logo: string;
    custom_domain: string;
    Is_visible: boolean;
    slug: string;
  };
  _users?: {
    id: number;
    created_at?: number;
    name: string;
    email: string;
    role: string;
    api_key?: string;
    shops_id?: string;
  };
  _action_buttons?: any[];
}

interface ProductImage {
  id: number;
  shops_id?: string;
  items_id?: number;
  created_at?: number;
  display_image?: string;
  seq: number;
  image_type: string;
  Is_disabled: boolean;
}

interface HeaderProps {
  shopId?: string;
}
interface FooterProps {
  shopId?: string;
}

// ===== ADDITIONAL TYPES FROM TYPES FILE =====
export interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface EventPass {
  id: string;
  event_id: number;
  user_id: string;
  pass_type: string;
  quantity: number;
  total_price: number;
  currency: string;
  status: "active" | "used" | "cancelled" | "refunded";
  qr_code: string;
  purchase_date: string;
  event?: Event;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export interface AppState {
  auth: AuthState;
  events: Event[];
  filters: EventFilters;
  loading: boolean;
  error: string | null;
}

class ApiService {
  private api: AxiosInstance;
  private baseURL = import.meta.env.VITE_API_BASE_URL;
  private elegantAuthKey = import.meta.env.VITE_ELEGANT_AUTH_KEY;
  private apiTimeout = parseInt(import.meta.env.VITE_API_TIMEOUT) || 30000;
  private publicAuthToken: string | null = null;
  private currentDomain: string | null = null;

  constructor() {
    // Validate required environment variables
    if (!this.baseURL) {
      throw new Error(
        "VITE_API_BASE_URL is not defined in environment variables"
      );
    }

    if (!this.elegantAuthKey) {
      throw new Error(
        "VITE_ELEGANT_AUTH_KEY is not defined in environment variables"
      );
    }

    this.api = axios.create({
      baseURL: this.baseURL,
      timeout: this.apiTimeout,
      headers: {
        "Content-Type": "application/json",
      },
    });

    // Request interceptor to handle tokens
    this.api.interceptors.request.use(
      async (config) => {
        // Add domain header with port
        if (typeof window !== "undefined") {
          const domain = this.extractDomainWithPort();
          config.headers["X-Elegant-Domain"] = domain;
        }

        // For events, reviews, menus, and products endpoints, use public auth token
        if (
          config.url?.includes("/events") ||
          config.url?.includes("/reviews") ||
          config.url?.includes("/menus") ||
          config.url?.includes("/products") ||
          config.url?.includes("/shops_info") ||
          config.url?.includes("/items/") ||
          config.url?.includes("/related_items")
        ) {
          const publicToken = await this.getPublicAuthToken();
          if (publicToken) {
            config.headers.Authorization = `Bearer ${publicToken}`;
            return config;
          }
        }

        // For other endpoints, try to get Clerk token first, then fallback to stored token
        const clerkToken = await this.getClerkToken();
        if (clerkToken) {
          config.headers.Authorization = `Bearer ${clerkToken}`;
        } else {
          const userToken = this.getStoredToken();
          if (userToken) {
            config.headers.Authorization = `Bearer ${userToken}`;
          }
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
            error.config?.url?.includes("/products") ||
            error.config?.url?.includes("/shops_info") ||
            error.config?.url?.includes("/items/") ||
            error.config?.url?.includes("/related_items")
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

  // ===== DOMAIN EXTRACTION for testing=====
  private extractDomainWithPort(): string {
    if (typeof window === "undefined") return "";

    let domain = window.location.hostname;

    return domain;
  }
  // New method to get Clerk token
  private async getClerkToken(): Promise<string | null> {
    try {
      // Access Clerk's window object if available
      if (typeof window !== "undefined" && (window as any).Clerk) {
        const clerk = (window as any).Clerk;
        if (clerk.session) {
          return await clerk.session.getToken();
        }
      }
    } catch (error) {
      console.warn("Failed to get Clerk token:", error);
    }
    return null;
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
        timeout: 30000, // Increased timeout for auth as well
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
    console.warn("Direct login is deprecated. Use Clerk authentication.");
    throw new Error("Please use Clerk authentication components");
  }
  async signup(userData: SignupData): Promise<User> {
    console.warn("Direct signup is deprecated. Use Clerk authentication.");
    throw new Error("Please use Clerk authentication components");
  }

  logout(): void {
    this.clearStoredToken();
    // Let Clerk handle the actual sign out
    if (typeof window !== "undefined" && (window as any).Clerk) {
      (window as any).Clerk.signOut();
    }
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
    const maxRetries = 3;
    let retryCount = 0;

    while (retryCount < maxRetries) {
      try {
        const res = await this.api.get(`/events/${id}`, {
          timeout: 45000, // 45 seconds for individual event requests
        });
        return res.data;
      } catch (err: any) {
        retryCount++;

        if (err.code === "ECONNABORTED" && retryCount < maxRetries) {
          console.warn(
            `Attempt ${retryCount} failed for event ${id}, retrying...`
          );
          // Wait before retrying (exponential backoff)
          await new Promise((resolve) =>
            setTimeout(resolve, 1000 * retryCount)
          );
          continue;
        }

        console.error("Failed to fetch event", err);
        return null;
      }
    }

    return null;
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
  async getShopById(shopId?: string): Promise<any> {
    try {
      const res = await this.api.get(`/shops/${shopId}`);
      return res.data;
    } catch (err) {
      console.error("Failed to fetch shop", err);
      return null;
    }
  }

  // ===== USER =====
  getCurrentUser(): User | null {
    // First try to get user from Clerk
    if (typeof window !== "undefined" && (window as any).Clerk) {
      const clerk = (window as any).Clerk;
      if (clerk.user) {
        return {
          id: clerk.user.id,

          email: clerk.user.emailAddresses[0]?.emailAddress || "",
          name: clerk.user.fullName || clerk.user.firstName || "",
          avatar: clerk.user.imageUrl,
          created_at: clerk.user.createdAt?.toISOString() || "",
        };
      }
    }

    // Fallback to localStorage
    try {
      const data = localStorage.getItem("user_data");
      return data ? JSON.parse(data) : null;
    } catch {
      return null;
    }
  }

  isAuthenticated(): boolean {
    // Check Clerk authentication first
    if (typeof window !== "undefined" && (window as any).Clerk) {
      return !!(window as any).Clerk.session;
    }
    // Fallback to stored token
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

  // shop info

  async getShopsInfo(): Promise<ShopInfo | null> {
    try {
      const res = await this.api.get("/shops_info");
      return res.data;
    } catch (err) {
      console.error("Failed to fetch shops info", err);
      return null;
    }
  }

  // ===== SEARCH =====
  async searchItems(
    query: string,
    shopId?: string
  ): Promise<SearchResponse | null> {
    try {
      // Build the search URL
      let searchUrl = `/items/${encodeURIComponent(query)}`;

      // Add shopId as query parameter if provided
      if (shopId) {
        searchUrl += `?shops_id=${shopId}`;
      }

      const res = await this.api.get(searchUrl);
      return res.data;
    } catch (err) {
      console.error("Failed to search items", err);
      return null;
    }
  }

  //related items
  async getRelatedItems(
    itemId: number | string
  ): Promise<RelatedItemsResponse | null> {
    try {
      const res = await this.api.get(`/related_items/${itemId}`);
      return res.data;
    } catch (err) {
      console.error("Failed to fetch related items", err);
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

export type {
  RelatedItem,
  RelatedItemsResponse,
  SearchResponse,
  EventCardProps,
  ActionButton,
  ReviewData,
  ReviewsResponse,
  Product,
  ProductImage,
  DynamicMenu,
  HeaderProps,
  FooterProps,
  ShopInfo,
};
export const apiService = new ApiService();
export default apiService;
