import React, { useState, useEffect } from "react";
import { useParams, useSearchParams, Link } from "react-router-dom";
import {
  Search,
  Calendar,
  MapPin,
  Clock,
  Star,
  Building,
  Tag,
  ArrowLeft,
  Filter,
  Grid,
  List,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { EventCard } from "@/components/events/EventCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Event } from "@/types";
import { apiService, SearchResponse } from "@/services/api";

const SearchResults = () => {
  const { query: urlQuery } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const [events, setEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState(urlQuery || "");
  const [searchResponse, setSearchResponse] = useState<SearchResponse | null>(
    null
  );
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  // Get shop ID from URL params if needed
  const shopId = searchParams.get("shopId");

  useEffect(() => {
    const loadSearchResults = async () => {
      try {
        setIsLoading(true);

        if (urlQuery) {
          // Use the search API endpoint
          const response = await apiService.searchItems(
            urlQuery,
            shopId || undefined
          );
          if (response) {
            setSearchResponse(response);
            setEvents(response.items || []);
          }
        }
      } catch (error) {
        console.error("Failed to load search results:", error);
        setEvents([]);
      } finally {
        setIsLoading(false);
      }
    };

    if (urlQuery) {
      loadSearchResults();
    } else {
      setIsLoading(false);
    }
  }, [urlQuery, shopId]);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // Navigate to new search URL
      const newUrl = `/search/${encodeURIComponent(searchQuery.trim())}${
        shopId ? `?shopId=${shopId}` : ""
      }`;
      window.location.href = newUrl;
    }
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // Render event in list view
  const renderEventListItem = (event: Event) => {
    const eventImage =
      // @ts-ignore
      event._item_images_of_items?.items?.[0]?.display_image ||
      "https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?w=800&auto=format&fit=crop&q=80";

    // @ts-ignore
    const eventTags = event.tags
      ? event.tags.split(",").map((tag) => tag.trim())
      : [];

    return (
      <Card
        key={event.id}
        className="bg-gradient-card border-0 shadow-card hover:shadow-lg transition-all duration-300"
      >
        <CardContent className="p-0">
          <div className="flex flex-col md:flex-row">
            {/* Event Image */}
            <div className="md:w-80 h-48 md:h-auto relative overflow-hidden rounded-l-lg">
              <img
                src={eventImage}
                alt={event.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
            </div>

            {/* Event Details */}
            <div className="flex-1 p-6">
              <div className="flex flex-col h-full">
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <Link
                      to={`/events/${event.id}`}
                      className="hover:text-primary transition-colors"
                    >
                      <h3 className="text-xl font-bold mb-2 line-clamp-2">
                        {event.title}
                      </h3>
                    </Link>

                    {/* Shop Info */}
                    {event._shops && (
                      <div className="flex items-center space-x-2 mb-3">
                        <div className="w-6 h-6 bg-white rounded flex items-center justify-center p-0.5">
                          <img
                            src={event._shops.logo}
                            alt={event._shops.name}
                            className="w-full h-full object-contain"
                          />
                        </div>
                        <span className="text-sm text-muted-foreground">
                          {event._shops.name}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Price */}
                  {event._events_seo_of_items?.price && (
                    <div className="text-right">
                      <div className="text-2xl font-bold text-primary">
                        ₹{event._events_seo_of_items.price}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        per ticket
                      </div>
                    </div>
                  )}
                </div>

                {/* Description */}
                <p className="text-muted-foreground mb-4 line-clamp-3">
                  {event.description}
                </p>

                {/* Event Meta */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
                  {event._events_seo_of_items?.start_time && (
                    <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                      <Calendar className="w-4 h-4 text-primary" />
                      <span>
                        {formatDate(event._events_seo_of_items.start_time)}
                      </span>
                    </div>
                  )}

                  {event._events_seo_of_items?.start_time && (
                    <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                      <Clock className="w-4 h-4 text-primary" />
                      <span>
                        {new Date(
                          event._events_seo_of_items.start_time
                        ).toLocaleTimeString("en-US", {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    </div>
                  )}

                  {event._events_seo_of_items?.address && (
                    <div className="flex items-center space-x-2 text-sm text-muted-foreground sm:col-span-2">
                      <MapPin className="w-4 h-4 text-primary" />
                      <span className="line-clamp-1">
                        {event._events_seo_of_items.address}
                      </span>
                    </div>
                  )}
                </div>

                {/* Tags */}
                {eventTags.length > 0 && (
                  <div className="flex flex-wrap gap-1 mb-4">
                    {eventTags.slice(0, 3).map((tag, index) => (
                      <Badge
                        key={index}
                        variant="secondary"
                        className="bg-primary/10 text-primary text-xs"
                      >
                        {tag}
                      </Badge>
                    ))}
                    {eventTags.length > 3 && (
                      <Badge variant="secondary" className="text-xs">
                        +{eventTags.length - 3}
                      </Badge>
                    )}
                  </div>
                )}

                {/* Action Button */}
                <div className="mt-auto">
                  <Button asChild className="w-full sm:w-auto">
                    <Link to={`/items/${event.id}`}>View Details</Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="min-h-screen bg-background">
      <Header shopId={shopId || undefined} />

      {/* Search Header */}
      <section className="py-12 border-b border-border">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center space-x-4 mb-6">
            <Button variant="ghost" asChild>
              <Link to="/events">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Events
              </Link>
            </Button>
          </div>

          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold mb-4">
              Search Results
              {urlQuery && (
                <span className="text-primary"> for "{urlQuery}"</span>
              )}
            </h1>
            {searchResponse && (
              <p className="text-xl text-muted-foreground">
                Found {searchResponse.itemsReceived} event
                {searchResponse.itemsReceived !== 1 ? "s" : ""}
                {searchResponse.itemsReceived > 0 && (
                  <span> on page {searchResponse.curPage}</span>
                )}
              </p>
            )}
          </div>

          {/* Search Form */}
          <form onSubmit={handleSearch} className="max-w-2xl mx-auto">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
              <Input
                type="search"
                placeholder="Search events, venues, organizers..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 pr-4 h-12 text-lg bg-muted/50 border-0 focus:bg-surface focus:ring-2 focus:ring-primary/20"
              />
              <Button
                type="submit"
                className="absolute right-2 top-1/2 transform -translate-y-1/2 h-8"
              >
                Search
              </Button>
            </div>
          </form>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          {isLoading ? (
            <div className="text-center py-16">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-muted-foreground">Searching events...</p>
            </div>
          ) : events.length === 0 ? (
            <div className="text-center py-16">
              <Search className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <h2 className="text-2xl font-bold mb-4">No events found</h2>
              <p className="text-muted-foreground mb-8 max-w-md mx-auto">
                {urlQuery
                  ? `We couldn't find any events matching "${urlQuery}". Try different keywords or browse all events.`
                  : "Enter a search term to find events."}
              </p>
              <div className="space-x-4">
                <Button asChild variant="outline">
                  <Link to="/events">Browse All Events</Link>
                </Button>
              </div>
            </div>
          ) : (
            <>
              {/* View Mode Controls */}
              <div className="flex justify-start items-center mb-8">
                <div className="flex items-center space-x-2">
                  <Button
                    variant={viewMode === "grid" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setViewMode("grid")}
                  >
                    <Grid className="w-4 h-4" />
                  </Button>
                  <Button
                    variant={viewMode === "list" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setViewMode("list")}
                  >
                    <List className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              {/* Events Grid/List */}
              {viewMode === "grid" ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {events.map((event) => (
                    <EventCard key={event.id} event={event} />
                  ))}
                </div>
              ) : (
                <div className="space-y-6">
                  {events.map((event) => renderEventListItem(event))}
                </div>
              )}

              {/* Pagination Info */}
              {searchResponse && searchResponse.itemsReceived > 0 && (
                <div className="mt-12 text-center">
                  <p className="text-muted-foreground">
                    Showing {searchResponse.itemsReceived} of{" "}
                    {searchResponse.itemsReceived} results
                    {searchResponse.nextPage && (
                      <span className="ml-2">
                        <Button variant="outline" size="sm">
                          Load More
                        </Button>
                      </span>
                    )}
                  </p>
                </div>
              )}
            </>
          )}
        </div>
      </section>

      <Footer shopId={shopId || undefined} />
    </div>
  );
};

export default SearchResults;
