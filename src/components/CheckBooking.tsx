import { useState, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
// @ts-ignore - Ignore TypeScript errors for jsPDF
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { getBooking } from "@/lib/api";

// Define type for content object in the addSection function
type SectionContent = Record<string, string | number | boolean | null | undefined>;

// Define booking response types
interface BookingData {
  id: string;
  name: string;
  email: string;
  phone: string;
  packageType: string;
  date: string;
  time?: string;
  venue: string;
  city: string;
  address?: string;
  amount: number;
  advancePayment?: number;
  balance?: number;
  status?: string;
  bandTime?: string;
  customTimeSlot?: string;
  ghodiForBaraat?: boolean;
  fireworks?: boolean;
  flowerCanon?: boolean;
  DoliForVidai?: boolean;
  createdAt?: string;
  [key: string]: any;
}

// Define API response types
type BookingResponse = 
  | { booking: BookingData }
  | { bookings: BookingData[] };

const formSchema = z.object({
  identifier: z.string().min(1, "Please enter a booking ID or phone number"),
});

interface CheckBookingProps {
  className?: string;
}

export function CheckBooking({ className }: CheckBookingProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [bookingDetails, setBookingDetails] = useState<BookingData | null>(null);
  const bookingDetailsRef = useRef<HTMLDivElement>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      identifier: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      setBookingDetails(null);
      
      const identifier = values.identifier.trim();
      
      // Determine if it's a phone number or booking ID
      const isPhoneNumber = /^\d{10}$/.test(identifier);
      
      // Use our centralized API service
      const data = await getBooking({
        bookingId: isPhoneNumber ? undefined : identifier,
        contactNumber: isPhoneNumber ? identifier : undefined
      }) as BookingResponse;
      
      // Handle the response based on what was returned
      if ('bookings' in data && data.bookings.length > 0) {
        // If searching by phone number, we might get multiple bookings - use the most recent
        setBookingDetails(data.bookings[0]);
      } else if ('booking' in data) {
        // If searching by ID, we get a single booking
        setBookingDetails(data.booking);
      } else {
        throw new Error('No booking found');
      }
    } catch (error) {
      console.error("Error fetching booking:", error);
      form.setError("identifier", { 
        type: "manual", 
        message: error instanceof Error ? error.message : "Failed to find booking" 
      });
      setBookingDetails(null);
    }
  };

  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return 'N/A';
    try {
      return new Date(dateString).toLocaleDateString('en-IN', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch (error) {
      return 'Invalid Date';
    }
  };

  const downloadPDF = async () => {
    if (!bookingDetails) return;
    
    try {
      // Show loading indicator or disable button during generation
      const button = document.getElementById('download-pdf-button');
      if (button) {
        button.textContent = 'Generating PDF...';
        button.setAttribute('disabled', 'true');
      }
      
      // Initialize PDF with better quality settings
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
        compress: true
      });
      
      // Set up constants for layout
      const pageWidth = 210;
      const margin = 20;
      const contentWidth = pageWidth - (margin * 2);
      let yPos = 20;
      
      // Add header with background
      pdf.setFillColor(18, 78, 102); // #124E66 in RGB
      pdf.rect(0, 0, pageWidth, 15, 'F');
      
      // Add title
      pdf.setFont('helvetica', 'bold');
      pdf.setFontSize(14);
      pdf.setTextColor(255, 255, 255);
      pdf.text('Modern Band - Booking Confirmation', pageWidth / 2, 10, { align: 'center' });
      
      // Add logo placeholder (future enhancement)
      // pdf.addImage(logoData, 'PNG', margin, 5, 15, 15);
      
      // Add booking ID
      yPos = 30;
      pdf.setFont('helvetica', 'bold');
      pdf.setFontSize(16);
      pdf.setTextColor(18, 78, 102);
      pdf.text('Booking ID: ', margin, yPos);
      
      pdf.setFont('courier', 'bold');
      pdf.setFontSize(16);
      pdf.setTextColor(0, 0, 0);
      pdf.text(bookingDetails.id, margin + 35, yPos);
      
      // Add booking date
      yPos += 8;
      pdf.setFont('helvetica', 'normal');
      pdf.setFontSize(10);
      pdf.setTextColor(100, 100, 100);
      const createdDate = formatDate(bookingDetails.createdAt);
      pdf.text(`Booking Date: ${createdDate}`, margin, yPos);
      
      // Add confirmation status
      yPos += 5;
      pdf.setFont('helvetica', 'bold');
      pdf.setFontSize(10);
      pdf.setTextColor(46, 125, 50);
      pdf.text('Status: Confirmed', margin, yPos);
      
      // Helper function to add a section to the PDF
      // @ts-ignore - Ignoring TypeScript errors for function parameters
      const addSection = (sectionTitle: string, sectionContent: SectionContent, icon: string | null = null): void => {
        // Check if we need a page break (leave 30mm space for footer)
        if (yPos > 267) {
          pdf.addPage();
          yPos = 20;
        }
        
        yPos += 10;
        
        // Add section title with colored background
        pdf.setFillColor(245, 247, 249);
        pdf.rect(margin, yPos - 5, contentWidth, 10, 'F');
        
        pdf.setDrawColor(229, 233, 239);
        pdf.rect(margin, yPos - 5, contentWidth, 10, 'S');
        
        pdf.setFont('helvetica', 'bold');
        pdf.setFontSize(12);
        pdf.setTextColor(18, 78, 102);
        pdf.text(sectionTitle, margin + 5, yPos);
        
        yPos += 10;
        
        // Add content
        pdf.setFont('helvetica', 'normal');
        pdf.setFontSize(10);
        pdf.setTextColor(0, 0, 0);
        
        Object.entries(sectionContent).forEach(([key, value]) => {
          // Skip if value is falsy
          if (!value && value !== 0) return;
          
          // Check if we need a page break
          if (yPos > 267) {
            pdf.addPage();
            yPos = 20;
          }
          
          pdf.setFont('helvetica', 'bold');
          pdf.text(`${key}:`, margin + 5, yPos);
          
          pdf.setFont('helvetica', 'normal');
          pdf.text(`${value}`, margin + 50, yPos);
          
          yPos += 7;
        });
      };
      
      // Personal Information Section
      addSection('Personal Information', {
        'Name': bookingDetails.name,
        'Email': bookingDetails.email,
        'Phone': bookingDetails.phone,
        'Additional Phone': bookingDetails.additionalPhone || 'N/A'
      });
      
      // Event Details Section
      addSection('Event Details', {
        'Package Type': bookingDetails.packageType,
        'Event Date': formatDate(bookingDetails.eventDate || bookingDetails.date),
        'Venue': bookingDetails.venue,
        'City': bookingDetails.city,
        'Time Slot': bookingDetails.bandTime || 'N/A',
        'Custom Time': (bookingDetails.bandTime === 'Custom' ? bookingDetails.customTimeSlot : 'N/A')
      });
      
      // Package Options Section
      if (bookingDetails.packageType === "Baraat Band Package" || bookingDetails.packageType === "DJ Band Package") {
        const packageOptions = {
          'Band Size': bookingDetails.numberOfPeople > 0 ? `${bookingDetails.numberOfPeople} people` : 'N/A',
          'Lights': bookingDetails.numberOfLights > 0 ? `${bookingDetails.numberOfLights} lights` : 'N/A',
          'Ghodi for Baraat': bookingDetails.ghodiForBaraat ? 'Yes' : 'No',
          'Ghoda Baggi': (!bookingDetails.ghodiForBaraat && bookingDetails.ghodaBaggi > 0) ? 
            bookingDetails.ghodaBaggi : 'N/A'
        };
        addSection('Package Options', packageOptions);
      }
      
      // Dhol Package Options
      if (bookingDetails.packageType === "Dhol Only Package") {
        const dholOptions = {
          'Number of Dhols': bookingDetails.numberOfDhols > 0 ? bookingDetails.numberOfDhols : 'N/A'
        };
        addSection('Dhol Package Options', dholOptions);
      }
      
      // Additional Features Section
      const additionalFeatures = {
        'Fireworks': bookingDetails.fireworks ? 'Yes' : 'No',
        'Fireworks Amount': bookingDetails.fireworks && bookingDetails.fireworksAmount > 0 ? 
          `Rs. ${bookingDetails.fireworksAmount}` : 'N/A',
        'Flower Canon': bookingDetails.flowerCanon ? 'Yes' : 'No',
        'Doli For Vidai': bookingDetails.doliForVidai ? 'Yes' : 'No'
      };
      addSection('Additional Features', additionalFeatures);
      
      // Additional Requests
      if (bookingDetails.customization) {
        yPos += 3;
        pdf.setFont('helvetica', 'bold');
        pdf.text('Additional Requests:', margin + 5, yPos);
        
        yPos += 7;
        pdf.setFont('helvetica', 'normal');
        
        // Handle multi-line text for customization
        const splitCustomization = pdf.splitTextToSize(bookingDetails.customization, contentWidth - 10);
        for (let i = 0; i < splitCustomization.length; i++) {
          const line = splitCustomization[i];
          if (yPos > 267) {
            pdf.addPage();
            yPos = 20;
          }
          pdf.text(line, margin + 5, yPos);
          yPos += 6;
        }
      }
      
      // Payment Details Section
      const baseAmount = bookingDetails.amount || 0;
      const fireworksAmount = bookingDetails.fireworksAmount || 0;
      const advancePayment = bookingDetails.advancePayment || 0;
      const totalAmount = baseAmount + fireworksAmount;
      const remainingAmount = totalAmount - advancePayment;
      
      const paymentDetails = {
        'Base Amount': `Rs. ${baseAmount}`,
        'Fireworks Amount': fireworksAmount > 0 ? `Rs. ${fireworksAmount}` : 'N/A',
        'Total Amount': `Rs. ${totalAmount}`,
        'Advance Payment': `Rs. ${advancePayment}`,
        'Remaining Amount': `Rs. ${remainingAmount}`
      };
      
      addSection('Payment Details', paymentDetails);
      
      // Add footer with contact info in a simplified way to avoid TypeScript errors
      const addFooter = (): void => {
        // Simplest approach - just loop through known number of pages
        // This works because we already know all the pages that have been added
        // @ts-ignore - Ignoring TypeScript errors for jsPDF internal methods
        const totalPages = pdf.getNumberOfPages ? pdf.getNumberOfPages() : 1;
        
        for (let i = 1; i <= totalPages; i++) {
          pdf.setPage(i);
          
          // Add footer background
          pdf.setFillColor(240, 240, 240);
          pdf.rect(0, 287, pageWidth, 10, 'F');
          
          // Add footer text
          pdf.setFont('helvetica', 'normal');
          pdf.setFontSize(8);
          pdf.setTextColor(100, 100, 100);
          pdf.text(
            'Modern Band - Your Premier Wedding Band Service | Contact: +91 9412308386 | info@modernband.com', 
            pageWidth / 2, 
            293, 
            { align: 'center' }
          );
          
          // Add page numbers
          pdf.text(`Page ${i} of ${totalPages}`, pageWidth - margin, 293);
        }
      };
      
      addFooter();
      
      // Save the PDF
      pdf.save(`ModernBand_Booking_${bookingDetails.id}.pdf`);
      
      // Reset button state
      if (button) {
        button.textContent = 'Download Details (PDF)';
        button.removeAttribute('disabled');
      }
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Failed to generate PDF. Please try again.');
      
      // Reset button even if there's an error
      const button = document.getElementById('download-pdf-button');
      if (button) {
        button.textContent = 'Download Details (PDF)';
        button.removeAttribute('disabled');
      }
    }
  };

  return (
    <>
      <Button
        variant="outline"
        onClick={() => setIsOpen(true)}
        className={className}
        aria-label="Check Booking"
      >
        Check Booking
      </Button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl text-[#124E66]">Check Booking Status</DialogTitle>
          </DialogHeader>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="identifier"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Booking ID / Phone Number</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter booking ID or phone number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" className="w-full">
                Check Status
              </Button>
            </form>
          </Form>

          {bookingDetails && (
            <div className="mt-6 space-y-6" ref={bookingDetailsRef}>
              {/* Booking ID Banner */}
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
                <h3 className="font-bold text-lg text-green-700 mb-1">Booking ID</h3>
                <p className="text-2xl font-mono font-bold tracking-wider">{bookingDetails.id}</p>
                <p className="text-sm text-green-600 mt-2">Confirmed</p>
              </div>
              
              {/* Personal Information */}
              <div className="bg-[#F5F7F9] rounded-lg border border-[#E5E9EF] p-4">
                <h4 className="font-semibold text-[#124E66] mb-3 flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  Personal Information
                </h4>
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
                <h4 className="font-semibold text-[#124E66] mb-3 flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  Event Details
                </h4>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <p><span className="font-medium">Package Type:</span> {bookingDetails.packageType}</p>
                  <p><span className="font-medium">Event Date:</span> {formatDate(bookingDetails.eventDate || bookingDetails.date)}</p>
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
                  <h4 className="font-semibold text-[#124E66] mb-3 flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
                    </svg>
                    Package Options
                  </h4>
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
                  <h4 className="font-semibold text-[#124E66] mb-3 flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
                    </svg>
                    Dhol Package Options
                  </h4>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    {bookingDetails.numberOfDhols > 0 && (
                      <p><span className="font-medium">Number of Dhols:</span> {bookingDetails.numberOfDhols}</p>
                    )}
                  </div>
                </div>
              )}

              {/* Additional Features */}
              <div className="bg-[#F5F7F9] rounded-lg border border-[#E5E9EF] p-4">
                <h4 className="font-semibold text-[#124E66] mb-3 flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                  </svg>
                  Additional Features
                </h4>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <p><span className="font-medium">Fireworks:</span> {bookingDetails.fireworks ? "Yes" : "No"}</p>
                  {bookingDetails.fireworks && bookingDetails.fireworksAmount > 0 && (
                    <p><span className="font-medium">Fireworks Amount:</span> Rs. {bookingDetails.fireworksAmount}</p>
                  )}
                  <p><span className="font-medium">Flower Canon:</span> {bookingDetails.flowerCanon ? "Yes" : "No"}</p>
                  <p><span className="font-medium">Doli For Vidai:</span> {bookingDetails.doliForVidai ? "Yes" : "No"}</p>
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
                <h4 className="font-semibold text-[#124E66] mb-3 flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                  Payment Details
                </h4>
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
            </div>
          )}
          
          {bookingDetails && (
            <Button
              id="download-pdf-button"
              variant="outline"
              className="w-full mt-6 bg-[#124E66] text-white hover:bg-[#0d3e52] hover:text-white flex items-center justify-center gap-2"
              onClick={downloadPDF}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Download Details (PDF)
            </Button>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
} 