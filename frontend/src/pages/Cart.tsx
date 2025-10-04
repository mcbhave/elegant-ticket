import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ShoppingCart, Trash2, ArrowLeft, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Badge } from "@/components/ui/badge";
import { useCart } from "@/contexts/CartContext";
import { apiService } from "@/services/api";

const Cart = () => {
  const {
    cartItems,
    itemCount: cartCount,
    isLoading,
    removeFromCart,
    clearCart,
    refreshCart: fetchCart,
  } = useCart();

  const [isUpdating, setIsUpdating] = useState<Record<string, boolean>>({});
  const [isClearing, setIsClearing] = useState(false);

  const currentUser = apiService.getCurrentUser();
  const guestId = !currentUser ? localStorage.getItem("tempCartUserId") : null;
  const isGuest = !currentUser && !!guestId;
  const [isCheckingOut, setIsCheckingOut] = useState(false);

  const handleRemoveItem = async (cartItemId: string) => {
    try {
      setIsUpdating((prev) => ({ ...prev, [cartItemId]: true }));

      // Use the context method instead
      const success = await removeFromCart(cartItemId);

      if (success) {
      } else {
      }
    } catch (error: any) {
      console.error("Error removing item:", error);
    } finally {
      setIsUpdating((prev) => ({ ...prev, [cartItemId]: false }));
    }
  };

  const handleClearCart = async () => {
    if (!confirm("Are you sure you want to clear your entire cart?")) {
      return;
    }

    try {
      setIsClearing(true);

      // Use the context method
      const success = await clearCart();

      if (success) {
      } else {
        alert("Failed to clear cart. Please try again.");
      }
    } catch (error: any) {
      console.error("Error clearing cart:", error);
      alert(error.message || "Failed to clear cart. Please try again.");
    } finally {
      setIsClearing(false);
    }
  };

  const calculateTotal = () => {
    return cartItems.reduce((total, item) => {
      return total + item.price * item.quantity;
    }, 0);
  };

  const getTotalItems = () => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  };

  const handleCheckout = async () => {
    // Check if user is logged in first
    if (!currentUser) {
      // Redirect to auth page if not logged in
      window.location.href = "/auth";
      return;
    }

    try {
      setIsCheckingOut(true);
      const result = await apiService.checkoutCart();

      if (result?.redirect_url) {
        // Redirect to the checkout URL
        window.location.href = result.redirect_url;
      } else {
      }
    } catch (error: any) {
      console.error("Checkout error:", error);
    } finally {
      setIsCheckingOut(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading your cart...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <ShoppingCart className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h1 className="text-2xl font-bold mb-4">Your Cart is Empty</h1>
            <p className="text-muted-foreground mb-8">
              Start shopping to add items to your cart
            </p>
            <div className="flex gap-4 justify-center">
              <Button asChild>
                <Link to="/events">Browse Events</Link>
              </Button>
              <Button asChild variant="outline">
                <Link to="/products">Browse Products</Link>
              </Button>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <Button variant="ghost" asChild className="mb-6">
          <Link to="/">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Continue Shopping
          </Link>
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-2xl font-bold">Shopping Cart</h1>
              <Badge variant="secondary">
                {getTotalItems()} {getTotalItems() === 1 ? "item" : "items"}
              </Badge>
            </div>

            {/* Guest User Notice */}
            {isGuest && (
              <Card className="mb-6 border-amber-200 bg-amber-50">
                <CardContent className="p-4">
                  <div className="flex items-start space-x-3">
                    <User className="w-5 h-5 text-amber-600 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-amber-800">
                        Shopping as Guest
                      </p>
                      <p className="text-sm text-amber-700">
                        Your cart is temporarily stored. Sign in to save your
                        items and complete your purchase.
                      </p>
                      <Button
                        asChild
                        size="sm"
                        className="mt-2"
                        variant="outline"
                      >
                        <Link to="/auth">Sign In</Link>
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            <div className="space-y-4">
              {cartItems.map((item) => (
                <Card key={item.id}>
                  <CardContent className="p-4">
                    <div className="flex items-start space-x-4">
                      {/* Product Image */}
                      <div className="w-20 h-20 rounded-lg overflow-hidden bg-muted flex-shrink-0">
                        {item.image ? (
                          <img
                            src={item.image}
                            alt={item.title || "Cart Item"}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              e.currentTarget.src =
                                "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400&auto=format&fit=crop&q=80";
                            }}
                          />
                        ) : (
                          <div className="w-full h-full bg-muted flex items-center justify-center">
                            <ShoppingCart className="w-8 h-8 text-muted-foreground" />
                          </div>
                        )}
                      </div>

                      {/* Product Details */}
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-lg truncate">
                          {item.title || "Cart Item"}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          Item ID: {item.items_id}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Action: {item.action_id}
                        </p>
                        {item.price > 0 && (
                          <p className="text-sm font-medium">
                            ${item.price.toFixed(2)} each
                          </p>
                        )}
                        <p className="text-xs text-muted-foreground">
                          Added:{" "}
                          {new Date(item.created_at).toLocaleDateString()}
                        </p>
                      </div>

                      {/* Quantity Display */}
                      <div className="flex items-center space-x-2">
                        <div className="text-center">
                          <span className="text-sm text-muted-foreground block">
                            Qty
                          </span>
                          <span className="font-medium">{item.quantity}</span>
                        </div>
                      </div>

                      {/* Total Price for this item */}
                      {item.price > 0 && (
                        <div className="text-right">
                          <p className="text-sm text-muted-foreground">Total</p>
                          <p className="font-semibold">
                            ${(item.price * item.quantity).toFixed(2)}
                          </p>
                        </div>
                      )}

                      {/* Remove Button */}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRemoveItem(item.id)}
                        disabled={isUpdating[item.id]}
                        className="text-destructive hover:text-destructive"
                      >
                        {isUpdating[item.id] ? (
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current"></div>
                        ) : (
                          <Trash2 className="w-4 h-4" />
                        )}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Cart Summary */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span>Items ({getTotalItems()})</span>
                  <span>{getTotalItems()}</span>
                </div>

                {calculateTotal() > 0 && (
                  <>
                    <div className="flex items-center justify-between">
                      <span>Subtotal</span>
                      <span>${calculateTotal().toFixed(2)}</span>
                    </div>
                    <div className="border-t pt-4">
                      <div className="flex items-center justify-between font-semibold">
                        <span>Total</span>
                        <span>${calculateTotal().toFixed(2)}</span>
                      </div>
                    </div>
                  </>
                )}

                <Button
                  className="w-full"
                  size="lg"
                  disabled={cartItems.length === 0 || isCheckingOut}
                  onClick={handleCheckout}
                >
                  {isCheckingOut ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current mr-2"></div>
                      Processing...
                    </>
                  ) : (
                    "Proceed to Checkout"
                  )}
                </Button>

                <Button
                  variant="outline"
                  className="w-full"
                  onClick={handleClearCart}
                  disabled={isClearing || cartItems.length === 0}
                >
                  {isClearing ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current mr-2"></div>
                      Clearing...
                    </>
                  ) : (
                    "Clear Cart"
                  )}
                </Button>
              </CardContent>
            </Card>

            {/* Cart Actions */}
            <Card>
              <CardContent className="p-4 space-y-3">
                <Button asChild variant="outline" className="w-full">
                  <Link to="/events">Browse More Events</Link>
                </Button>
                <Button asChild variant="outline" className="w-full">
                  <Link to="/products">Browse More Products</Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Cart;
