import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { RelatedItem } from "@/services/api";

interface RelatedItemsSectionProps {
  relatedItems: RelatedItem[];
  title?: string;
  subtitle?: string;
  className?: string;
  maxDisplay?: number;
  showViewAllButton?: boolean;
  gridCols?: {
    default: number;
    md: number;
    lg: number;
  };
}

export const RelatedItemsSection: React.FC<RelatedItemsSectionProps> = ({
  relatedItems,
  title = "Related Items",
  subtitle = "Items related to this content",
  className = "",
  maxDisplay,
  showViewAllButton = true,
  gridCols = { default: 1, md: 2, lg: 3 },
}) => {
  // Don't render if no related items
  if (!relatedItems.length) {
    return null;
  }

  // Determine items to display
  const displayItems = maxDisplay
    ? relatedItems.slice(0, maxDisplay)
    : relatedItems;

  const shouldShowViewAll =
    showViewAllButton && maxDisplay && relatedItems.length > maxDisplay;

  // Generate responsive grid classes
  const gridClasses = `grid-cols-${gridCols.default} md:grid-cols-${gridCols.md} lg:grid-cols-${gridCols.lg}`;

  // Helper function to generate item URL based on type
  const getItemUrl = (item: RelatedItem) => {
    const itemType = item.related_item_type.toLowerCase();

    // Handle different item types
    switch (itemType) {
      case "event":
        // For events, use slug if available, otherwise use ID
        return `/events/${item.slug}`;
      case "product":
        return `/products/${item.related_items_id}`;
      default:
        // Generic fallback
        return `/${itemType}s/${item.related_items_id}`;
    }
  };

  return (
    <section className={`py-16 bg-background ${className}`}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4">{title}</h2>
          <p className="text-xl text-muted-foreground">{subtitle}</p>
        </div>

        <div className={`grid ${gridClasses} gap-6`}>
          {displayItems.map((item) => (
            <Card
              key={item.id}
              className="bg-gradient-card border-0 shadow-card hover:shadow-lg transition-shadow"
            >
              <div className="aspect-video relative overflow-hidden rounded-t-lg">
                <img
                  src={
                    item.display_image ||
                    "https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?w=400&auto=format&fit=crop&q=80"
                  }
                  alt={item.title}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.currentTarget.src =
                      "https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?w=400&auto=format&fit=crop&q=80";
                  }}
                />
                {item.related_item_type && (
                  <Badge className="absolute top-3 left-3 bg-primary/90 text-white">
                    {item.related_item_type}
                  </Badge>
                )}
              </div>
              <CardContent className="p-6">
                <h3 className="font-bold text-lg mb-2 line-clamp-2">
                  {item.title}
                </h3>
                <p className="text-muted-foreground text-sm mb-4 line-clamp-3">
                  {item.description}
                </p>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-muted-foreground">
                    {new Date(item.created_at).toLocaleDateString()}
                  </span>
                  <Button variant="outline" size="sm" asChild>
                    <Link
                      to={getItemUrl(item)}
                      target={item.open_in_new_window ? "_blank" : "_self"}
                      rel={
                        item.open_in_new_window
                          ? "noopener noreferrer"
                          : undefined
                      }
                    >
                      View Details
                      <ArrowRight className="ml-2 w-4 h-4" />
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {shouldShowViewAll && (
          <div className="text-center mt-8">
            <Button variant="outline">
              View All Related Items
              <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
          </div>
        )}
      </div>
    </section>
  );
};
