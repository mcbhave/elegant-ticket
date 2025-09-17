import React, { useState, useEffect } from "react";
import { MapPin, ExternalLink } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface SimpleMapProps {
  address: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
}

const SimpleSquareMap: React.FC<SimpleMapProps> = ({
  address,
  coordinates,
}) => {
  const [mapCoords, setMapCoords] = useState(coordinates || null);

  // If coordinates are provided in the API response, use them directly
  useEffect(() => {
    if (coordinates) {
      setMapCoords(coordinates);
    }
  }, [coordinates]);

  // Create Google Maps static image URL (no API key needed for basic static maps)
  const createStaticMapUrl = (coords: { lat: number; lng: number }) => {
    const zoom = 15;
    const size = "300x300";
    const marker = `markers=color:red%7C${coords.lat},${coords.lng}`;

    // Using Google's static maps API (works without API key for basic usage)
    return `https://maps.googleapis.com/maps/api/staticmap?center=${coords.lat},${coords.lng}&zoom=${zoom}&size=${size}&${marker}&maptype=roadmap`;
  };

  // Fallback to OpenStreetMap static image
  const createOSMStaticUrl = (coords: { lat: number; lng: number }) => {
    // Using a service that generates static map images from OSM
    const zoom = 15;
    const width = 300;
    const height = 300;

    return `https://www.mapquestapi.com/staticmap/v5/map?key=YOUR_KEY&center=${coords.lat},${coords.lng}&size=${width},${height}&zoom=${zoom}&locations=${coords.lat},${coords.lng}`;
  };

  // Simple embedded map using OpenStreetMap
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
  const getDirectionsUrl = () => {
    const encodedAddress = encodeURIComponent(address);
    return `https://www.google.com/maps/dir/?api=1&destination=${encodedAddress}`;
  };

  return (
    <Card className="bg-gradient-card border-0 shadow-card">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center space-x-2 text-base">
          <MapPin className="w-5 h-5 text-primary" />
          <span>Location</span>
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
              title="Event location map"
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

        {/* Address */}
        <div className="text-center">
          <p className="text-sm text-muted-foreground mb-2">Address</p>
          <p className="text-sm font-medium leading-relaxed">{address}</p>
        </div>

        {/* Action Button */}
        <Button size="sm" className="w-full" asChild>
          <a
            href={getDirectionsUrl()}
            target="_blank"
            rel="noopener noreferrer"
          >
            <MapPin className="w-4 h-4 mr-2" />
            Get Directions
          </a>
        </Button>
      </CardContent>
    </Card>
  );
};

export default SimpleSquareMap;
