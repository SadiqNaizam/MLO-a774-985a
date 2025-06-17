import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

// Custom Components
import Footer from '@/components/layout/Footer';
import InteractiveLocationModal, { Address as LocationModalAddress } from '@/components/InteractiveLocationModal';
import CuisineSelectorCarousel, { Cuisine } from '@/components/CuisineSelectorCarousel';

// Shadcn/ui Components
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

// Lucide Icons
import { MapPin, Search, ShoppingCart, UserCircle, Star, Clock, Utensils, Soup, Beef, Salad, CakeSlice, Pizza as PizzaIcon, Fish as FishIcon, UtensilsCrossed } from 'lucide-react';

// Placeholder types (if not already imported from components)
interface Restaurant {
  id: string;
  name: string;
  imageUrl: string;
  cuisine: string;
  rating: string;
  deliveryTime: string;
}

// Sample data for CuisineSelectorCarousel
const sampleCuisines: Cuisine[] = [
  { id: 'pizza', name: 'Pizza', icon: PizzaIcon },
  { id: 'sushi', name: 'Sushi', icon: FishIcon },
  { id: 'indian', name: 'Indian', icon: Soup },
  { id: 'burgers', name: 'Burgers', icon: Beef },
  { id: 'salads', name: 'Salads', icon: Salad },
  { id: 'desserts', name: 'Desserts', icon: CakeSlice },
  { id: 'chinese', name: 'Chinese', icon: UtensilsCrossed },
  { id: 'all', name: 'All Cuisines', icon: Utensils },
];

// Sample data for Restaurant Cards
const sampleRestaurants: Restaurant[] = [
  { id: '1', name: "Mario's Pizzaria", imageUrl: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8cGl6emF8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=500&q=60', cuisine: 'Italian', rating: '4.7', deliveryTime: '25-35 min' },
  { id: '2', name: 'Sakura Sushi', imageUrl: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8c3VzaGl8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=500&q=60', cuisine: 'Japanese', rating: '4.9', deliveryTime: '30-40 min' },
  { id: '3', name: 'The Burger Joint', imageUrl: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8YnVyZ2VyfGVufDB8fDB8fHww&auto=format&fit=crop&w=500&q=60', cuisine: 'American', rating: '4.5', deliveryTime: '20-30 min' },
  { id: '4', name: 'Spice Route', imageUrl: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8aW5kaWFuJTIwZm9vZHxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=500&q=60', cuisine: 'Indian', rating: '4.6', deliveryTime: '35-45 min' },
];

// Sample data for InteractiveLocationModal saved addresses
const sampleSavedAddresses: LocationModalAddress[] = [
    { id: 'home', name: 'Home', street: '123 Main St', city: 'Foodville', postalCode: '12345', fullAddress: '123 Main St, Foodville, 12345' },
    { id: 'work', name: 'Work', street: '456 Office Park', city: 'Foodville', postalCode: '67890', fullAddress: '456 Office Park, Foodville, 67890' },
];

const Homepage: React.FC = () => {
  console.log('Homepage loaded');
  const navigate = useNavigate();

  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);
  const [deliveryLocation, setDeliveryLocation] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCuisineId, setSelectedCuisineId] = useState<string | null>(null);

  const handleLocationSet = (location: { type: 'search' | 'gps' | 'saved'; data: string | { latitude: number; longitude: number } | LocationModalAddress }) => {
    let locationString = '';
    if (location.type === 'search') {
      locationString = location.data as string;
    } else if (location.type === 'gps') {
      const coords = location.data as { latitude: number; longitude: number };
      locationString = `Current Location (${coords.latitude.toFixed(2)}, ${coords.longitude.toFixed(2)})`;
    } else if (location.type === 'saved') {
      const addr = location.data as LocationModalAddress;
      locationString = addr.fullAddress;
    }
    setDeliveryLocation(locationString);
    setIsLocationModalOpen(false);
    // TODO: Optionally, trigger fetching restaurants for the new location
  };

  const handleCuisineSelect = (cuisineId: string) => {
    setSelectedCuisineId(cuisineId);
    if (cuisineId === 'all') {
      navigate('/restaurant-listing');
    } else {
      navigate(`/restaurant-listing?cuisine=${cuisineId}`);
    }
  };
  
  const handleSearchSubmit = (e?: React.FormEvent<HTMLFormElement>) => {
    if (e) e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/restaurant-listing?search=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      navigate('/restaurant-listing');
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header Section */}
      <header className="bg-white dark:bg-gray-800 shadow-md sticky top-0 z-50">
        <div className="container mx-auto px-4 py-3 flex flex-wrap justify-between items-center">
          <Link to="/" className="text-3xl font-bold text-primary dark:text-sky-400">
            FoodieFleet
          </Link>
          <div className="flex items-center space-x-2 sm:space-x-4 order-3 sm:order-2 mt-2 sm:mt-0 w-full sm:w-auto justify-center sm:justify-start">
            <Button variant="ghost" onClick={() => setIsLocationModalOpen(true)} className="text-sm dark:text-gray-200 dark:hover:bg-gray-700">
              <MapPin className="mr-2 h-5 w-5 text-primary dark:text-sky-400" />
              {deliveryLocation || "Set Your Location"}
            </Button>
            <form onSubmit={handleSearchSubmit} className="hidden md:flex items-center space-x-2">
              <Input
                type="search"
                placeholder="Search restaurants..."
                className="h-9 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <Button type="submit" variant="secondary" size="icon" className="h-9 w-9 dark:bg-sky-500 dark:hover:bg-sky-600 dark:text-white">
                <Search className="h-4 w-4" />
              </Button>
            </form>
          </div>
          <nav className="flex items-center space-x-2 sm:space-x-3 order-2 sm:order-3">
            <Link to="/cart">
              <Button variant="ghost" size="icon" className="dark:text-gray-200 dark:hover:bg-gray-700">
                <ShoppingCart className="h-5 w-5" />
              </Button>
            </Link>
            <Link to="/user-profile">
              <Button variant="ghost" size="icon" className="dark:text-gray-200 dark:hover:bg-gray-700">
                <UserCircle className="h-5 w-5" />
              </Button>
            </Link>
          </nav>
           {/* Search bar for mobile, shown below nav items */}
           <form onSubmit={handleSearchSubmit} className="mt-2 md:hidden flex items-center space-x-2 w-full order-4">
              <Input
                type="search"
                placeholder="Search restaurants or dishes..."
                className="h-9 flex-grow dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <Button type="submit" variant="secondary" size="icon" className="h-9 w-9 dark:bg-sky-500 dark:hover:bg-sky-600 dark:text-white">
                <Search className="h-4 w-4" />
              </Button>
            </form>
        </div>
      </header>

      {/* Interactive Location Modal */}
      <InteractiveLocationModal
        isOpen={isLocationModalOpen}
        onClose={() => setIsLocationModalOpen(false)}
        onLocationSet={handleLocationSet}
        savedAddresses={sampleSavedAddresses}
      />

      {/* Main Content Area */}
      <main className="flex-grow container mx-auto px-4 py-8 space-y-10 sm:space-y-16">
        {/* Hero Section */}
        <section className="text-center py-8 sm:py-12 bg-gradient-to-r from-primary/10 to-secondary/10 dark:from-sky-500/20 dark:to-indigo-500/20 rounded-xl shadow-sm">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-800 dark:text-white">
            Delicious Food, Delivered to You
          </h1>
          <p className="mt-3 sm:mt-4 text-md sm:text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Order from your favorite local restaurants with just a few clicks. Fast, fresh, and convenient.
          </p>
          {!deliveryLocation && (
            <Button onClick={() => setIsLocationModalOpen(true)} size="lg" className="mt-6 sm:mt-8 bg-primary hover:bg-primary/90 dark:bg-sky-500 dark:hover:bg-sky-600 text-white">
              <MapPin className="mr-2 h-5 w-5" /> Set Delivery Location
            </Button>
          )}
        </section>

        {/* Cuisine Selector Carousel Section */}
        <section>
          <h2 className="text-2xl sm:text-3xl font-semibold mb-4 sm:mb-6 text-gray-700 dark:text-gray-200">Explore Cuisines</h2>
          <CuisineSelectorCarousel
            cuisines={sampleCuisines}
            selectedCuisineId={selectedCuisineId}
            onSelectCuisine={handleCuisineSelect}
          />
        </section>
        
        <Separator className="dark:bg-gray-700" />

        {/* Featured Restaurants Section */}
        <section>
          <div className="flex justify-between items-center mb-4 sm:mb-6">
            <h2 className="text-2xl sm:text-3xl font-semibold text-gray-700 dark:text-gray-200">Featured Restaurants</h2>
            <Link to="/restaurant-listing">
              <Button variant="outline" className="dark:text-gray-200 dark:border-gray-600 dark:hover:bg-gray-700">View All</Button>
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
            {sampleRestaurants.map((restaurant) => (
              <Link to={`/restaurant-detail?id=${restaurant.id}`} key={restaurant.id} className="group">
                <Card className="overflow-hidden h-full flex flex-col transition-all duration-300 ease-in-out group-hover:shadow-xl dark:bg-gray-800 dark:border-gray-700 group-hover:border-primary/50 dark:group-hover:border-sky-500/70">
                  <div className="aspect-video overflow-hidden">
                    <img 
                      src={restaurant.imageUrl} 
                      alt={restaurant.name} 
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  </div>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg sm:text-xl group-hover:text-primary dark:group-hover:text-sky-400 dark:text-gray-100">{restaurant.name}</CardTitle>
                    <p className="text-xs sm:text-sm text-muted-foreground dark:text-gray-400">{restaurant.cuisine}</p>
                  </CardHeader>
                  <CardContent className="flex-grow pt-0">
                    <div className="flex justify-between items-center text-xs sm:text-sm text-gray-600 dark:text-gray-300">
                      <span className="flex items-center"><Star className="w-4 h-4 mr-1 text-yellow-400" /> {restaurant.rating}</span>
                      <span className="flex items-center"><Clock className="w-4 h-4 mr-1" /> {restaurant.deliveryTime}</span>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </section>
      </main>

      {/* Footer Component */}
      <Footer />
    </div>
  );
};

export default Homepage;