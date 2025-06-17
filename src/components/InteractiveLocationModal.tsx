import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/components/ui/use-toast";
import { LocateFixed, Search, Home, Loader2, MapPin } from 'lucide-react';

interface Address {
  id: string;
  name?: string; // e.g., "Home", "Work"
  street: string;
  city: string;
  postalCode: string;
  fullAddress: string; // Pre-formatted full address for display
}

interface InteractiveLocationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLocationSet: (location: {
    type: 'search' | 'gps' | 'saved';
    data: string | { latitude: number; longitude: number } | Address;
  }) => void;
  savedAddresses?: Address[];
}

const InteractiveLocationModal: React.FC<InteractiveLocationModalProps> = ({
  isOpen,
  onClose,
  onLocationSet,
  savedAddresses = [],
}) => {
  console.log('InteractiveLocationModal loaded');
  const { toast } = useToast();

  const [locationInput, setLocationInput] = useState<string>('');
  const [selectedSavedAddress, setSelectedSavedAddress] = useState<Address | null>(null);
  const [gpsCoordinates, setGpsCoordinates] = useState<{ latitude: number; longitude: number } | null>(null);
  
  const [activeMethod, setActiveMethod] = useState<'search' | 'gps' | 'saved' | null>(null);

  const [isLoadingGps, setIsLoadingGps] = useState<boolean>(false);
  const [gpsError, setGpsError] = useState<string | null>(null);

  useEffect(() => {
    // Reset internal state when dialog is opened/closed or props change
    if (isOpen) {
      setLocationInput('');
      setSelectedSavedAddress(null);
      setGpsCoordinates(null);
      setActiveMethod(null);
      setGpsError(null);
      setIsLoadingGps(false);
    }
  }, [isOpen]);

  const handleGpsLocation = () => {
    if (!navigator.geolocation) {
      setGpsError("Geolocation is not supported by your browser.");
      toast({ variant: "destructive", title: "Error", description: "Geolocation is not supported by your browser." });
      setActiveMethod(null);
      return;
    }

    setIsLoadingGps(true);
    setGpsError(null);
    setActiveMethod('gps'); // Tentatively set, confirm on success

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setGpsCoordinates({ latitude, longitude });
        setIsLoadingGps(false);
        toast({ title: "Location Found", description: "Using your current location." });
        // Clear other inputs
        setLocationInput('');
        setSelectedSavedAddress(null);
      },
      (error) => {
        let message = "Unable to retrieve your location.";
        if (error.code === error.PERMISSION_DENIED) {
          message = "Location permission denied. Please enable it in your browser settings.";
        }
        setGpsError(message);
        setIsLoadingGps(false);
        setGpsCoordinates(null); // Ensure GPS data is cleared on error
        setActiveMethod(null); // Revert active method if GPS fails
        toast({ variant: "destructive", title: "GPS Error", description: message });
      }
    );
  };

  const handleSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLocationInput(e.target.value);
    setActiveMethod('search');
    // Clear other selections
    setGpsCoordinates(null);
    setSelectedSavedAddress(null);
    setGpsError(null);
  };

  const handleSelectSavedAddress = (address: Address) => {
    setSelectedSavedAddress(address);
    setActiveMethod('saved');
    // Clear other inputs
    setLocationInput('');
    setGpsCoordinates(null);
    setGpsError(null);
  };

  const handleConfirmLocation = () => {
    if (activeMethod === 'search' && locationInput.trim()) {
      onLocationSet({ type: 'search', data: locationInput.trim() });
    } else if (activeMethod === 'gps' && gpsCoordinates) {
      onLocationSet({ type: 'gps', data: gpsCoordinates });
    } else if (activeMethod === 'saved' && selectedSavedAddress) {
      onLocationSet({ type: 'saved', data: selectedSavedAddress });
    } else {
      toast({ variant: "destructive", title: "No location selected", description: "Please select or enter a location." });
      return; // Do not close if nothing valid is selected/entered
    }
    onClose();
  };
  
  const isConfirmDisabled = 
    !(activeMethod === 'search' && locationInput.trim()) &&
    !(activeMethod === 'gps' && gpsCoordinates) &&
    !(activeMethod === 'saved' && selectedSavedAddress);

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[525px] max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <MapPin className="mr-2 h-5 w-5 text-primary" /> Set Delivery Location
          </DialogTitle>
          <DialogDescription>
            Enter your address, use current location, or pick a saved address.
          </DialogDescription>
        </DialogHeader>
        
        <div className="py-2 pr-2 space-y-6 overflow-y-auto flex-grow">
          {/* Search Section */}
          <div className="space-y-2">
            <Label htmlFor="location-search" className="font-semibold">Search for address</Label>
            <div className="flex items-center space-x-2">
              <Input
                id="location-search"
                type="text"
                placeholder="Enter street, city, or zip code"
                value={locationInput}
                onChange={handleSearchInputChange}
                className={activeMethod === 'search' ? 'ring-2 ring-primary' : ''}
              />
              <Button 
                variant="outline" 
                size="icon" 
                onClick={() => { if(locationInput.trim()) { setActiveMethod('search'); } /* This button might be more for explicit search action if API call was here */ }}
                aria-label="Search Address"
              >
                <Search className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <Separator />

          {/* GPS Section */}
          <div className="space-y-2">
            <Button
              variant="outline"
              className="w-full justify-start text-left"
              onClick={handleGpsLocation}
              disabled={isLoadingGps}
            >
              {isLoadingGps ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <LocateFixed className="mr-2 h-4 w-4" />
              )}
              {isLoadingGps ? "Fetching Your Location..." : "Use My Current Location"}
            </Button>
            {gpsError && <p className="text-sm text-destructive px-1">{gpsError}</p>}
            {activeMethod === 'gps' && gpsCoordinates && !gpsError && (
              <p className="text-sm text-green-600 px-1">Current location coordinates obtained.</p>
            )}
          </div>
          
          {savedAddresses && savedAddresses.length > 0 && (
            <>
              <Separator />
              {/* Saved Addresses Section */}
              <div className="space-y-2">
                <h3 className="font-semibold text-sm">Select a saved address</h3>
                <ScrollArea className="h-[150px] border rounded-md">
                  <div className="p-2 space-y-1">
                  {savedAddresses.map((address) => (
                    <Button
                      key={address.id}
                      variant={selectedSavedAddress?.id === address.id && activeMethod === 'saved' ? "secondary" : "ghost"}
                      className="w-full justify-start text-left h-auto py-2"
                      onClick={() => handleSelectSavedAddress(address)}
                    >
                      <Home className="mr-2 h-4 w-4 flex-shrink-0" />
                      <div className="flex flex-col">
                        <span className="font-medium">{address.name || 'Saved Address'}</span>
                        <span className="text-xs text-muted-foreground">{address.fullAddress}</span>
                      </div>
                    </Button>
                  ))}
                  </div>
                </ScrollArea>
              </div>
            </>
          )}

          <Separator />

          {/* Map Preview Placeholder */}
          <div className="space-y-2">
            <Label className="font-semibold">Map Preview</Label>
            <div className="h-40 bg-muted rounded-md flex items-center justify-center text-muted-foreground">
              <MapPin className="h-8 w-8 mr-2" />
              <p>Map preview will appear here</p>
            </div>
          </div>
        </div>

        <DialogFooter className="mt-auto pt-4 border-t">
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <Button onClick={handleConfirmLocation} disabled={isConfirmDisabled}>
            Set Location
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default InteractiveLocationModal;