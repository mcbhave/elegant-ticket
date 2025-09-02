// Complete updated Footer component with dynamic functionality
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ExternalLink } from "lucide-react";
import { apiService, DynamicMenu, FooterProps, ShopInfo } from "@/services/api";

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

const shouldOpenInNewWindow = (menu: DynamicMenu) => {
  if (menu.Open_new_window) return true;

  if (menu.custom_url && isExternalUrl(menu.custom_url)) return true;

  return false;
};

export const Footer: React.FC<FooterProps> = ({ shopId }) => {
  const [dynamicMenus, setDynamicMenus] = useState<DynamicMenu[]>([]);
  const [isLoadingMenus, setIsLoadingMenus] = useState(true);
  const [shopInfo, setShopInfo] = useState<ShopInfo | null>(null);

  useEffect(() => {
    const fetchFooterData = async () => {
      try {
        setIsLoadingMenus(true);

        // Fetch all menus for footer placement
        const allMenus = await apiService.getMenus(shopId);
        const footerMenus = allMenus
          .filter((menu) => menu.is_visible && menu.placement === "footer")
          .sort((a, b) => a.seq - b.seq);

        setDynamicMenus(footerMenus);

        // Fetch shops info separately to get the shop name
        const shopInfoData = await apiService.getShopsInfo();
        if (shopInfoData) {
          setShopInfo(shopInfoData);
        }
      } catch (error) {
        console.error("Failed to load footer data:", error);
      } finally {
        setIsLoadingMenus(false);
      }
    };

    fetchFooterData();
  }, [shopId]);

  const renderDynamicMenuItem = (menu: DynamicMenu) => {
    const menuUrl = getMenuUrl(menu);
    const openInNewWindow = shouldOpenInNewWindow(menu);
    const isExternal = isExternalUrl(menuUrl);

    const linkProps = {
      className: "hover:text-primary transition-colors",
      style: {
        color: menu.font_color || undefined,
      },
    };

    if (openInNewWindow || isExternal) {
      return (
        <li key={menu.id}>
          <a
            href={menuUrl}
            target="_blank"
            rel="noopener noreferrer"
            {...linkProps}
          >
            <span className="flex items-center">
              {menu.display_name}
              <ExternalLink className="w-3 h-3 ml-1" />
            </span>
          </a>
        </li>
      );
    }

    // Handle internal URLs
    return (
      <li key={menu.id}>
        <Link to={menuUrl} {...linkProps}>
          {menu.display_name}
        </Link>
      </li>
    );
  };

  // Dynamic footer styles
  const footerStyle = {
    backgroundColor: shopInfo?.menu_footer_background_color || undefined,
  };

  return (
    <footer className="py-12 border-t border-border" style={footerStyle}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Section - Updated to use _shops.name */}
          {shopInfo && (
            <div>
              <div className="flex items-center space-x-2 mb-4">
                {shopInfo.logo && (
                  <img
                    src={shopInfo.logo}
                    alt={`${shopInfo._shops?.name || shopInfo.title} Logo`}
                    className="w-8 h-8 object-contain"
                  />
                )}
                {/* Use _shops.name if available, fallback to title */}
                {shopInfo._shops?.name && (
                  <span className="text-xl font-bold gradient-text">
                    {shopInfo._shops.name}
                  </span>
                )}
              </div>
              {shopInfo.description && (
                <p className="text-muted-foreground">{shopInfo.description}</p>
              )}
            </div>
          )}

          {/* Dynamic Footer Menus */}
          {dynamicMenus.length > 0 && (
            <div>
              <h3 className="font-semibold mb-4">Quick Links</h3>
              {isLoadingMenus ? (
                // Loading skeleton
                <ul className="space-y-2 text-muted-foreground">
                  {[1, 2, 3].map((i) => (
                    <li key={i}>
                      <div className="h-4 w-20 bg-muted animate-pulse rounded" />
                    </li>
                  ))}
                </ul>
              ) : (
                <ul className="space-y-2 text-muted-foreground">
                  {dynamicMenus.map((menu) => renderDynamicMenuItem(menu))}
                </ul>
              )}
            </div>
          )}

          {/* Static Platform Section */}
          <div>
            <h3 className="font-semibold mb-4">Platform</h3>
            <ul className="space-y-2 text-muted-foreground">
              <li>
                <Link
                  to="/events"
                  className="hover:text-primary transition-colors"
                >
                  Browse Events
                </Link>
              </li>
              <li>
                <Link
                  to="/auth"
                  className="hover:text-primary transition-colors"
                >
                  Sign Up
                </Link>
              </li>
              <li>
                <Link
                  to="/dashboard"
                  className="hover:text-primary transition-colors"
                >
                  Dashboard
                </Link>
              </li>
            </ul>
          </div>

          {/* Static Support Section */}
          <div>
            <h3 className="font-semibold mb-4">Support</h3>
            <ul className="space-y-2 text-muted-foreground">
              <li>
                <Link
                  to="/help"
                  className="hover:text-primary transition-colors"
                >
                  Help Center
                </Link>
              </li>
              <li>
                <Link
                  to="/contact"
                  className="hover:text-primary transition-colors"
                >
                  Contact Us
                </Link>
              </li>
              <li>
                <Link
                  to="/terms"
                  className="hover:text-primary transition-colors"
                >
                  Terms
                </Link>
              </li>
              <li>
                <Link
                  to="/privacy"
                  className="hover:text-primary transition-colors"
                >
                  Privacy
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Dynamic Copyright - Only show if exists */}
        {shopInfo?.copyright_text && (
          <div className="mt-8 pt-8 border-t border-border text-center text-muted-foreground">
            <p>{shopInfo.copyright_text}</p>
          </div>
        )}
      </div>
    </footer>
  );
};
