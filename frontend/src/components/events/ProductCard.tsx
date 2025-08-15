import React from "react";
import { Link } from "react-router-dom";
import { ShoppingCart, Store, Tag, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

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
  };
  _shops?: {
    id: string;
    name: string;
    description: string;
    logo: string;
    custom_domain: string;
    Is_visible: boolean;
    slug: string;
  };
  _users?: {
    id: number;
    name: string;
    email: string;
    role: string;
  };
  _action_buttons?: ActionButton[];
}

type ProductImage = {
  id: number;
  display_image?: string;
  seq: number;
  image_type: string;
  Is_disabled: boolean;
};

type ActionButton = {
  id: number;
  name: string;
  sharable_link: string;
  background_color: string;
  font_color: string;
  Is_visible: boolean;
  seq: number;
  open_in_new_window?: boolean;
};

interface ProductCardProps {
  product: Product;
  className?: string;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  className = "",
}) => {
  // Get images from the product
  const images = product._item_images_of_items?.items || [];
  const primaryImage = images.find((img) => img.seq === 1) || images[0];

  // Get action buttons from API
  const actionButtons: ActionButton[] = (product._action_buttons || [])
    .filter((button: ActionButton) => button.Is_visible)
    .sort((a: ActionButton, b: ActionButton) => a.seq - b.seq);

  const getStatusBadge = () => {
    const configMap = {
      available: { label: "Available", variant: "default" as const },
      disabled: { label: "Unavailable", variant: "secondary" as const },
    };
    const status = product.Is_disabled ? "disabled" : "available";
    const config = configMap[status];
    return (
      <Badge variant={config.variant} className="text-xs">
        {config.label}
      </Badge>
    );
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <Card
      className={`group card-hover overflow-hidden bg-gradient-card border-0 shadow-card ${className}`}
    >
      {/* Product Image */}
      <div className="relative overflow-hidden aspect-[16/10]">
        <img
          src={
            primaryImage?.display_image
              ? primaryImage.display_image.startsWith("//")
                ? `https:${primaryImage.display_image}`
                : primaryImage.display_image
              : "/placeholder.svg"
          }
          alt={product.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

        {/* Status Badge */}
        {/* <div className="absolute top-4 left-4">{getStatusBadge()}</div> */}

        {/* Product Type Badge */}
        <div className="absolute top-4 right-4">
          <Badge className="bg-primary text-primary-foreground font-semibold">
            {product.item_type}
          </Badge>
        </div>

        {/* Quick Actions Overlay */}
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
          <div className="flex gap-2">
            <Button size="sm" asChild className="btn-glow">
              <Link to={`/productdetails/${product.id}`}>View Details</Link>
            </Button>
            {product._shops?.custom_domain && (
              <Button size="sm" variant="secondary" asChild>
                <a
                  href={`https://${product._shops.custom_domain}`}
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
          <Link
            to={`/productdetails/${product.id}`}
            className="hover:underline"
          >
            {product.title}
          </Link>
        </h3>

        {/* Description */}
        <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
          {product.description}
        </p>

        {/* Product Info */}
        <div className="space-y-2 text-sm text-muted-foreground">
          {product._shops && (
            <div className="flex items-center gap-2">
              <Store className="w-4 h-4 text-primary" />
              <span className="line-clamp-1">{product._shops.name}</span>
            </div>
          )}
          <div className="flex items-center gap-2">
            {/* <Tag className="w-4 h-4 text-primary" /> */}
            {/* <span>Added {formatDate(product.created_at)}</span> */}
          </div>
        </div>

        {/* Tags - Both SEO_Tags and tags */}
        {(product.SEO_Tags || product.tags) && (
          <div className="flex flex-wrap gap-1 mt-3">
            {/* Regular Tags */}
            {product.tags &&
              product.tags
                .split(",")
                .slice(0, 100)
                .map((tag, i) => (
                  <Badge
                    key={`tag-${i}`}
                    variant="outline"
                    className="text-xs bg-green-50 text-green-700 border-green-200"
                  >
                    {tag.trim()}
                  </Badge>
                ))}
          </div>
        )}
      </CardContent>

      <CardFooter className="px-6 pb-6 pt-0">
        <div className="flex w-full gap-2">
          {/* Dynamic Action Buttons */}
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
                  asChild
                >
                  <a
                    href={button.sharable_link}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {button.name}
                  </a>
                </Button>
              ))}
            </>
          )}
        </div>
      </CardFooter>
    </Card>
  );
};
