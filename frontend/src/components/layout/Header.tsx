// Complete updated Header component with full dynamic functionality
import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  Search,
  User,
  Menu,
  X,
  Calendar,
  Settings,
  LogOut,
  ExternalLink,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "@/hooks/useAuth";
import { apiService } from "@/services/api";

// Dynamic menu interface
interface DynamicMenu {
  id: number;
  created_at: number;
  shops_id: string;
  name: string;
  seq: number;
  display_name: string;
  is_visible: boolean;
  custom_url: string;
  Open_new_window: boolean;
  category: string;
  placement: string;
  image_url: string;
  background_color: string;
  font_color: string;
  _shop_info: {
    id: number;
    shops_id: string;
    title: string;
    description: string;
    logo: string;
    menu_header_background_color: string;
    menu_footer_background_color: string;
    copyright_text: string;
  };
}

interface HeaderProps {
  shopId?: string;
}

// Helper function to determine if URL is external
const isExternalUrl = (url: string) => {
  if (!url) return false;
  return (
    url.startsWith("http://") ||
    url.startsWith("https://") ||
    url.startsWith("//")
  );
};

// Helper function to get the correct URL for a menu item
const getMenuUrl = (menu: DynamicMenu) => {
  if (menu.name.toLowerCase() === "home") {
    return "/";
  }

  // If custom_url exists, use it as is
  if (menu.custom_url) {
    return menu.custom_url;
  }

  // Fallback to name-based URL
  return `/${menu.name.toLowerCase()}`;
};

// Helper function to determine if menu should open in new window
const shouldOpenInNewWindow = (menu: DynamicMenu) => {
  // If explicitly set to open in new window
  if (menu.Open_new_window) return true;

  // If it's an external URL, open in new window
  if (menu.custom_url && isExternalUrl(menu.custom_url)) return true;

  return false;
};

export const Header: React.FC<HeaderProps> = ({ shopId }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [dynamicMenus, setDynamicMenus] = useState<DynamicMenu[]>([]);
  const [isLoadingMenus, setIsLoadingMenus] = useState(true);
  const [shopInfo, setShopInfo] = useState<DynamicMenu["_shop_info"] | null>(
    null
  );
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Helper function to determine if a menu item is active (only for internal URLs)
  const isMenuItemActive = (menuUrl: string, menuName: string) => {
    // Don't mark external URLs as active
    if (isExternalUrl(menuUrl)) return false;

    if (menuName.toLowerCase() === "home") {
      return location.pathname === "/" || location.pathname === "/home";
    }
    return (
      location.pathname === menuUrl || location.pathname.startsWith(menuUrl)
    );
  };

  // Fetch dynamic menus and shop info
  useEffect(() => {
    const fetchHeaderData = async () => {
      try {
        setIsLoadingMenus(true);

        // Fetch all menus to get shop info and header menus
        const allMenus = await apiService.getMenus(shopId);

        // Filter for header placement and visible menus
        const headerMenus = allMenus
          .filter((menu) => menu.is_visible && menu.placement === "header")
          .sort((a, b) => a.seq - b.seq);

        setDynamicMenus(headerMenus);

        // Extract shop info from the first menu item (they all have the same shop info)
        if (headerMenus.length > 0) {
          setShopInfo(headerMenus[0]._shop_info);
        }
      } catch (error) {
        console.error("Failed to load header data:", error);
        // Fallback to default menus if API fails
        setDynamicMenus([
          {
            id: 1,
            created_at: Date.now(),
            shops_id: shopId || "",
            name: "home",
            seq: 0,
            display_name: "Home",
            is_visible: true,
            custom_url: "/",
            Open_new_window: false,
            category: "Company",
            placement: "header",
            image_url: "",
            background_color: "#ffffff",
            font_color: "",
            _shop_info: {
              id: 1,
              shops_id: shopId || "",
              title: "Your Shop",
              description: "Welcome to our shop",
              logo: "",
              menu_header_background_color: "",
              menu_footer_background_color: "",
              copyright_text: "© 2025 All rights reserved.",
            },
          },
        ]);

        // Set default shop info
        setShopInfo({
          id: 1,
          shops_id: shopId || "",
          title: "Your Shop",
          description: "Welcome to our shop",
          logo: "",
          menu_header_background_color: "",
          menu_footer_background_color: "",
          copyright_text: "© 2025 All rights reserved.",
        });
      } finally {
        setIsLoadingMenus(false);
      }
    };

    fetchHeaderData();
  }, [shopId]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search/${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery("");
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  // Render dynamic menu item
  const renderDynamicMenuItem = (menu: DynamicMenu, isMobile = false) => {
    const menuUrl = getMenuUrl(menu);
    const openInNewWindow = shouldOpenInNewWindow(menu);
    const isExternal = isExternalUrl(menuUrl);

    // For internal URLs, check if active
    const isActive = !isExternal && isMenuItemActive(menuUrl, menu.name);

    const baseClasses = isMobile
      ? "text-foreground hover:text-primary transition-colors duration-200 font-medium block py-2"
      : "text-foreground/80 hover:text-primary transition-colors duration-200 font-medium relative group";

    const linkProps = {
      className: baseClasses,
      onClick: isMobile ? () => setIsMenuOpen(false) : undefined,
      style: {
        color: menu.font_color || undefined,
      },
    };

    // Handle external URLs or URLs that should open in new window
    if (openInNewWindow || isExternal) {
      return (
        <a
          key={menu.id}
          href={menuUrl}
          target="_blank"
          rel="noopener noreferrer"
          {...linkProps}
        >
          <span className="flex items-center">
            {menu.display_name}
            {!isMobile && <ExternalLink className="w-3 h-3 ml-1" />}
          </span>
          {!isMobile && (
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full" />
          )}
        </a>
      );
    }

    // Handle internal URLs
    return (
      <Link key={menu.id} to={menuUrl} {...linkProps}>
        {menu.display_name}
        {!isMobile && !isActive && (
          <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full" />
        )}
        {!isMobile && isActive && (
          <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-primary" />
        )}
      </Link>
    );
  };

  // Dynamic header styles
  const headerStyle = {
    backgroundColor: shopInfo?.menu_header_background_color || undefined,
  };

  return (
    <header
      className="sticky top-0 z-50 w-full bg-background/80 backdrop-blur-xl border-b border-border shadow-sm"
      style={headerStyle}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3 group">
            {shopInfo?.logo && (
              <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center group-hover:shadow-glow transition-all duration-300 p-1">
                <img
                  src={shopInfo.logo}
                  alt={`${shopInfo.title} `}
                  className="w-full h-full object-contain"
                />
              </div>
            )}
            <span className="text-xl font-bold gradient-text hidden sm:block">
              {shopInfo?.title}
            </span>
          </Link>

          {/* Desktop Navigation - Dynamic Menus */}
          <nav className="hidden md:flex items-center space-x-8 p-10">
            {isLoadingMenus ? (
              // Loading skeleton
              <div className="flex space-x-8">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="h-5 w-16 bg-muted animate-pulse rounded"
                  />
                ))}
              </div>
            ) : (
              dynamicMenus.map((menu) => renderDynamicMenuItem(menu, false))
            )}
          </nav>

          {/* Search Bar */}
          <form
            onSubmit={handleSearch}
            className="hidden lg:flex items-center max-w-sm mx-auto"
          >
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                type="search"
                placeholder="Search events..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-muted/50 border-0 focus:bg-surface focus:ring-2 focus:ring-primary/20"
              />
            </div>
          </form>

          {/* User Actions */}
          <div className="flex items-center space-x-4">
            {isAuthenticated && user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="relative h-8 w-8 rounded-full"
                  >
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={user.avatar} alt={user.name} />
                      <AvatarFallback className="bg-primary text-primary-foreground">
                        {user?.name?.charAt(0).toUpperCase() || "U"}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <div className="flex items-center justify-start gap-2 p-2">
                    <div className="flex flex-col space-y-1 leading-none">
                      <p className="font-medium">{user.name}</p>
                      <p className="w-48 truncate text-sm text-muted-foreground">
                        {user.email}
                      </p>
                    </div>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link to="/dashboard" className="w-full cursor-pointer">
                      <User className="mr-2 h-4 w-4" />
                      Dashboard
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/my-passes" className="w-full cursor-pointer">
                      <Calendar className="mr-2 h-4 w-4" />
                      My Passes
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/settings" className="w-full cursor-pointer">
                      <Settings className="mr-2 h-4 w-4" />
                      Settings
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    className="cursor-pointer text-destructive focus:text-destructive"
                    onClick={handleLogout}
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    Log out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="flex items-center space-x-2">
                <Button asChild className="btn-glow">
                  <Link to="/auth?tab=signup">Sign In</Link>
                </Button>
              </div>
            )}

            {/* Mobile menu button */}
            <Button
              variant="ghost"
              size="sm"
              className="md:hidden"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Search */}
        <div className="lg:hidden pb-4">
          <form onSubmit={handleSearch} className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              type="search"
              placeholder="Search events..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-muted/50 border-0"
            />
          </form>
        </div>

        {/* Mobile Navigation - Dynamic Menus */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-border py-4">
            <nav className="flex flex-col space-y-4">
              {isLoadingMenus ? (
                // Loading skeleton for mobile
                <div className="space-y-4">
                  {[1, 2, 3].map((i) => (
                    <div
                      key={i}
                      className="h-5 w-24 bg-muted animate-pulse rounded"
                    />
                  ))}
                </div>
              ) : (
                dynamicMenus.map((menu) => renderDynamicMenuItem(menu, true))
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};
