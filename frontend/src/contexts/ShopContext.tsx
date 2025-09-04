import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { apiService, ShopInfo } from "@/services/api";

interface ShopContextType {
  shopData: ShopInfo | null;
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
  const [shopData, setShopData] = useState<ShopInfo | null>(null);
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
