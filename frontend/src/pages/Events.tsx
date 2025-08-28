import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Calendar, ArrowRight, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Header } from "@/components/layout/Header";
import { EventCard } from "@/components/events/EventCard";
import { Card, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { apiService, Event } from "@/services/api";

interface Shop {
  id: string;
  name: string;
}

interface ApiResponse {
  items?: Event[];
  [key: string]: any;
}

const Events = () => {
  const [featuredEvents, setFeaturedEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string>("");
  const [shops, setShops] = useState<Shop[]>([]);
  const [selectedShop, setSelectedShop] = useState<string>("");

  // Load all events and unique shops
  useEffect(() => {
    const loadEventsAndShops = async () => {
      try {
        setError("");
        const response: ApiResponse | Event[] = await apiService.getEvents();

        // Handle both response formats - with items array or direct array
        const events = Array.isArray(response)
          ? response
          : response.items || [];

        setFeaturedEvents(events.slice(0, 100));

        // Extract unique shops from events
        const uniqueShops: Shop[] = Array.from(
          new Map(
            events
              .filter((e) => e.shops_id && e._shops?.name) // Filter out events without shop data
              .map((e) => [e.shops_id, { id: e.shops_id, name: e._shops.name }])
          ).values()
        );

        setShops(uniqueShops);
      } catch (error) {
        console.error("Failed to load featured events:", error);
        setError("Failed to load events. Please try refreshing the page.");
      } finally {
        setIsLoading(false);
      }
    };

    loadEventsAndShops();
  }, []);

  // Fetch events by selected shop
  const handleShopChange = async (shopId: string) => {
    setSelectedShop(shopId);
    setIsLoading(true);
    setError("");

    try {
      const filters = shopId ? { shopId } : {};
      const response: ApiResponse | Event[] = await apiService.getEvents(
        filters
      );

      // Handle both response formats
      const events = Array.isArray(response) ? response : response.items || [];

      setFeaturedEvents(events.slice(0, 100));
    } catch (error) {
      console.error("Failed to filter events:", error);
      setError("Failed to filter events. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Featured Events Section */}
      <section className="py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">Featured Events</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Discover the most exciting events happening right now
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
          ) : featuredEvents.length > 0 ? (
            /* Events Grid */
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
              {featuredEvents.map((event) => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>
          ) : (
            /* No Events State */
            <div className="text-center py-12">
              <Calendar className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">
                {selectedShop
                  ? "No events for this shop"
                  : "No events available"}
              </h3>
              <p className="text-muted-foreground mb-6">
                {selectedShop
                  ? "Try selecting a different shop or view all events"
                  : "Check back later for exciting new events"}
              </p>
              {selectedShop && (
                <Button
                  variant="outline"
                  onClick={() => handleShopChange("")}
                  className="mb-4"
                >
                  View All Events
                </Button>
              )}
            </div>
          )}

          {/* Navigation Button - Only show if we have events and not in error state */}
          {!error && !isLoading && featuredEvents.length > 0 && (
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

export default Events;
