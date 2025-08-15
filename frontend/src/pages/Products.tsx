import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Package, ArrowRight, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Header } from "@/components/layout/Header";
import { ProductCard } from "@/components/events/ProductCard";
import { Card, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { apiService } from "@/services/api";

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

type ProductImage = {
  id: number;
  shops_id?: string;
  items_id?: number;
  created_at?: number;
  display_image?: string;
  seq: number;
  image_type: string;
  Is_disabled: boolean;
};

interface Shop {
  id: string;
  name: string;
}

interface ApiResponse {
  items?: Product[];
  itemsReceived?: number;
  curPage?: number;
  nextPage?: number | null;
  prevPage?: number | null;
  offset?: number;
  perPage?: number;
  itemsTotal?: number;
  pageTotal?: number;
}

const Products = () => {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string>("");
  const [shops, setShops] = useState<Shop[]>([]);
  const [selectedShop, setSelectedShop] = useState<string>("");

  // Load all products and unique shops from API
  useEffect(() => {
    const loadProductsAndShops = async () => {
      try {
        setError("");
        setIsLoading(true);

        console.log("Fetching products from API...");
        const response = await apiService.getProducts();

        console.log("API Response:", response);

        // Handle response - check if it's direct array or object with items
        let products: Product[] = [];

        if (Array.isArray(response)) {
          products = response;
        } else if (
          response &&
          typeof response === "object" &&
          "items" in response
        ) {
          products = (response as ApiResponse).items || [];
        } else {
          console.error("Unexpected API response format:", response);
          throw new Error("Invalid API response format");
        }

        console.log("Processed products:", products);
        setFeaturedProducts(products.slice(0, 100));

        // Extract unique shops from products
        const uniqueShops: Shop[] = Array.from(
          new Map(
            products
              .filter((p) => p.shops_id && p._shops?.name)
              .map((p) => [
                p.shops_id,
                { id: p.shops_id, name: p._shops!.name },
              ])
          ).values()
        );

        console.log("Extracted shops:", uniqueShops);
        setShops(uniqueShops);
      } catch (error) {
        console.error("Failed to load products from API:", error);
        setError(
          `Failed to load products: ${
            error instanceof Error ? error.message : "Unknown error"
          }`
        );
      } finally {
        setIsLoading(false);
      }
    };

    loadProductsAndShops();
  }, []);

  // Fetch products by selected shop from API
  const handleShopChange = async (shopId: string) => {
    setSelectedShop(shopId);
    setIsLoading(true);
    setError("");

    try {
      console.log("Filtering products by shop:", shopId);

      const filters = shopId ? { shopId } : {};
      const response = await apiService.getProducts(filters);

      console.log("Filtered API Response:", response);

      // Handle response format
      let products: Product[] = [];

      if (Array.isArray(response)) {
        products = response;
      } else if (
        response &&
        typeof response === "object" &&
        "items" in response
      ) {
        products = (response as ApiResponse).items || [];
      }

      setFeaturedProducts(products.slice(0, 100));
    } catch (error) {
      console.error("Failed to filter products:", error);
      setError(
        `Failed to filter products: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Featured Products Section */}
      <section className="py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">Featured Products</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Discover the best products from our trusted merchants
            </p>
          </div>

          {/* Shop Dropdown */}
          {shops.length > 0 && (
            <div className="mb-8 flex justify-center">
              <select
                value={selectedShop}
                onChange={(e) => handleShopChange(e.target.value)}
                className="border rounded-md px-4 py-2 bg-background"
              >
                <option value="">All Shops</option>
                {shops.map((shop) => (
                  <option key={shop.id} value={shop.id}>
                    {shop.name}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <Alert className="mb-8 max-w-md mx-auto">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* Loading State */}
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {Array.from({ length: 6 }).map((_, index) => (
                <Card key={index} className="animate-pulse">
                  <div className="h-48 bg-muted rounded-t-lg"></div>
                  <CardContent className="p-6">
                    <div className="h-4 bg-muted rounded mb-2"></div>
                    <div className="h-3 bg-muted rounded mb-4 w-2/3"></div>
                    <div className="space-y-2">
                      <div className="h-3 bg-muted rounded w-1/2"></div>
                      <div className="h-3 bg-muted rounded w-3/4"></div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : featuredProducts.length > 0 ? (
            /* Products Grid - Using ProductCard */
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
              {featuredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            /* No Products State */
            <div className="text-center py-12">
              <Package className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">
                {selectedShop
                  ? "No products for this shop"
                  : "No products available"}
              </h3>
              <p className="text-muted-foreground mb-6">
                {selectedShop
                  ? "Try selecting a different shop or view all products"
                  : "Check back later for new products"}
              </p>
              {selectedShop && (
                <Button
                  variant="outline"
                  onClick={() => handleShopChange("")}
                  className="mb-4"
                >
                  View All Products
                </Button>
              )}
            </div>
          )}

          {/* Navigation Button - Only show if we have products and not in error state */}
          {!error && !isLoading && featuredProducts.length > 0 && (
            <div className="text-center">
              <Button size="lg" variant="outline" asChild>
                <Link to="/">
                  Back to Home
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Link>
              </Button>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Products;
