import React from "react";
import { Helmet } from "react-helmet-async";
import { useShop } from "@/contexts/ShopContext";

interface SEOProps {
  title?: string;
  description?: string;
  image?: string;
  url?: string;
  keywords?: string;
  pageType?: "website" | "article" | "product" | "event";
}

const DynamicSEO: React.FC<SEOProps> = ({
  title,
  description,
  image,
  url,
  keywords,
  pageType = "website",
}) => {
  const { shopData, loading } = useShop();

  if (loading || !shopData) {
    return null; // Don't render anything while loading or if no shop data
  }

  // Use props if provided, otherwise fall back to shop data
  const finalTitle = title || shopData.title;
  const finalDescription = description || shopData.description;
  const finalImage = image || shopData.home_image_url || shopData.logo;
  const finalUrl =
    url || (typeof window !== "undefined" ? window.location.href : "");

  // Extract keywords from SEO script or use provided keywords
  let finalKeywords = keywords;
  if (!finalKeywords && shopData.seo_script_text) {
    const keywordMatch = shopData.seo_script_text.match(
      /name="Keywords" content="([^"]*)">/
    );
    if (keywordMatch) {
      finalKeywords = keywordMatch[1];
    }
  }

  // Extract canonical URL from SEO script
  let canonicalUrl = finalUrl;
  if (shopData.seo_script_text) {
    const canonicalMatch = shopData.seo_script_text.match(
      /rel="canonical" href="([^"]*)">/
    );
    if (canonicalMatch) {
      canonicalUrl = canonicalMatch[1];
    }
  }

  // Extract msvalidate from SEO script
  let msValidate = "";
  if (shopData.seo_script_text) {
    const msValidateMatch = shopData.seo_script_text.match(
      /name="msvalidate\.01" content="([^"]*)">/
    );
    if (msValidateMatch) {
      msValidate = msValidateMatch[1];
    }
  }

  // Extract mobile alternate URL from SEO script
  let mobileAlternateUrl = "";
  if (shopData.seo_script_text) {
    const mobileMatch = shopData.seo_script_text.match(
      /rel="alternate"[^>]*href="([^"]*)">/
    );
    if (mobileMatch) {
      mobileAlternateUrl = mobileMatch[1];
    }
  }

  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <title>{finalTitle}</title>
      <meta name="description" content={finalDescription} />
      {finalKeywords && <meta name="keywords" content={finalKeywords} />}

      {/* Canonical URL */}
      <link rel="canonical" href={canonicalUrl} />

      {/* Mobile Alternate */}
      {mobileAlternateUrl && (
        <link
          rel="alternate"
          media="only screen and (max-width:640px)"
          href={mobileAlternateUrl}
        />
      )}

      {/* Microsoft Validation */}
      {msValidate && <meta name="msvalidate.01" content={msValidate} />}

      {/* Open Graph Tags */}
      <meta property="og:title" content={finalTitle} />
      <meta property="og:description" content={finalDescription} />
      <meta property="og:type" content={pageType} />
      <meta property="og:url" content={finalUrl} />
      {finalImage && <meta property="og:image" content={finalImage} />}

      {/* Twitter Card Tags */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={finalTitle} />
      <meta name="twitter:description" content={finalDescription} />
      {finalImage && <meta name="twitter:image" content={finalImage} />}

      {/* Favicon */}
      {shopData.logo && <link rel="icon" href={shopData.logo} />}

      {/* Inject SEO Script Text */}
      {shopData.seo_script_text && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: shopData.seo_script_text
              .replace(/<script[^>]*>/g, "")
              .replace(/<\/script>/g, ""),
          }}
        />
      )}
    </Helmet>
  );
};

export default DynamicSEO;
