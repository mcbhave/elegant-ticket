// Event Management Platform Types

export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  created_at: string;
  auth_token?: string;
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

export interface AuthCredentials {
  email: string;
  password: string;
}

export interface SignupData extends AuthCredentials {
  name: string;
}

export interface MenuItem {
  id: string;
  title: string;
  url: string;
  order: number;
  is_active: boolean;
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

export interface MenuItem {
  id: string;
  created_at: number;
  shops_id: string;
  name: string;
  seq: number;
  display_name: string;
  is_visible: boolean;
  custom_url: string;
  Open_new_window: boolean;
}

// export interface MenuItem {
//   id: string;
//   created_at: number;
//   shops_id: string;
//   name: string;
//   seq: number;
//   display_name: string;
//   is_visible: boolean;
//   custom_url: string;
//   Open_new_window: boolean;
//   _shops?: {
//     custom_domain: string;
//   };
// }
