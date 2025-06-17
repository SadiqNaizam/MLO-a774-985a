import React, { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import Footer from '@/components/layout/Footer'; // Custom component
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from '@/components/ui/dialog';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { toast } from 'sonner'; // For notifications
import { Star, Clock, MapPin, Utensils, ShoppingCart, Salad, Coffee, Cookie, Soup, PlusCircle, Info } from 'lucide-react';

// Placeholder types
interface Dish {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  imageUrl?: string;
  customizable?: boolean;
  options?: { name: string; price: number }[];
}

interface Review {
  id: string;
  userName: string;
  rating: number;
  comment: string;
  date: string;
}

interface Restaurant {
  id: string;
  name: string;
  cuisine: string;
  address: string;
  openingHours: string;
  rating: number;
  imageUrl?: string;
  menu: Dish[];
  reviews: Review[];
}

// Sample Data for a Restaurant
const sampleRestaurantData: Restaurant = {
  id: 'restaurant-123',
  name: 'The Gourmet Place',
  cuisine: 'Italian',
  address: '123 Main St, Anytown, USA',
  openingHours: 'Mon-Sun: 11:00 AM - 10:00 PM',
  rating: 4.5,
  imageUrl: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=800&auto=format&fit=crop',
  menu: [
    { id: 'dish-1', name: 'Margherita Pizza', description: 'Classic pizza with mozzarella and basil.', price: 12.99, category: 'Main Courses', imageUrl: 'https://images.unsplash.com/photo-1593504049358-743307ef1da3?q=80&w=600&auto=format&fit=crop', customizable: true },
    { id: 'dish-2', name: 'Spaghetti Carbonara', description: 'Creamy pasta with pancetta and egg.', price: 15.50, category: 'Main Courses', imageUrl: 'https://images.unsplash.com/photo-1588013273468-315080664DSs?q=80&w=600&auto=format&fit=crop' },
    { id: 'dish-3', name: 'Caesar Salad', description: 'Fresh salad with Caesar dressing.', price: 8.75, category: 'Appetizers', imageUrl: 'https://images.unsplash.com/photo-1550304935-f20077db5ada?q=80&w=600&auto=format&fit=crop' },
    { id: 'dish-4', name: 'Tiramisu', description: 'Delicious Italian dessert.', price: 7.00, category: 'Desserts', imageUrl: 'https://images.unsplash.com/photo-1571091718767-18b5b1457add?q=80&w=600&auto=format&fit=crop' },
    { id: 'dish-5', name: 'Espresso', description: 'Strong Italian coffee.', price: 3.00, category: 'Drinks' },
    { id: 'dish-6', name: 'Minestrone Soup', description: 'Hearty vegetable soup.', price: 6.50, category: 'Appetizers', imageUrl: 'https://images.unsplash.com/photo-1547592180-85f173990554?q=80&w=600&auto=format&fit=crop' },
  ],
  reviews: [
    { id: 'review-1', userName: 'Jane Doe', rating: 5, comment: 'Amazing food and great service!', date: '2024-07-15' },
    { id: 'review-2', userName: 'John Smith', rating: 4, comment: 'Lovely atmosphere, pasta was a bit salty.', date: '2024-07-10' },
  ],
};

// Simple Header Placeholder (as it's not a custom component provided)
const PageHeader: React.FC = () => {
  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold text-primary">FoodieFleet</Link>
        <nav className="flex items-center space-x-4">
          <Link to="/restaurant-listing" className="text-gray-600 hover:text-primary">Restaurants</Link>
          <Link to="/user-profile" className="text-gray-600 hover:text-primary">Profile</Link>
          <Link to="/cart">
            <Button variant="outline" size="icon">
              <ShoppingCart className="h-5 w-5" />
            </Button>
          </Link>
        </nav>
      </div>
    </header>
  );
};


// Dish Card Component (using shadcn Card)
interface DishCardProps {
  dish: Dish;
  onAddToCart: (dish: Dish) => void;
  onViewDetails: (dish: Dish) => void;
}

const DishCard: React.FC<DishCardProps> = ({ dish, onAddToCart, onViewDetails }) => {
  return (
    <Card className="overflow-hidden flex flex-col">
      {dish.imageUrl && (
        <img src={dish.imageUrl} alt={dish.name} className="w-full h-40 object-cover" />
      )}
      {!dish.imageUrl && (
         <div className="w-full h-40 bg-muted flex items-center justify-center">
            <Utensils className="w-12 h-12 text-gray-400" />
        </div>
      )}
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">{dish.name}</CardTitle>
        <CardDescription className="text-sm h-10 overflow-hidden">{dish.description}</CardDescription>
      </CardHeader>
      <CardContent className="flex-grow">
        <p className="text-xl font-semibold text-primary">${dish.price.toFixed(2)}</p>
      </CardContent>
      <CardFooter className="flex flex-col sm:flex-row gap-2 pt-0">
        <Button variant="outline" className="w-full sm:w-auto" onClick={() => onViewDetails(dish)}>
            <Info className="mr-2 h-4 w-4" /> View
        </Button>
        <Button className="w-full sm:w-auto flex-grow" onClick={() => onAddToCart(dish)}>
          <PlusCircle className="mr-2 h-4 w-4" /> Add to Cart
        </Button>
      </CardFooter>
    </Card>
  );
};


const RestaurantDetailPage: React.FC = () => {
  console.log('RestaurantDetailPage loaded');
  // In a real app, restaurantId would come from URL params:
  // const { restaurantId } = useParams();
  // And data would be fetched based on restaurantId.
  const restaurant = sampleRestaurantData; // Using sample data for now

  const [selectedDishForDialog, setSelectedDishForDialog] = useState<Dish | null>(null);


  const handleAddToCart = (dish: Dish) => {
    toast.success(`${dish.name} added to cart!`, {
      description: `Price: $${dish.price.toFixed(2)}`,
      action: {
        label: "View Cart",
        onClick: () => { /* Navigate to cart page */ window.location.href = '/cart'; },
      },
    });
    console.log('Added to cart:', dish);
  };

  const handleViewDetails = (dish: Dish) => {
    setSelectedDishForDialog(dish);
  };

  const menuCategories = React.useMemo(() => {
    const categories = new Set(restaurant.menu.map(dish => dish.category));
    return Array.from(categories);
  }, [restaurant.menu]);

  const getCategoryIcon = (category: string) => {
    switch (category.toLowerCase()) {
      case 'appetizers': return <Salad className="mr-2 h-5 w-5" />;
      case 'main courses': return <Utensils className="mr-2 h-5 w-5" />;
      case 'desserts': return <Cookie className="mr-2 h-5 w-5" />;
      case 'drinks': return <Coffee className="mr-2 h-5 w-5" />;
      default: return <Soup className="mr-2 h-5 w-5" />;
    }
  };

  if (!restaurant) {
    return <div>Loading restaurant details...</div>; // Or a proper skeleton loader
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <PageHeader />

      <main className="flex-grow container mx-auto px-4 py-8">
        <Breadcrumb className="mb-6">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link to="/">Home</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link to="/restaurant-listing">Restaurants</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>{restaurant.name}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        {/* Restaurant Info Card */}
        <Card className="mb-8 shadow-lg">
          <div className="md:flex">
            <div className="md:w-1/3">
              <img 
                src={restaurant.imageUrl || 'https://via.placeholder.com/400x300?text=Restaurant+Image'} 
                alt={restaurant.name} 
                className="object-cover w-full h-64 md:h-full rounded-t-lg md:rounded-l-lg md:rounded-t-none" 
              />
            </div>
            <div className="md:w-2/3">
              <CardHeader>
                <CardTitle className="text-3xl font-bold">{restaurant.name}</CardTitle>
                <CardDescription className="text-lg text-gray-600">{restaurant.cuisine}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center text-gray-700">
                  <MapPin className="mr-2 h-5 w-5 text-primary" />
                  <span>{restaurant.address}</span>
                </div>
                <div className="flex items-center text-gray-700">
                  <Clock className="mr-2 h-5 w-5 text-primary" />
                  <span>{restaurant.openingHours}</span>
                </div>
                <div className="flex items-center text-yellow-500">
                  {[...Array(Math.floor(restaurant.rating))].map((_, i) => <Star key={`full-${i}`} fill="currentColor" className="h-5 w-5" />)}
                  {restaurant.rating % 1 !== 0 && <Star key="half" fill="currentColor" className="h-5 w-5 opacity-50" />} 
                  {[...Array(5 - Math.ceil(restaurant.rating))].map((_, i) => <Star key={`empty-${i}`} className="h-5 w-5" />)}
                  <span className="ml-2 text-gray-700">{restaurant.rating.toFixed(1)} stars</span>
                </div>
              </CardContent>
            </div>
          </div>
        </Card>

        {/* Menu Tabs */}
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Menu</h2>
          <Tabs defaultValue={menuCategories[0] || 'all'} className="w-full">
            <TabsList className="grid w-full grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:flex lg:flex-wrap lg:justify-start mb-4">
              {menuCategories.map(category => (
                <TabsTrigger key={category} value={category} className="flex items-center justify-center data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                  {getCategoryIcon(category)} {category}
                </TabsTrigger>
              ))}
            </TabsList>
            {menuCategories.map(category => (
              <TabsContent key={category} value={category}>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {restaurant.menu.filter(dish => dish.category === category).map(dish => (
                    <DishCard key={dish.id} dish={dish} onAddToCart={handleAddToCart} onViewDetails={handleViewDetails} />
                  ))}
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </section>

        {/* Reviews Section */}
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">User Reviews</h2>
          {restaurant.reviews.length > 0 ? (
            <div className="space-y-4">
              {restaurant.reviews.map(review => (
                <Card key={review.id} className="shadow">
                  <CardHeader>
                    <CardTitle className="text-md flex items-center justify-between">
                      <span>{review.userName}</span>
                      <span className="text-sm font-normal text-gray-500">{review.date}</span>
                    </CardTitle>
                    <div className="flex items-center text-yellow-500">
                        {[...Array(review.rating)].map((_, i) => <Star key={i} fill="currentColor" className="h-4 w-4" />)}
                        {[...Array(5 - review.rating)].map((_, i) => <Star key={`empty-${i}`} className="h-4 w-4" />)}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-700">{review.comment}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <p className="text-gray-600">No reviews yet for this restaurant.</p>
          )}
        </section>

      </main>

      <Footer />

      {/* Dish Details Dialog */}
      {selectedDishForDialog && (
        <Dialog open={!!selectedDishForDialog} onOpenChange={(isOpen) => !isOpen && setSelectedDishForDialog(null)}>
          <DialogContent className="sm:max-w-[425px] md:max-w-[600px]">
            <DialogHeader>
              <DialogTitle className="text-2xl">{selectedDishForDialog.name}</DialogTitle>
              <DialogDescription>{selectedDishForDialog.description}</DialogDescription>
            </DialogHeader>
            <div className="py-4">
                {selectedDishForDialog.imageUrl && <img src={selectedDishForDialog.imageUrl} alt={selectedDishForDialog.name} className="w-full h-64 object-cover rounded-md mb-4"/>}
              <p className="text-xl font-semibold text-primary mb-2">${selectedDishForDialog.price.toFixed(2)}</p>
              {selectedDishForDialog.customizable && (
                <div>
                    <h4 className="font-semibold mb-2">Customization Options:</h4>
                    <p className="text-sm text-muted-foreground"> (Placeholder for customization form/options)</p>
                </div>
              )}
            </div>
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline">Close</Button>
              </DialogClose>
              <Button onClick={() => {
                handleAddToCart(selectedDishForDialog);
                setSelectedDishForDialog(null);
              }}>
                Add to Cart
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

    </div>
  );
};

export default RestaurantDetailPage;