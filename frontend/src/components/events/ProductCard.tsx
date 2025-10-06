import React from "react";
import { Link } from "react-router-dom";
import {
  ShoppingCart,
  Package,
  Star,
  ExternalLink,
  Building,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { apiService, Product, ActionButton } from "@/services/api";
import { useCart } from "@/contexts/CartContext";

interface ProductCardProps {
  product: Product;
  className?: string;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  className = "",
}) => {
  const { addToCart } = useCart();

  // Get product images
  const productImages = product._item_images_of_items?.items || [];
  const primaryImage =
    productImages.find((img) => img.seq === 1) || productImages[0];

  // Get action buttons from API
  // Try both possible property names for action buttons
  // @ts-ignore
  const actionButtons: ActionButton[] = (
    product._action_buttons_of_items ||
    product._action_buttons ||
    []
  )
    .filter((button: ActionButton) => button.Is_visible)
    .sort((a: ActionButton, b: ActionButton) => a.seq - b.seq);

  const handleButtonClick = async (button: ActionButton) => {
    try {
      const result = await addToCart(
        product.id,
        button.id,
        product.shops_id,
        0
      );

      if (result.success) {
        console.log("Item added to cart successfully");

        // Handle redirect_url from API response (priority)
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
        console.error("Failed to add to cart:", result.error);
      }
    } catch (error) {
      console.error("Failed to add to cart:", error);
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Failed to add item to cart. Please try again.";
    }
  };

  const getStatusBadge = () => {
    if (product.Is_disabled) {
      return (
        <Badge variant="destructive" className="text-xs">
          Disabled
        </Badge>
      );
    }
    return (
      <Badge variant="default" className="text-xs">
        Available
      </Badge>
    );
  };

  // Parse tags
  const productTags = product.tags
    ? product.tags
        .split(",")
        .map((tag) => tag.trim())
        .filter((tag) => tag)
        .slice(0, 3)
    : [];

  return (
    <Card
      className={`group card-hover overflow-hidden bg-gradient-card border-0 shadow-card ${className}`}
    >
      {/* Product Image */}
      <div className="relative overflow-hidden aspect-[16/10]">
        {primaryImage && (
          <img
            src={primaryImage.display_image}
            alt={product.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
            onError={(e) => {
              e.currentTarget.src =
                "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400&auto=format&fit=crop&q=80";
            }}
          />
        )}
        {!primaryImage && (
          <div className="w-full h-full bg-muted flex items-center justify-center">
            <Package className="w-16 h-16 text-muted-foreground" />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

        {/* Status Badge */}
        <div className="absolute top-4 left-4">{getStatusBadge()}</div>

        {/* Product Type Badge */}
        {product.item_type && (
          <div className="absolute top-4 right-4">
            <Badge className="bg-primary text-primary-foreground font-semibold">
              {product.item_type}
            </Badge>
          </div>
        )}

        {/* Quick Actions Overlay */}
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
          <div className="flex gap-2">
            <Button size="sm" asChild className="btn-glow">
              <Link to={`/product/${product.slug}`}>View Details</Link>
            </Button>
            {product._shops?.custom_domain && (
              <Button size="sm" variant="secondary" asChild>
                <a
                  href={product._shops.custom_domain}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <ExternalLink className="w-4 h-4" />
                </a>
              </Button>
            )}
          </div>
        </div>
      </div>

      <CardContent className="p-6">
        {/* Title */}
        <h3 className="font-semibold text-lg mb-2 line-clamp-2 group-hover:text-primary transition-colors">
          <Link to={`/product/${product.slug}`} className="hover:underline">
            {product.title}
          </Link>
        </h3>

        {/* Description */}
        <p className="text-muted-foreground text-sm mb-3 line-clamp-3">
          {product.description}
        </p>

        {/* Shop Info */}
        {product._shops && (
          <div className="flex items-center gap-2 mb-3 text-sm text-muted-foreground">
            <Building className="w-4 h-4 text-primary" />
            <span className="line-clamp-1">by {product._shops.name}</span>
          </div>
        )}

        {/* Product Info */}
        <div className="space-y-2 text-sm text-muted-foreground mb-3">
          <div className="flex items-center gap-2">
            <Package className="w-4 h-4 text-primary" />
            <span>Product ID: {product.id}</span>
          </div>
          {product.created_at && (
            <div className="flex items-center gap-2">
              <span className="text-xs">
                Added: {new Date(product.created_at).toLocaleDateString()}
              </span>
            </div>
          )}
        </div>

        {/* Tags */}
        {productTags.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-3">
            {productTags.map((tag, i) => (
              <Badge key={`tag-${i}`} variant="outline" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>
        )}

        {/* Reviews count if available */}
        {product._reviews_item_total > 0 && (
          <div className="flex items-center gap-1 mt-2">
            <Star className="w-4 h-4 text-yellow-400 fill-current" />
            <span className="text-xs text-muted-foreground">
              {product._reviews_item_total} reviews
            </span>
          </div>
        )}
      </CardContent>

      <CardFooter className="px-6 pb-6 pt-0">
        <div className="flex w-full gap-2">
          {/* Dynamic Action Buttons - Visible on Card */}
          {actionButtons.length > 0 && (
            <>
              {actionButtons.map((button) => (
                <Button
                  key={button.id}
                  className="flex-1 btn-glow"
                  style={{
                    backgroundColor: button.background_color,
                    color: button.font_color,
                  }}
                  onClick={() => handleButtonClick(button)}
                >
                  {button.name}
                </Button>
              ))}
            </>
          )}
        </div>
      </CardFooter>
    </Card>
  );
};
