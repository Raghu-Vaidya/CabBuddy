import { useState, useEffect, useContext } from "react";
import { AuthContext } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin, MapPinOff, Navigation, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import axios from "axios";
import io from "socket.io-client";
import LocationMap from "./LocationMap";

const apiUri = import.meta.env.VITE_REACT_API_URI;

const LocationSharing = ({ rideId, isDriver = false, onLocationUpdate, driverName }) => {
  const { user } = useContext(AuthContext);
  const [locationSharingEnabled, setLocationSharingEnabled] = useState(false);
  const [isUpdatingLocation, setIsUpdatingLocation] = useState(false);
  const [currentLocation, setCurrentLocation] = useState(null);
  const [driverLocation, setDriverLocation] = useState(null);
  const [socket, setSocket] = useState(null);
  const [locationError, setLocationError] = useState(null);

  // Initialize socket connection
  useEffect(() => {
    const newSocket = io(apiUri.replace('/api', ''));
    setSocket(newSocket);

    // Join ride room
    newSocket.emit('join-ride', rideId);

    // Listen for driver location updates
    newSocket.on('driver-location-update', (locationData) => {
      setDriverLocation(locationData);
      if (onLocationUpdate) {
        onLocationUpdate(locationData);
      }
    });

    // Listen for location sharing status changes
    newSocket.on('location-sharing-status-change', (statusData) => {
      setLocationSharingEnabled(statusData.enabled);
      if (!statusData.enabled) {
        setDriverLocation(null);
      }
    });

    return () => {
      newSocket.emit('leave-ride', rideId);
      newSocket.disconnect();
    };
  }, [rideId, onLocationUpdate]);

  // Check if location sharing is enabled for this ride
  useEffect(() => {
    const checkLocationSharingStatus = async () => {
      try {
        const response = await axios.get(`${apiUri}/rides/${rideId}/location`, {
          withCredentials: true,
        });
        setLocationSharingEnabled(response.data.locationSharingEnabled);
        if (response.data.driverLocation) {
          setDriverLocation(response.data.driverLocation);
        }
      } catch (error) {
        console.error('Error checking location sharing status:', error);
      }
    };

    checkLocationSharingStatus();
  }, [rideId]);

  // Get current location
  const getCurrentLocation = () => {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('Geolocation is not supported by this browser'));
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
        },
        (error) => {
          reject(error);
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 60000,
        }
      );
    });
  };

  // Toggle location sharing (driver only)
  const toggleLocationSharing = async () => {
    if (!isDriver) return;

    try {
      const response = await axios.post(
        `${apiUri}/rides/${rideId}/location/toggle`,
        {},
        { withCredentials: true }
      );
      
      setLocationSharingEnabled(response.data.locationSharingEnabled);
      
      if (response.data.locationSharingEnabled) {
        toast.success('Location sharing enabled');
        // Start sharing location immediately
        shareLocation();
      } else {
        toast.success('Location sharing disabled');
        setDriverLocation(null);
      }
    } catch (error) {
      console.error('Error toggling location sharing:', error);
      toast.error('Failed to toggle location sharing');
    }
  };

  // Share current location (driver only)
  const shareLocation = async () => {
    if (!isDriver || !locationSharingEnabled) return;

    setIsUpdatingLocation(true);
    setLocationError(null);

    try {
      const location = await getCurrentLocation();
      setCurrentLocation(location);

      const response = await axios.post(
        `${apiUri}/rides/${rideId}/location/update`,
        {
          latitude: location.latitude,
          longitude: location.longitude,
        },
        { withCredentials: true }
      );

      setDriverLocation(response.data.location);
      toast.success('Location updated');
    } catch (error) {
      console.error('Error sharing location:', error);
      setLocationError(error.message);
      
      if (error.code === 1) {
        toast.error('Location access denied. Please enable location permissions.');
      } else if (error.code === 2) {
        toast.error('Location unavailable. Please check your device settings.');
      } else if (error.code === 3) {
        toast.error('Location request timed out. Please try again.');
      } else {
        toast.error('Failed to get current location');
      }
    } finally {
      setIsUpdatingLocation(false);
    }
  };

  // Auto-update location every 30 seconds when sharing is enabled
  useEffect(() => {
    let interval;
    if (isDriver && locationSharingEnabled) {
      interval = setInterval(shareLocation, 30000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isDriver, locationSharingEnabled]);

  if (!user) {
    return null;
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MapPin className="h-5 w-5" />
          Location Sharing
        </CardTitle>
        <CardDescription>
          {isDriver 
            ? "Share your location with passengers" 
            : "View driver's real-time location"}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {isDriver ? (
          // Driver controls
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className={`w-3 h-3 rounded-full ${locationSharingEnabled ? 'bg-green-500' : 'bg-gray-400'}`} />
                <span className="text-sm">
                  {locationSharingEnabled ? 'Sharing location' : 'Location sharing off'}
                </span>
              </div>
              <Button
                onClick={toggleLocationSharing}
                variant={locationSharingEnabled ? "destructive" : "default"}
                size="sm"
              >
                {locationSharingEnabled ? (
                  <>
                    <MapPinOff className="h-4 w-4 mr-2" />
                    Stop Sharing
                  </>
                ) : (
                  <>
                    <MapPin className="h-4 w-4 mr-2" />
                    Start Sharing
                  </>
                )}
              </Button>
            </div>

            {locationSharingEnabled && (
              <div className="space-y-2">
                <Button
                  onClick={shareLocation}
                  disabled={isUpdatingLocation}
                  size="sm"
                  variant="outline"
                  className="w-full"
                >
                  <Navigation className="h-4 w-4 mr-2" />
                  {isUpdatingLocation ? 'Updating...' : 'Update Location Now'}
                </Button>
                
                {locationError && (
                  <div className="flex items-center gap-2 text-sm text-red-600">
                    <AlertCircle className="h-4 w-4" />
                    {locationError}
                  </div>
                )}

                <p className="text-xs text-muted-foreground">
                  Location updates automatically every 30 seconds when sharing is enabled.
                </p>
                
                {/* Show current location on map for driver */}
                {currentLocation && (
                  <div className="mt-4">
                    <LocationMap 
                      latitude={currentLocation.latitude}
                      longitude={currentLocation.longitude}
                      driverName="Your Location"
                    />
                  </div>
                )}
              </div>
            )}
          </div>
        ) : (
          // Passenger view
          <div className="space-y-4">
            {locationSharingEnabled ? (
              driverLocation ? (
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse" />
                    <span className="text-sm">Driver location available</span>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Last updated: {new Date(driverLocation.timestamp).toLocaleTimeString()}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Coordinates: {driverLocation.latitude.toFixed(6)}, {driverLocation.longitude.toFixed(6)}
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-yellow-500" />
                  <span className="text-sm">Waiting for driver location...</span>
                </div>
              )
            ) : (
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-gray-400" />
                <span className="text-sm">Driver has not enabled location sharing</span>
              </div>
            )}
            
            {/* Show map if location is available */}
            {locationSharingEnabled && driverLocation && (
              <div className="mt-4">
                <LocationMap 
                  latitude={driverLocation.latitude}
                  longitude={driverLocation.longitude}
                  driverName={driverName}
                />
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default LocationSharing;
