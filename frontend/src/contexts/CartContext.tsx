// src/contexts/CartContext.tsx
import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { apiService } from "@/services/api";

interface CartItem {
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

interface CartContextType {
  cartItems: CartItem[];
  itemCount: number; // Changed from cartCount to itemCount
  isLoading: boolean;
  addToCart: (
    itemsId: number,
    actionButtonsId: number,
    shopsId: string,
    price?: number
  ) => Promise<{ success: boolean; redirect_url?: string; error?: string }>;
  removeFromCart: (cartItemId: string) => Promise<boolean>;
  clearCart: () => Promise<boolean>;
  refreshCart: () => Promise<void>; // Changed from refetchCart
  transferGuestCart: () => Promise<boolean>; // Changed from migrateGuestCart
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [itemCount, setItemCount] = useState(0); // Changed from cartCount
  const [isLoading, setIsLoading] = useState(false);

  // Fetch cart items using the actual API
  const fetchCart = async () => {
    try {
      setIsLoading(true);
      const cartData = await apiService.getCartItems();
      setCartItems(cartData.items || []);
      setItemCount(cartData.itemsTotal || 0);
    } catch (error) {
      console.error("Failed to fetch cart:", error);
      setCartItems([]);
      setItemCount(0);
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch cart on component mount
  useEffect(() => {
    fetchCart();
  }, []);

  const addToCart = async (
    itemsId: number,
    actionButtonsId: number,
    shopsId: string,
    price: number = 0
  ): Promise<{ success: boolean; redirect_url?: string; error?: string }> => {
    try {
      const response = await apiService.addToCart(
        itemsId,
        actionButtonsId,
        shopsId,
        price
      );

      // Refresh cart to get accurate count
      await fetchCart();

      return {
        success: true,
        redirect_url: response?.redirect_url,
      };
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Failed to add item to cart. Please try again.";

      return {
        success: false,
        error: errorMessage,
      };
    }
  };

  const removeFromCart = async (cartItemId: string): Promise<boolean> => {
    try {
      // TODO: Implement DELETE endpoint for cart items
      // await apiService.removeFromCart(cartItemId);

      setCartItems((prev) => prev.filter((item) => item.id !== cartItemId));
      setItemCount((prev) => prev - 1);

      return true;
    } catch (error) {
      console.error("Failed to remove item from cart:", error);
      return false;
    }
  };

  const clearCart = async (): Promise<boolean> => {
    try {
      // TODO: Implement DELETE endpoint to clear all cart items
      // await apiService.clearCart();

      setCartItems([]);
      setItemCount(0);

      return true;
    } catch (error) {
      console.error("Failed to clear cart:", error);
      return false;
    }
  };

  const refreshCart = async () => {
    await fetchCart();
  };

  const transferGuestCart = async (): Promise<boolean> => {
    try {
      const success = await apiService.transferCartToUser();
      if (success) {
        await fetchCart(); // Refresh cart after transfer
      }
      return success;
    } catch (error) {
      console.error("Failed to transfer guest cart:", error);
      return false;
    }
  };

  // Auto-refresh cart when user authentication changes
  // Handle authentication changes and cart transfer
  useEffect(() => {
    const handleAuthChange = async () => {
      const user = apiService.getCurrentUser();
      if (user?.id) {
        // User is authenticated - first transfer cart, then fetch
        const localCart = JSON.parse(
          localStorage.getItem("anonymousCart") || "[]"
        );

        if (localCart.length > 0) {
          console.log("Transferring cart items on auth change...");
          try {
            await apiService.transferCartToUser();
            console.log("Cart transfer completed");
          } catch (error) {
            console.error("Failed to transfer cart:", error);
          }
        }

        // Now fetch the updated cart (should include transferred items)
        await fetchCart();
      } else {
        // User logged out - fetch local cart
        await fetchCart();
      }
    };

    handleAuthChange();
  }, []);

  const contextValue: CartContextType = {
    cartItems,
    itemCount, // Changed from cartCount
    isLoading,
    addToCart,
    removeFromCart,
    clearCart,
    refreshCart, // Changed from refetchCart
    transferGuestCart, // Changed from migrateGuestCart
  };

  return (
    <CartContext.Provider value={contextValue}>{children}</CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};

export default CartContext;
