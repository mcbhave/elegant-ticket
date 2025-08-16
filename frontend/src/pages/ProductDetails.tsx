import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";

import {
  ShoppingCart,
  ArrowLeft,
  ExternalLink,
  Star,
  Building,
  Tag,
  Package,
  ArrowRight,
  Globe,
  User,
  Calendar,
  Shield,
  Truck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { ProductCard } from "@/components/events/ProductCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { apiService } from "@/services/api";

// Product interface matching your API response
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
    itemsReceived?: number;
    curPage?: number;
    nextPage?: number | null;
    prevPage?: number | null;
    offset?: number | null;
    perPage?: number | null;
  };
  _shops?: {
    id: string;
    created_at?: number;
    name: string;
    description: string;
    logo: string;
    custom_domain: string;
    Is_visible: boolean;
    slug: string;
  };
  _users?: {
    id: number;
    created_at?: number;
    name: string;
    email: string;
    role: string;
    api_key?: string;
    shops_id?: string;
  };
  _action_buttons?: any[];
}

interface ProductImage {
  id: number;
  shops_id?: string;
  items_id?: number;
  created_at?: number;
  display_image?: string;
  seq: number;
  image_type: string;
  Is_disabled: boolean;
}

// Review interface for API data
interface ReviewData {
  id: string;
  created_at: number;
  items_id: number;
  shops_id: string;
  Comments: string;
  Helpful_count: number;
  Is_visible: boolean;
  Rating: number;
  Title: string;
  item_images_id: number[];
  users_id: number;
  user_info?: {
    id: number;
    name: string;
  };
}

interface ReviewsResponse {
  itemsReceived: number;
  curPage: number;
  nextPage: number | null;
  prevPage: number | null;
  offset: number;
  perPage: number;
  itemsTotal: number;
  pageTotal: number;
  items: ReviewData[];
  ratings_avg: {
    reviews_Rating1: number;
    Total_items: number;
  }[];
}

const ProductDetails = () => {
  const { shopId, id } = useParams();
  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [reviews, setReviews] = useState<ReviewData[]>([]);
  const [reviewsData, setReviewsData] = useState<ReviewsResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [reviewsExpanded, setReviewsExpanded] = useState(false);
  const [selectedImage, setSelectedImage] = useState<ProductImage | null>(null);

  useEffect(() => {
    const loadProductDetails = async () => {
      try {
        if (id) {
          // Fetch main product
          const productData = await apiService.getProductById(id);
          setProduct(productData);

          if (productData) {
            // Set the first image as selected
            const images = productData._item_images_of_items?.items || [];
            if (images.length > 0) {
              setSelectedImage(
                images.find((img) => img.seq === 1) || images[0]
              );
            }

            // Fetch reviews for this product
            const reviewsResponse = await apiService.getReviewsByItemId(
              productData.id
            );
            if (reviewsResponse) {
              setReviewsData(reviewsResponse);
              setReviews(
                reviewsResponse.items.filter((review) => review.Is_visible)
              );
            }

            // Fetch related products (same shop)
            const allProducts = await apiService.getProducts();
            let related = [];

            if (Array.isArray(allProducts)) {
              related = allProducts;
            } else if (
              allProducts &&
              typeof allProducts === "object" &&
              "items" in allProducts
            ) {
              related = allProducts.items || [];
            }

            const filteredRelated = related
              .filter(
                (p) =>
                  p.id !== productData.id &&
                  p._shops?.id === productData._shops?.id
              )
              .slice(0, 3);
            setRelatedProducts(filteredRelated);
          }
        }
      } catch (error) {
        console.error("Failed to load product details:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadProductDetails();
  }, [id]);

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

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

  // Process product tags
  const productTags = product.tags
    ? product.tags.split(",").map((tag) => tag.trim())
    : [];

  const seoTags = product.SEO_Tags
    ? product.SEO_Tags.split(",")
        .map((tag) => tag.trim())
        .filter((tag) => tag.length > 0)
    : [];

  const images = product._item_images_of_items?.items || [];
  const primaryImage =
    selectedImage || images.find((img) => img.seq === 1) || images[0];

  const getImageUrl = (imageUrl?: string) => {
    if (!imageUrl) return "/placeholder.svg";
    return imageUrl.startsWith("//") ? `https:${imageUrl}` : imageUrl;
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Back Button */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        <Button variant="ghost" asChild className="mb-4">
          <Link to="/products">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Products
          </Link>
        </Button>
      </div>

      {/* Main Content */}
      <section className="py-8">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
            {/* Left Column - Product Images */}
            <div className="space-y-4">
              {/* Main Image */}
              <div className="relative aspect-square overflow-hidden rounded-lg bg-white">
                <img
                  src={getImageUrl(primaryImage?.display_image)}
                  alt={product.title}
                  className="w-full h-full object-contain transition-transform duration-300 hover:scale-105"
                />
              </div>

              {/* Thumbnail Images */}
              {images.length > 1 && (
                <div className="grid grid-cols-4 gap-2">
                  {images.map((image) => (
                    <button
                      key={image.id}
                      onClick={() => setSelectedImage(image)}
                      className={`relative aspect-square overflow-hidden rounded-lg border-2 transition-all ${
                        selectedImage?.id === image.id
                          ? "border-primary ring-2 ring-primary/20"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      <img
                        src={getImageUrl(image.display_image)}
                        alt={`${product.title} - Image ${image.seq}`}
                        className="w-full h-full object-contain bg-white"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Right Column - Product Info */}
            <div className="space-y-6">
              {/* Title and Status */}
              <div>
                <div className="flex items-start justify-between mb-2">
                  <h1 className="text-3xl font-bold text-foreground">
                    {product.title}
                  </h1>
                </div>

                {/* Product Type */}
                <Badge className="bg-primary/10 text-primary mb-4">
                  {product.item_type}
                </Badge>

                {/* Ratings */}
                {reviews.length > 0 && (
                  <div className="flex items-center space-x-2 mb-4">
                    <div className="flex items-center">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          className={`w-5 h-5 ${
                            i < Math.floor(getAverageRating())
                              ? "text-yellow-400 fill-current"
                              : "text-gray-300"
                          }`}
                        />
                      ))}
                    </div>
                    <span className="font-semibold">
                      {getAverageRating() > 0
                        ? getAverageRating().toFixed(1)
                        : "N/A"}
                    </span>
                    <span className="text-muted-foreground">
                      ({getTotalReviews()} reviews)
                    </span>
                  </div>
                )}
              </div>

              {/* Description */}
              <div>
                <h3 className="text-lg font-semibold mb-3">Description</h3>
                <p className="text-muted-foreground leading-relaxed">
                  {product.description}
                </p>
              </div>

              {/* Product Details */}
              <Card className="bg-gradient-card border-0 shadow-card">
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold mb-4">
                    Product Details
                  </h3>
                  <div className="space-y-3">
                    {/* <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Product ID</span>
                      <span className="font-medium">#{product.id}</span>
                    </div> */}
                    {/* <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Added Date</span>
                      <span className="font-medium">
                        {formatDate(product.created_at)}
                      </span>
                    </div> */}
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Category</span>
                      <span className="font-medium">{product.item_type}</span>
                    </div>
                    {productTags.length > 0 && (
                      <div className="space-y-2">
                        <span className="text-muted-foreground">Tags</span>
                        <div className="flex flex-wrap gap-2">
                          {productTags.map((tag, index) => (
                            <Badge
                              key={index}
                              variant="secondary"
                              className="bg-green-50 text-green-700 border-green-200"
                            >
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Action Buttons */}
              <div className="space-y-3">
                {product._shops?.custom_domain && (
                  <Button
                    size="lg"
                    variant="outline"
                    className="w-full"
                    asChild
                  >
                    <a
                      href={`https://${product._shops.custom_domain}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <ExternalLink className="w-5 h-5 mr-2" />
                      Visit Shop Website
                    </a>
                  </Button>
                )}
              </div>
            </div>
          </div>

          {/* Additional Details Section */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Tags and Additional Info */}
            <div className="lg:col-span-2 space-y-8">
              {/* SEO Tags (if different from product tags) */}
              {/* {seoTags.length > 0 && (
                <Card className="bg-gradient-card border-0 shadow-card">
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Tag className="w-6 h-6 text-primary" />
                      <span>SEO Tags</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {seoTags.map((tag, index) => (
                        <Badge
                          key={index}
                          variant="outline"
                          className="bg-blue-50 text-blue-700 border-blue-200"
                        >
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )} */}

              {/* Reviews */}
              {reviews.length > 0 && (
                <Card className="bg-gradient-card border-0 shadow-card">
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Star className="w-6 h-6 text-primary" />
                        <span>Customer Reviews</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Star className="w-5 h-5 text-yellow-400 fill-current" />
                        <span className="font-bold">
                          {getAverageRating() > 0
                            ? getAverageRating().toFixed(1)
                            : "N/A"}
                        </span>
                        <span className="text-muted-foreground">
                          ({getTotalReviews()} reviews)
                        </span>
                      </div>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      {reviews
                        .slice(0, reviewsExpanded ? reviews.length : 2)
                        .map((review) => (
                          <div
                            key={review.id}
                            className="border-b border-border last:border-b-0 pb-4 last:pb-0"
                          >
                            <div className="flex items-start space-x-4">
                              <Avatar className="w-10 h-10">
                                <AvatarFallback className="bg-primary/10 text-primary">
                                  {review.user_info?.name
                                    ? review.user_info.name
                                        .charAt(0)
                                        .toUpperCase()
                                    : "U"}
                                </AvatarFallback>
                              </Avatar>
                              <div className="flex-1">
                                <div className="flex items-center space-x-2 mb-1">
                                  <h4 className="font-semibold">
                                    {review.user_info?.name || "Anonymous User"}
                                  </h4>
                                  <div className="flex items-center">
                                    {Array.from({ length: 5 }).map((_, i) => (
                                      <Star
                                        key={i}
                                        className={`w-4 h-4 ${
                                          i < review.Rating
                                            ? "text-yellow-400 fill-current"
                                            : "text-gray-300"
                                        }`}
                                      />
                                    ))}
                                  </div>
                                  <span className="text-sm text-muted-foreground">
                                    {formatReviewDate(review.created_at)}
                                  </span>
                                </div>
                                <h5 className="font-medium mb-1">
                                  {review.Title}
                                </h5>
                                <p className="text-muted-foreground">
                                  {review.Comments}
                                </p>
                                {review.Helpful_count > 0 && (
                                  <p className="text-sm text-muted-foreground mt-2">
                                    {review.Helpful_count} people found this
                                    helpful
                                  </p>
                                )}
                              </div>
                            </div>
                          </div>
                        ))}

                      {reviews.length > 2 && (
                        <Button
                          variant="ghost"
                          onClick={() => setReviewsExpanded(!reviewsExpanded)}
                          className="w-full"
                        >
                          {reviewsExpanded
                            ? "Show Less"
                            : `Show ${reviews.length - 2} More Reviews`}
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Right Column - Sidebar */}
            <div className="space-y-6">
              {/* Shop Info */}
              {product._shops && (
                <Card className="bg-gradient-card border-0 shadow-card">
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Building className="w-6 h-6 text-primary" />
                      <span>Shop</span>
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
                            e.currentTarget.nextElementSibling!.style.display =
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
                        <p className="text-sm text-muted-foreground">
                          Shop Owner
                        </p>
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
                          href={`https://${product._shops.custom_domain}`}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <Globe className="w-4 h-4 mr-2" />
                          Visit Shop
                        </a>
                      </Button>
                    )}
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default ProductDetails;
