// src/contexts/SEOContext.tsx
import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";

interface SEOContextType {
  injectSEOScript: (seoScript: string) => void;
  clearSEOScript: () => void;
  currentSEOScript: string | null;
}

const SEOContext = createContext<SEOContextType | undefined>(undefined);

export const SEOProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [currentSEOScript, setCurrentSEOScript] = useState<string | null>(null);
  const [addedElements, setAddedElements] = useState<Element[]>([]);

  const clearPreviousSEOElements = () => {
    addedElements.forEach((element) => {
      element.remove();
    });
    setAddedElements([]);
  };

  const injectSEOScript = (seoScript: string) => {
    // Clear previous SEO elements
    clearPreviousSEOElements();

    if (seoScript) {
      // Create a temporary div to hold the HTML string
      const tempDiv = document.createElement("div");
      tempDiv.innerHTML = seoScript;

      // Get all script and meta tags from the temp div
      const scripts = tempDiv.querySelectorAll("script");
      const metaTags = tempDiv.querySelectorAll("meta");
      const links = tempDiv.querySelectorAll("link");

      // Store references for cleanup
      const newElements: Element[] = [];

      // Append script tags to body
      scripts.forEach((script) => {
        const newScript = document.createElement("script");
        // Copy all attributes
        Array.from(script.attributes).forEach((attr) => {
          newScript.setAttribute(attr.name, attr.value);
        });
        // Copy content
        newScript.textContent = script.textContent;
        document.body.appendChild(newScript);
        newElements.push(newScript);
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
          newElements.push(newMeta);
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
            newElements.push(newLink);
          }
        }
      });

      setAddedElements(newElements);
    }

    setCurrentSEOScript(seoScript);
  };

  const clearSEOScript = () => {
    clearPreviousSEOElements();
    setCurrentSEOScript(null);
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      clearPreviousSEOElements();
    };
  }, []);

  const contextValue: SEOContextType = {
    injectSEOScript,
    clearSEOScript,
    currentSEOScript,
  };

  return (
    <SEOContext.Provider value={contextValue}>{children}</SEOContext.Provider>
  );
};

export const useSEO = () => {
  const context = useContext(SEOContext);
  if (context === undefined) {
    throw new Error("useSEO must be used within a SEOProvider");
  }
  return context;
};

export default SEOContext;
