import React, { useState } from "react";
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

const Index = () => {
  const navigate = useNavigate();
  const [featuredEvents, setFeaturedEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  // Use shared shop data from context
  const { shopData: shopInfo, loading: shopInfoLoading } = useShop();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search/${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery(""); // Clear the search input
    }
  };

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
          navigate(button.redirect_url);
        }
        break;
      default:
        // Handle as external URL
        if (button.Open_in_new_window) {
          window.open(button.redirect_url, "_blank");
        } else {
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

  const stats = [
    { label: "Active Events", value: "2,000+", icon: Calendar },
    { label: "Happy Attendees", value: "50K+", icon: Star },
    { label: "Cities Covered", value: "100+", icon: MapPin },
  ];

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

          {/* Description - Use shop description - FIXED: Changed p to div */}
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
            >
              {shopInfo.header_2}
            </h2>
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
                      className="btn-glow bg-primary text-primary-foreground hover:bg-primary/90"
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

      {/* Stats Section */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {stats.map((stat, index) => (
              <Card
                key={index}
                className="text-center bg-card border shadow-lg"
              >
                <CardContent className="p-8">
                  <stat.icon className="w-12 h-12 text-primary mx-auto mb-4" />
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

          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {["Music", "Arts", "Sports", "Food", "Tech", "Business"].map(
              (category) => (
                <Link
                  key={category}
                  to={`/events?category=${category.toLowerCase()}`}
                  className="group"
                >
                  <Card className="card-hover bg-card border shadow-lg">
                    <CardContent className="p-6 text-center">
                      <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3 group-hover:bg-primary/20 transition-colors">
                        <Calendar className="w-6 h-6 text-primary" />
                      </div>
                      <h3 className="font-semibold group-hover:text-primary transition-colors">
                        {category}
                      </h3>
                    </CardContent>
                  </Card>
                </Link>
              )
            )}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary text-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold mb-4">
            Ready to Join the Experience?
          </h2>
          <div className="text-xl mb-8 text-white/90 max-w-2xl mx-auto">
            Create your account today and start discovering amazing events in
            your area
          </div>
          <Button
            size="lg"
            asChild
            className="btn-glow bg-white text-foreground hover:bg-white/90"
          >
            <Link to="/auth?tab=signup">
              Get Started Now
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
