import React, { useEffect } from "react";
import { Helmet } from "react-helmet-async";

interface DynamicSEOInjectorProps {
  seoScript?: string;
  title?: string;
  description?: string;
  image?: string;
  url?: string;
}

const DynamicSEOInjector: React.FC<DynamicSEOInjectorProps> = ({
  seoScript,
  title,
  description,
  image,
  url,
}) => {
  // Function to extract ONLY JSON-LD structured data
  const getStructuredData = (): string | null => {
    if (!seoScript) return null;

    try {
      const jsonMatch = seoScript.match(
        /<script[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/i
      );

      if (jsonMatch && jsonMatch[1]) {
        const jsonData = jsonMatch[1].trim();
        // Validate that it's proper JSON
        JSON.parse(jsonData);
        return jsonData;
      }
    } catch (error) {
      console.error("Error parsing structured data:", error);
    }
    return null;
  };

  // Effect to inject entire SEO script into body (without parsing)
  useEffect(() => {
    if (!seoScript) return;

    // Create a container div for the SEO script
    const seoContainer = document.createElement("div");
    seoContainer.setAttribute("data-seo-injector", "true");
    seoContainer.style.display = "none"; // Hide the container
    seoContainer.innerHTML = seoScript; // Inject entire script without parsing

    // Append to body
    document.body.appendChild(seoContainer);

    // Cleanup function
    return () => {
      // Remove all elements with data-seo-injector attribute
      const elements = document.querySelectorAll('[data-seo-injector="true"]');
      elements.forEach((element) => element.remove());
    };
  }, [seoScript]);

  const structuredData = getStructuredData();

  return (
    <Helmet>
      {/* Basic Meta Tags */}
      {title && <title>{title}</title>}
      {description && <meta name="description" content={description} />}

      {/* Open Graph Tags */}
      {title && <meta property="og:title" content={title} />}
      {description && <meta property="og:description" content={description} />}
      {url && <meta property="og:url" content={url} />}
      {image && <meta property="og:image" content={image} />}

      {/* Twitter Card Tags */}
      {title && <meta name="twitter:title" content={title} />}
      {description && <meta name="twitter:description" content={description} />}
      {image && <meta name="twitter:image" content={image} />}
      <meta name="twitter:card" content="summary_large_image" />

      {/* JSON-LD Structured Data (parsed and placed in head) */}
      {structuredData && (
        <script type="application/ld+json">{structuredData}</script>
      )}
    </Helmet>
  );
};

export default DynamicSEOInjector;
