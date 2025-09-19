import React, { useState, useEffect } from "react";
import { MapPin, ExternalLink, Navigation } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ItemAddressNew } from "@/services/api";

interface SimpleMapProps {
  itemAddresses: ItemAddressNew[];
  showMultipleAddresses?: boolean;
  className?: string;
}

const SimpleSquareMap: React.FC<SimpleMapProps> = ({
  itemAddresses = [],
  showMultipleAddresses = true,
  className = "",
}) => {
  const [mapCoords, setMapCoords] = useState<{
    lat: number;
    lng: number;
  } | null>(null);
  const [selectedAddress, setSelectedAddress] = useState<string>("");

  useEffect(() => {
    if (itemAddresses && itemAddresses.length > 0) {
      const primaryAddress = itemAddresses[0];
      setSelectedAddress(primaryAddress.fulladdress);

      if (primaryAddress.latitude && primaryAddress.longitude) {
        setMapCoords({
          lat: parseFloat(primaryAddress.latitude),
          lng: parseFloat(primaryAddress.longitude),
        });
      }
    }
  }, [itemAddresses]);

  // Create embedded map URL using OpenStreetMap
  const createEmbeddedMapUrl = (coords: { lat: number; lng: number }) => {
    const bbox = {
      left: coords.lng - 0.01,
      bottom: coords.lat - 0.01,
      right: coords.lng + 0.01,
      top: coords.lat + 0.01,
    };

    return `https://www.openstreetmap.org/export/embed.html?bbox=${bbox.left},${bbox.bottom},${bbox.right},${bbox.top}&layer=mapnik&marker=${coords.lat},${coords.lng}`;
  };

  // Create directions URL
  const getDirectionsUrl = (targetAddress: string) => {
    const encodedAddress = encodeURIComponent(targetAddress);
    return `https://www.google.com/maps/dir/?api=1&destination=${encodedAddress}`;
  };

  // Get the primary address
  const primaryAddress = itemAddresses.length > 0 ? itemAddresses[0] : null;
  const hasMultipleAddresses = itemAddresses.length > 1;

  // Only render if we have new API data
  if (!itemAddresses || itemAddresses.length === 0) {
    return null;
  }

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Primary Location Card */}
      <Card className="bg-gradient-card border-0 shadow-card">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center justify-between text-base">
            <div className="flex items-center space-x-2">
              <MapPin className="w-5 h-5 text-primary" />
              <span>{primaryAddress?.Locations_text}</span>
            </div>
            {primaryAddress?.addressType && (
              <Badge variant="secondary" className="text-xs">
                {primaryAddress.addressType}
              </Badge>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Square Map Container */}
          <div className="w-full aspect-square bg-muted rounded-lg overflow-hidden border relative">
            {mapCoords ? (
              <iframe
                src={createEmbeddedMapUrl(mapCoords)}
                width="100%"
                height="100%"
                style={{ border: 0 }}
                title="Location map"
                className="rounded-lg"
              />
            ) : (
              // Fallback when no coordinates available
              <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-blue-900/20 dark:to-indigo-900/20">
                <div className="text-center space-y-2">
                  <MapPin className="w-8 h-8 text-primary mx-auto" />
                  <p className="text-sm font-medium">Map Location</p>
                  <p className="text-xs text-muted-foreground px-2">
                    Click below for directions
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Address Display */}
          <div className="text-center space-y-2">
            <p className="text-sm text-muted-foreground">
              {primaryAddress?.Locations_text}
            </p>
            <p className="text-sm font-medium leading-relaxed">
              {selectedAddress}
            </p>

            {/* Additional address details if available */}
            {primaryAddress && (
              <div className="text-xs text-muted-foreground space-y-1">
                {primaryAddress.locality && <p>{primaryAddress.locality}</p>}
                {primaryAddress.region && primaryAddress.postal_code && (
                  <p>
                    {primaryAddress.region} {primaryAddress.postal_code}
                  </p>
                )}
                {primaryAddress.country && <p>{primaryAddress.country}</p>}
              </div>
            )}
          </div>

          {/* Action Button */}
          {primaryAddress?.show_directions_button !== false &&
            selectedAddress && (
              <Button size="sm" className="w-full" asChild>
                <a
                  href={getDirectionsUrl(selectedAddress)}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Navigation className="w-4 h-4 mr-2" />
                  Get Directions
                </a>
              </Button>
            )}
        </CardContent>
      </Card>

      {/* Additional Addresses */}
      {showMultipleAddresses && hasMultipleAddresses && (
        <Card className="bg-gradient-card border-0 shadow-card">
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Other Locations</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {itemAddresses.slice(1).map((addr, index) => (
              <div
                key={addr.id}
                className="flex items-start justify-between p-3 bg-muted/50 rounded-lg"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2 mb-1">
                    <MapPin className="w-4 h-4 text-primary flex-shrink-0" />
                    {addr.addressType && (
                      <Badge variant="outline" className="text-xs">
                        {addr.addressType}
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm font-medium leading-relaxed">
                    {addr.fulladdress}
                  </p>
                </div>

                {addr.show_directions_button !== false && (
                  <Button
                    variant="outline"
                    size="sm"
                    asChild
                    className="ml-2 flex-shrink-0"
                  >
                    <a
                      href={getDirectionsUrl(addr.fulladdress)}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </Button>
                )}
              </div>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default SimpleSquareMap;
