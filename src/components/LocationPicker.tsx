import React, { useState, useEffect, useRef } from 'react';
import { MapPin, Navigation, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { toast } from '@/hooks/use-toast';

interface LocationPickerProps {
  value: string;
  onChange: (location: string, coordinates?: { lat: number; lng: number }) => void;
  placeholder?: string;
}

const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

const LocationPicker: React.FC<LocationPickerProps> = ({ value, onChange, placeholder }) => {
  const [isMapOpen, setIsMapOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedCoords, setSelectedCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [mapAddress, setMapAddress] = useState('');
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<google.maps.Map | null>(null);
  const markerRef = useRef<google.maps.Marker | null>(null);

  // Get current location
  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      toast({
        title: "Geolocation Not Supported",
        description: "Your browser doesn't support location detection. Please enter manually or use the map.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const coords = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        };
        reverseGeocode(coords);
        setIsLoading(false);
        toast({
          title: "Location Detected",
          description: "Your current location has been detected successfully!",
        });
      },
      (error) => {
        console.error('Geolocation error:', error);
        let errorMessage = "Unable to detect your location. Please enter manually or use the map.";
        
        switch(error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = "Location access denied. Please enable location permissions in your browser settings and try again.";
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage = "Location information unavailable. Please check your internet connection and try again.";
            break;
          case error.TIMEOUT:
            errorMessage = "Location request timed out. Please try again or enter location manually.";
            break;
        }
        
        toast({
          title: "Location Error",
          description: errorMessage,
          variant: "destructive",
        });
        setIsLoading(false);
      },
      { 
        enableHighAccuracy: true, 
        timeout: 15000, // Increased timeout
        maximumAge: 300000 // Cache location for 5 minutes
      }
    );
  };

  // Reverse geocode coordinates to address
  const reverseGeocode = async (coords: { lat: number; lng: number }) => {
    try {
      if (!GOOGLE_MAPS_API_KEY) {
        console.error('Google Maps API key not configured');
        onChange(`${coords.lat}, ${coords.lng}`, coords);
        return;
      }

      const response = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${coords.lat},${coords.lng}&key=${GOOGLE_MAPS_API_KEY}`
      );
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data.status === 'OK' && data.results && data.results.length > 0) {
        const address = data.results[0].formatted_address;
        onChange(address, coords);
      } else {
        console.warn('Geocoding API response:', data);
        onChange(`${coords.lat}, ${coords.lng}`, coords);
        if (data.status !== 'ZERO_RESULTS') {
          toast({
            title: "Address Lookup Failed",
            description: "Could not get address for your location. Coordinates will be used instead.",
            variant: "destructive",
          });
        }
      }
    } catch (error) {
      console.error('Reverse geocoding failed:', error);
      onChange(`${coords.lat}, ${coords.lng}`, coords);
      toast({
        title: "Address Lookup Error",
        description: "Failed to get address. Your coordinates will be used instead.",
        variant: "destructive",
      });
    }
  };

  // Initialize map
  const initializeMap = () => {
    if (!mapRef.current || mapInstanceRef.current) return;

    // Default to user's approximate location or city center
    const defaultCenter = { lat: 40.7128, lng: -74.0060 }; // NYC

    const map = new google.maps.Map(mapRef.current, {
      center: defaultCenter,
      zoom: 15,
      styles: [
        {
          featureType: 'poi',
          elementType: 'labels',
          stylers: [{ visibility: 'off' }]
        }
      ]
    });

    mapInstanceRef.current = map;

    // Add click listener to map
    map.addListener('click', (event: google.maps.MapMouseEvent) => {
      const coords = {
        lat: event.latLng!.lat(),
        lng: event.latLng!.lng()
      };
      
      setSelectedCoords(coords);
      
      // Remove existing marker
      if (markerRef.current) {
        markerRef.current.setMap(null);
      }
      
      // Add new marker
      const marker = new google.maps.Marker({
        position: coords,
        map: map,
        title: 'Selected Location',
        animation: google.maps.Animation.DROP
      });
      
      markerRef.current = marker;
      
      // Get address for selected location
      reverseGeocodeForMap(coords);
    });

    // Try to get user's current location for map center
    navigator.geolocation?.getCurrentPosition(
      (position) => {
        const userLocation = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        };
        map.setCenter(userLocation);
        map.setZoom(16);
      },
      () => {
        // Fallback to default location if geolocation fails
        console.log('Using default map center');
      }
    );
  };

  // Reverse geocode for map selection
  const reverseGeocodeForMap = async (coords: { lat: number; lng: number }) => {
    try {
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${coords.lat},${coords.lng}&key=${GOOGLE_MAPS_API_KEY}`
      );
      const data = await response.json();
      
      if (data.results && data.results.length > 0) {
        const address = data.results[0].formatted_address;
        setMapAddress(address);
      } else {
        setMapAddress(`${coords.lat}, ${coords.lng}`);
      }
    } catch (error) {
      console.error('Reverse geocoding failed:', error);
      setMapAddress(`${coords.lat}, ${coords.lng}`);
    }
  };

  // Load Google Maps script
  useEffect(() => {
    if (isMapOpen && !window.google) {
      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_API_KEY}&libraries=places`;
      script.async = true;
      script.defer = true;
      script.onload = initializeMap;
      document.head.appendChild(script);
    } else if (isMapOpen && window.google) {
      setTimeout(initializeMap, 100);
    }
  }, [isMapOpen]);

  // Confirm map selection
  const confirmMapSelection = () => {
    if (selectedCoords && mapAddress) {
      onChange(mapAddress, selectedCoords);
      setIsMapOpen(false);
      setSelectedCoords(null);
      setMapAddress('');
    } else {
      toast({
        title: "No Location Selected",
        description: "Please click on the map to select a location.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex gap-2">
        <div className="flex-1">
          <Input
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder || "Enter location or use GPS/Map"}
            className="pr-20"
          />
        </div>
        
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={getCurrentLocation}
          disabled={isLoading}
          className="flex-shrink-0"
          title="Get current location"
        >
          {isLoading ? (
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
          ) : (
            <Navigation className="h-4 w-4" />
          )}
        </Button>
        
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => setIsMapOpen(true)}
          className="flex-shrink-0"
          title="Select on map"
        >
          <MapPin className="h-4 w-4" />
        </Button>
      </div>

      {/* Map Modal */}
      <Dialog open={isMapOpen} onOpenChange={setIsMapOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              Select Issue Location
            </DialogTitle>
            <DialogDescription>
              Click on the map to pinpoint the exact location of the issue.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <p className="text-sm text-gray-600">
              Click on the map to pinpoint the exact location of the issue.
            </p>
            
            {/* Map Container */}
            <div 
              ref={mapRef} 
              className="w-full h-96 rounded-lg border border-gray-300"
              style={{ minHeight: '400px' }}
            />
            
            {/* Selected Location Display */}
            {selectedCoords && (
              <div className="bg-blue-50 p-3 rounded-lg">
                <p className="text-sm font-medium text-blue-800 mb-1">Selected Location:</p>
                <p className="text-sm text-blue-700">{mapAddress}</p>
                <p className="text-xs text-blue-600">
                  Coordinates: {selectedCoords.lat.toFixed(6)}, {selectedCoords.lng.toFixed(6)}
                </p>
              </div>
            )}
            
            {/* Action Buttons */}
            <div className="flex justify-end gap-3">
              <Button
                variant="outline"
                onClick={() => {
                  setIsMapOpen(false);
                  setSelectedCoords(null);
                  setMapAddress('');
                }}
              >
                Cancel
              </Button>
              <Button
                onClick={confirmMapSelection}
                disabled={!selectedCoords}
                className="bg-blue-600 hover:bg-blue-700"
              >
                Confirm Location
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default LocationPicker;