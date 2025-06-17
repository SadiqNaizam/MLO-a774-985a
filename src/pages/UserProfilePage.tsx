import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Footer from '@/components/layout/Footer'; // Custom component

// Shadcn/ui components
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

// Lucide icons
import { User, ListOrdered, MapPin, CreditCard, HelpCircle, ShoppingCart, LogOut, Building } from 'lucide-react';

// Placeholder data
const userProfile = {
  name: 'Alex Johnson',
  email: 'alex.johnson@example.com',
  phone: '555-123-4567',
  avatarUrl: 'https://i.pravatar.cc/150?u=alexjohnson', // Placeholder avatar
  initials: 'AJ',
};

const pastOrders = [
  { id: 'ORD78923', date: '2024-07-25', items: 3, total: 45.99, status: 'Delivered', restaurant: 'Pizza Place' },
  { id: 'ORD65487', date: '2024-07-20', items: 2, total: 22.50, status: 'Delivered', restaurant: 'Burger Joint' },
  { id: 'ORD32155', date: '2024-07-15', items: 5, total: 78.00, status: 'Cancelled', restaurant: 'Sushi Express' },
];

const savedAddresses = [
  { id: 'addr1', type: 'Home', line1: '123 Main Street', city: 'New York', state: 'NY', zip: '10001', isDefault: true },
  { id: 'addr2', type: 'Work', line1: '456 Business Ave', city: 'New York', state: 'NY', zip: '10002', isDefault: false },
];

const savedPaymentMethods = [
  { id: 'pay1', type: 'Visa', last4: '1234', expiry: '12/2026', isDefault: true },
  { id: 'pay2', type: 'MasterCard', last4: '5678', expiry: '08/2025', isDefault: false },
];

// Simple Header for the page
const PageHeader = () => {
  const navigate = useNavigate();
  return (
    <header className="bg-white dark:bg-gray-900 shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="text-2xl font-bold text-primary dark:text-primary-foreground">
            FoodieFleet
          </Link>
          <nav className="flex items-center space-x-4">
            <Link to="/" className="text-gray-600 dark:text-gray-300 hover:text-primary dark:hover:text-primary-foreground transition-colors">Home</Link>
            <Link to="/restaurant-listing" className="text-gray-600 dark:text-gray-300 hover:text-primary dark:hover:text-primary-foreground transition-colors">Restaurants</Link>
            <Link to="/cart" className="text-gray-600 dark:text-gray-300 hover:text-primary dark:hover:text-primary-foreground transition-colors flex items-center">
              <ShoppingCart className="h-5 w-5 mr-1" /> Cart
            </Link>
            <Button variant="outline" onClick={() => navigate('/user-profile')}>
              <User className="h-5 w-5 mr-1" /> Profile
            </Button>
            {/* A logout button could be added here, typically linking to a logout action then to '/' or '/login' */}
          </nav>
        </div>
      </div>
    </header>
  );
};


const UserProfilePage = () => {
  console.log('UserProfilePage loaded');
  const navigate = useNavigate();

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-950">
      <PageHeader />

      <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row md:space-x-8">
          {/* User Avatar and Name - could be a sidebar on larger screens */}
          <div className="md:w-1/4 mb-8 md:mb-0 flex flex-col items-center text-center">
            <Avatar className="h-32 w-32 mb-4 border-4 border-primary/50 dark:border-primary-foreground/50">
              <AvatarImage src={userProfile.avatarUrl} alt={userProfile.name} />
              <AvatarFallback className="text-4xl">{userProfile.initials}</AvatarFallback>
            </Avatar>
            <h1 className="text-2xl font-semibold text-gray-800 dark:text-gray-100">{userProfile.name}</h1>
            <p className="text-sm text-gray-600 dark:text-gray-400">{userProfile.email}</p>
            <Button variant="ghost" size="sm" className="mt-4 text-primary dark:text-primary-foreground hover:text-primary/80">
              Edit Profile Picture
            </Button>
             <Button variant="destructive" size="sm" className="mt-2 w-full max-w-xs" onClick={() => { /* Handle logout */ navigate('/'); }}>
              <LogOut className="mr-2 h-4 w-4" /> Logout
            </Button>
          </div>

          {/* Tabs Section */}
          <div className="md:w-3/4">
            <Tabs defaultValue="profile" className="w-full">
              <ScrollArea orientation="horizontal" className="pb-2">
                <TabsList className="grid w-full grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2">
                  <TabsTrigger value="profile" className="flex items-center gap-2"><User className="h-4 w-4" />Profile</TabsTrigger>
                  <TabsTrigger value="orders" className="flex items-center gap-2"><ListOrdered className="h-4 w-4" />Orders</TabsTrigger>
                  <TabsTrigger value="addresses" className="flex items-center gap-2"><MapPin className="h-4 w-4" />Addresses</TabsTrigger>
                  <TabsTrigger value="payment" className="flex items-center gap-2"><CreditCard className="h-4 w-4" />Payment</TabsTrigger>
                  <TabsTrigger value="support" className="flex items-center gap-2"><HelpCircle className="h-4 w-4" />Support</TabsTrigger>
                </TabsList>
              </ScrollArea>

              {/* Profile Settings Tab */}
              <TabsContent value="profile" className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Account Information</CardTitle>
                    <CardDescription>Manage your personal details and password.</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name</Label>
                      <Input id="name" defaultValue={userProfile.name} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address</Label>
                      <Input id="email" type="email" defaultValue={userProfile.email} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input id="phone" type="tel" defaultValue={userProfile.phone} />
                    </div>
                    <CardTitle className="text-lg pt-4 border-t mt-4">Change Password</CardTitle>
                     <div className="space-y-2">
                      <Label htmlFor="current-password">Current Password</Label>
                      <Input id="current-password" type="password" placeholder="Enter current password" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="new-password">New Password</Label>
                      <Input id="new-password" type="password" placeholder="Enter new password" />
                    </div>
                     <div className="space-y-2">
                      <Label htmlFor="confirm-password">Confirm New Password</Label>
                      <Input id="confirm-password" type="password" placeholder="Confirm new password" />
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button>Save Changes</Button>
                  </CardFooter>
                </Card>
              </TabsContent>

              {/* Order History Tab */}
              <TabsContent value="orders" className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Order History</CardTitle>
                    <CardDescription>Review your past orders.</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {pastOrders.length > 0 ? (
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Order ID</TableHead>
                            <TableHead>Date</TableHead>
                            <TableHead>Restaurant</TableHead>
                            <TableHead>Items</TableHead>
                            <TableHead className="text-right">Total</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="text-center">Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {pastOrders.map((order) => (
                            <TableRow key={order.id}>
                              <TableCell className="font-medium">{order.id}</TableCell>
                              <TableCell>{order.date}</TableCell>
                              <TableCell>{order.restaurant}</TableCell>
                              <TableCell>{order.items}</TableCell>
                              <TableCell className="text-right">${order.total.toFixed(2)}</TableCell>
                              <TableCell>
                                <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                                  order.status === 'Delivered' ? 'bg-green-100 text-green-700 dark:bg-green-700 dark:text-green-100' :
                                  order.status === 'Cancelled' ? 'bg-red-100 text-red-700 dark:bg-red-700 dark:text-red-100' :
                                  'bg-yellow-100 text-yellow-700 dark:bg-yellow-700 dark:text-yellow-100'
                                }`}>
                                  {order.status}
                                </span>
                              </TableCell>
                              <TableCell className="text-center">
                                <Button variant="outline" size="sm" onClick={() => navigate('/order-tracking')}> {/* Assuming generic track page or /order-tracking/ORD_ID */}
                                  View Details
                                </Button>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    ) : (
                      <p className="text-gray-500 dark:text-gray-400 text-center py-4">You haven't placed any orders yet.</p>
                    )}
                  </CardContent>
                   {pastOrders.length > 0 && (
                    <CardFooter className="justify-center">
                        <Button variant="link" onClick={() => navigate('/restaurant-listing')}>Place a New Order</Button>
                    </CardFooter>
                   )}
                </Card>
              </TabsContent>

              {/* Saved Addresses Tab */}
              <TabsContent value="addresses" className="mt-6">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                      <CardTitle>Saved Addresses</CardTitle>
                      <CardDescription>Manage your delivery addresses.</CardDescription>
                    </div>
                    <Button size="sm"><MapPin className="mr-2 h-4 w-4" />Add New Address</Button>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {savedAddresses.length > 0 ? savedAddresses.map((address) => (
                      <Card key={address.id} className="p-4 bg-gray-50 dark:bg-gray-800">
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="font-semibold text-gray-800 dark:text-gray-100">
                              {address.type} {address.isDefault && <span className="text-xs text-primary dark:text-primary-foreground ml-2">(Default)</span>}
                            </h4>
                            <p className="text-sm text-gray-600 dark:text-gray-300">{address.line1}</p>
                            <p className="text-sm text-gray-600 dark:text-gray-300">{address.city}, {address.state} {address.zip}</p>
                          </div>
                          <div className="flex space-x-2">
                            <Button variant="outline" size="sm">Edit</Button>
                            <Button variant="destructive" size="sm">Delete</Button>
                          </div>
                        </div>
                      </Card>
                    )) : (
                       <p className="text-gray-500 dark:text-gray-400 text-center py-4">You have no saved addresses.</p>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Payment Methods Tab */}
              <TabsContent value="payment" className="mt-6">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                      <CardTitle>Payment Methods</CardTitle>
                      <CardDescription>Manage your saved payment options.</CardDescription>
                    </div>
                     <Button size="sm"><CreditCard className="mr-2 h-4 w-4" />Add Payment Method</Button>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {savedPaymentMethods.length > 0 ? savedPaymentMethods.map((method) => (
                      <Card key={method.id} className="p-4 bg-gray-50 dark:bg-gray-800">
                         <div className="flex justify-between items-start">
                          <div>
                            <h4 className="font-semibold text-gray-800 dark:text-gray-100">
                              {method.type} ending in {method.last4}
                              {method.isDefault && <span className="text-xs text-primary dark:text-primary-foreground ml-2">(Default)</span>}
                            </h4>
                            <p className="text-sm text-gray-600 dark:text-gray-300">Expires: {method.expiry}</p>
                          </div>
                           <div className="flex space-x-2">
                            <Button variant="outline" size="sm">Edit</Button>
                            <Button variant="destructive" size="sm">Remove</Button>
                          </div>
                        </div>
                      </Card>
                    )) : (
                       <p className="text-gray-500 dark:text-gray-400 text-center py-4">You have no saved payment methods.</p>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Help & Support Tab */}
              <TabsContent value="support" className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Help & Support</CardTitle>
                    <CardDescription>Find answers to your questions or contact us.</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-gray-700 dark:text-gray-300">
                      If you need assistance, please check our <Link to="/faq" className="text-primary dark:text-primary-foreground hover:underline">FAQ page</Link> or 
                      <Link to="/contact" className="text-primary dark:text-primary-foreground hover:underline ml-1">contact our support team</Link>.
                    </p>
                    <div className="space-y-2">
                        <Button variant="outline" className="w-full justify-start text-left" onClick={() => navigate('/faq')}>
                            <HelpCircle className="mr-2 h-4 w-4" /> Read FAQs
                        </Button>
                         <Button variant="outline" className="w-full justify-start text-left" onClick={() => navigate('/contact')}>
                            <Building className="mr-2 h-4 w-4" /> Contact Support
                        </Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default UserProfilePage;