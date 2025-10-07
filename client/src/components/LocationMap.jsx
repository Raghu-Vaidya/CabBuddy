import { useEffect, useRef } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin } from "lucide-react";

const LocationMap = ({ latitude, longitude, driverName = "Driver" }) => {
  const mapRef = useRef(null);
  const markerRef = useRef(null);

  useEffect(() => {
    if (!latitude || !longitude || !mapRef.current) return;

    // Create a simple map using OpenStreetMap
    const mapElement = mapRef.current;
    mapElement.innerHTML = ''; // Clear previous content

    // Create an iframe with OpenStreetMap
    const iframe = document.createElement('iframe');
    iframe.src = `https://www.openstreetmap.org/export/embed.html?bbox=${longitude-0.01},${latitude-0.01},${longitude+0.01},${latitude+0.01}&layer=mapnik&marker=${latitude},${longitude}`;
    iframe.width = '100%';
    iframe.height = '300px';
    iframe.frameBorder = '0';
    iframe.style.border = 'none';
    iframe.style.borderRadius = '8px';

    mapElement.appendChild(iframe);
  }, [latitude, longitude]);

  if (!latitude || !longitude) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            Driver Location
          </CardTitle>
          <CardDescription>Real-time driver location</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-48 bg-muted rounded-lg">
            <p className="text-muted-foreground">Location not available</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MapPin className="h-5 w-5" />
          Driver Location
        </CardTitle>
        <CardDescription>
          {driverName}'s current location
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div ref={mapRef} className="w-full h-48 bg-muted rounded-lg overflow-hidden" />
        <div className="mt-2 text-xs text-muted-foreground">
          Coordinates: {latitude.toFixed(6)}, {longitude.toFixed(6)}
        </div>
      </CardContent>
    </Card>
  );
};

export default LocationMap;
