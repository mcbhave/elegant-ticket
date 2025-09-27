// Updated Header component with guest cart support
import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  Search,
  User,
  Menu,
  X,
  Settings,
  LogOut,
  ExternalLink,
  ShoppingCart,
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
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/hooks/useAuth";
import { useCart } from "@/contexts/CartContext";
import {
  apiService,
  DynamicMenu,
  HeaderProps,
  ShopInfo,
  CustomerUrls,
} from "@/services/api";

// Helper functions remain the same...
const isExternalUrl = (url: string) => {
  if (!url) return false;
  return (
    url.startsWith("http://") ||
    url.startsWith("https://") ||
    url.startsWith("//")
  );
};

const getMenuUrl = (menu: DynamicMenu) => {
  if (menu.name.toLowerCase() === "home") {
    return "/";
  }

  if (menu.custom_url) {
    return menu.custom_url;
  }

  return `/${menu.name.toLowerCase()}`;
};

const shouldOpenInNewWindow = (menu: DynamicMenu) => {
  if (menu.Open_new_window) return true;
  if (menu.custom_url && isExternalUrl(menu.custom_url)) return true;
  return false;
};

export const Header: React.FC<HeaderProps> = ({ shopId }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [dynamicMenus, setDynamicMenus] = useState<DynamicMenu[]>([]);
  const [isLoadingMenus, setIsLoadingMenus] = useState(true);
  const [shopInfo, setShopInfo] = useState<ShopInfo | null>(null);
  const [isLoadingUserAction, setIsLoadingUserAction] = useState(false);
  const { user, isAuthenticated, logout } = useAuth();
  const { itemCount, refreshCart, transferGuestCart } = useCart();
  const navigate = useNavigate();
  const location = useLocation();

  // Helper function to determine if a menu item is active
  const isMenuItemActive = (menuUrl: string, menuName: string) => {
    if (isExternalUrl(menuUrl)) return false;

    if (menuName.toLowerCase() === "home") {
      return location.pathname === "/" || location.pathname === "/home";
    }
    return (
      location.pathname === menuUrl || location.pathname.startsWith(menuUrl)
    );
  };

  // Fetch initial data (menus and shop info)
  useEffect(() => {
    const fetchHeaderData = async () => {
      try {
        setIsLoadingMenus(true);

        // Fetch all menus for header placement
        const allMenus = await apiService.getMenus(shopId);
        const headerMenus = allMenus
          .filter((menu) => menu.is_visible && menu.placement === "header")
          .sort((a, b) => a.seq - b.seq);

        setDynamicMenus(headerMenus);

        // Fetch shops info separately
        const shopInfoData = await apiService.getShopsInfo();
        if (shopInfoData) {
          setShopInfo(shopInfoData);
        }
      } catch (error) {
        console.error("Failed to fetch header data:", error);
      } finally {
        setIsLoadingMenus(false);
      }
    };

    fetchHeaderData();
  }, [shopId]);

  // Handle authentication state changes for cart transfer
  // useEffect(() => {
  //   if (isAuthenticated && user?.id) {
  //     // User just logged in, transfer guest cart
  //     const transferCart = async () => {
  //       try {
  //         await transferGuestCart();
  //       } catch (error) {
  //         console.error("Failed to transfer guest cart in header:", error);
  //       }
  //     };

  //     // Small delay to ensure auth is fully set up
  //     const timeoutId = setTimeout(transferCart, 1000);
  //     return () => clearTimeout(timeoutId);
  //   }
  // }, [isAuthenticated, user?.id, transferGuestCart]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search/${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery("");
    }
  };

  const handleLogout = async () => {
    try {
      logout();
      // Refresh cart to show guest cart after logout
      await refreshCart();
      navigate("/");
    } catch (error) {
      console.error("Failed to handle logout:", error);
      navigate("/");
    }
  };

  // Updated function to handle user menu clicks with guest cart consideration
  const handleUserMenuClick = async (
    menuType: "dashboard" | "cart" | "settings"
  ) => {
    if (!isAuthenticated || !user) {
      // For guests, only allow cart access
      if (menuType === "cart") {
        navigate("/cart");
        return;
      }
      // For other menu types, redirect to auth
      navigate("/auth?tab=signin");
      return;
    }

    if (isLoadingUserAction) {
      return;
    }

    setIsLoadingUserAction(true);

    try {
      // Get base URLs from shopInfo
      const baseUrls = {
        dashboard: shopInfo?.user_dashboard_url || "/dashboard",
        cart: shopInfo?.user_shopping_cart_url || "/cart",
        settings: shopInfo?.user_settings_url || "/settings",
      };

      let finalUrl = baseUrls[menuType];

      // Only fetch customer URLs for dashboard clicks
      if (menuType === "dashboard") {
        try {
          const customerUrls = await apiService.getCustomerUrls();
          if (customerUrls?.external_dashbord_token) {
            finalUrl = finalUrl + customerUrls.external_dashbord_token;
          }
        } catch (apiError) {
          console.error(
            "Failed to fetch customer URLs for dashboard:",
            apiError
          );
        }
      }

      // Handle redirection
      setTimeout(() => {
        if (isExternalUrl(finalUrl)) {
          window.location.href = finalUrl;
        } else {
          navigate(finalUrl);
        }
      }, 100);
    } catch (error) {
      console.error(`Failed to handle ${menuType} menu click:`, error);

      const baseUrls = {
        dashboard: shopInfo?.user_dashboard_url || "/dashboard",
        cart: shopInfo?.user_shopping_cart_url || "/cart",
        settings: shopInfo?.user_settings_url || "/settings",
      };
      const baseUrl = baseUrls[menuType];

      setTimeout(() => {
        if (isExternalUrl(baseUrl)) {
          window.location.href = baseUrl;
        } else {
          navigate(baseUrl);
        }
      }, 100);
    } finally {
      setTimeout(() => {
        setIsLoadingUserAction(false);
      }, 500);
    }
  };

  // Handle cart button click - accessible to both guests and authenticated users
  const handleCartClick = () => {
    navigate("/cart");
  };

  // Get static menu names
  const getMenuNames = () => {
    const sourceInfo =
      shopInfo || (dynamicMenus.length > 0 ? dynamicMenus[0]._shop_info : null);

    return {
      dashboard: sourceInfo?.user_dashboard_name || "Dashboard",
      shoppingCart: sourceInfo?.user_shopping_cart_name || "Shopping Cart",
      settings: sourceInfo?.user_setting_name || "Settings",
      logout: sourceInfo?.user_logout_name || "Log out",
    };
  };

  const menuNames = getMenuNames();

  // Render dynamic menu item function remains the same
  const renderDynamicMenuItem = (menu: DynamicMenu, isMobile = false) => {
    const menuUrl = getMenuUrl(menu);
    const openInNewWindow = shouldOpenInNewWindow(menu);
    const isExternal = isExternalUrl(menuUrl);
    const isActive = !isExternal && isMenuItemActive(menuUrl, menu.name);

    const baseClasses = isMobile
      ? "text-foreground hover:text-primary transition-colors duration-200 font-medium block py-2"
      : "text-foreground/80 hover:text-primary transition-colors duration-200 font-medium relative group";

    const linkProps = {
      className: baseClasses,
      onClick: isMobile ? () => setIsMenuOpen(false) : undefined,
      style: {
        color:
          menu.font_color && menu.font_color !== "null"
            ? menu.font_color
            : undefined,
      },
    };

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
    backgroundColor:
      shopInfo?.menu_header_background_color &&
      shopInfo.menu_header_background_color !== "null"
        ? shopInfo.menu_header_background_color
        : undefined,
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
              <div className="flex items-center justify-center group-hover:shadow-glow transition-all duration-300">
                <img
                  src={shopInfo.logo}
                  alt={`${shopInfo._shops?.name || shopInfo.title}`}
                  className="max-h-12 max-w-24 h-auto w-auto object-contain"
                  style={{
                    minHeight: "32px",
                    minWidth: "32px",
                  }}
                />
              </div>
            )}
            <span className="text-xl font-bold gradient-text hidden sm:block">
              {shopInfo?._shops?.name}
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8 p-10">
            {isLoadingMenus ? (
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
          {!shopInfo?.hide_search_bar && (
            <form
              onSubmit={handleSearch}
              className="hidden lg:flex items-center max-w-sm mx-auto"
            >
              <div className="relative w-full">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                {shopInfo?.header_4_font_color && (
                  <style>
                    {`.search-input::placeholder { color: ${shopInfo.header_4_font_color} !important; }`}
                  </style>
                )}
                <Input
                  type="search"
                  placeholder={shopInfo?.header_4 || "Search..."}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 bg-muted/50 border-0 focus:bg-surface focus:ring-2 focus:ring-primary/20"
                />
              </div>
            </form>
          )}

          {/* User Actions */}
          <div className="flex items-center space-x-4">
            {/* Cart Icon - Always visible for both guests and authenticated users */}
            <Button
              variant="ghost"
              size="sm"
              className="relative"
              onClick={handleCartClick}
              title={isAuthenticated ? "View Cart" : "View Cart (Guest)"}
            >
              <ShoppingCart className="w-5 h-5" />
              {itemCount > 0 && (
                <Badge className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs bg-primary text-primary-foreground">
                  {itemCount > 99 ? "99+" : itemCount}
                </Badge>
              )}
            </Button>

            {isAuthenticated && user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="relative h-8 w-8 rounded-full"
                    disabled={isLoadingUserAction}
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

                  {/* Dynamic Dashboard Menu Item */}
                  <DropdownMenuItem
                    className="cursor-pointer"
                    onClick={() => handleUserMenuClick("dashboard")}
                    disabled={isLoadingUserAction}
                  >
                    <User className="mr-2 h-4 w-4" />
                    {menuNames.dashboard}
                    {isLoadingUserAction && (
                      <span className="ml-auto text-xs text-muted-foreground">
                        Loading...
                      </span>
                    )}
                  </DropdownMenuItem>

                  {/* Dynamic Shopping Cart Menu Item */}
                  {menuNames.shoppingCart && menuNames.shoppingCart.trim() && (
                    <DropdownMenuItem
                      className="cursor-pointer"
                      onClick={() => handleUserMenuClick("cart")}
                      disabled={isLoadingUserAction}
                    >
                      <ShoppingCart className="mr-2 h-4 w-4" />
                      {menuNames.shoppingCart}
                    </DropdownMenuItem>
                  )}

                  {/* Dynamic Settings Menu Item */}
                  {menuNames.settings && menuNames.settings.trim() && (
                    <DropdownMenuItem
                      className="cursor-pointer"
                      onClick={() => handleUserMenuClick("settings")}
                      disabled={isLoadingUserAction}
                    >
                      <Settings className="mr-2 h-4 w-4" />
                      {menuNames.settings}
                    </DropdownMenuItem>
                  )}

                  <DropdownMenuSeparator />

                  {/* Dynamic Logout Menu Item */}
                  <DropdownMenuItem
                    className="cursor-pointer text-destructive focus:text-destructive"
                    onClick={handleLogout}
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    {menuNames.logout}
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
        {!shopInfo?.hide_search_bar && (
          <div className="lg:hidden pb-4">
            <form onSubmit={handleSearch} className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                type="search"
                placeholder={shopInfo?.header_4 || "Search..."}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-muted/50 border-0"
              />
            </form>
          </div>
        )}

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-border py-4">
            <nav className="flex flex-col space-y-4">
              {isLoadingMenus ? (
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
