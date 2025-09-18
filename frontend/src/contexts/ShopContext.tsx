// src/contexts/ShopContext.tsx
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
  isLoading: boolean;
  error: string | null;
  refetchShopData: () => Promise<void>;
}

const ShopContext = createContext<ShopContextType | undefined>(undefined);

export const ShopProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [shopData, setShopData] = useState<ShopInfo | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchShopData = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const data = await apiService.getShopsInfo();
      setShopData(data);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "An unknown error occurred";
      setError(errorMessage);
      console.error("Error fetching shop data:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const refetchShopData = async () => {
    await fetchShopData();
  };

  useEffect(() => {
    fetchShopData();
  }, []);

  const contextValue: ShopContextType = {
    shopData,
    isLoading,
    error,
    refetchShopData,
  };

  return (
    <ShopContext.Provider value={contextValue}>{children}</ShopContext.Provider>
  );
};

export const useShop = () => {
  const context = useContext(ShopContext);
  if (context === undefined) {
    throw new Error("useShop must be used within a ShopProvider");
  }
  return context;
};

export default ShopContext;
