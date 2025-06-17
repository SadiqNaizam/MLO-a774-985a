import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

// Custom Components
import Footer from '@/components/layout/Footer';
import OrderStatusTracker, { OrderStatusId } from '@/components/OrderStatusTracker';

// shadcn/ui Components
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';

// Icons
import { ChevronLeft, MapPin, Package, Clock, Phone, ShoppingCart, UserCircle, Utensils } from 'lucide-react';

// Helper: Simple Header for this page
const SimpleHeader: React.FC = () => {
  return (
    <header className="bg-white dark:bg-gray-900 shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold text-primary flex items-center">
          <Utensils className="mr-2 h-6 w-6" />
          FoodieFleet
        </Link>
        <nav className="space-x-4 flex items-center">
          <Link to="/" className="text-gray-600 dark:text-gray-300 hover:text-primary dark:hover:text-primary-dark transition-colors flex items-center">
            <Utensils className="mr-1 h-4 w-4" /> Home
          </Link>
          <Link to="/restaurant-listing" className="text-gray-600 dark:text-gray-300 hover:text-primary dark:hover:text-primary-dark transition-colors flex items-center">
            <Package className="mr-1 h-4 w-4" /> Restaurants
          </Link>
          <Link to="/cart" className="text-gray-600 dark:text-gray-300 hover:text-primary dark:hover:text-primary-dark transition-colors flex items-center">
            <ShoppingCart className="mr-1 h-4 w-4" /> Cart
          </Link>
          <Link to="/user-profile" className="text-gray-600 dark:text-gray-300 hover:text-primary dark:hover:text-primary-dark transition-colors flex items-center">
            <UserCircle className="mr-1 h-4 w-4" /> Profile
          </Link>
        </nav>
      </div>
    </header>
  );
};


const OrderTrackingPage: React.FC = () => {
  console.log('OrderTrackingPage loaded');
  const navigate = useNavigate();

  // Placeholder order data
  const order = {
    id: 'FF123456789',
    estimatedDeliveryTime: '4:30 PM - 4:45 PM',
    currentStatus: 'PREPARING' as OrderStatusId,
    deliveryAddress: '123 Main St, Anytown, USA, 12345',
    restaurantName: 'The Gourmet Place',
    items: [
      { id: '1', name: 'Margherita Pizza', quantity: 1, price: 15.99 },
      { id: '2', name: 'Caesar Salad', quantity: 1, price: 8.50 },
      { id: '3', name: 'Coke', quantity: 2, price: 2.00 },
    ],
    subtotal: 28.49,
    deliveryFee: 3.00,
    tax: 2.28,
    total: 33.77,
    driver: {
      name: 'John D.',
      vehicle: 'Blue Toyota Prius',
      plate: 'XYZ 123',
    },
  };

  const orderStatuses: { id: OrderStatusId; label: string; icon: React.ElementType; time?: string; details?: string }[] = [
    { id: 'ORDER_PLACED', label: 'Order Placed', icon: Package, time: "3:45 PM", details: "We've received your order." },
    { id: 'PREPARING', label: 'Preparing', icon: Utensils, time: "3:50 PM", details: `${order.restaurantName} is preparing your delicious meal.` },
    { id: 'OUT_FOR_DELIVERY', label: 'Out for Delivery', icon: Clock, time: "4:15 PM", details: `${order.driver.name} is on the way with your order.` },
    { id: 'DELIVERED', label: 'Delivered', icon: MapPin, time: "4:35 PM", details: "Enjoy your meal!" },
  ];


  return (
    <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-950">
      <SimpleHeader />

      <ScrollArea className="flex-grow">
        <main className="container mx-auto px-4 py-8">
          <Button variant="outline" onClick={() => navigate(-1)} className="mb-6 text-sm">
            <ChevronLeft className="mr-2 h-4 w-4" /> Back
          </Button>

          <Card className="mb-8 shadow-lg">
            <CardHeader>
              <CardTitle className="text-2xl">Track Your Order: #{order.id}</CardTitle>
              <CardDescription>
                Estimated Delivery: <span className="font-semibold text-primary">{order.estimatedDeliveryTime}</span>
              </CardDescription>
            </CardHeader>
            <CardContent>
              <OrderStatusTracker currentStatusId={order.currentStatus} />
            </CardContent>
          </Card>

          <div className="grid md:grid-cols-3 gap-6">
            {/* Order Details Card */}
            <Card className="md:col-span-2 shadow-md">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Package className="mr-2 h-5 w-5 text-primary" />
                  Order Summary
                </CardTitle>
                <CardDescription>From: {order.restaurantName}</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 mb-4">
                  {order.items.map(item => (
                    <li key={item.id} className="flex justify-between items-center text-sm">
                      <span>{item.name} (x{item.quantity})</span>
                      <span>${(item.price * item.quantity).toFixed(2)}</span>
                    </li>
                  ))}
                </ul>
                <Separator className="my-3" />
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between"><span>Subtotal:</span><span>${order.subtotal.toFixed(2)}</span></div>
                  <div className="flex justify-between"><span>Delivery Fee:</span><span>${order.deliveryFee.toFixed(2)}</span></div>
                  <div className="flex justify-between"><span>Tax:</span><span>${order.tax.toFixed(2)}</span></div>
                  <Separator className="my-2" />
                  <div className="flex justify-between font-semibold text-base"><span>Total:</span><span>${order.total.toFixed(2)}</span></div>
                </div>
              </CardContent>
            </Card>

            {/* Delivery & Actions Card */}
            <Card className="shadow-md">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <MapPin className="mr-2 h-5 w-5 text-primary" />
                  Delivery Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="font-semibold text-sm">Delivery Address:</p>
                  <p className="text-sm text-gray-700 dark:text-gray-300">{order.deliveryAddress}</p>
                </div>
                {order.currentStatus === 'OUT_FOR_DELIVERY' && order.driver && (
                  <div>
                    <p className="font-semibold text-sm">Your Rider:</p>
                    <p className="text-sm text-gray-700 dark:text-gray-300">{order.driver.name}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{order.driver.vehicle} ({order.driver.plate})</p>
                  </div>
                )}
                <Separator />
                <div className="space-y-2">
                  <Button className="w-full" disabled={order.currentStatus !== 'OUT_FOR_DELIVERY'}>
                    <MapPin className="mr-2 h-4 w-4" /> Track on Map (Live)
                  </Button>
                  <Button variant="outline" className="w-full" onClick={() => navigate('/contact')}> {/* Assuming a general contact page route */}
                    <Phone className="mr-2 h-4 w-4" /> Contact Support
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Detailed Status Timeline (Optional, but good for tracking pages) */}
          <Card className="mt-8 shadow-md">
            <CardHeader>
              <CardTitle>Order Timeline</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-4">
                {orderStatuses.map((status, index) => {
                  const isActiveOrCompleted = orderStatuses.findIndex(s => s.id === order.currentStatus) >= index;
                  const isCurrent = status.id === order.currentStatus;
                  return (
                    <li key={status.id} className="flex items-start">
                      <div className="flex flex-col items-center mr-4">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${isActiveOrCompleted ? (isCurrent ? 'bg-blue-500 animate-pulse' : 'bg-green-500') : 'bg-gray-300 dark:bg-gray-600'}`}>
                          <status.icon className={`h-4 w-4 ${isActiveOrCompleted ? 'text-white' : 'text-gray-500 dark:text-gray-400'}`} />
                        </div>
                        {index < orderStatuses.length - 1 && (
                          <div className={`w-0.5 h-12 mt-1 ${isActiveOrCompleted && !isCurrent ? 'bg-green-500' : 'bg-gray-300 dark:bg-gray-600'}`}></div>
                        )}
                      </div>
                      <div>
                        <p className={`font-semibold ${isCurrent ? 'text-blue-600 dark:text-blue-400' : (isActiveOrCompleted ? 'text-green-600 dark:text-green-400' : 'text-gray-700 dark:text-gray-300')}`}>{status.label}</p>
                        {isActiveOrCompleted && status.time && <p className="text-xs text-gray-500 dark:text-gray-400">{status.time}</p>}
                        {isActiveOrCompleted && status.details && <p className="text-sm text-gray-600 dark:text-gray-400">{status.details}</p>}
                      </div>
                    </li>
                  );
                })}
              </ul>
            </CardContent>
          </Card>

        </main>
      </ScrollArea>

      <Footer />
    </div>
  );
};

export default OrderTrackingPage;