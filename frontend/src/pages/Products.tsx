import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Package, ArrowRight, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Header } from "@/components/layout/Header";
import { ProductCard } from "@/components/events/ProductCard";
import { Card, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { apiService, Product } from "@/services/api";

interface Shop {
  id: string;
  name: string;
}

interface ApiResponse {
  items?: Product[];
  [key: string]: any;
}

const Products = () => {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string>("");
  const [shops, setShops] = useState<Shop[]>([]);
  const [selectedShop, setSelectedShop] = useState<string>("");

  // Load all products and unique shops
  useEffect(() => {
    const loadProductsAndShops = async () => {
      try {
        setError("");
        const response: ApiResponse | Product[] =
          await apiService.getProducts();

        // Handle both response formats - with items array or direct array
        const products = Array.isArray(response)
          ? response
          : response.items || [];

        setFeaturedProducts(products.slice(0, 100));

        // Extract unique shops from products
        const uniqueShops: Shop[] = Array.from(
          new Map(
            products
              .filter((p) => p.shops_id && p._shops?.name) // Filter out products without shop data
              .map((p) => [p.shops_id, { id: p.shops_id, name: p._shops.name }])
          ).values()
        );

        setShops(uniqueShops);
      } catch (error) {
        console.error("Failed to load featured products:", error);
        setError("Failed to load products. Please try refreshing the page.");
      } finally {
        setIsLoading(false);
      }
    };

    loadProductsAndShops();
  }, []);

  // Fetch products by selected shop
  const handleShopChange = async (shopId: string) => {
    setSelectedShop(shopId);
    setIsLoading(true);
    setError("");

    try {
      const filters = shopId ? { shopId } : {};
      const response: ApiResponse | Product[] = await apiService.getProducts(
        filters
      );

      // Handle both response formats
      const products = Array.isArray(response)
        ? response
        : response.items || [];

      setFeaturedProducts(products.slice(0, 100));
    } catch (error) {
      console.error("Failed to filter products:", error);
      setError("Failed to filter products. Please try again.");
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
              Discover the best products available right now
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
              {Array.from({ length: 100 }).map((_, index) => (
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
            /* Products Grid */
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
                  : "Check back later for exciting new products"}
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
