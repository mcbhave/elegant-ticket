// src/hooks/useItemSEO.ts
import { useEffect, useState } from "react";
import { useSEO } from "@/contexts/SEOContext";
import { apiService, Event, Product } from "@/services/api";

interface UseItemSEOOptions {
  slug?: string;
  itemType?: "event" | "product";
  enabled?: boolean;
}

interface UseItemSEOReturn {
  isLoading: boolean;
  error: string | null;
  itemData: Event | Product | null;
  refetch: () => Promise<void>;
}

export const useItemSEO = ({
  slug,
  itemType = "event",
  enabled = true,
}: UseItemSEOOptions): UseItemSEOReturn => {
  const { injectSEOScript, clearSEOScript } = useSEO();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [itemData, setItemData] = useState<Event | Product | null>(null);

  const fetchItemAndInjectSEO = async () => {
    if (!slug || !enabled) return;

    try {
      setIsLoading(true);
      setError(null);

      let data: Event | Product | null = null;
      let seoScript: string | null = null;

      if (itemType === "event") {
        // Make direct API call to items_details endpoint
        try {
          // Use the apiService's internal axios instance
          const response = await (apiService as any).api.get(
            `/items_details/${slug}`
          );
          data = Array.isArray(response.data)
            ? response.data[0]
            : response.data;

          // Check for SEO script in different possible locations
          if (data && (data as any)._events_seo?.seo_script) {
            seoScript = (data as any)._events_seo.seo_script;
          } else if (data && (data as Event)._events_seo_of_items?.seo_script) {
            seoScript = (data as Event)._events_seo_of_items.seo_script;
          }
          // Check if the seo_script is directly in the data
          else if (data && (data as any).seo_script) {
            seoScript = (data as any).seo_script;
          }
        } catch (apiError) {
          console.error("Failed to fetch from items_details:", apiError);
          // Fallback to existing event method
          data = await apiService.getEventBySlug(slug);
          if (data && (data as Event)._events_seo_of_items?.seo_script) {
            seoScript = (data as Event)._events_seo_of_items.seo_script;
          }
        }
      } else if (itemType === "product") {
        data = await apiService.getProductBySlug(slug);
        // Check for SEO script in product data if needed
      }

      setItemData(data);

      // Inject SEO script if available
      if (seoScript) {
        injectSEOScript(seoScript);
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to load item SEO data";
      setError(errorMessage);
      clearSEOScript();
    } finally {
      setIsLoading(false);
    }
  };

  const refetch = async () => {
    await fetchItemAndInjectSEO();
  };

  useEffect(() => {
    fetchItemAndInjectSEO();

    return () => {
      if (!slug || !enabled) {
        clearSEOScript();
      }
    };
  }, [slug, itemType, enabled]);

  return {
    isLoading,
    error,
    itemData,
    refetch,
  };
};
