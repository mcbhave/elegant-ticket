import axios, { AxiosInstance } from "axios";
import {
  User,
  Event,
  AuthCredentials,
  SignupData,
  MenuItem,
  EventFilters,
} from "@/types";

class ApiService {
  private api: AxiosInstance;
  private baseURL = "https://x8ki-letl-twmt.n7.xano.io/api:2duosZ1Y";

  constructor() {
    this.api = axios.create({
      baseURL: this.baseURL,
      timeout: 10000,
      headers: {
        "Content-Type": "application/json",
      },
    });

    // Attach token to requests
    this.api.interceptors.request.use(
      (config) => {
        const token = this.getStoredToken();
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Handle 401 errors
    this.api.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          this.clearStoredToken();
          window.location.href = "/auth";
        }
        return Promise.reject(error);
      }
    );
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

  // ===== AUTH =====
  async login(credentials: AuthCredentials): Promise<User> {
    try {
      const res = await this.api.post(
        `${this.baseURL}/auth/login`,
        credentials
      );

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
      const res = await this.api.post(`${this.baseURL}/auth/signup`, userData);

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

  // ===== EVENTS =====
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

  // ===== MENUS =====
  async getMenus(shopId: string): Promise<MenuItem[]> {
    try {
      const res = await this.api.get(`/menus/${shopId}`);
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
}

export const apiService = new ApiService();
export default apiService;
