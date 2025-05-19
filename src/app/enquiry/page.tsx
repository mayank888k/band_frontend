"use client";

import { useState, useEffect, Suspense } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import Link from "next/link";
import { motion } from "framer-motion";
import { useSearchParams } from "next/navigation";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
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
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";

const PackageEnum = z.enum(["Normal Band", "DJ Band", "Dhol", "Wedding Event", "Full Wedding"]);
type PackageType = z.infer<typeof PackageEnum>;

// Use a custom validator for package type to handle empty strings
const packageTypeField = z.union([
  PackageEnum,
  z.literal("").transform(() => undefined)
]).optional();

const formSchema = z.object({
  eventDate: z.date({
    required_error: "Please select a date",
  }),
  venueAddress: z.string().min(2, "Venue address is required"),
  packageType: packageTypeField,
  timingOption: z.string().optional(),
  customTiming: z.string().optional(),
  numberOfLights: z.number().optional(),
  ghodaBaggi: z.number().optional(),
  ghodiForBaraat: z.boolean().default(false),
  fireworks: z.boolean().default(false),
  fireworksAmount: z.number().optional(),
  doli: z.boolean().default(false),
  flowerCanon: z.boolean().default(false),
  numberOfDhols: z.number().optional(),
  additionalRequirements: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

// Create a separate client component that uses useSearchParams
function EnquiryForm() {
  const [formSubmitted, setFormSubmitted] = useState(false);
  const searchParams = useSearchParams();
  
  // Get the initial package type from URL params before form initialization
  const getInitialPackageType = (): PackageType | undefined => {
    const packageParam = searchParams?.get("package");
    
    if (packageParam) {
      const packageMapping: Record<string, PackageType> = {
        "baraat": "Normal Band",
        "djBand": "DJ Band", 
        "reception": "Wedding Event",
        "fullWedding": "Full Wedding",
        "dhol": "Dhol"
      };
      
      return packageMapping[packageParam];
    }
    
    return undefined;
  };
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      eventDate: new Date(),
      venueAddress: "",
      packageType: getInitialPackageType(),
      timingOption: undefined,
      customTiming: "",
      numberOfLights: 0,
      ghodaBaggi: 0,
      ghodiForBaraat: false,
      fireworks: false,
      fireworksAmount: 0,
      doli: false,
      flowerCanon: false,
      numberOfDhols: 0,
      additionalRequirements: "",
    },
  });

  const packageType = form.watch("packageType");
  const ghodiForBaraat = form.watch("ghodiForBaraat");
  const fireworks = form.watch("fireworks");
  const timingOption = form.watch("timingOption");
  
  // This ensures packageType from URL gets set even after form is initialized
  useEffect(() => {
    const initialPackageType = getInitialPackageType();
    if (initialPackageType && !form.getValues("packageType")) {
      form.setValue("packageType", initialPackageType, {
        shouldValidate: false, // First just set the value without validation
      });
      
      // Then trigger validation after a small delay
      setTimeout(() => {
        form.trigger("packageType");
      }, 100);
    }
  }, [searchParams, form]);

  const onSubmit = async (data: FormValues) => {
    // Format the data for WhatsApp
    let message = `*New Price Enquiry*\n\n`;
    message += `*Event Date:* ${data.eventDate ? data.eventDate.toLocaleDateString() : 'Not specified'}\n`;
    message += `*Venue Address:* ${data.venueAddress}\n`;
    message += `*Package Type:* ${data.packageType || 'Not specified'}\n`;
    
    // Add package-specific details
    if (data.packageType === "Normal Band" || data.packageType === "DJ Band") {
      message += `*Timing Option:* ${data.timingOption === "Custom" ? data.customTiming : data.timingOption || 'Not specified'}\n`;
      message += `*Number of Lights:* ${data.numberOfLights || 0}\n`;
      
      if (data.ghodiForBaraat) {
        message += `*Ghodi for Baraat:* Yes\n`;
      } else {
        message += `*Ghoda Baggi:* ${data.ghodaBaggi || 0}\n`;
      }
    }
    
    if (data.packageType === "Dhol") {
      message += `*Number of Dhols:* ${data.numberOfDhols || 0}\n`;
    }
    
    // Add common additional options
    if (data.fireworks) {
      message += `*Fireworks:* Yes\n`;
      message += `*Fireworks Amount:* ${data.fireworksAmount || 0}\n`;
    }
    
    if (data.doli) message += `*Doli:* Yes\n`;
    if (data.flowerCanon) message += `*Flower Canon:* Yes\n`;
    
    // Add additional requirements
    if (data.additionalRequirements) {
      message += `\n*Additional Requirements:*\n${data.additionalRequirements}\n`;
    }
    
    // Encode the message for WhatsApp
    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/9194123038386?text=${encodedMessage}`; // Replace with your actual WhatsApp number
    
    // Open WhatsApp in a new tab
    window.open(whatsappUrl, '_blank');
    
    // Show success message
    setFormSubmitted(true);
  };

  return (
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
              <span className="text-[#124E66]">Enquire</span> Price
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
              Fill out the form below to get a custom quote for your event. We'll provide pricing information based on your specific requirements.
            </motion.p>
          </motion.div>
        </div>
      </section>
      
      {/* Form Section */}
      <section className="py-16 bg-[#F5F7F9]">
        <div className="container">
          <div className="max-w-4xl mx-auto">
            <div className="bg-white p-8 rounded-lg shadow-md">
              <h2 className="text-2xl font-bold text-[#124E66] mb-6">Event Details</h2>
              
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Event Date */}
                    <FormField
                      control={form.control}
                      name="eventDate"
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

                    {/* Venue Address */}
                    <FormField
                      control={form.control}
                      name="venueAddress"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-[#2E3944] font-medium">Venue Address</FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="Enter venue address" 
                              {...field} 
                              className="bg-[#F5F7F9] border-[#E5E9EF] focus-visible:ring-[#124E66] focus-visible:ring-offset-0 focus-visible:border-[#124E66] transition-colors"
                            />
                          </FormControl>
                          <FormMessage className="text-red-500" />
                        </FormItem>
                      )}
                    />
                  </div>

                  {/* Package Type */}
                  <FormField
                    control={form.control}
                    name="packageType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-[#2E3944] font-medium">Package Type</FormLabel>
                        <Select 
                          onValueChange={(value) => {
                            if (value) {
                              field.onChange(value);
                            }
                          }}
                          value={field.value || undefined}
                        >
                          <FormControl>
                            <SelectTrigger className="bg-[#F5F7F9] border-[#E5E9EF] focus:ring-[#124E66] focus:ring-offset-0 focus:border-[#124E66] transition-colors">
                              <SelectValue placeholder="Select a package" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="Normal Band">Normal Band</SelectItem>
                            <SelectItem value="DJ Band">DJ Band</SelectItem>
                            <SelectItem value="Dhol">Dhol</SelectItem>
                            <SelectItem value="Wedding Event">Wedding Event (Haldi / Mehendi / Sangeet)</SelectItem>
                            <SelectItem value="Full Wedding">Full Wedding</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage className="text-red-500" />
                      </FormItem>
                    )}
                  />

                  {/* Conditional Fields based on Package Type */}
                  {(packageType === "Normal Band" || packageType === "DJ Band") && (
                    <div className="space-y-6 p-6 bg-[#F5F7F9] border border-[#E5E9EF] rounded-lg">
                      <h3 className="text-lg font-semibold text-[#124E66] mb-4">
                        {packageType === "Normal Band" ? "Normal Band Options" : "DJ Band Options"}
                      </h3>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Timing Options */}
                        <FormField
                          control={form.control}
                          name="timingOption"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-[#2E3944] font-medium">Timing</FormLabel>
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
                                  <SelectItem value="Custom">Custom</SelectItem>
                                </SelectContent>
                              </Select>
                              <FormMessage className="text-red-500" />
                            </FormItem>
                          )}
                        />

                        {/* Custom Timing field */}
                        {timingOption === "Custom" && (
                          <FormField
                            control={form.control}
                            name="customTiming"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="text-[#2E3944] font-medium">Custom Timing</FormLabel>
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

                        {/* Number of Lights */}
                        <FormField
                          control={form.control}
                          name="numberOfLights"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-[#2E3944] font-medium">Number of Lights</FormLabel>
                              <FormControl>
                                <Input 
                                  type="number" 
                                  min="0"
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

                        {/* Ghodi for Baraat */}
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

                        {/* Ghoda Baggi (only shown when Ghodi for Baraat is not checked) */}
                        {!ghodiForBaraat && (
                          <FormField
                            control={form.control}
                            name="ghodaBaggi"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="text-[#2E3944] font-medium">Ghoda Baggi</FormLabel>
                                <FormControl>
                                  <Input 
                                    type="number" 
                                    min="0"
                                    {...field}
                                    onChange={(e) => field.onChange(parseInt(e.target.value) || 0)} 
                                    value={field.value || ""}
                                    placeholder="Enter number of horses needed"
                                    className="bg-white border-[#E5E9EF] focus-visible:ring-[#124E66] focus-visible:ring-offset-0 focus-visible:border-[#124E66]"
                                  />
                                </FormControl>
                                <FormMessage className="text-red-500" />
                              </FormItem>
                            )}
                          />
                        )}
                      </div>
                    </div>
                  )}

                  {/* Dhol Package Options */}
                  {packageType === "Dhol" && (
                    <div className="space-y-6 p-6 bg-[#F5F7F9] border border-[#E5E9EF] rounded-lg">
                      <h3 className="text-lg font-semibold text-[#124E66] mb-4">Dhol Options</h3>
                      
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
                                {...field}
                                onChange={(e) => field.onChange(parseInt(e.target.value) || 0)} 
                                value={field.value || ""}
                                placeholder="Enter number of dhols"
                                className="bg-white border-[#E5E9EF] focus-visible:ring-[#124E66] focus-visible:ring-offset-0 focus-visible:border-[#124E66]"
                              />
                            </FormControl>
                            <FormMessage className="text-red-500" />
                          </FormItem>
                        )}
                      />
                    </div>
                  )}

                  {/* Additional Options (shown for all package types) */}
                  {(packageType === "Normal Band" || packageType === "DJ Band") && (
                    <div className="space-y-6 p-6 bg-[#F5F7F9] border border-[#E5E9EF] rounded-lg">
                      <h3 className="text-lg font-semibold text-[#124E66] mb-4">Additional Options</h3>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Fireworks */}
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

                        {/* Doli */}
                        <FormField
                          control={form.control}
                          name="doli"
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

                        {/* Flower Canon */}
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
                      </div>

                      {/* Fireworks Amount (only shown when Fireworks is checked) */}
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
                                  className="bg-white border-[#E5E9EF] focus-visible:ring-[#124E66] focus-visible:ring-offset-0 focus-visible:border-[#124E66]"
                                />
                              </FormControl>
                              <FormMessage className="text-red-500" />
                            </FormItem>
                          )}
                        />
                      )}
                    </div>
                  )}

                  {/* Additional Requirements (shown for all package types) */}
                  {packageType && (
                    <FormField
                      control={form.control}
                      name="additionalRequirements"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-[#2E3944] font-medium">Additional Requirements</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Enter any specific requirements or special requests"
                              className="min-h-[100px] bg-[#F5F7F9] border-[#E5E9EF] focus-visible:ring-[#124E66] focus-visible:ring-offset-0 focus-visible:border-[#124E66]"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage className="text-red-500" />
                        </FormItem>
                      )}
                    />
                  )}

                  {/* Submit Button */}
                  <div className="flex justify-center pt-4">
                    <Button 
                      type="submit" 
                      className="bg-[#124E66] hover:bg-[#124E66]/90 h-12 px-8 text-white font-medium shadow-lg hover:shadow-xl transition-all"
                      disabled={!form.formState.isValid}
                    >
                      Enquire Price
                    </Button>
                  </div>

                  {/* Success Message */}
                  {formSubmitted && (
                    <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg text-center text-green-700">
                      <p className="font-medium">Your enquiry has been sent!</p>
                      <p className="text-sm mt-1">We'll get back to you with pricing information shortly.</p>
                    </div>
                  )}
                </form>
              </Form>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-[#124E66] text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23ffffff\' fill-opacity=\'0.1\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-20"></div>
        <div className="container relative z-10">
          <motion.div 
            className="text-center max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, margin: "-100px" }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          >
            <h2 className="mb-6 text-3xl md:text-4xl lg:text-5xl text-white">Ready to Make Your Event Special?</h2>
            <div className="w-24 h-1 bg-[#748D92] mx-auto mb-6"></div>
            <p className="text-xl mb-8 text-white/90">
              Book Modern Band today and let us add energy and excitement to your celebration.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.98 }}>
                <Link href="/booking" className="btn-lg bg-white text-[#124E66] hover:bg-white/90 shadow-lg py-3 px-6 rounded-md font-medium inline-block">
                  Book Now
                </Link>
              </motion.div>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.98 }}>
                <Link href="/contact" className="btn-lg border border-white hover:bg-white/10 py-3 px-6 rounded-md font-medium inline-block">
                  Contact Us
                </Link>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}

// Main page component that wraps the form with Suspense
export default function EnquiryPage() {
  return (
    <PublicPageWrapper>
      <Suspense fallback={<div className="flex justify-center items-center min-h-screen">Loading...</div>}>
        <EnquiryForm />
      </Suspense>
    </PublicPageWrapper>
  );
} 