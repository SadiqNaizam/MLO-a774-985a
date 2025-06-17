import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

// Custom Components
import Footer from '@/components/layout/Footer';

// shadcn/ui Components
import { Button } from '@/components/ui/button';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardHeader, CardTitle, CardFooter, CardDescription } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/components/ui/use-toast'; // For "Order Placed" notification

// Icons
import { ShoppingCart, MapPin, CreditCard, ListOrdered, ArrowLeft, ChevronRight } from 'lucide-react';

// Placeholder Header (as it's not provided in custom_component_code)
const CheckoutHeader = () => (
  <header className="bg-white shadow-sm sticky top-0 z-50">
    <div className="container mx-auto px-4 py-4 flex justify-between items-center">
      <Link to="/" className="text-2xl font-bold text-primary">
        FoodieFleet
      </Link>
      <div className="flex items-center space-x-4">
        <Link to="/cart" className="text-gray-600 hover:text-primary flex items-center">
          <ShoppingCart className="h-5 w-5 mr-1" />
          Cart
        </Link>
        <Link to="/user-profile" className="text-gray-600 hover:text-primary">
          Profile
        </Link>
      </div>
    </div>
  </header>
);

const CheckoutPage: React.FC = () => {
  console.log('CheckoutPage loaded');
  const navigate = useNavigate();
  const { toast } = useToast();

  // State for accordion control
  const [activeAccordionItem, setActiveAccordionItem] = useState<string | undefined>('delivery-address');

  // Placeholder form data (in a real app, this would be more complex with validation)
  const [deliveryInfo, setDeliveryInfo] = useState({
    fullName: '',
    addressLine1: '',
    addressLine2: '',
    city: '',
    postalCode: '',
    country: 'US', // Default country
    saveAddress: false,
  });

  const [paymentInfo, setPaymentInfo] = useState({
    paymentMethod: 'credit-card', // 'credit-card' or 'paypal'
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    saveCard: false,
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, section: 'delivery' | 'payment') => {
    const { name, value, type } = e.target;
    const checked = type === 'checkbox' ? (e.target as HTMLInputElement).checked : undefined;

    if (section === 'delivery') {
      setDeliveryInfo(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
    } else if (section === 'payment') {
      setPaymentInfo(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
    }
  };

  const handleSelectChange = (value: string, name: string, section: 'delivery' | 'payment') => {
     if (section === 'delivery') {
      setDeliveryInfo(prev => ({ ...prev, [name]: value }));
    }
    // Add payment section if select is used there
  };

  const handleRadioChange = (value: string, name: string) => {
    setPaymentInfo(prev => ({ ...prev, [name]: value }));
  };
  
  const mockOrderItems = [
    { id: '1', name: 'Margherita Pizza', quantity: 1, price: 12.99 },
    { id: '2', name: 'Coca-Cola (2L)', quantity: 1, price: 3.00 },
    { id: '3', name: 'Garlic Breadsticks', quantity: 1, price: 5.50 },
  ];

  const subtotal = mockOrderItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const deliveryFee = 4.99;
  const taxes = subtotal * 0.08; // 8% tax
  const totalAmount = subtotal + deliveryFee + taxes;

  const handlePlaceOrder = (e: React.FormEvent) => {
    e.preventDefault();
    // Basic validation example
    if (!deliveryInfo.fullName || !deliveryInfo.addressLine1 || !deliveryInfo.city || !deliveryInfo.postalCode) {
        toast({
            variant: "destructive",
            title: "Missing Information",
            description: "Please fill in all required delivery address fields.",
        });
        setActiveAccordionItem('delivery-address');
        return;
    }
    if (paymentInfo.paymentMethod === 'credit-card' && (!paymentInfo.cardNumber || !paymentInfo.expiryDate || !paymentInfo.cvv)) {
        toast({
            variant: "destructive",
            title: "Missing Information",
            description: "Please fill in all required payment details.",
        });
        setActiveAccordionItem('payment-method');
        return;
    }

    console.log("Order placed:", { deliveryInfo, paymentInfo, orderItems: mockOrderItems, totalAmount });
    toast({
      title: "Order Placed Successfully!",
      description: "We're preparing your delicious meal. Redirecting to tracking...",
      className: "bg-green-500 text-white",
    });
    // Navigate to order tracking page (path from App.tsx)
    setTimeout(() => {
      navigate('/order-tracking');
    }, 2000);
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <CheckoutHeader />

      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="mb-6">
          <Link to="/cart" className="flex items-center text-sm text-primary hover:underline">
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back to Cart
          </Link>
          <h1 className="text-3xl font-bold mt-2">Checkout</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Checkout Steps - Accordion */}
          <form onSubmit={handlePlaceOrder} className="lg:col-span-2 space-y-6">
            <Accordion
              type="single"
              collapsible
              value={activeAccordionItem}
              onValueChange={setActiveAccordionItem}
              className="w-full bg-white shadow rounded-lg"
            >
              {/* Step 1: Delivery Address */}
              <AccordionItem value="delivery-address">
                <AccordionTrigger className="px-6 py-4 text-lg font-semibold hover:no-underline">
                  <div className="flex items-center">
                    <MapPin className="h-6 w-6 mr-3 text-primary" />
                    1. Delivery Address
                  </div>
                </AccordionTrigger>
                <AccordionContent className="px-6 pb-6 pt-2 border-t">
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="fullName">Full Name</Label>
                      <Input id="fullName" name="fullName" value={deliveryInfo.fullName} onChange={(e) => handleInputChange(e, 'delivery')} placeholder="John Doe" required />
                    </div>
                    <div>
                      <Label htmlFor="addressLine1">Address Line 1</Label>
                      <Input id="addressLine1" name="addressLine1" value={deliveryInfo.addressLine1} onChange={(e) => handleInputChange(e, 'delivery')} placeholder="123 Main St" required />
                    </div>
                    <div>
                      <Label htmlFor="addressLine2">Address Line 2 (Optional)</Label>
                      <Input id="addressLine2" name="addressLine2" value={deliveryInfo.addressLine2} onChange={(e) => handleInputChange(e, 'delivery')} placeholder="Apartment, suite, etc." />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="city">City</Label>
                        <Input id="city" name="city" value={deliveryInfo.city} onChange={(e) => handleInputChange(e, 'delivery')} placeholder="Anytown" required />
                      </div>
                      <div>
                        <Label htmlFor="postalCode">Postal Code</Label>
                        <Input id="postalCode" name="postalCode" value={deliveryInfo.postalCode} onChange={(e) => handleInputChange(e, 'delivery')} placeholder="12345" required />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="country">Country</Label>
                      <Select name="country" value={deliveryInfo.country} onValueChange={(value) => handleSelectChange(value, 'country', 'delivery')}>
                        <SelectTrigger id="country">
                          <SelectValue placeholder="Select country" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="US">United States</SelectItem>
                          <SelectItem value="CA">Canada</SelectItem>
                          <SelectItem value="GB">United Kingdom</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="flex items-center space-x-2 pt-2">
                      <Checkbox id="saveAddress" name="saveAddress" checked={deliveryInfo.saveAddress} onCheckedChange={(checked) => setDeliveryInfo(prev => ({ ...prev, saveAddress: !!checked }))} />
                      <Label htmlFor="saveAddress" className="text-sm font-normal">Save this address for future orders</Label>
                    </div>
                    <Button type="button" onClick={() => setActiveAccordionItem('payment-method')} className="w-full md:w-auto mt-2">
                      Continue to Payment <ChevronRight className="h-4 w-4 ml-1" />
                    </Button>
                  </div>
                </AccordionContent>
              </AccordionItem>

              {/* Step 2: Payment Method */}
              <AccordionItem value="payment-method">
                <AccordionTrigger className="px-6 py-4 text-lg font-semibold hover:no-underline">
                  <div className="flex items-center">
                    <CreditCard className="h-6 w-6 mr-3 text-primary" />
                    2. Payment Method
                  </div>
                </AccordionTrigger>
                <AccordionContent className="px-6 pb-6 pt-2 border-t">
                  <RadioGroup name="paymentMethod" value={paymentInfo.paymentMethod} onValueChange={(value) => handleRadioChange(value, 'paymentMethod')} className="space-y-4">
                    <Label className="font-semibold text-base">Choose payment method:</Label>
                    <div className="flex items-center space-x-3 p-3 border rounded-md has-[:checked]:border-primary has-[:checked]:ring-1 has-[:checked]:ring-primary">
                      <RadioGroupItem value="credit-card" id="credit-card" />
                      <Label htmlFor="credit-card" className="font-normal flex-grow cursor-pointer">Credit/Debit Card</Label>
                    </div>
                    {paymentInfo.paymentMethod === 'credit-card' && (
                      <div className="ml-8 space-y-4 p-4 border-l border-dashed">
                        <div>
                          <Label htmlFor="cardNumber">Card Number</Label>
                          <Input id="cardNumber" name="cardNumber" value={paymentInfo.cardNumber} onChange={(e) => handleInputChange(e, 'payment')} placeholder="•••• •••• •••• ••••" required />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="expiryDate">Expiry Date</Label>
                            <Input id="expiryDate" name="expiryDate" value={paymentInfo.expiryDate} onChange={(e) => handleInputChange(e, 'payment')} placeholder="MM/YY" required />
                          </div>
                          <div>
                            <Label htmlFor="cvv">CVV</Label>
                            <Input id="cvv" name="cvv" value={paymentInfo.cvv} onChange={(e) => handleInputChange(e, 'payment')} placeholder="•••" required />
                          </div>
                        </div>
                        <div className="flex items-center space-x-2 pt-2">
                          <Checkbox id="saveCard" name="saveCard" checked={paymentInfo.saveCard} onCheckedChange={(checked) => setPaymentInfo(prev => ({ ...prev, saveCard: !!checked }))} />
                          <Label htmlFor="saveCard" className="text-sm font-normal">Save this card for future payments</Label>
                        </div>
                      </div>
                    )}
                    <div className="flex items-center space-x-3 p-3 border rounded-md has-[:checked]:border-primary has-[:checked]:ring-1 has-[:checked]:ring-primary">
                      <RadioGroupItem value="paypal" id="paypal" />
                      <Label htmlFor="paypal" className="font-normal flex-grow cursor-pointer">PayPal</Label>
                    </div>
                     {paymentInfo.paymentMethod === 'paypal' && (
                        <div className="ml-8 p-4 border-l border-dashed">
                            <p className="text-sm text-gray-600">You will be redirected to PayPal to complete your purchase.</p>
                        </div>
                    )}
                  </RadioGroup>
                  <Button type="button" onClick={() => setActiveAccordionItem('order-summary')} className="w-full md:w-auto mt-4">
                      Review Order <ChevronRight className="h-4 w-4 ml-1" />
                  </Button>
                </AccordionContent>
              </AccordionItem>

              {/* Step 3: Order Summary (Review) */}
              <AccordionItem value="order-summary">
                <AccordionTrigger className="px-6 py-4 text-lg font-semibold hover:no-underline">
                  <div className="flex items-center">
                    <ListOrdered className="h-6 w-6 mr-3 text-primary" />
                    3. Review Your Order
                  </div>
                </AccordionTrigger>
                <AccordionContent className="px-6 pb-6 pt-2 border-t">
                    <Card className="border-none shadow-none">
                        <CardHeader className="px-0">
                            <CardTitle>Order Items</CardTitle>
                        </CardHeader>
                        <CardContent className="px-0 space-y-3">
                            {mockOrderItems.map(item => (
                                <div key={item.id} className="flex justify-between items-center">
                                <div>
                                    <p className="font-medium">{item.name}</p>
                                    <p className="text-sm text-gray-500">Quantity: {item.quantity}</p>
                                </div>
                                <p>${(item.price * item.quantity).toFixed(2)}</p>
                                </div>
                            ))}
                            <Separator className="my-3" />
                            <div className="flex justify-between">
                                <p>Subtotal</p>
                                <p>${subtotal.toFixed(2)}</p>
                            </div>
                            <div className="flex justify-between">
                                <p>Delivery Fee</p>
                                <p>${deliveryFee.toFixed(2)}</p>
                            </div>
                            <div className="flex justify-between">
                                <p>Taxes (8%)</p>
                                <p>${taxes.toFixed(2)}</p>
                            </div>
                            <Separator className="my-3" />
                            <div className="flex justify-between font-bold text-lg">
                                <p>Total Amount</p>
                                <p>${totalAmount.toFixed(2)}</p>
                            </div>
                        </CardContent>
                    </Card>
                    <Button type="submit" size="lg" className="w-full mt-6">
                        Place Order & Pay ${totalAmount.toFixed(2)}
                    </Button>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </form>

          {/* Order Summary Side Panel (static, but content shown in accordion step 3 too) */}
          <div className="lg:col-span-1">
            <Card className="sticky top-24 shadow-lg"> {/* Added sticky for better UX on scroll */}
              <CardHeader>
                <CardTitle className="text-xl">Order Summary</CardTitle>
                <CardDescription>Review your items before placing the order.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {mockOrderItems.map(item => (
                  <div key={item.id} className="flex justify-between items-start">
                    <div>
                      <p className="font-medium leading-tight">{item.name}</p>
                      <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                    </div>
                    <p className="text-sm">${(item.price * item.quantity).toFixed(2)}</p>
                  </div>
                ))}
                <Separator className="my-4" />
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Delivery Fee</span>
                    <span>${deliveryFee.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Taxes</span>
                    <span>${taxes.toFixed(2)}</span>
                  </div>
                </div>
                <Separator className="my-4" />
                <div className="flex justify-between font-semibold text-lg">
                  <span>Total</span>
                  <span>${totalAmount.toFixed(2)}</span>
                </div>
              </CardContent>
              <CardFooter>
                 <Button type="submit" form="checkout-form" size="lg" className="w-full" onClick={(e) => {
                    // This click handler is mostly for illustration if this button is outside the form.
                    // If inside the form, it will submit. If form ID is used, need to ensure form has that ID.
                    // For this setup, the main "Place Order" button is inside the accordion.
                    // This could be a redundant button or a trigger for the main form submission.
                    // To avoid confusion, I will ensure the form has an ID for this to work or make it clear.
                    // The main form submit button is inside the accordion. This one is more like a summary confirmation.
                    // Let's assume the form tag wrapping accordion has id="checkout-form"
                    const mainForm = document.getElementById('checkout-form') as HTMLFormElement | null;
                    if (mainForm) {
                      // Create and dispatch a submit event
                      const submitEvent = new Event('submit', { bubbles: true, cancelable: true });
                      mainForm.dispatchEvent(submitEvent);
                    } else {
                      // Fallback or error, though the main button should be preferred
                       handlePlaceOrder(e as any); // Cast needed as this button is not type=submit within a form by default
                    }
                 }}>
                    Place Order
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default CheckoutPage;