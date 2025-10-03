import axios, { AxiosInstance } from "axios";

// ===== ALL YOUR EXISTING TYPES (keeping them as-is) =====

export interface ItemAddress {
  id: string;
  created_at: number;
  shops_id: string;
  items_id: number;
  addressType: string;
  seq: number;
  country: string;
  country_code: string;
  line1: string;
  line2: string;
  locality: string;
  postal_code: string;
  region: string;
  region_code: string;
  zip_code: string;
  zip_four: string;
  fulladdress: string;
  show_directions_button: boolean;
  Locations_text: string;
}

export interface ItemAddressesResponse {
  items: ItemAddress[];
  itemsReceived: number;
  curPage: number;
  nextPage: number | null;
  prevPage: number | null;
  offset: number | null;
  perPage: number | null;
  itemsTotal: number | null;
  pageTotal: number | null;
}
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
  slug: string;
  shops_id: string;
  item_type: string;
  title: string;
  description: string;
  SEO_Tags: string;
  created_at?: string;
  updated_at?: string;
  _events_seo_of_items?: EventDetails;
  _item_images_of_items?: {
    items?: EventImage[];
    itemsReceived?: number;
    curPage?: number;
    nextPage?: number | null;
    prevPage?: number | null;
    offset?: number | null;
    perPage?: number | null;
  };
  _item_addresses_of_items?: ItemAddressesResponse; // Add this new property
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
  _shop_info: Shops_Info;
}

interface Shops_Info {
  id: number;
  shops_id: string;
  title: string;
  description: string;
  logo: string;
  header_4: string;
  header_4_font_color: string;
  menu_header_background_color: string;
  menu_footer_background_color: string;
  copyright_text: string;
  user_dashboard_url: string;
  user_settings_url: string;
  user_shopping_cart_url: string;
  redirect_after_signup: string;
  redirect_after_signin: string;
  redirect_after_logout: string;
  user_dashboard_name: string;
  user_shopping_cart_name: string;
  user_setting_name: string;
  user_logout_name: string;
}

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
  header_7: string;
  header_7_font_color: string;
  header_7_background_color: string;
  header_8: string;
  header_8_font_color: string;
  header_9: string;
  header_9_font_color: string;
  header_9_background_color: string;
  menu_header_background_color: string;
  menu_footer_background_color: string;
  Items_categories_title: string;
  Items_categories_description: string;
  copyright_text: string;
  menu_header_font_color: string;
  menu_footer_font_color: string;
  user_dashboard_url: string;
  user_settings_url: string;
  user_shopping_cart_url: string;
  redirect_after_signup: string;
  redirect_after_signin: string;
  redirect_after_logout: string;
  user_dashboard_name: string;
  user_shopping_cart_name: string;
  user_setting_name: string;
  user_logout_name: string;
  _shop_action_buttons_of_shops?: {
    items: Array<{
      id: number;
      created_at: number;
      shops_id: string;
      name: string;
      redirect_url: string;
      Open_in_new_window: boolean;
      redirect_url_type: string;
      seq: number;
      background_color: string;
      font_color: string;
    }>;
    itemsReceived: number;
    curPage: number;
    nextPage: number | null;
    prevPage: number | null;
    offset: number | null;
    perPage: number | null;
    itemsTotal: number | null;
    pageTotal: number | null;
  };
  _shop_stats_of_shops?: Array<{
    id: number;
    created_at: number;
    shops_id: string;
    image_url: string;
    title: string;
    description: string;
    seq: number;
  }>;
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

interface SearchResponse {
  itemsReceived: number;
  curPage: number;
  nextPage: number | null;
  prevPage: number | null;
  offset: number;
  perPage: number;
  items: (Event | Product)[];
}

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

interface ItemCategory {
  id: number;
  created_at: number;
  shops_id: string;
  category_type: string;
  name: string;
  Is_visible: boolean;
  image_url: string;
  _shop_info: {
    id: number;
    shops_id: string;
    title: string;
    description: string;
    logo: string;
    Items_categories_title: string;
    Items_categories_description: string;
  };
}

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
// customerurl
interface CustomerUrls {
  id: string;
  created_at: number;
  elegant_user_id: string;
  external_dashbord_token: string;
  external_shopping_cart: string;
  external_settings: string;
}

// map
export interface ItemAddressNew {
  id: string;
  created_at: number;
  shops_id: string;
  items_id: number;
  addressType: string;
  seq: number;
  country: string;
  country_code: string;
  line1: string;
  line2: string;
  locality: string;
  postal_code: string;
  region: string;
  region_code: string;
  zip_code: string;
  zip_four: string;
  fulladdress: string;
  show_directions_button: boolean;
  Locations_text: string;
  latitude: string;
  longitude: string;
  gmapkey: string;
}

export interface ItemAddressesNewResponse {
  itemsReceived: number;
  curPage: number;
  nextPage: number | null;
  prevPage: number | null;
  offset: number;
  perPage: number;
  itemsTotal: number;
  pageTotal: number;
  items: ItemAddressNew[];
}

// Add these new cart-related interfaces
export interface CartItem {
  id: string;
  created_at: number;
  shops_id: string;
  cart_user_id: string;
  items_id: number;
  price: number;
  action_id: string;
  action_type: string;
  quantity: number;
  booking_slug: string;
}

export interface CartResponse {
  redirect_url: string;
  cart_item: CartItem[];
}

export interface CartItemsResponse {
  itemsReceived: number;
  curPage: number;
  nextPage: number | null;
  prevPage: number | null;
  offset: number;
  perPage: number;
  itemsTotal: number;
  pageTotal: number;
  items: CartItem[];
}

// ===== OPTIMIZED API SERVICE =====
class ApiService {
  private api: AxiosInstance;
  private baseURL = import.meta.env.VITE_API_BASE_URL;
  private elegantAuthKey = import.meta.env.VITE_ELEGANT_AUTH_KEY;
  private apiTimeout = parseInt(import.meta.env.VITE_API_TIMEOUT);
  private publicAuthToken: string | null = null;
  private currentDomain: string | null = null;

  // ===== CACHING =====
  private cache = new Map<string, { data: any; expiry: number }>();
  private readonly CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

  // ===== REQUEST DEDUPLICATION =====
  private pendingRequests = new Map<string, Promise<any>>();

  // ===== AUTH PROMISES =====
  private publicAuthPromise: Promise<string | null> | null = null;
  private clerkTokenPromise: Promise<string | null> | null = null;

  constructor() {
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

    this.setupInterceptors();
    this.initializePublicAuth();
  }

  // ===== CACHING UTILITIES =====
  private getCacheKey(url: string, params?: any): string {
    return `${url}${params ? `?${JSON.stringify(params)}` : ""}`;
  }

  private getFromCache<T>(key: string): T | null {
    const cached = this.cache.get(key);
    if (cached && cached.expiry > Date.now()) {
      return cached.data;
    }
    if (cached) {
      this.cache.delete(key); // Remove expired cache
    }
    return null;
  }

  private setCache<T>(key: string, data: T): void {
    this.cache.set(key, {
      data,
      expiry: Date.now() + this.CACHE_DURATION,
    });
  }

  private clearCacheByPattern(pattern: string): void {
    for (const [key] of this.cache) {
      if (key.includes(pattern)) {
        this.cache.delete(key);
      }
    }
  }

  // ===== DOMAIN EXTRACTION =====
  private extractDomainWithPort(): string {
    if (typeof window === "undefined") return "";
    return window.location.hostname;
  }

  // ===== OPTIMIZED TOKEN METHODS =====
  private async getClerkToken(): Promise<string | null> {
    // Return cached promise if already in progress
    if (this.clerkTokenPromise) {
      return this.clerkTokenPromise;
    }

    this.clerkTokenPromise = new Promise(async (resolve) => {
      try {
        if (typeof window !== "undefined" && (window as any).Clerk) {
          const clerk = (window as any).Clerk;
          if (clerk.session) {
            const token = await clerk.session.getToken();
            resolve(token);
            return;
          }
        }
        resolve(null);
      } catch (error) {
        console.warn("Failed to get Clerk token:", error);
        resolve(null);
      } finally {
        // Clear promise after 1 second to allow fresh attempts
        setTimeout(() => {
          this.clerkTokenPromise = null;
        }, 1000);
      }
    });

    return this.clerkTokenPromise;
  }

  private async getPublicAuthToken(): Promise<string | null> {
    // Return cached token if available and valid
    if (this.publicAuthToken) {
      return this.publicAuthToken;
    }

    // Return existing promise if in progress
    if (this.publicAuthPromise) {
      return this.publicAuthPromise;
    }

    this.publicAuthPromise = new Promise(async (resolve) => {
      try {
        const headers: Record<string, string> = {
          "X-Elegant-Auth": this.elegantAuthKey,
          "Content-Type": "application/json",
        };

        if (typeof window !== "undefined") {
          headers["X-Elegant-Domain"] = this.extractDomainWithPort();
        }

        const response = await axios.get(`${this.baseURL}/auth/me`, {
          headers,
          timeout: 10000, // Reduced timeout for auth
        });

        const responseDomain =
          response.headers["x-elegant-domain"] ||
          response.headers["X-Elegant-Domain"];
        if (responseDomain) {
          this.currentDomain = responseDomain;
        }

        if (response.data?.authToken) {
          this.publicAuthToken = response.data.authToken;
          resolve(this.publicAuthToken);
          return;
        }
        resolve(null);
      } catch (error) {
        console.error("Failed to get public auth token:", error);
        resolve(null);
      } finally {
        // Clear promise after completion
        this.publicAuthPromise = null;
      }
    });

    return this.publicAuthPromise;
  }

  // ===== OPTIMIZED INTERCEPTORS =====
  private setupInterceptors(): void {
    // Request interceptor
    this.api.interceptors.request.use(
      async (config) => {
        // Add domain header
        if (typeof window !== "undefined") {
          config.headers["X-Elegant-Domain"] = this.extractDomainWithPort();
        }

        // Determine which token to use based on endpoint
        const isPublicEndpoint = this.isPublicEndpoint(config.url || "");

        if (isPublicEndpoint) {
          const publicToken = await this.getPublicAuthToken();
          if (publicToken) {
            config.headers.Authorization = `Bearer ${publicToken}`;
          }
        } else {
          const clerkToken = await this.getClerkToken();
          if (clerkToken) {
            config.headers.Authorization = `Bearer ${clerkToken}`;
          } else {
            const userToken = this.getStoredToken();
            if (userToken) {
              config.headers.Authorization = `Bearer ${userToken}`;
            }
          }
        }

        return config;
      },
      (error) => Promise.reject(error)
    );

    // Response interceptor with improved error handling
    this.api.interceptors.response.use(
      (response) => response,
      async (error) => {
        if (error.response?.status === 401) {
          const isPublicEndpoint = this.isPublicEndpoint(
            error.config?.url || ""
          );

          if (isPublicEndpoint) {
            // Clear and retry public token
            this.publicAuthToken = null;
            const publicToken = await this.getPublicAuthToken();
            if (publicToken) {
              error.config.headers.Authorization = `Bearer ${publicToken}`;
              return this.api.request(error.config);
            }
          } else {
            // Clear user token and handle redirect
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
  }

  // ===== HELPER METHODS =====
  private isPublicEndpoint(url: string): boolean {
    return (
      url.includes("/events") ||
      url.includes("/reviews") ||
      url.includes("/menus") ||
      url.includes("/products") ||
      url.includes("/shops_info") ||
      url.includes("/items/") ||
      url.includes("/related_items") ||
      url.includes("/items_categories") ||
      url.includes("/customer_urls") ||
      url.includes("/cart_items") ||
      url.includes("/items_details") ||
      url.includes("/item_addresses") ||
      url.includes("/customer")
    );
  }

  private async initializePublicAuth(): Promise<void> {
    try {
      await this.getPublicAuthToken();
    } catch (error) {
      console.warn("Failed to initialize public auth token:", error);
    }
  }

  // ===== REQUEST DEDUPLICATION =====
  private async makeRequest<T>(
    key: string,
    requestFn: () => Promise<T>
  ): Promise<T> {
    // Check cache first
    const cached = this.getFromCache<T>(key);
    if (cached) {
      return cached;
    }

    // Check if request is already pending
    if (this.pendingRequests.has(key)) {
      return this.pendingRequests.get(key)!;
    }

    // Make new request
    const promise = requestFn();
    this.pendingRequests.set(key, promise);

    try {
      const result = await promise;
      this.setCache(key, result);
      return result;
    } finally {
      this.pendingRequests.delete(key);
    }
  }

  // ===== TOKEN STORAGE =====
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
      return "Network error. Please check your internet connection.";
    } else {
      return error.message || "An unexpected error occurred.";
    }
  }

  // ===== AUTH METHODS =====
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
    this.cache.clear(); // Clear all cached data
    if (typeof window !== "undefined" && (window as any).Clerk) {
      (window as any).Clerk.signOut();
    }
  }

  // ===== OPTIMIZED API METHODS =====
  async getEvents(filters?: EventFilters): Promise<Event[]> {
    const cacheKey = this.getCacheKey("/events", filters);

    return this.makeRequest(cacheKey, async () => {
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
    });
  }

  async getEventById(id: number | string): Promise<Event | null> {
    const cacheKey = this.getCacheKey(`/events/${id}`);

    return this.makeRequest(cacheKey, async () => {
      try {
        const res = await this.api.get(`/events/${id}`);
        return res.data;
      } catch (err) {
        console.error("Failed to fetch event", err);
        return null;
      }
    });
  }

  async getEventBySlug(slug: string): Promise<Event | null> {
    try {
      // Get events response (which may be an object with items property or direct array)
      const response = await this.getEvents();

      // Handle both response formats like in Events.tsx
      const events = Array.isArray(response) ? response : response.items || [];

      const eventWithSlug = events.find((event: Event) => event.slug === slug);

      if (!eventWithSlug) {
        return null;
      }

      // Then fetch full details using the existing getEventById method
      return this.getEventById(eventWithSlug.id);
    } catch (err) {
      console.error("Failed to fetch event by slug", err);
      return null;
    }
  }

  async getReviewsByItemId(
    itemId: number | string
  ): Promise<ReviewsResponse | null> {
    const cacheKey = this.getCacheKey(`/reviews`, { items_id: itemId });

    return this.makeRequest(cacheKey, async () => {
      try {
        const res = await this.api.get(`/reviews?items_id=${itemId}`);
        return res.data;
      } catch (err) {
        console.error("Failed to fetch reviews", err);
        return null;
      }
    });
  }

  // get map
  async getItemAddresses(
    itemId: number | string
  ): Promise<ItemAddressesNewResponse | null> {
    const cacheKey = this.getCacheKey(`/item_addresses/${itemId}`);

    return this.makeRequest(cacheKey, async () => {
      try {
        const res = await this.api.get(`/item_addresses/${itemId}`);
        return res.data;
      } catch (err) {
        console.error("Failed to fetch item addresses", err);
        return null;
      }
    });
  }

  async getMenus(shopId?: string): Promise<DynamicMenu[]> {
    const cacheKey = this.getCacheKey("/menus", { shopId });

    return this.makeRequest(cacheKey, async () => {
      try {
        const endpoint = shopId ? `/menus/${shopId}` : "/menus";
        const res = await this.api.get(endpoint);
        return res.data;
      } catch (err) {
        console.error("Failed to fetch menus", err);
        return [];
      }
    });
  }

  async getDynamicMenus(shopId?: string): Promise<DynamicMenu[]> {
    try {
      const menus = await this.getMenus(shopId);
      return menus
        .filter((menu) => menu.is_visible)
        .sort((a, b) => a.seq - b.seq);
    } catch (err) {
      console.error("Failed to fetch dynamic menus", err);
      return [];
    }
  }

  async getShopById(shopId?: string): Promise<any> {
    const cacheKey = this.getCacheKey(`/shops/${shopId}`);

    return this.makeRequest(cacheKey, async () => {
      try {
        const res = await this.api.get(`/shops/${shopId}`);
        return res.data;
      } catch (err) {
        console.error("Failed to fetch shop", err);
        return null;
      }
    });
  }

  getCurrentUser(): User | null {
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

    try {
      const data = localStorage.getItem("user_data");
      return data ? JSON.parse(data) : null;
    } catch {
      return null;
    }
  }

  isAuthenticated(): boolean {
    if (typeof window !== "undefined" && (window as any).Clerk) {
      return !!(window as any).Clerk.session;
    }
    return !!this.getStoredToken();
  }

  async getProducts(filters?: ProductFilters): Promise<Product[]> {
    const cacheKey = this.getCacheKey("/products", filters);

    return this.makeRequest(cacheKey, async () => {
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
    });
  }

  async getProductById(id: number | string): Promise<Product | null> {
    const cacheKey = this.getCacheKey(`/products/${id}`);

    return this.makeRequest(cacheKey, async () => {
      try {
        const res = await this.api.get(`/products/${id}`);
        return res.data;
      } catch (err) {
        console.error("Failed to fetch product", err);
        return null;
      }
    });
  }

  //slug product
  async getProductBySlug(slug: string): Promise<Product | null> {
    try {
      const res = await this.api.get(`/items_details/${slug}`);

      let productData;
      if (Array.isArray(res.data)) {
        productData = res.data[0];
      } else {
        productData = res.data;
      }

      return productData || null;
    } catch (err) {
      console.error("Failed to fetch product by slug", err);
      return null;
    }
  }

  async getItemsCategories(shopId?: string): Promise<ItemCategory[]> {
    const cacheKey = this.getCacheKey("/items_categories", { shopId });

    return this.makeRequest(cacheKey, async () => {
      try {
        const params = new URLSearchParams();
        if (shopId) params.append("shops_id", shopId);

        const endpoint = params.toString()
          ? `/items_categories?${params.toString()}`
          : "/items_categories";
        const res = await this.api.get(endpoint);

        return res.data
          .filter((category: ItemCategory) => category.Is_visible)
          .sort((a: ItemCategory, b: ItemCategory) =>
            a.name.localeCompare(b.name)
          );
      } catch (err) {
        console.error("Failed to fetch items categories", err);
        return [];
      }
    });
  }

  // customers url get function
  async getCustomerUrls(): Promise<CustomerUrls | null> {
    // Don't cache this as it's user-specific
    try {
      const user = this.getCurrentUser();
      if (!user || !user.id) {
        console.warn("No user found for customer URLs request");
        return null;
      }

      const headers: Record<string, string> = {
        "x-elegant-userid": user.id,
      };

      const res = await this.api.get("/customer_urls", { headers });

      return res.data;
    } catch (err) {
      return null;
    }
  }

  async getShopsInfo(): Promise<ShopInfo | null> {
    const cacheKey = this.getCacheKey("/shops_info");

    return this.makeRequest(cacheKey, async () => {
      try {
        const res = await this.api.get("/shops_info");
        return res.data;
      } catch (err) {
        console.error("Failed to fetch shops info", err);
        return null;
      }
    });
  }

  async searchItems(
    query: string,
    shopId?: string
  ): Promise<SearchResponse | null> {
    const cacheKey = this.getCacheKey(`/items/${query}`, { shopId });

    return this.makeRequest(cacheKey, async () => {
      try {
        let searchUrl = `/items/${encodeURIComponent(query)}`;
        if (shopId) {
          searchUrl += `?shops_id=${shopId}`;
        }

        const res = await this.api.get(searchUrl);
        return res.data;
      } catch (err) {
        console.error("Failed to search items", err);
        return null;
      }
    });
  }

  async getRelatedItems(
    itemId: number | string
  ): Promise<RelatedItemsResponse | null> {
    const cacheKey = this.getCacheKey(`/related_items/${itemId}`);

    return this.makeRequest(cacheKey, async () => {
      try {
        const res = await this.api.get(`/related_items/${itemId}`);
        return res.data;
      } catch (err) {
        console.error("Failed to fetch related items", err);
        return null;
      }
    });
  }

  // Add these methods inside the ApiService class

  // ===== USER ID MANAGEMENT =====
  private generateTempUserId(): string {
    return `temp_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private getCurrentUserId(): string {
    // First try to get Clerk user ID
    const user = this.getCurrentUser();
    if (user?.id) {
      return user.id;
    }

    // If no Clerk user, get or create temp ID
    let tempId = localStorage.getItem("tempCartUserId");
    if (!tempId) {
      tempId = this.generateTempUserId();
      localStorage.setItem("tempCartUserId", tempId);
    }
    return tempId;
  }

  // ===== CART METHODS =====
  async addToCart(
    itemsId: number,
    actionButtonsId: number,
    shopsId: string,
    price: number = 0
  ): Promise<any> {
    try {
      const user = this.getCurrentUser();
      const payload = {
        shops_id: shopsId,
        items_id: itemsId,
        action_id: actionButtonsId.toString(),
        action_type: "Add to cart",
      };

      if (user?.id) {
        // CRITICAL: Ensure customer exists BEFORE adding to cart
        const customerExists = await this.ensureCustomerExists(user.id);
        if (!customerExists) {
          throw new Error("Failed to initialize customer account");
        }

        // Authenticated user - add user ID header
        const headers: Record<string, string> = {
          "x-elegant-userid": user.id,
        };
        const res = await this.api.post("/cart_items", payload, { headers });
        this.clearCacheByPattern("/cart_items");
        return res.data;
      } else {
        // Anonymous user - use localStorage
        const localCart = this.getLocalCart();
        const existingItemIndex = localCart.findIndex(
          (item) =>
            item.items_id === itemsId &&
            item.action_id === actionButtonsId.toString()
        );

        if (existingItemIndex > -1) {
          localCart[existingItemIndex].quantity += 1;
        } else {
          const newItem: CartItem = {
            id: `temp_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            created_at: Date.now(),
            shops_id: shopsId,
            cart_user_id: "anonymous",
            items_id: itemsId,
            price: price,
            action_id: actionButtonsId.toString(),
            action_type: "Add to cart",
            quantity: 1,
            booking_slug: "",
          };
          localCart.push(newItem);
        }

        this.setLocalCart(localCart);
        return {
          redirect_url: "",
          cart_item: [localCart[localCart.length - 1]],
        };
      }
    } catch (err: any) {
      console.error("Failed to add item to cart", err);
      throw new Error(this.handleApiError(err));
    }
  }

  async getCartItems(): Promise<CartItemsResponse> {
    try {
      const user = this.getCurrentUser();

      if (user?.id) {
        // Wait for auth token to be ready
        await this.getClerkToken();

        // CRITICAL: Ensure customer exists BEFORE fetching cart
        const customerExists = await this.ensureCustomerExists(user.id);
        if (!customerExists) {
          console.error("Customer creation failed");
          // Clear localStorage and return empty cart
          localStorage.removeItem("anonymousCart");
          return {
            itemsReceived: 0,
            curPage: 1,
            nextPage: null,
            prevPage: null,
            offset: 0,
            perPage: 25,
            itemsTotal: 0,
            pageTotal: 1,
            items: [],
          };
        }

        const headers: Record<string, string> = {
          "x-elegant-userid": user.id,
        };

        const res = await this.api.get("/cart_items", { headers });

        // CRITICAL: Always clear localStorage when we successfully get API data
        // This ensures we never mix temp IDs with real UUIDs
        localStorage.removeItem("anonymousCart");
        localStorage.removeItem("tempCartUserId");

        return res.data;
      } else {
        // Anonymous user - return localStorage cart

        return this.getLocalCartAsApiFormat();
      }
    } catch (err: any) {
      console.error("Failed to fetch cart items", err);

      const user = this.getCurrentUser();

      // If 404, it means empty cart
      if (err.response?.status === 404) {
        // Clear localStorage for logged-in users
        if (user?.id) {
          localStorage.removeItem("anonymousCart");
          localStorage.removeItem("tempCartUserId");
        }

        return {
          itemsReceived: 0,
          curPage: 1,
          nextPage: null,
          prevPage: null,
          offset: 0,
          perPage: 25,
          itemsTotal: 0,
          pageTotal: 1,
          items: [],
        };
      }

      // For logged-in users with errors, return empty cart (DON'T use localStorage)
      if (user?.id) {
        console.error(
          "Error for logged-in user - returning empty cart, NOT localStorage"
        );
        localStorage.removeItem("anonymousCart");
        localStorage.removeItem("tempCartUserId");
        return {
          itemsReceived: 0,
          curPage: 1,
          nextPage: null,
          prevPage: null,
          offset: 0,
          perPage: 25,
          itemsTotal: 0,
          pageTotal: 1,
          items: [],
        };
      }

      // Only for anonymous users - fallback to localStorage
      console.warn("Anonymous user - using localStorage");
      return this.getLocalCartAsApiFormat();
    }
  }
  private setLocalCart(items: CartItem[]): void {
    localStorage.setItem("anonymousCart", JSON.stringify(items));
  }
  private getLocalCartAsApiFormat(): CartItemsResponse {
    const localCart = this.getLocalCart();
    return {
      itemsReceived: localCart.length,
      curPage: 1,
      nextPage: null,
      prevPage: null,
      offset: 0,
      perPage: 25,
      itemsTotal: localCart.length,
      pageTotal: 1,
      items: localCart,
    };
  }
  private getLocalCart(): CartItem[] {
    try {
      const cart = localStorage.getItem("anonymousCart");
      return cart ? JSON.parse(cart) : [];
    } catch {
      return [];
    }
  }

  async transferCartToUser(): Promise<boolean> {
    try {
      const user = this.getCurrentUser();
      if (!user?.id) {
        return true;
      }

      const localCart = this.getLocalCart();
      if (localCart.length === 0) {
        return true;
      }

      // Get the temporary user ID that was used for anonymous cart
      const tempUserId = localStorage.getItem("tempCartUserId");

      // Step 1: Transfer each item to the authenticated user's cart
      const headers = { "x-elegant-userid": user.id };
      let successCount = 0;

      for (const item of localCart) {
        try {
          const payload = {
            shops_id: item.shops_id,
            items_id: item.items_id,
            action_id: item.action_id,
            action_type: item.action_type,
          };

          await this.api.post("/cart_items", payload, { headers });
          successCount++;
        } catch (itemError) {
          console.warn("Failed to transfer cart item:", item.id, itemError);
        }
      }

      // Step 2: Delete old cart items from the temporary user ID (if we had one)
      if (tempUserId) {
        try {
          const deleteHeaders = { "x-elegant-userid": tempUserId };
          await this.api.delete("/cart_items", { headers: deleteHeaders });

          localStorage.removeItem("tempCartUserId");
        } catch (deleteError) {
          console.warn("Failed to delete old cart items:", deleteError);
          // Don't fail the whole process if delete fails
        }
      }

      // Step 3: Clean up localStorage
      if (successCount > 0) {
        localStorage.removeItem("anonymousCart");
        this.clearCacheByPattern("/cart_items");
      }

      return successCount > 0;
    } catch (error) {
      console.error("Failed to transfer cart:", error);
      return false;
    }
  }

  getCartItemCount(): Promise<number> {
    return this.getCartItems().then((response) => response.itemsTotal || 0);
  }

  async ensureCustomerExists(clerkUserId: string): Promise<boolean> {
    try {
      const headers: Record<string, string> = {
        "x-elegant-userid": clerkUserId,
      };

      try {
        // First, try to check if customer exists by fetching cart (which requires customer)
        // If this succeeds, customer already exists
        await this.api.get("/cart_items", { headers });

        return true;
      } catch (checkError: any) {
        // If 404, customer doesn't exist yet, create it
        if (
          checkError.response?.status === 404 &&
          checkError.response?.data?.message === "Customer not found"
        ) {
          try {
            const response = await this.api.post(
              "/customer",
              {
                elegant_user_id: clerkUserId,
                external_dashbord_token: "",
                external_shopping_cart: "",
                external_settings: "",
                external_token: "",
                customer_number: 0,
                Full_name: "",
              },
              { headers }
            );

            return true;
          } catch (createError: any) {
            // If 409/400, customer was created by another request, that's fine
            if (
              createError.response?.status === 409 ||
              createError.response?.status === 400
            ) {
              return true;
            }
            console.error(
              "Failed to create customer:",
              createError.response?.data
            );
            return false;
          }
        }

        // Some other error occurred
        console.error(
          "Unexpected error checking customer:",
          checkError.response?.data
        );
        return false;
      }
    } catch (error) {
      console.error("Error in ensureCustomerExists:", error);
      return false;
    }
  }

  // checkout items
  async checkoutCart(): Promise<{
    redirect_url: string;
    result1: CartItem[];
  } | null> {
    try {
      const user = this.getCurrentUser();

      if (!user?.id) {
        throw new Error("Please sign in to complete checkout");
      }

      const headers: Record<string, string> = {
        "x-elegant-userid": user.id,
      };

      // Change from GET to POST
      const res = await this.api.post("/cart_items/check_out", {}, { headers });
      this.clearCacheByPattern("/cart_items");
      return res.data;
    } catch (err: any) {
      console.error("Failed to checkout", err);
      throw new Error(this.handleApiError(err));
    }
  }

  async removeFromCart(cartItemId: string): Promise<boolean> {
    try {
      const user = this.getCurrentUser();

      if (user?.id) {
        // Authenticated user - use API
        const headers: Record<string, string> = {
          "x-elegant-userid": user.id,
        };

        await this.api.delete(`/cart_items/${cartItemId}`, { headers });
        this.clearCacheByPattern("/cart_items");
        return true;
      } else {
        // Anonymous user - remove from localStorage
        const localCart = this.getLocalCart();
        const filteredCart = localCart.filter((item) => item.id !== cartItemId);
        this.setLocalCart(filteredCart);
        return true;
      }
    } catch (err: any) {
      console.error("Failed to remove cart item", err);
      throw new Error(this.handleApiError(err));
    }
  }

  // Alternative clearCart if DELETE /cart_items doesn't exist
  async clearCart(): Promise<boolean> {
    try {
      const user = this.getCurrentUser();

      if (user?.id) {
        // Get all cart items
        const cartResponse = await this.getCartItems();
        const items = cartResponse.items;

        // Delete each item individually
        const headers: Record<string, string> = {
          "x-elegant-userid": user.id,
        };

        for (const item of items) {
          await this.api.delete(`/cart_items/${item.id}`, { headers });
        }

        this.clearCacheByPattern("/cart_items");
        return true;
      } else {
        // Anonymous user - clear localStorage
        localStorage.removeItem("anonymousCart");
        return true;
      }
    } catch (err: any) {
      console.error("Failed to clear cart", err);
      throw new Error(this.handleApiError(err));
    }
  }

  // ===== UTILITY METHODS =====
  async refreshPublicAuthToken(): Promise<boolean> {
    this.publicAuthToken = null;
    this.publicAuthPromise = null;
    const token = await this.getPublicAuthToken();
    return !!token;
  }

  getCurrentDomain(): string | null {
    return this.currentDomain;
  }

  setCurrentDomain(domain: string): void {
    this.currentDomain = domain;
  }

  // ===== CACHE MANAGEMENT =====
  clearCache(): void {
    this.cache.clear();
  }

  clearCacheForEndpoint(endpoint: string): void {
    this.clearCacheByPattern(endpoint);
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
  ItemCategory,
  CustomerUrls,
};

export const apiService = new ApiService();
export default apiService;
