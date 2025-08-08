import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Calendar, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Header } from "@/components/layout/Header";
import { EventCard } from "@/components/events/EventCard";
import { Card, CardContent } from "@/components/ui/card";
import { Event } from "@/types";
import { apiService } from "@/services/api";

const Events = () => {
  const [featuredEvents, setFeaturedEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [shops, setShops] = useState<{ id: string; name: string }[]>([]);
  const [selectedShop, setSelectedShop] = useState<string>("");

  // Load all events and unique shops
  useEffect(() => {
    const loadEventsAndShops = async () => {
      try {
        const events = await apiService.getEvents();
        setFeaturedEvents(events.slice(0, 6));

        // Extract unique shops from events
        const uniqueShops = Array.from(
          new Map(
            events.map((e) => [
              e.shops_id,
              { id: e.shops_id, name: e._shops.name },
            ])
          ).values()
        );
        setShops(uniqueShops);
      } catch (error) {
        console.error("Failed to load featured events:", error);
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

    try {
      const filters = shopId ? { shopId } : {};
      const events = await apiService.getEvents(filters);
      setFeaturedEvents(events.slice(0, 6));
    } catch (error) {
      console.error("Failed to filter events:", error);
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
          <div className="mb-8 flex justify-center">
            <select
              value={selectedShop}
              onChange={(e) => handleShopChange(e.target.value)}
              className="border rounded-md px-4 py-2"
            >
              <option value="">All Shops</option>
              {shops.map((shop) => (
                <option key={shop.id} value={shop.id}>
                  {shop.name}
                </option>
              ))}
            </select>
          </div>

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
          ) : featuredEvents.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
              {featuredEvents.map((event) => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Calendar className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">
                No events available
              </h3>
              <p className="text-muted-foreground mb-6">
                Check back later for exciting new events
              </p>
            </div>
          )}

          <div className="text-center">
            <Button size="lg" variant="outline" asChild>
              <Link to="/events">
                View All Events
                <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Events;
