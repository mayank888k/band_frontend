"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import Link from "next/link";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { format } from "date-fns";

const bookingIdSchema = z.object({
  bookingId: z.string().min(3, "Booking ID is required"),
});

const phoneSchema = z.object({
  phone: z.string().regex(/^[0-9]{10}$/, "Invalid phone number"),
});

type BookingIdFormValues = z.infer<typeof bookingIdSchema>;
type PhoneFormValues = z.infer<typeof phoneSchema>;

type BookingInfo = {
  id: string;
  bookingId: string;
  name: string;
  email: string;
  phone: string;
  packageType: string;
  date: string;
  venue: string;
  city: string;
  amount: number;
  advancePayment: number;
  createdAt: string;
  [key: string]: any; // To allow for additional fields
};

export default function CheckBookingPage() {
  const [bookingInfo, setBookingInfo] = useState<BookingInfo | null>(null);
  const [bookingsList, setBookingsList] = useState<BookingInfo[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const bookingIdForm = useForm<BookingIdFormValues>({
    resolver: zodResolver(bookingIdSchema),
    defaultValues: {
      bookingId: "",
    },
  });

  const phoneForm = useForm<PhoneFormValues>({
    resolver: zodResolver(phoneSchema),
    defaultValues: {
      phone: "",
    },
  });

  const searchByBookingId = async (data: BookingIdFormValues) => {
    setLoading(true);
    setError(null);
    setBookingInfo(null);
    setBookingsList([]);

    try {
      const { getBooking } = await import("@/lib/api");
      const response = await getBooking({ bookingId: data.bookingId });
      
      if ('booking' in response && response.booking) {
        setBookingInfo(response.booking as BookingInfo);
      }
    } catch (error: any) {
      console.error("Error fetching booking:", error);
      setError(error.message || "Failed to find booking with this ID");
    } finally {
      setLoading(false);
    }
  };

  const searchByPhone = async (data: PhoneFormValues) => {
    setLoading(true);
    setError(null);
    setBookingInfo(null);
    setBookingsList([]);

    try {
      const { getBooking } = await import("@/lib/api");
      const response = await getBooking({ contactNumber: data.phone });
      
      if ('bookings' in response && response.bookings) {
        setBookingsList(response.bookings as BookingInfo[]);
      } else if ('booking' in response && response.booking) {
        setBookingsList([response.booking as BookingInfo]);
      }
    } catch (error: any) {
      console.error("Error fetching bookings:", error);
      setError(error.message || "Failed to find bookings with this phone number");
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), "PPP");
    } catch (e) {
      return dateString;
    }
  };

  const renderBookingDetails = (booking: BookingInfo) => (
    <Card key={booking.bookingId || booking.id} className="mb-6 shadow-md">
      <CardHeader className="bg-[#124E66] text-white">
        <CardTitle>Booking #{booking.bookingId?.substring(0, 8) || booking.id.substring(0, 8)}</CardTitle>
        <CardDescription className="text-white/80">
          Created on {formatDate(booking.createdAt)}
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h3 className="font-medium text-gray-500">Customer Details</h3>
            <div className="mt-2 space-y-2">
              <p><span className="font-medium">Name:</span> {booking.name}</p>
              <p><span className="font-medium">Email:</span> {booking.email}</p>
              <p><span className="font-medium">Phone:</span> {booking.phone}</p>
            </div>
          </div>
          <div>
            <h3 className="font-medium text-gray-500">Event Details</h3>
            <div className="mt-2 space-y-2">
              <p><span className="font-medium">Package:</span> {booking.packageType}</p>
              <p><span className="font-medium">Date:</span> {formatDate(booking.date)}</p>
              <p><span className="font-medium">Venue:</span> {booking.venue}, {booking.city}</p>
            </div>
          </div>
        </div>

        <div className="mt-6 pt-4 border-t border-gray-200">
          <h3 className="font-medium text-gray-500">Payment Information</h3>
          <div className="mt-2 space-y-2">
            <p><span className="font-medium">Total Amount:</span> Rs. {booking.amount}</p>
            <p><span className="font-medium">Advance Payment:</span> Rs. {booking.advancePayment}</p>
            <p><span className="font-medium">Balance Due:</span> Rs. {booking.amount - booking.advancePayment}</p>
          </div>
        </div>
      </CardContent>
      <CardFooter className="bg-gray-50 border-t">
        <p className="text-sm text-gray-500">
          Please contact us at <a href="tel:+919876543210" className="text-[#124E66]">+91 9876543210</a> for any queries.
        </p>
      </CardFooter>
    </Card>
  );

  return (
    <div className="flex flex-col min-h-screen pt-24">
      {/* Hero Section */}
      <section className="relative flex items-center py-20">
        {/* Dark overlay with new color scheme */}
        <div className="absolute inset-0 bg-[#D3D9D4]/70 z-10"></div>
        {/* Background image */}
        <div className="absolute inset-0 bg-[url('/hero-bg.png')] bg-cover bg-center bg-no-repeat"></div>
        <div className="container relative z-20">
          <div className="max-w-2xl">
            <h1 className="mb-4 text-4xl md:text-5xl font-bold text-[#2E3944]">
              <span className="text-[#124E66]">Check</span> Your Booking
            </h1>
            <p className="mb-6 text-xl text-[#2E3944]">
              View the details of your Modern Band booking by entering your booking ID or phone number.
            </p>
          </div>
        </div>
      </section>
      
      {/* Search Section */}
      <section className="py-16 bg-[#F5F7F9]">
        <div className="container">
          <div className="max-w-3xl mx-auto">
            <Tabs defaultValue="id" className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-8">
                <TabsTrigger value="id">Search by Booking ID</TabsTrigger>
                <TabsTrigger value="phone">Search by Phone Number</TabsTrigger>
              </TabsList>
              
              {/* Search by Booking ID */}
              <TabsContent value="id">
                <Card>
                  <CardHeader>
                    <CardTitle>Enter Your Booking ID</CardTitle>
                    <CardDescription>
                      The booking ID was sent to you in your confirmation email or SMS.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Form {...bookingIdForm}>
                      <form onSubmit={bookingIdForm.handleSubmit(searchByBookingId)} className="space-y-6">
                        <FormField
                          control={bookingIdForm.control}
                          name="bookingId"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Booking ID</FormLabel>
                              <FormControl>
                                <Input placeholder="Enter your booking ID" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <Button 
                          type="submit" 
                          className="w-full bg-[#124E66] hover:bg-[#124E66]/90"
                          disabled={loading}
                        >
                          {loading ? "Searching..." : "Search"}
                        </Button>
                      </form>
                    </Form>
                  </CardContent>
                </Card>
              </TabsContent>
              
              {/* Search by Phone */}
              <TabsContent value="phone">
                <Card>
                  <CardHeader>
                    <CardTitle>Enter Your Phone Number</CardTitle>
                    <CardDescription>
                      Use the phone number you provided during booking.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Form {...phoneForm}>
                      <form onSubmit={phoneForm.handleSubmit(searchByPhone)} className="space-y-6">
                        <FormField
                          control={phoneForm.control}
                          name="phone"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Phone Number</FormLabel>
                              <FormControl>
                                <Input type="tel" placeholder="Enter your 10-digit phone number" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <Button 
                          type="submit" 
                          className="w-full bg-[#124E66] hover:bg-[#124E66]/90"
                          disabled={loading}
                        >
                          {loading ? "Searching..." : "Search"}
                        </Button>
                      </form>
                    </Form>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>

            {/* Display Error */}
            {error && (
              <div className="mt-8 p-4 bg-red-50 border border-red-200 rounded-md text-red-600">
                {error}
              </div>
            )}

            {/* Display Booking Details */}
            {bookingInfo && (
              <div className="mt-8">
                <h2 className="text-2xl font-bold mb-4">Booking Details</h2>
                {renderBookingDetails(bookingInfo)}
              </div>
            )}

            {/* Display Multiple Bookings */}
            {bookingsList.length > 0 && (
              <div className="mt-8">
                <h2 className="text-2xl font-bold mb-4">Your Bookings ({bookingsList.length})</h2>
                {bookingsList.map(booking => renderBookingDetails(booking))}
              </div>
            )}

            <div className="mt-8 text-center">
              <p className="mb-4">Need to make a new booking?</p>
              <Link href="/booking">
                <Button className="bg-[#124E66] hover:bg-[#124E66]/90">
                  Book Now
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
} 