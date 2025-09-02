import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { apiService } from "@/services/api";

interface ShopData {
  id: number;
  created_at: number;
  shops_id: string;
  title: string;
  description: string;
  logo: string;
  seo_script_text: string;
  home_image_url?: string;
  hide_home_image_url?: boolean;
  home_background_color?: string;
  header_1?: string;
  header_1_font_color?: string;
  header_2?: string;
  header_2_font_color?: string;
  header_3?: string;
  header_3_font_color?: string;
  header_4?: string;
  header_4_font_color?: string;
  header_5?: string;
  header_5_font_color?: string;
  header_6?: string;
  menu_header_background_color?: string;
  menu_footer_background_color?: string;
  Items_categories_title?: string;
  Items_categories_description?: string;
  copyright_text?: string;
  menu_header_font_color?: string;
  menu_footer_font_color?: string;
  _shop_action_buttons_of_shops?: {
    items: Array<{
      id: number;
      name: string;
      redirect_url: string;
      redirect_url_type: string;
      Open_in_new_window: boolean;
      seq: number;
    }>;
  };
}

interface ShopContextType {
  shopData: ShopData | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

const ShopContext = createContext<ShopContextType | undefined>(undefined);

export const useShop = () => {
  const context = useContext(ShopContext);
  if (context === undefined) {
    throw new Error("useShop must be used within a ShopProvider");
  }
  return context;
};

interface ShopProviderProps {
  children: ReactNode;
}

export const ShopProvider: React.FC<ShopProviderProps> = ({ children }) => {
  const [shopData, setShopData] = useState<ShopData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchShopData = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await apiService.getShopsInfo();
      if (data) {
        setShopData(data);
      }
    } catch (err: any) {
      console.error("Failed to fetch shop data:", err);
      setError(err.message || "Failed to fetch shop data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchShopData();
  }, []);

  const value: ShopContextType = {
    shopData,
    loading,
    error,
    refetch: fetchShopData,
  };

  return <ShopContext.Provider value={value}>{children}</ShopContext.Provider>;
};

export type { ShopData };
