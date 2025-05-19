"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { format } from "date-fns";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import PublicPageWrapper from "@/components/PublicPageWrapper";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
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
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { CalendarIcon, CheckCircle } from "lucide-react";

const formSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  phone: z.string().regex(/^[0-9]{10}$/, "Invalid phone number"),
  additionalPhone: z.string().regex(/^[0-9]{10}$/, "Invalid phone number").optional().or(z.literal("")),
  packageType: z.enum(["Baraat Band Package", "DJ Band Package", "Dhol Only Package", "Reception Package", "Full Wedding Package"]),
  date: z.date({
    required_error: "Please select a date",
  }),
  venue: z.string().min(2, "Venue is required"),
  city: z.string().min(2, "City is required"),
  customization: z.string().optional(),
  bandTime: z.string().optional(),
  customTimeSlot: z.string().optional(),
  numberOfPeople: z.number().optional(),
  numberOfLights: z.number().optional(),
  numberOfDhols: z.number().optional(),
  ghodaBaggi: z.number().optional(),
  ghodiForBaraat: z.boolean().default(false),
  fireworks: z.boolean().default(false),
  fireworksAmount: z.number().optional(),
  flowerCanon: z.boolean().default(false),
  DoliForVidai: z.boolean().default(false),
  amount: z.number().min(0),
  advancePayment: z.number().min(0),
});

type FormValues = z.infer<typeof formSchema>;

export default function BookingPage() {
  const [showConfirmationDialog, setShowConfirmationDialog] = useState(false);
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const [bookingDetails, setBookingDetails] = useState<any>(null);
  const [currentStep, setCurrentStep] = useState<number>(1);
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      additionalPhone: "",
      packageType: undefined,
      venue: "",
      city: "",
      customization: "",
      ghodiForBaraat: false,
      fireworks: false,
      flowerCanon: false,
      DoliForVidai: false,
      amount: 0,
      advancePayment: 0,
    },
    mode: "onChange",
  });

  const packageType = form.watch("packageType");
  const ghodiForBaraat = form.watch("ghodiForBaraat");
  const fireworks = form.watch("fireworks");
  const amount = form.watch("amount");
  const advancePayment = form.watch("advancePayment");

  // Navigation functions for the form wizard
  const nextStep = async () => {
    const fields = getFieldsForStep(currentStep);
    const isValid = await validateFields(fields);
    
    if (isValid) {
      // Close confirmation dialog if it's open (failsafe)
      setShowConfirmationDialog(false);
      // Move to next step
      setCurrentStep((prev) => Math.min(prev + 1, 4));
    }
  };
  
  const prevStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };
  
  // Validate the fields for the current step
  const validateFields = async (fields: string[]) => {
    const result = await form.trigger(fields as any[]);
    return result;
  };
  
  // Get the fields that need to be validated for each step
  const getFieldsForStep = (step: number): string[] => {
    switch (step) {
      case 1: // Personal Information
        return ["name", "email", "phone", "additionalPhone"];
      case 2: // Event Details
        return ["packageType", "date", "venue", "city"];
      case 3: // Additional Features
        return []; // Optional fields
      case 4: // Payment Information
        return ["amount", "advancePayment"];
      default:
        return [];
    }
  };

  const onSubmit = async (data: FormValues) => {
    // Only show confirmation dialog on the payment step when "Book Now" is clicked
    if (currentStep === 4) {
      setShowConfirmationDialog(true);
    }
  };

  const confirmBooking = async () => {
    try {
      // Import is inside the function to avoid issues with Next.js SSR
      const { createBooking } = await import('@/lib/api');
      
      // Get form data
      const formData = form.getValues();
      
      // Prepare booking data
      const bookingData = {
        ...formData,
        // Convert checkbox values to booleans
        ghodiForBaraat: !!formData.ghodiForBaraat,
        fireworks: !!formData.fireworks,
        flowerCanon: !!formData.flowerCanon,
        DoliForVidai: !!formData.DoliForVidai
      };
      
      // Submit booking
      const response = await createBooking(bookingData);
      
      // Close the confirmation dialog
      setShowConfirmationDialog(false);
      
      // Store booking details and show success dialog
      setBookingDetails(response.booking);
      setShowSuccessDialog(true);
      
    } catch (error) {
      console.error("Error creating booking:", error);
      alert("Failed to create booking. Please try again.");
    }
  };

  return (
    <PublicPageWrapper>
      <div className="flex flex-col min-h-screen pt-24">
        {/* Hero Section */}
        <section className="relative flex items-center py-24">
          {/* Dark overlay with new color scheme */}
          <div className="absolute inset-0 bg-[#D3D9D4]/70 z-10"></div>
          {/* Background image */}
          <div className="absolute inset-0 bg-[url('/hero-bg.png')] bg-cover bg-center bg-no-repeat"></div>
          <div className="container relative z-20">
            <motion.div 
              className="max-w-3xl"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6 }}
            >
              <motion.h1 
                className="mb-4 text-4xl md:text-5xl lg:text-6xl font-bold text-[#2E3944]"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ 
                  duration: 0.8, 
                  ease: [0.22, 1, 0.36, 1] 
                }}
              >
                <span className="text-[#124E66]">Book</span> Your Event
              </motion.h1>
              <motion.p 
                className="mb-8 text-xl text-[#2E3944]"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ 
                  duration: 0.8, 
                  delay: 0.3, 
                  ease: [0.22, 1, 0.36, 1] 
                }}
              >
                Fill out the form below to book Modern Band for your special celebration. We'll make your event unforgettable.
              </motion.p>
            </motion.div>
          </div>
        </section>
        
        {/* Form Section */}
        <section className="py-16 bg-[#F5F7F9]">
          <div className="container">
            <div className="grid md:grid-cols-3 gap-8">
              <div className="md:col-span-2">
                <Form {...form}>
                  <form onSubmit={(e) => {
                    // Only submit the form when on step 4 and clicking "Book Now"
                    if (currentStep === 4) {
                      form.handleSubmit(onSubmit)(e);
                    } else {
                      // Prevent form submission for other steps
                      e.preventDefault();
                    }
                  }} className="space-y-8 bg-white p-8 rounded-lg shadow-md border border-[#E5E9EF]">
                    {/* Wizard Steps Indicator */}
                    <div className="mb-8">
                      <div className="flex items-center justify-between relative">
                        {[1, 2, 3, 4].map((step) => (
                          <div key={step} className="flex flex-col items-center relative z-10">
                            <div 
                              className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-colors ${
                                currentStep >= step 
                                  ? "bg-[#124E66] text-white border-[#124E66]" 
                                  : "bg-white text-[#2E3944]/70 border-[#E5E9EF]"
                              }`}
                            >
                              {step}
                            </div>
                            <span className={`text-sm mt-2 font-medium transition-colors ${
                              currentStep >= step 
                                ? "text-[#124E66]" 
                                : "text-[#2E3944]/50"
                            }`}>
                              {step === 1 
                                ? "Personal Info" 
                                : step === 2 
                                ? "Event Details" 
                                : step === 3 
                                ? "Features" 
                                : "Payment"}
                            </span>
                          </div>
                        ))}
                        
                        {/* Connector lines */}
                        <div className="absolute top-5 left-0 right-0 h-0.5 bg-[#E5E9EF] -z-10">
                          <div 
                            className="h-full bg-[#124E66] transition-all" 
                            style={{ width: `${(currentStep - 1) * 33.33}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                    
                    <AnimatePresence mode="wait">
                      {/* Step 1: Personal Information */}
                      {currentStep === 1 && (
                        <motion.div
                          key="step1"
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: 20 }}
                          transition={{ duration: 0.3 }}
                        >
                          <div className="border-b border-[#E5E9EF] pb-6 mb-6">
                            <h2 className="text-2xl font-bold text-[#124E66] mb-2">Personal Information</h2>
                            <p className="text-[#2E3944]/70">Please provide your contact details</p>
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <FormField
                              control={form.control}
                              name="name"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel className="text-[#2E3944] font-medium">Name</FormLabel>
                                  <FormControl>
                                    <Input 
                                      placeholder="Enter your name" 
                                      {...field} 
                                      className="bg-[#F5F7F9] border-[#E5E9EF] focus-visible:ring-[#124E66] focus-visible:ring-offset-0 focus-visible:border-[#124E66] transition-colors"
                                    />
                                  </FormControl>
                                  <FormMessage className="text-red-500" />
                                </FormItem>
                              )}
                            />

                            <FormField
                              control={form.control}
                              name="email"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel className="text-[#2E3944] font-medium">Email</FormLabel>
                                  <FormControl>
                                    <Input 
                                      type="email" 
                                      placeholder="Enter your email" 
                                      {...field} 
                                      className="bg-[#F5F7F9] border-[#E5E9EF] focus-visible:ring-[#124E66] focus-visible:ring-offset-0 focus-visible:border-[#124E66] transition-colors"
                                    />
                                  </FormControl>
                                  <FormMessage className="text-red-500" />
                                </FormItem>
                              )}
                            />

                            <FormField
                              control={form.control}
                              name="phone"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel className="text-[#2E3944] font-medium">Phone Number</FormLabel>
                                  <FormControl>
                                    <Input 
                                      type="tel" 
                                      placeholder="Enter your phone number" 
                                      {...field} 
                                      className="bg-[#F5F7F9] border-[#E5E9EF] focus-visible:ring-[#124E66] focus-visible:ring-offset-0 focus-visible:border-[#124E66] transition-colors"
                                    />
                                  </FormControl>
                                  <FormMessage className="text-red-500" />
                                </FormItem>
                              )}
                            />

                            <FormField
                              control={form.control}
                              name="additionalPhone"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel className="text-[#2E3944] font-medium">Additional Contact (Optional)</FormLabel>
                                  <FormControl>
                                    <Input 
                                      type="tel" 
                                      placeholder="Enter additional phone number" 
                                      {...field} 
                                      className="bg-[#F5F7F9] border-[#E5E9EF] focus-visible:ring-[#124E66] focus-visible:ring-offset-0 focus-visible:border-[#124E66] transition-colors"
                                    />
                                  </FormControl>
                                  <FormMessage className="text-red-500" />
                                </FormItem>
                              )}
                            />
                          </div>
                        </motion.div>
                      )}

                      {/* Step 2: Event Details */}
                      {currentStep === 2 && (
                        <motion.div
                          key="step2"
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: 20 }}
                          transition={{ duration: 0.3 }}
                        >
                          <div className="border-b border-[#E5E9EF] pb-6 mb-6 pt-4">
                            <h2 className="text-2xl font-bold text-[#124E66] mb-2">Event Details</h2>
                            <p className="text-[#2E3944]/70">Tell us about your event</p>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <FormField
                              control={form.control}
                              name="packageType"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel className="text-[#2E3944] font-medium">Package Type</FormLabel>
                                  <Select onValueChange={field.onChange} value={field.value}>
                                    <FormControl>
                                      <SelectTrigger className="bg-[#F5F7F9] border-[#E5E9EF] focus:ring-[#124E66] focus:ring-offset-0 focus:border-[#124E66] transition-colors">
                                        <SelectValue placeholder="Select a package" />
                                      </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                      <SelectItem value="Baraat Band Package">Baraat Band Package</SelectItem>
                                      <SelectItem value="DJ Band Package">DJ Band Package</SelectItem>
                                      <SelectItem value="Dhol Only Package">Dhol Only Package</SelectItem>
                                      <SelectItem value="Reception Package">Haldi / Menhendi/ Sangeet / Reception Package</SelectItem>
                                      <SelectItem value="Full Wedding Package">Full Wedding Package</SelectItem>
                                    </SelectContent>
                                  </Select>
                                  <FormMessage className="text-red-500" />
                                </FormItem>
                              )}
                            />

                            <FormField
                              control={form.control}
                              name="date"
                              render={({ field }) => (
                                <FormItem className="flex flex-col">
                                  <FormLabel className="text-[#2E3944] font-medium">Event Date</FormLabel>
                                  <FormControl>
                                    <div className="relative">
                                      <DatePicker
                                        selected={field.value}
                                        onChange={(date: Date | null) => date && field.onChange(date)}
                                        dateFormat="MMMM d, yyyy"
                                        minDate={new Date()}
                                        className="flex h-10 w-full rounded-md border border-[#E5E9EF] bg-[#F5F7F9] px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#124E66] focus:border-[#124E66]"
                                        placeholderText="Select date"
                                        showPopperArrow={false}
                                        autoComplete="off"
                                      />
                                    </div>
                                  </FormControl>
                                  <FormMessage className="text-red-500" />
                                </FormItem>
                              )}
                            />

                            <FormField
                              control={form.control}
                              name="venue"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel className="text-[#2E3944] font-medium">Venue</FormLabel>
                                  <FormControl>
                                    <Input 
                                      placeholder="Enter venue details" 
                                      {...field} 
                                      className="bg-[#F5F7F9] border-[#E5E9EF] focus-visible:ring-[#124E66] focus-visible:ring-offset-0 focus-visible:border-[#124E66] transition-colors"
                                    />
                                  </FormControl>
                                  <FormMessage className="text-red-500" />
                                </FormItem>
                              )}
                            />

                            <FormField
                              control={form.control}
                              name="city"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel className="text-[#2E3944] font-medium">City / Town / Village</FormLabel>
                                  <FormControl>
                                    <Input 
                                      placeholder="Enter city/town/village" 
                                      {...field} 
                                      className="bg-[#F5F7F9] border-[#E5E9EF] focus-visible:ring-[#124E66] focus-visible:ring-offset-0 focus-visible:border-[#124E66] transition-colors"
                                    />
                                  </FormControl>
                                  <FormMessage className="text-red-500" />
                                </FormItem>
                              )}
                            />
                          </div>

                          {/* Conditional Fields based on Package Type */}
                          {packageType === "Baraat Band Package" && (
                            <div className="space-y-6 p-6 bg-[#F5F7F9] border border-[#E5E9EF] rounded-lg mt-8">
                              <h3 className="text-lg font-semibold text-[#124E66]">Baraat Package Options</h3>
                              
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <FormField
                                  control={form.control}
                                  name="bandTime"
                                  render={({ field }) => (
                                    <FormItem>
                                      <FormLabel className="text-[#2E3944] font-medium">Band Time (Shift)</FormLabel>
                                      <Select onValueChange={field.onChange} value={field.value}>
                                        <FormControl>
                                          <SelectTrigger className="bg-white border-[#E5E9EF] focus:ring-[#124E66] focus:ring-offset-0 focus:border-[#124E66]">
                                            <SelectValue placeholder="Select time slot" />
                                          </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                          <SelectItem value="7PM to 9PM">7PM to 9PM</SelectItem>
                                          <SelectItem value="10PM to 12PM">10PM to 12PM</SelectItem>
                                          <SelectItem value="12PM to 2PM">12PM to 2PM</SelectItem>
                                          <SelectItem value="Full Time">Full Time</SelectItem>
                                          <SelectItem value="Custom">Custom</SelectItem>
                                        </SelectContent>
                                      </Select>
                                      <FormMessage className="text-red-500" />
                                    </FormItem>
                                  )}
                                />

                                {form.watch("bandTime") === "Custom" && packageType === "Baraat Band Package" && (
                                  <FormField
                                    control={form.control}
                                    name="customTimeSlot"
                                    render={({ field }) => (
                                      <FormItem>
                                        <FormLabel className="text-[#2E3944] font-medium">Custom Time Slot</FormLabel>
                                        <FormControl>
                                          <Input 
                                            placeholder="e.g., 8:30PM to 11:30PM" 
                                            {...field} 
                                            className="bg-white border-[#E5E9EF] focus-visible:ring-[#124E66] focus-visible:ring-offset-0 focus-visible:border-[#124E66]"
                                          />
                                        </FormControl>
                                        <FormMessage className="text-red-500" />
                                      </FormItem>
                                    )}
                                  />
                                )}

                                <FormField
                                  control={form.control}
                                  name="numberOfPeople"
                                  render={({ field }) => (
                                    <FormItem>
                                      <FormLabel className="text-[#2E3944] font-medium">Number of People in Band</FormLabel>
                                      <FormControl>
                                        <Input 
                                          type="number" 
                                          min="1" 
                                          {...field}
                                          onChange={(e) => field.onChange(parseInt(e.target.value) || 0)} 
                                          value={field.value || ""}
                                          className="bg-white border-[#E5E9EF] focus-visible:ring-[#124E66] focus-visible:ring-offset-0 focus-visible:border-[#124E66]"
                                          placeholder="Enter number of people"
                                        />
                                      </FormControl>
                                      <FormMessage className="text-red-500" />
                                    </FormItem>
                                  )}
                                />

                                <FormField
                                  control={form.control}
                                  name="numberOfLights"
                                  render={({ field }) => (
                                    <FormItem>
                                      <FormLabel className="text-[#2E3944] font-medium">Number of Lights</FormLabel>
                                      <FormControl>
                                        <Input 
                                          type="number" 
                                          min="4"
                                          max="100"
                                          step="4"
                                          {...field}
                                          onChange={(e) => field.onChange(parseInt(e.target.value) || 0)} 
                                          value={field.value || ""}
                                          placeholder="Enter number of lights"
                                          className="bg-white border-[#E5E9EF] focus-visible:ring-[#124E66] focus-visible:ring-offset-0 focus-visible:border-[#124E66]"
                                        />
                                      </FormControl>
                                      <FormMessage className="text-red-500" />
                                    </FormItem>
                                  )}
                                />

                                <FormField
                                  control={form.control}
                                  name="ghodiForBaraat"
                                  render={({ field }) => (
                                    <FormItem className="flex flex-row items-start space-x-3 space-y-0 pt-2">
                                      <FormControl>
                                        <Checkbox
                                          checked={field.value}
                                          onCheckedChange={field.onChange}
                                          className="data-[state=checked]:bg-[#124E66] data-[state=checked]:border-[#124E66]"
                                        />
                                      </FormControl>
                                      <div className="space-y-1 leading-none">
                                        <FormLabel className="text-[#2E3944] font-medium">Ghodi for Baraat</FormLabel>
                                      </div>
                                    </FormItem>
                                  )}
                                />
                              </div>

                              {!ghodiForBaraat && (
                                <FormField
                                  control={form.control}
                                  name="ghodaBaggi"
                                  render={({ field }) => (
                                    <FormItem>
                                      <FormLabel className="text-[#2E3944] font-medium">Ghoda Baggi</FormLabel>
                                      <Select 
                                        onValueChange={(value) => field.onChange(parseInt(value))}
                                        value={field.value?.toString()}
                                      >
                                        <FormControl>
                                          <SelectTrigger className="bg-white border-[#E5E9EF] focus:ring-[#124E66] focus:ring-offset-0 focus:border-[#124E66]">
                                            <SelectValue placeholder="Select number of Ghoda Baggi" />
                                          </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                          {[1, 2, 3, 4].map((num) => (
                                            <SelectItem key={num} value={num.toString()}>{num}</SelectItem>
                                          ))}
                                        </SelectContent>
                                      </Select>
                                      <FormMessage className="text-red-500" />
                                    </FormItem>
                                  )}
                                />
                              )}
                            </div>
                          )}

                          {/* DJ Band Package Options */}
                          {packageType === "DJ Band Package" && (
                            <div className="space-y-6 p-6 bg-[#F5F7F9] border border-[#E5E9EF] rounded-lg mt-8">
                              <h3 className="text-lg font-semibold text-[#124E66]">DJ Package Options</h3>
                              
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <FormField
                                  control={form.control}
                                  name="bandTime"
                                  render={({ field }) => (
                                    <FormItem>
                                      <FormLabel className="text-[#2E3944] font-medium">DJ Time (Shift)</FormLabel>
                                      <Select onValueChange={field.onChange} value={field.value}>
                                        <FormControl>
                                          <SelectTrigger className="bg-white border-[#E5E9EF] focus:ring-[#124E66] focus:ring-offset-0 focus:border-[#124E66]">
                                            <SelectValue placeholder="Select time slot" />
                                          </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                          <SelectItem value="7PM to 9PM">7PM to 9PM</SelectItem>
                                          <SelectItem value="10PM to 12PM">10PM to 12PM</SelectItem>
                                          <SelectItem value="12PM to 2PM">12PM to 2PM</SelectItem>
                                          <SelectItem value="Full Time">Full Time</SelectItem>
                                          <SelectItem value="Custom">Custom</SelectItem>
                                        </SelectContent>
                                      </Select>
                                      <FormMessage className="text-red-500" />
                                    </FormItem>
                                  )}
                                />

                                {form.watch("bandTime") === "Custom" && (
                                  <FormField
                                    control={form.control}
                                    name="customTimeSlot"
                                    render={({ field }) => (
                                      <FormItem>
                                        <FormLabel className="text-[#2E3944] font-medium">Custom Time Slot</FormLabel>
                                        <FormControl>
                                          <Input 
                                            placeholder="e.g., 8:30PM to 11:30PM" 
                                            {...field} 
                                            className="bg-white border-[#E5E9EF] focus-visible:ring-[#124E66] focus-visible:ring-offset-0 focus-visible:border-[#124E66]"
                                          />
                                        </FormControl>
                                        <FormMessage className="text-red-500" />
                                      </FormItem>
                                    )}
                                  />
                                )}

                                <FormField
                                  control={form.control}
                                  name="numberOfLights"
                                  render={({ field }) => (
                                    <FormItem>
                                      <FormLabel className="text-[#2E3944] font-medium">Number of Lights</FormLabel>
                                      <FormControl>
                                        <Input 
                                          type="number" 
                                          min="4"
                                          max="16"
                                          step="4"
                                          {...field}
                                          onChange={(e) => field.onChange(parseInt(e.target.value) || 0)} 
                                          value={field.value || ""}
                                          placeholder="Enter number of lights"
                                          className="bg-white border-[#E5E9EF] focus-visible:ring-[#124E66] focus-visible:ring-offset-0 focus-visible:border-[#124E66]"
                                        />
                                      </FormControl>
                                      <FormMessage className="text-red-500" />
                                    </FormItem>
                                  )}
                                />

                                <FormField
                                  control={form.control}
                                  name="ghodiForBaraat"
                                  render={({ field }) => (
                                    <FormItem className="flex flex-row items-start space-x-3 space-y-0 pt-2">
                                      <FormControl>
                                        <Checkbox
                                          checked={field.value}
                                          onCheckedChange={field.onChange}
                                          className="data-[state=checked]:bg-[#124E66] data-[state=checked]:border-[#124E66]"
                                        />
                                      </FormControl>
                                      <div className="space-y-1 leading-none">
                                        <FormLabel className="text-[#2E3944] font-medium">Ghodi for Baraat</FormLabel>
                                      </div>
                                    </FormItem>
                                  )}
                                />
                              </div>

                              {!ghodiForBaraat && (
                                <FormField
                                  control={form.control}
                                  name="ghodaBaggi"
                                  render={({ field }) => (
                                    <FormItem>
                                      <FormLabel className="text-[#2E3944] font-medium">Ghoda Baggi</FormLabel>
                                      <Select 
                                        onValueChange={(value) => field.onChange(parseInt(value))}
                                        value={field.value?.toString()}
                                      >
                                        <FormControl>
                                          <SelectTrigger className="bg-white border-[#E5E9EF] focus:ring-[#124E66] focus:ring-offset-0 focus:border-[#124E66]">
                                            <SelectValue placeholder="Select number of Ghoda Baggi" />
                                          </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                          {[1, 2, 3, 4].map((num) => (
                                            <SelectItem key={num} value={num.toString()}>{num}</SelectItem>
                                          ))}
                                        </SelectContent>
                                      </Select>
                                      <FormMessage className="text-red-500" />
                                    </FormItem>
                                  )}
                                />
                              )}
                            </div>
                          )}

                          {/* Dhol Only Package Options */}
                          {packageType === "Dhol Only Package" && (
                            <div className="space-y-6 p-6 bg-[#F5F7F9] border border-[#E5E9EF] rounded-lg mt-8">
                              <h3 className="text-lg font-semibold text-[#124E66]">Dhol Package Options</h3>
                              
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <FormField
                                  control={form.control}
                                  name="bandTime"
                                  render={({ field }) => (
                                    <FormItem>
                                      <FormLabel className="text-[#2E3944] font-medium">Performance Time (Shift)</FormLabel>
                                      <Select onValueChange={field.onChange} value={field.value}>
                                        <FormControl>
                                          <SelectTrigger className="bg-white border-[#E5E9EF] focus:ring-[#124E66] focus:ring-offset-0 focus:border-[#124E66]">
                                            <SelectValue placeholder="Select time slot" />
                                          </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                          <SelectItem value="7PM to 9PM">7PM to 9PM</SelectItem>
                                          <SelectItem value="10PM to 12PM">10PM to 12PM</SelectItem>
                                          <SelectItem value="12PM to 2PM">12PM to 2PM</SelectItem>
                                          <SelectItem value="Full Time">Full Time</SelectItem>
                                          <SelectItem value="Custom">Custom</SelectItem>
                                        </SelectContent>
                                      </Select>
                                      <FormMessage className="text-red-500" />
                                    </FormItem>
                                  )}
                                />

                                {form.watch("bandTime") === "Custom" && packageType === "Dhol Only Package" && (
                                  <FormField
                                    control={form.control}
                                    name="customTimeSlot"
                                    render={({ field }) => (
                                      <FormItem>
                                        <FormLabel className="text-[#2E3944] font-medium">Custom Time Slot</FormLabel>
                                        <FormControl>
                                          <Input 
                                            placeholder="e.g., 8:30PM to 11:30PM" 
                                            {...field} 
                                            className="bg-white border-[#E5E9EF] focus-visible:ring-[#124E66] focus-visible:ring-offset-0 focus-visible:border-[#124E66]"
                                          />
                                        </FormControl>
                                        <FormMessage className="text-red-500" />
                                      </FormItem>
                                    )}
                                  />
                                )}

                                <FormField
                                  control={form.control}
                                  name="numberOfDhols"
                                  render={({ field }) => (
                                    <FormItem>
                                      <FormLabel className="text-[#2E3944] font-medium">Number of Dhols</FormLabel>
                                      <FormControl>
                                        <Input 
                                          type="number" 
                                          min="1"
                                          max="10"
                                          {...field}
                                          onChange={(e) => field.onChange(parseInt(e.target.value) || 0)} 
                                          value={field.value || ""}
                                          placeholder="Enter number of dhols (1-10)"
                                          className="bg-white border-[#E5E9EF] focus-visible:ring-[#124E66] focus-visible:ring-offset-0 focus-visible:border-[#124E66]"
                                        />
                                      </FormControl>
                                      <FormMessage className="text-red-500" />
                                    </FormItem>
                                  )}
                                />
                              </div>
                            </div>
                          )}
                        </motion.div>
                      )}

                      {/* Step 3: Additional Features */}
                      {currentStep === 3 && (
                        <motion.div
                          key="step3"
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: 20 }}
                          transition={{ duration: 0.3 }}
                        >
                          <div className="border-b border-[#E5E9EF] pb-6 mb-6 pt-4">
                            <h2 className="text-2xl font-bold text-[#124E66] mb-2">Additional Features</h2>
                            <p className="text-[#2E3944]/70">Customize your booking with these options</p>
                          </div>

                          {/* Common Fields for all packages */}
                          <div className="space-y-6">
                            <FormField
                              control={form.control}
                              name="fireworks"
                              render={({ field }) => (
                                <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                                  <FormControl>
                                    <Checkbox
                                      checked={field.value}
                                      onCheckedChange={field.onChange}
                                      className="data-[state=checked]:bg-[#124E66] data-[state=checked]:border-[#124E66]"
                                    />
                                  </FormControl>
                                  <div className="space-y-1 leading-none">
                                    <FormLabel className="text-[#2E3944] font-medium">Fireworks</FormLabel>
                                  </div>
                                </FormItem>
                              )}
                            />

                            {fireworks && (
                              <FormField
                                control={form.control}
                                name="fireworksAmount"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel className="text-[#2E3944] font-medium">Fireworks Amount (Rs)</FormLabel>
                                    <FormControl>
                                      <Input 
                                        type="number" 
                                        min="0" 
                                        {...field}
                                        onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                                        value={field.value || ""}
                                        className="bg-[#F5F7F9] border-[#E5E9EF] focus-visible:ring-[#124E66] focus-visible:ring-offset-0 focus-visible:border-[#124E66]"
                                      />
                                    </FormControl>
                                    <FormMessage className="text-red-500" />
                                  </FormItem>
                                )}
                              />
                            )}

                            <FormField
                              control={form.control}
                              name="flowerCanon"
                              render={({ field }) => (
                                <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                                  <FormControl>
                                    <Checkbox
                                      checked={field.value}
                                      onCheckedChange={field.onChange}
                                      className="data-[state=checked]:bg-[#124E66] data-[state=checked]:border-[#124E66]"
                                    />
                                  </FormControl>
                                  <div className="space-y-1 leading-none">
                                    <FormLabel className="text-[#2E3944] font-medium">Flower Canon</FormLabel>
                                  </div>
                                </FormItem>
                              )}
                            />

                            <FormField
                              control={form.control}
                              name="DoliForVidai"
                              render={({ field }) => (
                                <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                                  <FormControl>
                                    <Checkbox
                                      checked={field.value}
                                      onCheckedChange={field.onChange}
                                      className="data-[state=checked]:bg-[#124E66] data-[state=checked]:border-[#124E66]"
                                    />
                                  </FormControl>
                                  <div className="space-y-1 leading-none">
                                    <FormLabel className="text-[#2E3944] font-medium">Doli For Vidai</FormLabel>
                                  </div>
                                </FormItem>
                              )}
                            />

                            <FormField
                              control={form.control}
                              name="customization"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel className="text-[#2E3944] font-medium">Additional Requests</FormLabel>
                                  <FormControl>
                                    <Textarea
                                      placeholder="Enter any specific requirements or customizations"
                                      className="min-h-[100px] bg-[#F5F7F9] border-[#E5E9EF] focus-visible:ring-[#124E66] focus-visible:ring-offset-0 focus-visible:border-[#124E66]"
                                      {...field}
                                    />
                                  </FormControl>
                                  <FormMessage className="text-red-500" />
                                </FormItem>
                              )}
                            />
                          </div>
                        </motion.div>
                      )}

                      {/* Step 4: Payment Details */}
                      {currentStep === 4 && (
                        <motion.div
                          key="step4"
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: 20 }}
                          transition={{ duration: 0.3 }}
                        >
                          <div className="border-b border-[#E5E9EF] pb-6 mb-6 pt-4">
                            <h2 className="text-2xl font-bold text-[#124E66] mb-2">Payment Details</h2>
                            <p className="text-[#2E3944]/70">Specify payment information</p>
                          </div>

                          {/* Payment Fields */}
                          <div className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                              <FormField
                                control={form.control}
                                name="amount"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel className="text-[#2E3944] font-medium">Total Amount (Rs)</FormLabel>
                                    <FormControl>
                                      <Input 
                                        type="number" 
                                        min="0" 
                                        {...field}
                                        onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                                        value={field.value || ""}
                                        className="bg-[#F5F7F9] border-[#E5E9EF] focus-visible:ring-[#124E66] focus-visible:ring-offset-0 focus-visible:border-[#124E66]"
                                      />
                                    </FormControl>
                                    <FormMessage className="text-red-500" />
                                  </FormItem>
                                )}
                              />

                              <FormField
                                control={form.control}
                                name="advancePayment"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel className="text-[#2E3944] font-medium">Advance Payment (Min 30%)</FormLabel>
                                    <FormControl>
                                      <Input 
                                        type="number" 
                                        min="0" 
                                        {...field}
                                        onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                                        value={field.value || ""}
                                        className="bg-[#F5F7F9] border-[#E5E9EF] focus-visible:ring-[#124E66] focus-visible:ring-offset-0 focus-visible:border-[#124E66]"
                                      />
                                    </FormControl>
                                    <FormMessage className="text-red-500" />
                                  </FormItem>
                                )}
                              />
                            </div>

                            <div className="p-4 bg-[#F5F7F9] rounded-lg border border-[#E5E9EF]">
                              <div className="flex justify-between mb-2">
                                <span className="text-[#2E3944] font-medium">Base Amount:</span>
                                <span className="text-[#124E66] font-semibold">Rs. {amount || 0}</span>
                              </div>
                              {(form.watch("fireworksAmount") || 0) > 0 && (
                                <div className="flex justify-between mb-2">
                                  <span className="text-[#2E3944] font-medium">Fireworks Amount:</span>
                                  <span className="text-[#124E66] font-semibold">Rs. {form.watch("fireworksAmount") || 0}</span>
                                </div>
                              )}
                              <div className="flex justify-between mb-2 pt-2 border-t border-[#E5E9EF]">
                                <span className="text-[#2E3944] font-medium">Total Amount:</span>
                                <span className="text-[#124E66] font-semibold">Rs. {(amount || 0) + (form.watch("fireworksAmount") || 0)}</span>
                              </div>
                              <div className="flex justify-between mb-2">
                                <span className="text-[#2E3944] font-medium">Advance Payment:</span>
                                <span className="text-[#124E66] font-semibold">Rs. {advancePayment || 0}</span>
                              </div>
                              <div className="flex justify-between pt-2 border-t border-[#E5E9EF]">
                                <span className="text-[#2E3944] font-medium">Remaining Amount:</span>
                                <span className="text-[#124E66] font-semibold">Rs. {((amount || 0) + (form.watch("fireworksAmount") || 0)) - (advancePayment || 0)}</span>
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {/* Navigation Buttons */}
                    <div className="flex justify-between mt-8 pt-4 border-t border-[#E5E9EF]">
                      {currentStep > 1 && (
                        <Button 
                          type="button" 
                          onClick={prevStep}
                          className="bg-white border border-[#124E66] text-[#124E66] hover:bg-[#124E66]/5"
                        >
                          Previous
                        </Button>
                      )}
                      
                      {currentStep < 4 ? (
                        <Button 
                          type="button" 
                          onClick={nextStep}
                          className="ml-auto bg-[#124E66] hover:bg-[#124E66]/90"
                        >
                          Next
                        </Button>
                      ) : (
                        <Button 
                          type="button" 
                          onClick={async () => {
                            const fields = getFieldsForStep(currentStep);
                            const isValid = await validateFields(fields);
                            if (isValid) {
                              setShowConfirmationDialog(true);
                            }
                          }}
                          className="ml-auto bg-[#124E66] hover:bg-[#124E66]/90 h-12 text-white font-medium shadow-lg hover:shadow-xl transition-all"
                        >
                          Book Now
                        </Button>
                      )}
                    </div>
                  </form>
                </Form>
              </div>
              
              <div className="space-y-6">
                {/* Booking Rules Card */}
                <Card className="shadow-md border-[#748D92]/10 bg-white overflow-hidden">
                  <CardHeader className="bg-[#748D92] text-white">
                    <CardTitle className="text-xl">Booking Rules</CardTitle>
                    <CardDescription className="text-white/80">Important information about our booking policy</CardDescription>
                  </CardHeader>
                  <CardContent className="pt-6">
                    <ul className="space-y-3">
                      <li className="flex items-start gap-2">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#124E66] flex-shrink-0 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        <span>Bookings must be made at least 30 days in advance</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#124E66] flex-shrink-0 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        <span>Cancellations made 15+ days before event: 70% refund</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#124E66] flex-shrink-0 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        <span>Cancellations made 7-14 days before event: 50% refund</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#124E66] flex-shrink-0 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        <span>Cancellations made less than 7 days before: No refund</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#124E66] flex-shrink-0 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        <span>Rescheduling available with at least 15 days notice</span>
                      </li>
                    </ul>
                  </CardContent>
                </Card>
                
                {/* How Booking Works Card */}
                <Card className="shadow-md border-[#748D92]/10 bg-white overflow-hidden">
                  <CardHeader className="bg-[#748D92] text-white">
                    <CardTitle className="text-xl">How Booking Works</CardTitle>
                    <CardDescription className="text-white/80">Our easy booking process</CardDescription>
                  </CardHeader>
                  <CardContent className="pt-6">
                    <ol className="space-y-4">
                      <li className="flex gap-3">
                        <div className="flex-shrink-0 w-7 h-7 rounded-full bg-[#124E66] text-white flex items-center justify-center font-medium">1</div>
                        <div>
                          <p className="font-medium text-[#2E3944]">Fill the booking form</p>
                          <p className="text-sm text-gray-600">Provide all required details for your event</p>
                        </div>
                      </li>
                      <li className="flex gap-3">
                        <div className="flex-shrink-0 w-7 h-7 rounded-full bg-[#124E66] text-white flex items-center justify-center font-medium">2</div>
                        <div>
                          <p className="font-medium text-[#2E3944]">Pay 30% advance</p>
                          <p className="text-sm text-gray-600">Secure your booking with advance payment</p>
                        </div>
                      </li>
                      <li className="flex gap-3">
                        <div className="flex-shrink-0 w-7 h-7 rounded-full bg-[#124E66] text-white flex items-center justify-center font-medium">3</div>
                        <div>
                          <p className="font-medium text-[#2E3944]">Confirmation sent</p>
                          <p className="text-sm text-gray-600">Receive booking details via email & SMS</p>
                        </div>
                      </li>
                      <li className="flex gap-3">
                        <div className="flex-shrink-0 w-7 h-7 rounded-full bg-[#124E66] text-white flex items-center justify-center font-medium">4</div>
                        <div>
                          <p className="font-medium text-[#2E3944]">Pay balance before event</p>
                          <p className="text-sm text-gray-600">Remaining amount due 7 days before the event</p>
                        </div>
                      </li>
                    </ol>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>

        {/* Confirmation Dialog */}
        <Dialog open={showConfirmationDialog} onOpenChange={setShowConfirmationDialog}>
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-xl text-[#124E66]">Confirm Your Booking</DialogTitle>
            </DialogHeader>
            <div className="space-y-6">
              {/* Personal Information */}
              <div className="bg-[#F5F7F9] rounded-lg border border-[#E5E9EF] p-4">
                <h3 className="font-semibold text-[#124E66] mb-3 flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  Personal Information
                </h3>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <p><span className="font-medium">Name:</span> {form.getValues().name}</p>
                  <p><span className="font-medium">Email:</span> {form.getValues().email}</p>
                  <p><span className="font-medium">Phone:</span> {form.getValues().phone}</p>
                  {form.getValues().additionalPhone && (
                    <p><span className="font-medium">Additional Phone:</span> {form.getValues().additionalPhone}</p>
                  )}
                </div>
              </div>

              {/* Event Details */}
              <div className="bg-[#F5F7F9] rounded-lg border border-[#E5E9EF] p-4">
                <h3 className="font-semibold text-[#124E66] mb-3 flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  Event Details
                </h3>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <p><span className="font-medium">Package Type:</span> {form.getValues().packageType}</p>
                  <p><span className="font-medium">Event Date:</span> {form.getValues().date?.toLocaleDateString()}</p>
                  <p><span className="font-medium">Venue:</span> {form.getValues().venue}</p>
                  <p><span className="font-medium">City:</span> {form.getValues().city}</p>
                  {form.getValues().bandTime && (
                    <p><span className="font-medium">Time Slot:</span> {form.getValues().bandTime}</p>
                  )}
                  {form.getValues().bandTime === "Custom" && form.getValues().customTimeSlot && (
                    <p><span className="font-medium">Custom Time:</span> {form.getValues().customTimeSlot}</p>
                  )}
                </div>
              </div>

              {/* Package Specific Options */}
              {(form.getValues().packageType === "Baraat Band Package" || form.getValues().packageType === "DJ Band Package") && (
                <div className="bg-[#F5F7F9] rounded-lg border border-[#E5E9EF] p-4">
                  <h3 className="font-semibold text-[#124E66] mb-3 flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
                    </svg>
                    Package Options
                  </h3>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    {(form.getValues().numberOfPeople ?? 0) > 0 && (
                      <p><span className="font-medium">Band Size:</span> {form.getValues().numberOfPeople} people</p>
                    )}
                    {(form.getValues().numberOfLights ?? 0) > 0 && (
                      <p><span className="font-medium">Lights:</span> {form.getValues().numberOfLights} lights</p>
                    )}
                    {form.getValues().ghodiForBaraat && (
                      <p><span className="font-medium">Ghodi for Baraat:</span> Yes</p>
                    )}
                    {!form.getValues().ghodiForBaraat && (form.getValues().ghodaBaggi ?? 0) > 0 && (
                      <p><span className="font-medium">Ghoda Baggi:</span> {form.getValues().ghodaBaggi}</p>
                    )}
                  </div>
                </div>
              )}

              {/* Dhol Package Options */}
              {form.getValues().packageType === "Dhol Only Package" && (
                <div className="bg-[#F5F7F9] rounded-lg border border-[#E5E9EF] p-4">
                  <h3 className="font-semibold text-[#124E66] mb-3 flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
                    </svg>
                    Dhol Package Options
                  </h3>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    {(form.getValues().numberOfDhols ?? 0) > 0 && (
                      <p><span className="font-medium">Number of Dhols:</span> {form.getValues().numberOfDhols}</p>
                    )}
                  </div>
                </div>
              )}

              {/* Additional Features */}
              <div className="bg-[#F5F7F9] rounded-lg border border-[#E5E9EF] p-4">
                <h3 className="font-semibold text-[#124E66] mb-3 flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                  </svg>
                  Additional Features
                </h3>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <p><span className="font-medium">Fireworks:</span> {form.getValues().fireworks ? "Yes" : "No"}</p>
                  {form.getValues().fireworks && (form.getValues().fireworksAmount ?? 0) > 0 && (
                    <p><span className="font-medium">Fireworks Amount:</span> Rs. {form.getValues().fireworksAmount}</p>
                  )}
                  <p><span className="font-medium">Flower Canon:</span> {form.getValues().flowerCanon ? "Yes" : "No"}</p>
                  <p><span className="font-medium">Doli For Vidai:</span> {form.getValues().DoliForVidai ? "Yes" : "No"}</p>
                </div>
                {form.getValues().customization && (
                  <div className="mt-3">
                    <p className="font-medium">Additional Requests:</p>
                    <p className="text-sm mt-1 bg-white p-2 rounded border border-[#E5E9EF]">{form.getValues().customization}</p>
                  </div>
                )}
              </div>

              {/* Payment Summary */}
              <div className="bg-[#F5F7F9] rounded-lg border border-[#E5E9EF] p-4">
                <h3 className="font-semibold text-[#124E66] mb-3 flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                  Payment Details
                </h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="font-medium">Base Amount:</span>
                    <span>Rs. {form.getValues().amount || 0}</span>
                  </div>
                  {(form.getValues().fireworksAmount || 0) > 0 && (
                    <div className="flex justify-between">
                      <span className="font-medium">Fireworks Amount:</span>
                      <span>Rs. {form.getValues().fireworksAmount || 0}</span>
                    </div>
                  )}
                  <div className="flex justify-between pt-2 border-t border-[#E5E9EF]">
                    <span className="font-medium">Total Amount:</span>
                    <span className="text-[#124E66] font-bold">Rs. {(form.getValues().amount || 0) + (form.getValues().fireworksAmount || 0)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Advance Payment:</span>
                    <span>Rs. {form.getValues().advancePayment || 0}</span>
                  </div>
                  <div className="flex justify-between pt-2 border-t border-[#E5E9EF]">
                    <span className="font-medium">Remaining Amount:</span>
                    <span className="text-[#124E66] font-semibold">Rs. {((form.getValues().amount || 0) + (form.getValues().fireworksAmount || 0)) - (form.getValues().advancePayment || 0)}</span>
                  </div>
                </div>
              </div>
              
              <div className="flex gap-3">
                <Button onClick={() => setShowConfirmationDialog(false)} className="w-1/2 bg-gray-200 text-gray-800 hover:bg-gray-300">
                  Edit Details
                </Button>
                <Button onClick={confirmBooking} className="w-1/2 bg-[#124E66] hover:bg-[#124E66]/90 text-white">
                  Confirm & Book
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Success Dialog */}
        <Dialog open={showSuccessDialog} onOpenChange={setShowSuccessDialog}>
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-xl text-[#124E66] flex items-center gap-2">
                <CheckCircle className="h-6 w-6 text-green-500" />
                Booking Successful!
              </DialogTitle>
            </DialogHeader>
            
            {bookingDetails && (
              <div className="space-y-6">
                <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
                  <h3 className="font-bold text-lg text-green-700 mb-1">Your Booking ID</h3>
                  <p className="text-2xl font-mono font-bold tracking-wider">{bookingDetails.bookingId || bookingDetails.id}</p>
                  <p className="text-sm text-green-600 mt-2">Please save this ID for future reference</p>
                </div>
                
                {/* Personal Information */}
                <div className="bg-[#F5F7F9] rounded-lg border border-[#E5E9EF] p-4">
                  <h3 className="font-semibold text-[#124E66] mb-3 flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    Personal Information
                  </h3>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <p><span className="font-medium">Name:</span> {bookingDetails.name}</p>
                    <p><span className="font-medium">Email:</span> {bookingDetails.email}</p>
                    <p><span className="font-medium">Phone:</span> {bookingDetails.phone}</p>
                    {bookingDetails.additionalPhone && (
                      <p><span className="font-medium">Additional Phone:</span> {bookingDetails.additionalPhone}</p>
                    )}
                  </div>
                </div>

                {/* Event Details */}
                <div className="bg-[#F5F7F9] rounded-lg border border-[#E5E9EF] p-4">
                  <h3 className="font-semibold text-[#124E66] mb-3 flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    Event Details
                  </h3>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <p><span className="font-medium">Package Type:</span> {bookingDetails.packageType}</p>
                    <p><span className="font-medium">Event Date:</span> {new Date(bookingDetails.date).toLocaleDateString()}</p>
                    <p><span className="font-medium">Venue:</span> {bookingDetails.venue}</p>
                    <p><span className="font-medium">City:</span> {bookingDetails.city}</p>
                    {bookingDetails.bandTime && (
                      <p><span className="font-medium">Time Slot:</span> {bookingDetails.bandTime}</p>
                    )}
                    {bookingDetails.bandTime === "Custom" && bookingDetails.customTimeSlot && (
                      <p><span className="font-medium">Custom Time:</span> {bookingDetails.customTimeSlot}</p>
                    )}
                  </div>
                </div>

                {/* Package Specific Options */}
                {(bookingDetails.packageType === "Baraat Band Package" || bookingDetails.packageType === "DJ Band Package") && (
                  <div className="bg-[#F5F7F9] rounded-lg border border-[#E5E9EF] p-4">
                    <h3 className="font-semibold text-[#124E66] mb-3 flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
                      </svg>
                      Package Options
                    </h3>
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      {bookingDetails.numberOfPeople > 0 && (
                        <p><span className="font-medium">Band Size:</span> {bookingDetails.numberOfPeople} people</p>
                      )}
                      {bookingDetails.numberOfLights > 0 && (
                        <p><span className="font-medium">Lights:</span> {bookingDetails.numberOfLights} lights</p>
                      )}
                      {bookingDetails.ghodiForBaraat && (
                        <p><span className="font-medium">Ghodi for Baraat:</span> Yes</p>
                      )}
                      {!bookingDetails.ghodiForBaraat && bookingDetails.ghodaBaggi > 0 && (
                        <p><span className="font-medium">Ghoda Baggi:</span> {bookingDetails.ghodaBaggi}</p>
                      )}
                    </div>
                  </div>
                )}

                {/* Dhol Package Options */}
                {bookingDetails.packageType === "Dhol Only Package" && (
                  <div className="bg-[#F5F7F9] rounded-lg border border-[#E5E9EF] p-4">
                    <h3 className="font-semibold text-[#124E66] mb-3 flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
                      </svg>
                      Dhol Package Options
                    </h3>
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      {bookingDetails.numberOfDhols > 0 && (
                        <p><span className="font-medium">Number of Dhols:</span> {bookingDetails.numberOfDhols}</p>
                      )}
                    </div>
                  </div>
                )}

                {/* Additional Features */}
                <div className="bg-[#F5F7F9] rounded-lg border border-[#E5E9EF] p-4">
                  <h3 className="font-semibold text-[#124E66] mb-3 flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                    </svg>
                    Additional Features
                  </h3>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <p><span className="font-medium">Fireworks:</span> {bookingDetails.fireworks ? "Yes" : "No"}</p>
                    {bookingDetails.fireworks && bookingDetails.fireworksAmount > 0 && (
                      <p><span className="font-medium">Fireworks Amount:</span> Rs. {bookingDetails.fireworksAmount}</p>
                    )}
                    <p><span className="font-medium">Flower Canon:</span> {bookingDetails.flowerCanon ? "Yes" : "No"}</p>
                    <p><span className="font-medium">Doli For Vidai:</span> {bookingDetails.DoliForVidai ? "Yes" : "No"}</p>
                  </div>
                  {bookingDetails.customization && (
                    <div className="mt-3">
                      <p className="font-medium">Additional Requests:</p>
                      <p className="text-sm mt-1 bg-white p-2 rounded border border-[#E5E9EF]">{bookingDetails.customization}</p>
                    </div>
                  )}
                </div>

                {/* Payment Summary */}
                <div className="bg-[#F5F7F9] rounded-lg border border-[#E5E9EF] p-4">
                  <h3 className="font-semibold text-[#124E66] mb-3 flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                    Payment Details
                  </h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="font-medium">Base Amount:</span>
                      <span>Rs. {bookingDetails.amount || 0}</span>
                    </div>
                    {(bookingDetails.fireworksAmount || 0) > 0 && (
                      <div className="flex justify-between">
                        <span className="font-medium">Fireworks Amount:</span>
                        <span>Rs. {bookingDetails.fireworksAmount || 0}</span>
                      </div>
                    )}
                    <div className="flex justify-between pt-2 border-t border-[#E5E9EF]">
                      <span className="font-medium">Total Amount:</span>
                      <span className="text-[#124E66] font-bold">Rs. {(bookingDetails.amount || 0) + (bookingDetails.fireworksAmount || 0)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">Advance Payment:</span>
                      <span>Rs. {bookingDetails.advancePayment || 0}</span>
                    </div>
                    <div className="flex justify-between pt-2 border-t border-[#E5E9EF]">
                      <span className="font-medium">Remaining Amount:</span>
                      <span className="text-[#124E66] font-bold">Rs. {((bookingDetails.amount || 0) + (bookingDetails.fireworksAmount || 0)) - (bookingDetails.advancePayment || 0)}</span>
                    </div>
                  </div>
                </div>

                <DialogFooter>
                  <div className="text-center w-full">
                    <p className="text-sm text-gray-500 mb-3">Thank you for your booking! We'll be in touch soon.</p>
                    <Button 
                      onClick={() => setShowSuccessDialog(false)} 
                      className="bg-[#124E66] min-w-[200px] hover:bg-[#124E66]/90"
                    >
                      Done
                    </Button>
                  </div>
                </DialogFooter>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </PublicPageWrapper>
  );
} 