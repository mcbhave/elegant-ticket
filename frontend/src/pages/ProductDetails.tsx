import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";

import {
  ShoppingCart,
  MapPin,
  Globe,
  Star,
  User,
  Building,
  Tag,
  ArrowLeft,
  ExternalLink,
  Package,
  ArrowRight,
  Heart,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useItemSEO } from "@/hooks/useItemSEO";
import { ReviewsSection } from "@/components/reuse/ReviewsSection";
import { RelatedItemsSection } from "@/components/reuse/RelatedItemsSection";

import {
  apiService,
  RelatedItem,
  RelatedItemsResponse,
  ReviewData,
  ReviewsResponse,
  Product,
  ActionButton,
} from "@/services/api";

const ProductDetails = () => {
  const { slug } = useParams();
  const [product, setProduct] = useState<Product | null>(null);
  const [reviews, setReviews] = useState<ReviewData[]>([]);
  const [reviewsData, setReviewsData] = useState<ReviewsResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [reviewsExpanded, setReviewsExpanded] = useState(false);
  const [relatedItems, setRelatedItems] = useState<RelatedItem[]>([]);

  useEffect(() => {
    const loadProductDetails = async () => {
      if (!slug) return;

      try {
        setIsLoading(true);

        // Fetch main product first
        const productData = await apiService.getProductBySlug(slug);

        if (!productData) {
          setIsLoading(false);
          return;
        }

        setProduct(productData);

        // Now fetch reviews and related items using the product ID
        const productId = productData.id;

        // Fetch reviews for this product
        try {
          const reviewsResponse = await apiService.getReviewsByItemId(
            productId
          );
          if (reviewsResponse) {
            setReviewsData(reviewsResponse);
            setReviews(
              reviewsResponse.items.filter((review) => review.Is_visible)
            );
          }
        } catch (reviewError) {
          console.warn("No reviews found for this product:", reviewError);
          setReviews([]);
          setReviewsData(null);
        }

        // Fetch related items for this product
        try {
          const relatedItemsResponse = await apiService.getRelatedItems(
            productId
          );
          if (relatedItemsResponse) {
            setRelatedItems(
              relatedItemsResponse.items.filter((item) => item.is_visible)
            );
          }
        } catch (relatedError) {
          console.warn(
            "No related items found for this product:",
            relatedError
          );
          setRelatedItems([]);
        }
      } catch (error) {
        console.error("Failed to load product details:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadProductDetails();
  }, [slug]);

  const formatReviewDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getAverageRating = () => {
    if (reviewsData?.ratings_avg && reviewsData.ratings_avg.length > 0) {
      return reviewsData.ratings_avg[0].reviews_Rating1;
    }
    return 0;
  };

  const getTotalReviews = () => {
    if (reviewsData?.ratings_avg && reviewsData.ratings_avg.length > 0) {
      return reviewsData.ratings_avg[0].Total_items;
    }
    return 0;
  };

  const handleActionButtonClick = async (button: ActionButton) => {
    try {
      const isAuthenticated = apiService.isAuthenticated();

      if (!isAuthenticated) {
        const shouldLogin = confirm(
          "Please log in to add items to your cart. Would you like to log in now?"
        );
        if (shouldLogin) {
          window.location.href = "/auth";
        }
        return;
      }

      await apiService.addToCart(product!.id, button.id, product!.shops_id, 0);

      console.log("Item added to cart successfully");

      if (button.sharable_link && button.sharable_link !== "null") {
        if (button.open_in_new_window) {
          window.open(button.sharable_link, "_blank", "noopener,noreferrer");
        } else {
          window.location.href = button.sharable_link;
        }
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Failed to add item to cart. Please try again.";
      alert(errorMessage);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-16 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">
            Loading product details...
          </p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-2xl font-bold text-foreground mb-4">
            Product Not Found
          </h1>
          <p className="text-muted-foreground mb-8">
            The product you're looking for doesn't exist.
          </p>
          <Button asChild>
            <Link to="/products">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Products
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  // Parse tags - products have tags property with null checks
  const productTags = product.tags
    ? product.tags
        .split(",")
        .map((tag) => tag.trim())
        .filter((tag) => tag)
    : [];

  // Get product image with null checks
  const productImages = product._item_images_of_items?.items || [];
  const primaryImage =
    productImages.find((img) => img.seq === 1) || productImages[0];
  const productImage = primaryImage?.display_image;

  // Get action buttons with null checks
  const actionButtons: ActionButton[] = (product._action_buttons_of_items || [])
    .filter((button: ActionButton) => button.Is_visible)
    .sort((a: ActionButton, b: ActionButton) => a.seq - b.seq);

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        <Button variant="ghost" asChild className="mb-4">
          <Link to="/products">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Products
          </Link>
        </Button>
      </div>

      {/* Hero Section */}
      <section className="relative h-[60vh] flex items-end overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${productImage})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />

        <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 pb-12 text-white">
          <div className="max-w-4xl">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 tracking-tight">
              {product.title}
            </h1>

            <p className="text-xl md:text-2xl mb-6 text-white/90 leading-relaxed">
              {(product.description || "").length > 150
                ? product.description.substring(0, 150) + "..."
                : product.description}
            </p>

            <div className="flex flex-wrap gap-6 mb-6">
              <div className="flex items-center space-x-2">
                <Package className="w-5 h-5 text-primary" />
                <span>Product</span>
              </div>
              {product.item_type && (
                <div className="flex items-center space-x-2">
                  <Tag className="w-5 h-5 text-primary" />
                  <span>{product.item_type}</span>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              {actionButtons.map((button) => (
                <Button
                  key={button.id}
                  size="lg"
                  className="btn-glow"
                  style={{
                    backgroundColor: button.background_color,
                    color: button.font_color,
                  }}
                  onClick={() => handleActionButtonClick(button)}
                >
                  <ShoppingCart className="w-5 h-5 mr-2" />
                  {button.name}
                </Button>
              ))}
              {actionButtons.length === 0 && (
                <Button
                  size="lg"
                  className="btn-glow bg-primary text-primary-foreground hover:bg-primary/90"
                >
                  <ShoppingCart className="w-5 h-5 mr-2" />
                  Add to Cart
                </Button>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Left Column - Product Details */}
            <div className="lg:col-span-2 space-y-8">
              {/* Product Information */}
              <Card className="bg-gradient-card border-0 shadow-card">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Package className="w-6 h-6 text-primary" />
                    <span>Product Information</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-semibold mb-2">Product Type</h4>
                      <p className="text-muted-foreground">
                        {product.item_type}
                      </p>
                    </div>

                    <div>
                      <h4 className="font-semibold mb-2">Status</h4>
                      <Badge
                        variant="secondary"
                        className={
                          product.Is_disabled
                            ? "bg-red-100 text-red-800"
                            : "bg-green-100 text-green-800"
                        }
                      >
                        {product.Is_disabled ? "Disabled" : "Available"}
                      </Badge>
                    </div>

                    {product.created_at && (
                      <div>
                        <h4 className="font-semibold mb-2">Added On</h4>
                        <p className="text-muted-foreground">
                          {new Date(product.created_at).toLocaleDateString(
                            "en-US",
                            {
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                            }
                          )}
                        </p>
                      </div>
                    )}

                    {product.SEO_Tags && (
                      <div>
                        <h4 className="font-semibold mb-2">SEO Tags</h4>
                        <p className="text-muted-foreground text-sm">
                          {product.SEO_Tags.split(",").slice(0, 5).join(", ")}
                        </p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* About This Product Card */}
              <Card className="bg-gradient-card border-0 shadow-card">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Globe className="w-6 h-6 text-primary" />
                    <span>About This Product</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h3 className="text-2xl font-bold mb-4 text-foreground">
                      {product.title}
                    </h3>
                    <div className="prose prose-gray max-w-none">
                      <p className="text-muted-foreground leading-relaxed text-base">
                        {product.description}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Product Images */}
              {productImages.length > 1 && (
                <Card className="bg-gradient-card border-0 shadow-card">
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Package className="w-6 h-6 text-primary" />
                      <span>Product Gallery</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      {productImages.map((image, index) => (
                        <div
                          key={image.id}
                          className="aspect-square relative overflow-hidden rounded-lg"
                        >
                          <img
                            src={image.display_image}
                            alt={`Product image ${index + 1}`}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              e.currentTarget.src =
                                "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400&auto=format&fit=crop&q=80";
                            }}
                          />
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Tags */}

              {productTags.length > 0 && (
                <Card className="bg-gradient-card border-0 shadow-card">
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Tag className="w-6 h-6 text-primary" />
                      <span>Tags</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {productTags.map((tag, index) => (
                        <Badge
                          key={index}
                          variant="secondary"
                          className="bg-primary/10 text-primary hover:bg-primary/20"
                        >
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Reviews */}
              <ReviewsSection
                reviews={reviews}
                reviewsData={reviewsData}
                initialDisplayCount={3}
              />
            </div>

            {/* Right Column - Sidebar */}
            <div className="space-y-6">
              {/* Shop/Seller Info */}

              {product._shops && (
                <Card className="bg-gradient-card border-0 shadow-card">
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Building className="w-6 h-6 text-primary" />
                      <span>Seller</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center space-x-4 mb-4">
                      <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center p-1">
                        <img
                          src={product._shops.logo}
                          alt={product._shops.name}
                          className="w-full h-full object-contain"
                          onError={(e) => {
                            e.currentTarget.style.display = "none";
                            // @ts-ignore
                            e.currentTarget.nextElementSibling.style.display =
                              "flex";
                          }}
                        />
                        <div className="w-full h-full bg-gradient-primary rounded-lg items-center justify-center hidden">
                          <Building className="w-6 h-6 text-white" />
                        </div>
                      </div>
                      <div>
                        <h3 className="font-bold text-lg">
                          {product._shops.name}
                        </h3>
                        <p className="text-sm text-muted-foreground">Seller</p>
                      </div>
                    </div>
                    <p className="text-muted-foreground mb-4">
                      {product._shops.description}
                    </p>

                    {product._shops.custom_domain && (
                      <Button
                        variant="outline"
                        size="sm"
                        asChild
                        className="w-full"
                      >
                        <a
                          href={product._shops.custom_domain}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <Globe className="w-4 h-4 mr-2" />
                          Visit Store
                        </a>
                      </Button>
                    )}
                  </CardContent>
                </Card>
              )}

              {/* Product Stats */}
              <Card className="bg-gradient-card border-0 shadow-card">
                <CardHeader>
                  <CardTitle>Product Stats</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Status</span>
                    <Badge
                      variant="secondary"
                      className={
                        product.Is_disabled
                          ? "bg-red-100 text-red-800"
                          : "bg-green-100 text-green-800"
                      }
                    >
                      {product.Is_disabled ? "Disabled" : "Available"}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Type</span>
                    <span className="font-semibold">{product.item_type}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Reviews</span>
                    <span className="font-semibold">{getTotalReviews()}</span>
                  </div>
                  {product.created_at && (
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Added</span>
                      <span className="font-semibold">
                        {new Date(product.created_at).toLocaleDateString()}
                      </span>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Action Buttons Card */}
              <Card className="bg-gradient-hero text-white border-0 shadow-card">
                <CardContent className="p-6 text-center space-y-4">
                  {actionButtons.map((button) => (
                    <Button
                      key={button.id}
                      size="lg"
                      className="w-full btn-glow"
                      style={{
                        backgroundColor: button.background_color,
                        color: button.font_color,
                      }}
                      onClick={() => handleActionButtonClick(button)}
                    >
                      <ShoppingCart className="w-5 h-5 mr-2" />
                      {button.name}
                    </Button>
                  ))}

                  {actionButtons.length === 0 && (
                    <Button
                      size="lg"
                      className="w-full btn-glow bg-white text-foreground hover:bg-white/90"
                    >
                      <ShoppingCart className="w-5 h-5 mr-2" />
                      Add to Cart
                    </Button>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Related Items */}
      <RelatedItemsSection
        relatedItems={relatedItems}
        title="Related Items"
        subtitle="Items related to this product"
        maxDisplay={6}
        showViewAllButton={true}
        gridCols={{ default: 1, md: 2, lg: 3 }}
      />

      <Footer />
    </div>
  );
};

export default ProductDetails;
