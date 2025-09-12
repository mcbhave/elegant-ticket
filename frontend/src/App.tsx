import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import React, { ReactNode, useEffect } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext, useAuthProvider } from "@/hooks/useAuth";
import { ShopProvider, useShop } from "@/contexts/ShopContext";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import NotFound from "./pages/NotFound";
import Events from "./pages/Events";
import EventDetails from "./pages/EventDetails";
import Products from "./pages/Products";
import ProductDetails from "./pages/ProductDetails";
import SearchResults from "./pages/SearchResults";

const queryClient = new QueryClient();

// AuthProvider component using your existing auth hook
const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const auth = useAuthProvider();

  return <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>;
};

// SEO Injection Component
const SEOInjector: React.FC = () => {
  const { shopData } = useShop(); // Assuming your ShopContext provides shopData

  useEffect(() => {
    if (shopData?.seo_script_text) {
      // Create a temporary div to hold the HTML string
      const tempDiv = document.createElement("div");
      tempDiv.innerHTML = shopData.seo_script_text;

      // Get all script and meta tags from the temp div
      const scripts = tempDiv.querySelectorAll("script");
      const metaTags = tempDiv.querySelectorAll("meta");
      const links = tempDiv.querySelectorAll("link");

      // Store references for cleanup
      const addedElements: Element[] = [];

      // Append script tags to body (as requested by your manager)
      scripts.forEach((script) => {
        const newScript = document.createElement("script");
        // Copy all attributes
        Array.from(script.attributes).forEach((attr) => {
          newScript.setAttribute(attr.name, attr.value);
        });
        // Copy content
        newScript.textContent = script.textContent;
        document.body.appendChild(newScript);
        addedElements.push(newScript);
      });

      // Append meta tags to head (for SEO purposes)
      metaTags.forEach((meta) => {
        // Check if meta tag already exists to avoid duplicates
        const existingMeta = document.head.querySelector(
          `meta[${Array.from(meta.attributes)
            .map((attr) => `${attr.name}="${attr.value}"`)
            .join("][")}]`
        );
        if (!existingMeta) {
          const newMeta = document.createElement("meta");
          Array.from(meta.attributes).forEach((attr) => {
            newMeta.setAttribute(attr.name, attr.value);
          });
          document.head.appendChild(newMeta);
          addedElements.push(newMeta);
        }
      });

      // Append link tags to head
      links.forEach((link) => {
        // Check if link already exists to avoid duplicates
        const href = link.getAttribute("href");
        const rel = link.getAttribute("rel");
        if (href && rel) {
          const existingLink = document.head.querySelector(
            `link[href="${href}"][rel="${rel}"]`
          );
          if (!existingLink) {
            const newLink = document.createElement("link");
            Array.from(link.attributes).forEach((attr) => {
              newLink.setAttribute(attr.name, attr.value);
            });
            document.head.appendChild(newLink);
            addedElements.push(newLink);
          }
        }
      });

      // Cleanup function - remove elements when component unmounts or data changes
      return () => {
        addedElements.forEach((element) => {
          element.remove();
        });
      };
    }
  }, [shopData?.seo_script_text]);

  return null; // This component doesn't render anything
};

const App = () => (
  <HelmetProvider>
    <QueryClientProvider client={queryClient}>
      <ShopProvider>
        <AuthProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <SEOInjector /> {/* Add SEO injection here */}
            <BrowserRouter>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/auth" element={<Auth />} />
                <Route path="/items" element={<Events />} />
                <Route path="/items/:id" element={<EventDetails />} />
                <Route path="/products" element={<Products />} />
                <Route
                  path="/productdetails/:id"
                  element={<ProductDetails />}
                />
                <Route path="/search/:query" element={<SearchResults />} />
                <Route path="*" element={<Navigate to="/items" replace />} />
              </Routes>
            </BrowserRouter>
          </TooltipProvider>
        </AuthProvider>
      </ShopProvider>
    </QueryClientProvider>
  </HelmetProvider>
);

export default App;
