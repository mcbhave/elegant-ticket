import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Calendar,
  MapPin,
  ArrowRight,
  Search,
  Filter,
  Star,
  Phone,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { EventCard } from "@/components/events/EventCard";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import { useShop } from "@/contexts/ShopContext";
import DynamicSEO from "@/components/DynamicSEO";
import { apiService, ItemCategory, Event } from "@/services/api";

const Index = () => {
  const navigate = useNavigate();
  const [featuredEvents, setFeaturedEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [categories, setCategories] = useState<ItemCategory[]>([]);
  const [categoriesLoading, setCategoriesLoading] = useState(true);

  // Use shared shop data from context
  const { shopData: shopInfo, loading: shopInfoLoading } = useShop();

  // Fetch categories on component mount
  useEffect(() => {
    const fetchCategories = async () => {
      setCategoriesLoading(true);
      try {
        const fetchedCategories = await apiService.getItemsCategories(
          shopInfo?._shops?.id
        );
        setCategories(fetchedCategories);
      } catch (error) {
        console.error("Error fetching categories:", error);
        // Fallback to default categories if API fails
        setCategories([]);
      } finally {
        setCategoriesLoading(false);
      }
    };

    // Only fetch categories if we have shop info or after a reasonable delay
    if (shopInfo?._shops?.id || !shopInfoLoading) {
      fetchCategories();
    }
  }, [shopInfo?._shops?.id, shopInfoLoading]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search/${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery(""); // Clear the search input
    }
  };

  // Function to handle action button clicks
  // Function to handle action button clicks
  const handleActionButtonClick = (button: any) => {
    switch (button.redirect_url_type) {
      case "tel":
        window.location.href = `tel:${button.redirect_url}`;
        break;
      case "email":
        window.location.href = `mailto:${button.redirect_url}`;
        break;
      case "link":
        if (button.Open_in_new_window) {
          window.open(button.redirect_url, "_blank");
        } else {
          // Check if it's an internal route (starts with /) or external URL
          if (button.redirect_url.startsWith("/")) {
            // Internal route - use React Router navigate
            navigate(button.redirect_url);
          } else if (
            button.redirect_url.startsWith("http://") ||
            button.redirect_url.startsWith("https://")
          ) {
            // External URL - navigate in same tab
            window.location.href = button.redirect_url;
          } else {
            // Assume it's an internal route without leading slash
            navigate(`/${button.redirect_url}`);
          }
        }
        break;
      default:
        // Handle as external URL
        if (button.Open_in_new_window) {
          window.open(button.redirect_url, "_blank");
        } else {
          // For external URLs, use window.location.href to open in same tab
          window.location.href = button.redirect_url;
        }
    }
  };

  // Function to get icon based on button type or name
  const getButtonIcon = (button: any) => {
    const name = button.name?.toLowerCase();
    const type = button.redirect_url_type;

    if (type === "tel" || name?.includes("call") || name?.includes("phone")) {
      return <Phone className="w-4 h-4 mr-2" />;
    }
    if (name?.includes("search")) {
      return <Search className="w-4 h-4 mr-2" />;
    }
    return <ArrowRight className="w-4 h-4 mr-2" />;
  };

  // Dynamic stats function to replace hardcoded data
  const getStatsData = () => {
    // Use dynamic stats from API if available
    if (
      shopInfo?._shop_stats_of_shops &&
      shopInfo._shop_stats_of_shops.length > 0
    ) {
      return shopInfo._shop_stats_of_shops
        .sort((a, b) => a.seq - b.seq) // Sort by sequence
        .map((stat) => ({
          label: stat.description,
          value: stat.title,
          icon: stat.image_url ? null : Calendar, // Use Calendar as fallback icon
          image_url: stat.image_url,
        }));
    }

    // Fallback to default stats if no API data
    return [
      { label: "Active Events", value: "2,000+", icon: Calendar },
      { label: "Happy Attendees", value: "50K+", icon: Star },
      { label: "Cities Covered", value: "100+", icon: MapPin },
    ];
  };

  // Fallback categories when API categories are not available
  const defaultCategories = [
    { name: "Music", category_type: "music" },
    { name: "Arts", category_type: "arts" },
    { name: "Sports", category_type: "sports" },
    { name: "Food", category_type: "food" },
    { name: "Tech", category_type: "tech" },
    { name: "Business", category_type: "business" },
  ];

  // Determine which categories to display
  const displayCategories =
    categories.length > 0
      ? categories
      : defaultCategories.map((cat, index) => ({
          id: index,
          name: cat.name,
          category_type: cat.category_type,
          created_at: Date.now(),
          shops_id: "",
          Is_visible: true,
          image_url: "",
          _shop_info: {
            id: 0,
            shops_id: "",
            title: "",
            description: "",
            logo: "",
            Items_categories_title: "",
            Items_categories_description: "",
          },
        }));

  return (
    <div className="min-h-screen bg-background">
      {/* Dynamic SEO Component - Uses shop defaults */}
      <DynamicSEO />

      <Header />

      {/* Hero Section */}
      <section className="relative h-[90vh] flex items-center justify-center overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            ...(shopInfo?.home_image_url && !shopInfo?.hide_home_image_url
              ? {
                  backgroundImage: `url(${shopInfo.home_image_url})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                  backgroundRepeat: "no-repeat",
                }
              : {
                  backgroundColor: shopInfo?.home_background_color,
                }),
          }}
        />
        <div className="absolute inset-0 bg-black/50" />

        <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 text-center text-white">
          {/* Main Heading - Use header_1 */}
          <h1
            className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 tracking-tight"
            style={{
              color: shopInfo?.header_1_font_color || "#ffffff",
            }}
          >
            {shopInfoLoading ? (
              <div className="inline-flex items-center">
                <div className="animate-pulse bg-white/20 h-16 w-96 rounded-lg"></div>
              </div>
            ) : (
              shopInfo?.header_1
            )}
          </h1>

          {/* Description - Use shop description */}
          <div
            className="text-xl md:text-2xl mb-8 text-white/90 max-w-3xl mx-auto leading-relaxed"
            style={{
              color: shopInfo?.header_2_font_color || "#ffffff",
            }}
          >
            {shopInfoLoading ? (
              <div className="space-y-3">
                <div className="animate-pulse bg-white/20 h-6 w-full rounded"></div>
                <div className="animate-pulse bg-white/20 h-6 w-3/4 mx-auto rounded"></div>
              </div>
            ) : (
              shopInfo?.description
            )}
          </div>

          {/* Secondary Header - Use header_2 if different from header_1 */}
          {shopInfo?.header_2 && shopInfo?.header_2 !== shopInfo?.header_1 && (
            <h2
              className="text-2xl md:text-3xl mb-6 font-semibold"
              style={{
                color: shopInfo?.header_2_font_color || "#ffffff",
              }}
            ></h2>
          )}

          {/* Header 3 - if available */}
          {shopInfo?.header_3 && (
            <h3
              className="text-xl md:text-2xl mb-4 font-medium"
              style={{
                color: shopInfo?.header_3_font_color || "#ffffff",
              }}
            >
              {shopInfo.header_3}
            </h3>
          )}

          {/* Search Form */}
          {!shopInfo?.hide_search_bar && (
            <form onSubmit={handleSearch} className="max-w-2xl mx-auto mb-8">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white/60 w-5 h-5" />
                {shopInfo?.header_4_font_color && (
                  <style>
                    {`.search-input::placeholder { color: ${shopInfo.header_4_font_color} !important; }`}
                  </style>
                )}
                <Input
                  type="search"
                  placeholder={
                    shopInfoLoading ? "Loading..." : shopInfo?.header_4
                  }
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="search-input pl-12 pr-32 py-4 text-lg bg-white/10 border-white/20 text-white focus:bg-white/20 backdrop-blur-sm"
                  disabled={shopInfoLoading}
                />
                <Button
                  type="submit"
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 btn-glow"
                  style={{
                    color: shopInfo?.header_5_font_color || "#ffffff",
                  }}
                >
                  <Search className="w-4 h-4 mr-2" />
                  {shopInfo?.header_5 || "Search"}
                </Button>
              </div>
            </form>
          )}

          {/* Dynamic Action Buttons from API */}
          {shopInfo?._shop_action_buttons_of_shops?.items &&
            shopInfo._shop_action_buttons_of_shops.items.length > 0 && (
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                {shopInfo._shop_action_buttons_of_shops.items
                  .sort((a: any, b: any) => a.seq - b.seq) // Sort by sequence
                  .map((button: any) => (
                    <Button
                      key={button.id}
                      size="lg"
                      onClick={() => handleActionButtonClick(button)}
                      className="btn-glow hover:opacity-90 transition-opacity"
                      style={{
                        backgroundColor: button.background_color || "#7c3bed",
                        color: button.font_color || "#ffffff",
                      }}
                    >
                      {getButtonIcon(button)}
                      {button.name}
                    </Button>
                  ))}
              </div>
            )}
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center">
            <div className="w-1 h-3 bg-white/50 rounded-full mt-2"></div>
          </div>
        </div>
      </section>

      {/* Dynamic Stats Section */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {getStatsData().map((stat, index) => (
              <Card
                key={index}
                className="text-center bg-card border shadow-lg"
              >
                <CardContent className="p-8">
                  {stat.image_url ? (
                    <img
                      src={stat.image_url}
                      alt={stat.label}
                      className="w-48 h-48 mx-auto mb-4 object-contain"
                      onError={(e) => {
                        // Fallback to Calendar icon if image fails
                        const target = e.target as HTMLImageElement;
                        target.style.display = "none";
                        const fallbackIcon = document.createElement("div");
                        fallbackIcon.innerHTML =
                          '<svg class="w-12 h-12 text-primary mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>';
                        target.parentNode?.appendChild(fallbackIcon);
                      }}
                    />
                  ) : (
                    stat.icon && (
                      <stat.icon className="w-12 h-12 text-primary mx-auto mb-4" />
                    )
                  )}
                  <h3 className="text-3xl font-bold mb-2">{stat.value}</h3>
                  <div className="text-muted-foreground">{stat.label}</div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">
              {shopInfo?.Items_categories_title || "Popular Categories"}
            </h2>
            <div className="text-xl text-muted-foreground">
              {shopInfo?.Items_categories_description ||
                "Find events that match your interests"}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6 justify-items-center">
            {categoriesLoading ? (
              // Loading skeleton
              Array.from({ length: 6 }).map((_, index) => (
                <Card
                  key={index}
                  className="bg-card border shadow-lg w-full max-w-[280px]"
                >
                  <CardContent className="p-10 text-center">
                    <div className="w-32 h-32 bg-gray-200 mx-auto mb-6 animate-pulse rounded-lg"></div>
                    <div className="h-6 bg-gray-200 rounded animate-pulse"></div>
                  </CardContent>
                </Card>
              ))
            ) : displayCategories.length > 0 ? (
              displayCategories.map((category) => (
                <Link
                  key={category.id}
                  to={`/search/${encodeURIComponent(category.category_type)}`}
                  className="group w-full max-w-[280px]"
                >
                  <Card className="card-hover bg-card border shadow-lg h-full min-h-[280px] w-full transform transition-all duration-300 hover:scale-105 hover:shadow-xl">
                    <CardContent className="p-10 text-center flex flex-col items-center justify-center h-full">
                      <div className="w-32 h-32 flex items-center justify-center mx-auto mb-6 rounded-lg overflow-hidden">
                        {category.image_url ? (
                          <img
                            src={category.image_url}
                            alt={category.name}
                            className="w-full h-full object-contain bg-transparent transition-transform duration-300 group-hover:scale-110"
                            style={{ background: "transparent" }}
                            onError={(e) => {
                              // Fallback to Calendar icon if image fails to load
                              const target = e.target as HTMLImageElement;
                              target.style.display = "none";
                              const calendarIcon =
                                document.createElement("div");
                              calendarIcon.innerHTML =
                                '<svg class="w-16 h-16 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>';
                              target.parentNode?.appendChild(calendarIcon);
                            }}
                          />
                        ) : (
                          <Calendar className="w-16 h-16 text-primary transition-transform duration-300 group-hover:scale-110" />
                        )}
                      </div>
                      <h3 className="font-semibold text-lg group-hover:text-primary transition-colors leading-tight">
                        {category.name}
                      </h3>
                    </CardContent>
                  </Card>
                </Link>
              ))
            ) : (
              // Empty state
              <div className="col-span-full text-center py-8">
                <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">No categories available</p>
              </div>
            )}
          </div>
        </div>
      </section>
      {/* CTA Section */}
      <section
        className="py-20 text-white"
        style={{
          backgroundColor: shopInfo?.header_7_background_color || "#7c3bed",
        }}
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2
            className="text-4xl font-bold mb-4"
            style={{
              color: shopInfo?.header_7_font_color || "#ffffff",
            }}
          >
            {shopInfo?.header_7 || "Ready to Join the Experience?"}
          </h2>
          <div
            className="text-xl mb-8 text-white/90 max-w-2xl mx-auto"
            style={{
              color: shopInfo?.header_8_font_color || "#ffffff",
            }}
          >
            {shopInfo?.header_8}
          </div>
          <Button
            size="lg"
            asChild
            className="btn-glow hover:opacity-90 transition-opacity"
            style={{
              backgroundColor: shopInfo?.header_9_background_color || "#ffffff",
              color: shopInfo?.header_9_font_color || "#000000",
            }}
          >
            <Link to="/auth?tab=signup">
              {shopInfo?.header_9}
              <ArrowRight className="ml-2 w-5 h-5" />
            </Link>
          </Button>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Index;
