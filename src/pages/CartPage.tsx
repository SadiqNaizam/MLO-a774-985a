import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';

// Assuming a common Header component for the application layout
import Header from '@/components/layout/Header'; 
// Custom Footer component
import Footer from '@/components/layout/Footer';

// shadcn/ui components
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { useToast } from "@/components/ui/use-toast";

// Icons
import { Trash2, Plus, Minus, ShoppingCart } from 'lucide-react';

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
  // Example: could add variant like color or size
  // variant?: string; 
}

const initialCartItems: CartItem[] = [
  { id: '1', name: 'Gourmet Burger Deluxe', price: 15.99, quantity: 1, image: 'https://source.unsplash.com/random/100x100/?burger&sig=1' },
  { id: '2', name: 'Large Pepperoni Pizza', price: 22.50, quantity: 1, image: 'https://source.unsplash.com/random/100x100/?pizza&sig=2' },
  { id: '3', name: 'Fresh Orange Juice (1L)', price: 4.75, quantity: 2, image: 'https://source.unsplash.com/random/100x100/?juice&sig=3' },
  { id: '4', name: 'Chocolate Lava Cake', price: 8.00, quantity: 1, image: 'https://source.unsplash.com/random/100x100/?cake&sig=4' },
];

const DELIVERY_FEE = 5.00;
const TAX_RATE = 0.08; // 8%

const CartPage = () => {
  console.log('CartPage loaded');
  const { toast } = useToast();
  const [cartItems, setCartItems] = useState<CartItem[]>(initialCartItems);
  const [promoCode, setPromoCode] = useState<string>('');

  const handleQuantityChange = (itemId: string, newQuantity: number) => {
    const quantity = Math.max(1, newQuantity); // Ensure quantity is at least 1
    setCartItems(currentItems =>
      currentItems.map(item =>
        item.id === itemId ? { ...item, quantity } : item
      )
    );
  };

  const handleRemoveItem = (itemId: string) => {
    setCartItems(currentItems => currentItems.filter(item => item.id !== itemId));
    toast({
      title: "Item Removed",
      description: "The item has been removed from your cart.",
    });
  };

  const subtotal = useMemo(() => {
    return cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
  }, [cartItems]);

  const taxes = useMemo(() => {
    return subtotal * TAX_RATE;
  }, [subtotal]);

  const total = useMemo(() => {
    return subtotal + taxes + (cartItems.length > 0 ? DELIVERY_FEE : 0);
  }, [subtotal, taxes, cartItems.length]);

  const handleApplyPromoCode = () => {
    if (promoCode.toUpperCase() === "SAVE10") {
       toast({
        title: "Promo Code Applied!",
        description: `"${promoCode}" applied. (Note: Discount logic not implemented in this demo).`,
      });
    } else if (promoCode.trim() === "") {
      toast({
        variant: "destructive",
        title: "Invalid Promo Code",
        description: "Please enter a promo code.",
      });
    }
    else {
      toast({
        variant: "destructive",
        title: "Invalid Promo Code",
        description: `Promo code "${promoCode}" is not valid.`,
      });
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Assume Header component handles title and potentially cart icon/count */}
      <Header pageTitle="Your Shopping Cart" cartItemCount={cartItems.reduce((sum, item) => sum + item.quantity, 0)} />

      <main className="flex-grow container mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8 text-center">
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-gray-900 dark:text-white">
            Review Your Order
          </h1>
          <p className="mt-2 text-lg text-gray-600 dark:text-gray-300">
            Check your items and proceed to a secure checkout.
          </p>
        </div>

        {cartItems.length === 0 ? (
          <Card className="text-center py-12">
            <CardContent>
              <ShoppingCart className="mx-auto h-16 w-16 text-gray-400 dark:text-gray-500 mb-4" />
              <h2 className="text-2xl font-semibold text-gray-700 dark:text-gray-200 mb-2">Your Cart is Empty</h2>
              <p className="text-gray-500 dark:text-gray-400 mb-6">Looks like you haven't added anything to your cart yet.</p>
              <Link to="/restaurant-listing">
                <Button size="lg">Start Shopping</Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 xl:gap-12">
            {/* Cart Items Section */}
            <section className="lg:col-span-8">
              <Card className="shadow-lg">
                <CardHeader>
                  <CardTitle className="text-2xl">Your Items ({cartItems.reduce((sum, item) => sum + item.quantity, 0)})</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[100px] hidden sm:table-cell">Image</TableHead>
                        <TableHead>Product</TableHead>
                        <TableHead className="text-center">Quantity</TableHead>
                        <TableHead className="text-right">Price</TableHead>
                        <TableHead className="text-right">Total</TableHead>
                        <TableHead className="text-center">Remove</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {cartItems.map(item => (
                        <TableRow key={item.id}>
                          <TableCell className="hidden sm:table-cell">
                            <img 
                              src={item.image} 
                              alt={item.name} 
                              className="w-16 h-16 object-cover rounded-md" 
                            />
                          </TableCell>
                          <TableCell className="font-medium">{item.name}</TableCell>
                          <TableCell>
                            <div className="flex items-center justify-center space-x-1 sm:space-x-2">
                              <Button 
                                variant="outline" 
                                size="icon" 
                                className="h-8 w-8 sm:h-9 sm:w-9"
                                onClick={() => handleQuantityChange(item.id, item.quantity - 1)} 
                                disabled={item.quantity <= 1}
                                aria-label="Decrease quantity"
                              >
                                <Minus className="h-4 w-4" />
                              </Button>
                              <Input
                                type="number"
                                value={item.quantity}
                                onChange={(e) => handleQuantityChange(item.id, parseInt(e.target.value, 10) || 1)}
                                className="w-12 sm:w-16 text-center h-8 sm:h-9 px-1"
                                min="1"
                                aria-label={`Quantity for ${item.name}`}
                              />
                              <Button 
                                variant="outline" 
                                size="icon" 
                                className="h-8 w-8 sm:h-9 sm:w-9"
                                onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                                aria-label="Increase quantity"
                              >
                                <Plus className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                          <TableCell className="text-right">${item.price.toFixed(2)}</TableCell>
                          <TableCell className="text-right font-semibold">${(item.price * item.quantity).toFixed(2)}</TableCell>
                          <TableCell className="text-center">
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className="text-red-500 hover:text-red-700"
                              onClick={() => handleRemoveItem(item.id)}
                              aria-label={`Remove ${item.name} from cart`}
                            >
                              <Trash2 className="h-5 w-5" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </section>

            {/* Order Summary Section */}
            <section className="lg:col-span-4">
              <Card className="shadow-lg sticky top-24"> {/* Sticky for longer carts */}
                <CardHeader>
                  <CardTitle className="text-2xl">Order Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Delivery Fee</span>
                    <span>${DELIVERY_FEE.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Taxes ({(TAX_RATE * 100).toFixed(0)}%)</span>
                    <span>${taxes.toFixed(2)}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between text-xl font-bold">
                    <span>Total</span>
                    <span>${total.toFixed(2)}</span>
                  </div>
                  
                  <div className="pt-4 space-y-2">
                    <Label htmlFor="promo-code" className="font-semibold">Have a Promo Code?</Label>
                    <div className="flex items-stretch space-x-2">
                      <InputOTP 
                        maxLength={6} 
                        value={promoCode} 
                        onChange={(value) => setPromoCode(value)}
                        name="promo-code"
                        id="promo-code"
                        containerClassName="flex-grow"
                      >
                        <InputOTPGroup className="w-full">
                          <InputOTPSlot index={0} className="flex-1" />
                          <InputOTPSlot index={1} className="flex-1" />
                          <InputOTPSlot index={2} className="flex-1" />
                          <InputOTPSlot index={3} className="flex-1" />
                          <InputOTPSlot index={4} className="flex-1" />
                          <InputOTPSlot index={5} className="flex-1" />
                        </InputOTPGroup>
                      </InputOTP>
                      <Button variant="outline" onClick={handleApplyPromoCode} className="shrink-0 px-3">Apply</Button>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="mt-4">
                  <Link to="/checkout" className="w-full">
                    <Button size="lg" className="w-full text-lg py-6">
                      Proceed to Checkout (${total.toFixed(2)})
                    </Button>
                  </Link>
                </CardFooter>
              </Card>
            </section>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default CartPage;