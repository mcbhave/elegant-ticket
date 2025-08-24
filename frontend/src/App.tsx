import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import React, { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext, useAuthProvider } from "@/hooks/useAuth";
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

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/items" element={<Events />} />
            <Route path="/items/:id" element={<EventDetails />} />
            <Route path="/products" element={<Products />} />
            <Route path="/productdetails/:id" element={<ProductDetails />} />
            <Route path="/search/:query" element={<SearchResults />} />
            <Route path="*" element={<Navigate to="/items" replace />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
