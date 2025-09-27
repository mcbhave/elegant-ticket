// src/hooks/useActionButton.ts
import { useState } from "react";
import { useCart } from "@/contexts/CartContext";
import { ActionButton as ActionButtonType } from "@/services/api";

interface UseActionButtonOptions {
  onSuccess?: (redirectUrl?: string) => void;
  onError?: (error: string) => void;
  showAlert?: boolean; // Whether to show alert on error
}

export const useActionButton = (options: UseActionButtonOptions = {}) => {
  const { addToCart } = useCart();
  const [loadingStates, setLoadingStates] = useState<Record<number, boolean>>(
    {}
  );

  const { onSuccess, onError, showAlert = true } = options;

  const handleActionButtonClick = async (
    button: ActionButtonType,
    itemId: number,
    shopsId: string,
    price: number = 0
  ) => {
    try {
      setLoadingStates((prev) => ({ ...prev, [button.id]: true }));

      const result = await addToCart(itemId, button.id, shopsId, price);

      if (result.success) {
        console.log("Item added to cart successfully");

        // Call success callback if provided
        onSuccess?.(result.redirect_url);

        // Handle redirect_url from API response
        if (result.redirect_url) {
          if (button.open_in_new_window) {
            window.open(result.redirect_url, "_blank", "noopener,noreferrer");
          } else {
            window.location.href = result.redirect_url;
          }
        }
        // Fallback to button's sharable_link if no redirect_url in response
        else if (button.sharable_link && button.sharable_link !== "null") {
          if (button.open_in_new_window) {
            window.open(button.sharable_link, "_blank", "noopener,noreferrer");
          } else {
            window.location.href = button.sharable_link;
          }
        }
      } else {
        const errorMsg =
          result.error || "Failed to add item to cart. Please try again.";
        onError?.(errorMsg);
        if (showAlert) {
          alert(errorMsg);
        }
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Failed to add item to cart. Please try again.";
      onError?.(errorMessage);
      if (showAlert) {
        alert(errorMessage);
      }
    } finally {
      setLoadingStates((prev) => ({ ...prev, [button.id]: false }));
    }
  };

  const isButtonLoading = (buttonId: number) => {
    return loadingStates[buttonId] || false;
  };

  return {
    handleActionButtonClick,
    isButtonLoading,
    loadingStates,
  };
};
