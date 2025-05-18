"use client";

import { useState, useEffect } from "react";
import * as React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Calendar, Clock, MapPin, DollarSign, Filter, Download, Search, X, Trash2 } from "lucide-react";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription,
  DialogFooter
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { format } from "date-fns";
import { DatePicker } from "@/components/ui/date-picker";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { getBookings, deleteBooking, deletePastBookings } from "@/lib/api";

// Import statement for PDF generation - make sure both packages are installed:
// npm install jspdf jspdf-autotable
import jsPDF from "jspdf";
import autoTable from 'jspdf-autotable';

interface Booking {
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

// Define API response type
interface BookingsResponse {
  bookings: Booking[];
  deleted_count?: number;
  data?: Booking[];
  results?: Booking[];
}

// Helper function to check if an object is a Booking
function isBooking(obj: any): obj is Booking {
  return (
    obj &&
    typeof obj === 'object' &&
    'id' in obj &&
    'name' in obj &&
    'email' in obj &&
    'phone' in obj &&
    'packageType' in obj &&
    'date' in obj &&
    'venue' in obj &&
    'city' in obj &&
    'amount' in obj
  );
}

// Helper function to safely convert possibly unknown data to Booking[]
function safelyGetBookings(data: any): Booking[] {
  let bookings: any[] = [];
  
  // Case 1: data.bookings is array of bookings
  if (data && data.bookings && Array.isArray(data.bookings)) {
    bookings = data.bookings;
  }
  // Case 2: data is array of bookings
  else if (Array.isArray(data)) {
    bookings = data;
  }
  // Case 3: data.data is array of bookings
  else if (data && data.data && Array.isArray(data.data)) {
    bookings = data.data;
  }
  // Case 4: data.results is array of bookings
  else if (data && data.results && Array.isArray(data.results)) {
    bookings = data.results;
  }
  
  // Filter valid bookings and normalize date fields
  return bookings
    .filter(isBooking)
    .map(booking => ({
      ...booking,
      // Ensure date is in a consistent format
      date: booking.date || booking.eventDate || new Date().toISOString()
    }));
}

export default function BookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [filteredBookings, setFilteredBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  
  // Filters
  const [nameFilter, setNameFilter] = useState("");
  const [phoneFilter, setPhoneFilter] = useState("");
  const [monthFilter, setMonthFilter] = useState<string | null>(null);
  const [dateFilter, setDateFilter] = useState<Date | undefined>(undefined);
  const [packageFilter, setPackageFilter] = useState<string | null>(null);
  const [showActiveOnly, setShowActiveOnly] = useState(false);

  // Dialog control
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // Add a state to control the popover
  const [datePickerOpen, setDatePickerOpen] = useState(false);

  // Add states for delete confirmation
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isDeletePastDialogOpen, setIsDeletePastDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        setIsLoading(true);
        const data = await getBookings() as BookingsResponse;
        console.log("API Response:", data);
        
        // Safely get bookings with type validation
        const processedBookings = safelyGetBookings(data);
        
        console.log("Processed bookings:", processedBookings);
        setBookings(processedBookings);
        setFilteredBookings(processedBookings);
      } catch (error) {
        console.error('Error fetching bookings:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBookings();
  }, []);

  // Apply filters when any filter changes
  useEffect(() => {
    applyFilters();
  }, [nameFilter, phoneFilter, monthFilter, dateFilter, packageFilter, showActiveOnly, bookings]);

  const applyFilters = () => {
    // Get the most current bookings data to filter
    let result = [...bookings];
    console.log("Applying filters to", result.length, "bookings");

    // Filter by name
    if (nameFilter) {
      result = result.filter(booking => 
        booking.name.toLowerCase().includes(nameFilter.toLowerCase())
      );
    }

    // Filter by phone
    if (phoneFilter) {
      result = result.filter(booking => 
        booking.phone.includes(phoneFilter)
      );
    }

    // Filter by month
    if (monthFilter) {
      result = result.filter(booking => {
        const bookingDate = new Date(booking.date);
        return bookingDate.getMonth() === parseInt(monthFilter) - 1;
      });
    }

    // Filter by exact date
    if (dateFilter !== undefined) {
      result = result.filter(booking => {
        const bookingDate = new Date(booking.date);
        return bookingDate.toDateString() === dateFilter.toDateString();
      });
    }

    // Filter by package type
    if (packageFilter) {
      result = result.filter(booking => 
        booking.packageType === packageFilter
      );
    }

    // Filter by active status (future events)
    if (showActiveOnly) {
      const today = new Date();
      result = result.filter(booking => {
        try {
          // Handle both possible date field names
          const dateStr = booking.date || booking.eventDate;
          if (!dateStr) return true; // Include if no date found
          
          const bookingDate = new Date(dateStr);
          return bookingDate >= today;
        } catch (error) {
          console.error("Error comparing dates for booking:", booking);
          return true; // Include by default if there's an error
        }
      });
    }

    console.log("Filtered to", result.length, "bookings");
    setFilteredBookings(result);
  };

  const resetFilters = () => {
    setNameFilter("");
    setPhoneFilter("");
    setMonthFilter(null);
    setDateFilter(undefined);
    setPackageFilter(null);
    setShowActiveOnly(false);
  };

  const handleViewDetails = (booking: Booking) => {
    setSelectedBooking(booking);
    setIsDialogOpen(true);
  };

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), "PPP");
    } catch (e) {
      return dateString;
    }
  };

  const getPackageTypes = () => {
    const packageTypes = new Set(bookings.map(b => b.packageType));
    return Array.from(packageTypes);
  };

  const downloadPDF = () => {
    try {
      const doc = new jsPDF();
      
      // Add title
      doc.setFontSize(18);
      doc.text('Modern Band - Booking Report', 14, 22);
      
      // Add subtitle with date
      doc.setFontSize(11);
      doc.setTextColor(100);
      doc.text(`Generated on ${new Date().toLocaleDateString()}`, 14, 30);
      
      // Add filter information if any filters are applied
      let yPos = 40;
      if (nameFilter || phoneFilter || monthFilter || dateFilter || packageFilter || !showActiveOnly) {
        doc.setFontSize(12);
        doc.setTextColor(0);
        doc.text('Applied Filters:', 14, yPos);
        yPos += 7;
        
        if (nameFilter) {
          doc.setFontSize(10);
          doc.text(`Name contains: ${nameFilter}`, 18, yPos);
          yPos += 6;
        }
        
        if (phoneFilter) {
          doc.setFontSize(10);
          doc.text(`Phone contains: ${phoneFilter}`, 18, yPos);
          yPos += 6;
        }
        
        if (monthFilter) {
          const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
          doc.setFontSize(10);
          doc.text(`Month: ${monthNames[parseInt(monthFilter) - 1]}`, 18, yPos);
          yPos += 6;
        }
        
        if (dateFilter !== undefined) {
          doc.setFontSize(10);
          doc.text(`Date: ${dateFilter.toLocaleDateString()}`, 18, yPos);
          yPos += 6;
        }
        
        if (packageFilter) {
          doc.setFontSize(10);
          doc.text(`Package: ${packageFilter}`, 18, yPos);
          yPos += 6;
        }
        
        if (!showActiveOnly) {
          doc.setFontSize(10);
          doc.text('Including past bookings', 18, yPos);
          yPos += 10;
        } else {
          doc.setFontSize(10);
          doc.text('Only future bookings', 18, yPos);
          yPos += 10;
        }
      }
      
      // Add bookings table using autoTable from jspdf-autotable
      autoTable(doc, {
        startY: yPos,
        head: [['Name', 'Phone', 'Package', 'Date', 'Venue', 'Amount (₹)']],
        body: filteredBookings.map(booking => [
          booking.name,
          booking.phone,
          booking.packageType,
          formatDate(booking.date),
          `${booking.venue}, ${booking.city}`,
          booking.amount.toString()
        ]),
        headStyles: {
          fillColor: [18, 78, 102], // #124E66 in RGB
          textColor: [255, 255, 255],
          fontStyle: 'bold'
        },
        alternateRowStyles: {
          fillColor: [240, 240, 240]
        },
        margin: { top: 15 }
      });
      
      // Add summary
      const pageCount = doc.getNumberOfPages();
      const lastPage = pageCount;
      doc.setPage(lastPage);
      
      // Get the final Y position after the table
      let finalY = 280;
      try {
        // @ts-ignore - Access internal autoTable properties
        finalY = (doc as any).lastAutoTable?.finalY || 280;
      } catch (error) {
        console.error('Error accessing finalY:', error);
      }
      
      doc.setFontSize(11);
      doc.setTextColor(0);
      doc.text(`Total Bookings: ${filteredBookings.length}`, 14, finalY + 10);
      
      const totalAmount = filteredBookings.reduce((sum, booking) => sum + booking.amount, 0);
      doc.text(`Total Amount: ₹${totalAmount.toLocaleString()}`, 14, finalY + 20);
      
      // Add footer with page numbers
      for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setFontSize(10);
        doc.setTextColor(150);
        doc.text(`Page ${i} of ${pageCount}`, doc.internal.pageSize.getWidth() / 2, doc.internal.pageSize.getHeight() - 10, { align: 'center' });
        doc.text('Modern Band Booking System', 14, doc.internal.pageSize.getHeight() - 10);
      }
      
      doc.save(`bookings-report-${new Date().toISOString().split('T')[0]}.pdf`);
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('An error occurred while generating the PDF. Please make sure all required libraries are installed correctly.');
    }
  };

  // Use a callback that properly handles DatePicker's output type
  const handleDateSelect = React.useCallback((date: Date | Date[] | undefined) => {
    // Convert the potentially complex date object from DatePicker to a single Date or undefined
    if (date === undefined || date === null) {
      setDateFilter(undefined);
    } else if (Array.isArray(date)) {
      setDateFilter(date.length > 0 ? date[0] : undefined);
    } else {
      setDateFilter(date);
    }
    setDatePickerOpen(false);
  }, []);

  // Handle delete booking
  const handleDeleteBooking = async () => {
    if (!selectedBooking) return;
    
    try {
      setIsDeleting(true);
      console.log("Deleting booking with ID:", selectedBooking.id);
      
      try {
        // Make sure we're using the exact ID from the database
        const bookingId = String(selectedBooking.id).trim();
        console.log("Cleaned booking ID for deletion:", bookingId);
        
        const result = await deleteBooking(bookingId);
        console.log("Delete result:", result);
        
        // Close dialogs immediately after successful deletion
        setIsDeleteDialogOpen(false);
        setIsDialogOpen(false);
        
        // Refetch all bookings
        const data = await getBookings();
        console.log("Refetched bookings:", data);
        
        // Safely get bookings with type validation
        const updatedBookings = safelyGetBookings(data);
        
        // Update both state variables sequentially
        setBookings(updatedBookings);
        setFilteredBookings(updatedBookings); // Directly update filtered bookings
        
        // Then apply filters to the updated list
        applyFilters();
        
        // Show success message
        setSuccessMessage("Booking deleted successfully");
        setTimeout(() => setSuccessMessage(""), 3000);
      } catch (apiError) {
        console.error("API error details:", apiError);
        throw apiError;
      }
    } catch (error) {
      console.error('Error deleting booking:', error);
      setErrorMessage(error instanceof Error ? error.message : 'Failed to delete booking');
      
      // Leave dialogs open when there's an error so user can try again
    } finally {
      setIsDeleting(false);
    }
  };

  // Handle delete past bookings
  const handleDeletePastBookings = async () => {
    try {
      setIsDeleting(true);
      
      const response = await deletePastBookings();
      console.log("Delete past bookings result:", response);
      
      // Close dialog first
      setIsDeletePastDialogOpen(false);
      
      // Refetch all bookings
      const data = await getBookings();
      console.log("Refetched bookings after past deletion:", data);
      
      // Safely get bookings with type validation
      const updatedBookings = safelyGetBookings(data);
      
      // Update both state variables
      setBookings(updatedBookings);
      setFilteredBookings(updatedBookings); // Directly update filtered bookings
      
      // Apply filters
      applyFilters();
      
      // Show success message with count
      const deletedCount = response && typeof response === 'object' && 'deleted_count' in response
        ? response.deleted_count
        : 'Unknown number of';
      
      setSuccessMessage(`${deletedCount} past booking(s) deleted successfully`);
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (error) {
      console.error('Error deleting past bookings:', error);
      setErrorMessage(error instanceof Error ? error.message : 'Failed to delete past bookings');
    } finally {
      setIsDeleting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 relative">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Bookings</h1>
          <p className="text-gray-500 dark:text-gray-400">
            Manage and track all band bookings
          </p>
        </div>

        <div className="flex flex-wrap gap-2 w-full sm:w-auto">
          <Button 
            variant="outline" 
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-1 flex-1 sm:flex-none justify-center"
            size="sm"
          >
            <Filter className="h-4 w-4" />
            <span className="hidden sm:inline">{showFilters ? "Hide Filters" : "Show Filters"}</span>
            <span className="sm:hidden">Filters</span>
          </Button>
          
          <Button 
            variant="outline"
            onClick={() => setIsDeletePastDialogOpen(true)}
            className="flex items-center gap-1 border-red-200 text-red-600 hover:bg-red-50 flex-1 sm:flex-none justify-center"
            size="sm"
          >
            <Trash2 className="h-4 w-4" />
            <span className="hidden sm:inline">Delete Past Bookings</span>
            <span className="sm:hidden">Delete Past</span>
          </Button>
          
          <Button 
            onClick={downloadPDF}
            className="bg-[#124E66] hover:bg-[#124E66]/90 text-white flex items-center gap-1 flex-1 sm:flex-none justify-center"
            size="sm"
          >
            <Download className="h-4 w-4" />
            <span className="hidden sm:inline">Download PDF</span>
            <span className="sm:hidden">PDF</span>
          </Button>
        </div>
      </div>

      {/* Success message */}
      {successMessage && (
        <div className="bg-green-50 border border-green-200 text-green-700 p-4 rounded-md">
          {successMessage}
        </div>
      )}

      {/* Error message */}
      {errorMessage && (
        <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-md">
          {errorMessage}
        </div>
      )}

      {/* Filters */}
      {showFilters && (
        <Card className="border border-gray-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Filter Bookings</CardTitle>
            <CardDescription>Use the options below to filter the booking list</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="nameFilter">Customer Name</Label>
                <div className="relative">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
                  <Input
                    id="nameFilter"
                    placeholder="Filter by name"
                    value={nameFilter}
                    onChange={(e) => setNameFilter(e.target.value)}
                    className="pl-8"
                  />
                  {nameFilter && (
                    <button 
                      onClick={() => setNameFilter("")}
                      className="absolute right-2 top-2.5"
                    >
                      <X className="h-4 w-4 text-gray-500" />
                    </button>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="phoneFilter">Phone Number</Label>
                <div className="relative">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
                  <Input
                    id="phoneFilter"
                    placeholder="Filter by phone"
                    value={phoneFilter}
                    onChange={(e) => setPhoneFilter(e.target.value)}
                    className="pl-8"
                  />
                  {phoneFilter && (
                    <button 
                      onClick={() => setPhoneFilter("")}
                      className="absolute right-2 top-2.5"
                    >
                      <X className="h-4 w-4 text-gray-500" />
                    </button>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="monthFilter">Month</Label>
                <Select 
                  value={monthFilter || "all"} 
                  onValueChange={(value) => setMonthFilter(value === "all" ? null : value)}
                >
                  <SelectTrigger id="monthFilter">
                    <SelectValue placeholder="Select month" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All months</SelectItem>
                    <SelectItem value="1">January</SelectItem>
                    <SelectItem value="2">February</SelectItem>
                    <SelectItem value="3">March</SelectItem>
                    <SelectItem value="4">April</SelectItem>
                    <SelectItem value="5">May</SelectItem>
                    <SelectItem value="6">June</SelectItem>
                    <SelectItem value="7">July</SelectItem>
                    <SelectItem value="8">August</SelectItem>
                    <SelectItem value="9">September</SelectItem>
                    <SelectItem value="10">October</SelectItem>
                    <SelectItem value="11">November</SelectItem>
                    <SelectItem value="12">December</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="dateFilter">Specific Date</Label>
                <Popover open={datePickerOpen} onOpenChange={setDatePickerOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      variant={"outline"}
                      className={`w-full justify-start text-left font-normal ${
                        dateFilter === undefined && "text-muted-foreground"
                      }`}
                    >
                      <Calendar className="mr-2 h-4 w-4" />
                      {dateFilter !== undefined ? format(dateFilter, "PPP") : "Pick a date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <DatePicker
                      mode="single"
                      selected={dateFilter}
                      onSelect={handleDateSelect}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div className="space-y-2">
                <Label htmlFor="packageFilter">Package Type</Label>
                <Select 
                  value={packageFilter || "all"} 
                  onValueChange={(value) => setPackageFilter(value === "all" ? null : value)}
                >
                  <SelectTrigger id="packageFilter">
                    <SelectValue placeholder="Select package" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All packages</SelectItem>
                    {getPackageTypes().map(packageType => (
                      <SelectItem key={packageType} value={packageType}>
                        {packageType}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2 flex items-end">
                <div className="flex items-center space-x-2">
                  <Switch
                    id="activeOnly"
                    checked={showActiveOnly}
                    onCheckedChange={(checked) => setShowActiveOnly(checked)}
                  />
                  <Label htmlFor="activeOnly">Show only future bookings</Label>
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between border-t pt-6">
            <div className="text-sm text-gray-500">
              Showing {filteredBookings.length} of {bookings.length} bookings
            </div>
            <Button variant="outline" onClick={resetFilters}>
              Reset Filters
            </Button>
          </CardFooter>
        </Card>
      )}

      <div className="grid gap-6">
        {filteredBookings.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <p className="text-gray-500 dark:text-gray-400">No bookings found</p>
            </CardContent>
          </Card>
        ) : (
          filteredBookings.map((booking, index) => (
            <Card key={index} className="overflow-hidden hover:shadow-md transition-shadow cursor-pointer" onClick={() => handleViewDetails(booking)}>
              <CardHeader className="bg-gray-50 dark:bg-gray-800 pb-4">
                <CardTitle className="flex items-center justify-between">
                  <span>{booking.name}</span>
                  <Badge className="text-sm px-3 py-1 bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300">
                    {booking.packageType}
                  </Badge>
                </CardTitle>
                <CardDescription>Booking ID: {booking.id}</CardDescription>
              </CardHeader>
              <CardContent className="pt-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-5 w-5 text-gray-500" />
                    <div>
                      <p className="text-sm font-medium">Date</p>
                      <p className="text-sm text-gray-500">{formatDate(booking.date)}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-5 w-5 text-gray-500" />
                    <div>
                      <p className="text-sm font-medium">Time</p>
                      <p className="text-sm text-gray-500">{booking.time || booking.bandTime || 'Not specified'}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="h-5 w-5 text-gray-500" />
                    <div>
                      <p className="text-sm font-medium">Location</p>
                      <p className="text-sm text-gray-500">{booking.city}, {booking.venue}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <DollarSign className="h-5 w-5 text-gray-500" />
                    <div>
                      <p className="text-sm font-medium">Amount</p>
                      <p className="text-sm text-gray-500">₹{booking.amount}</p>
                    </div>
                  </div>
                </div>
                <div className="mt-4 border-t pt-4">
                  <p className="text-sm font-medium">Contact Info</p>
                  <p className="text-sm text-gray-500">{booking.email} | {booking.phone}</p>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Booking Details Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          {selectedBooking && (
            <>
              <DialogHeader>
                <DialogTitle className="text-xl flex justify-between items-center">
                  <span>Booking Details</span>
                  <Badge className="ml-4 px-3 py-1 bg-blue-100 text-blue-800">
                    {selectedBooking.packageType}
                  </Badge>
                </DialogTitle>
                <DialogDescription>
                  Booking ID: {selectedBooking.id}
                  {selectedBooking.createdAt && (
                    <span className="ml-4">Created: {formatDate(selectedBooking.createdAt)}</span>
                  )}
                </DialogDescription>
              </DialogHeader>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                {/* Customer Details */}
                <div className="space-y-4">
                  <h3 className="font-semibold text-lg border-b pb-2">Customer Information</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-500">Name:</span>
                      <span className="font-medium">{selectedBooking.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Email:</span>
                      <span className="font-medium">{selectedBooking.email}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Phone:</span>
                      <span className="font-medium">{selectedBooking.phone}</span>
                    </div>
                    {selectedBooking.additionalPhone && (
                      <div className="flex justify-between">
                        <span className="text-gray-500">Additional Phone:</span>
                        <span className="font-medium">{selectedBooking.additionalPhone}</span>
                      </div>
                    )}
                  </div>
                </div>
                
                {/* Event Details */}
                <div className="space-y-4">
                  <h3 className="font-semibold text-lg border-b pb-2">Event Information</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-500">Date:</span>
                      <span className="font-medium">{formatDate(selectedBooking.date)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Package:</span>
                      <span className="font-medium">{selectedBooking.packageType}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Venue:</span>
                      <span className="font-medium">{selectedBooking.venue}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">City:</span>
                      <span className="font-medium">{selectedBooking.city}</span>
                    </div>
                    {selectedBooking.bandTime && (
                      <div className="flex justify-between">
                        <span className="text-gray-500">Band Time:</span>
                        <span className="font-medium">{selectedBooking.bandTime}</span>
                      </div>
                    )}
                    {selectedBooking.customTimeSlot && (
                      <div className="flex justify-between">
                        <span className="text-gray-500">Custom Time:</span>
                        <span className="font-medium">{selectedBooking.customTimeSlot}</span>
                      </div>
                    )}
                  </div>
                </div>
                
                {/* Payment Details */}
                <div className="space-y-4">
                  <h3 className="font-semibold text-lg border-b pb-2">Payment Information</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-500">Total Amount:</span>
                      <span className="font-medium">₹{selectedBooking.amount}</span>
                    </div>
                    {selectedBooking.advancePayment !== undefined && (
                      <>
                        <div className="flex justify-between">
                          <span className="text-gray-500">Advance Payment:</span>
                          <span className="font-medium">₹{selectedBooking.advancePayment}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500">Balance Due:</span>
                          <span className="font-medium">₹{selectedBooking.amount - selectedBooking.advancePayment}</span>
                        </div>
                      </>
                    )}
                    {selectedBooking.fireworksAmount && (
                      <div className="flex justify-between">
                        <span className="text-gray-500">Fireworks Amount:</span>
                        <span className="font-medium">₹{selectedBooking.fireworksAmount}</span>
                      </div>
                    )}
                  </div>
                </div>
                
                {/* Additional Features */}
                <div className="space-y-4">
                  <h3 className="font-semibold text-lg border-b pb-2">Additional Features</h3>
                  <div className="space-y-2">
                    <div className="grid grid-cols-2 gap-2">
                      <div className="flex items-center">
                        <div className={`w-4 h-4 rounded-full mr-2 ${selectedBooking.ghodiForBaraat ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                        <span>Ghodi for Baraat</span>
                      </div>
                      <div className="flex items-center">
                        <div className={`w-4 h-4 rounded-full mr-2 ${selectedBooking.fireworks ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                        <span>Fireworks</span>
                      </div>
                      <div className="flex items-center">
                        <div className={`w-4 h-4 rounded-full mr-2 ${selectedBooking.flowerCanon ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                        <span>Flower Canon</span>
                      </div>
                      <div className="flex items-center">
                        <div className={`w-4 h-4 rounded-full mr-2 ${selectedBooking.DoliForVidai ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                        <span>Doli for Vidai</span>
                      </div>
                    </div>
                    
                    {selectedBooking.numberOfPeople && (
                      <div className="flex justify-between mt-2">
                        <span className="text-gray-500">Number of People:</span>
                        <span className="font-medium">{selectedBooking.numberOfPeople}</span>
                      </div>
                    )}
                    
                    {selectedBooking.numberOfLights && (
                      <div className="flex justify-between">
                        <span className="text-gray-500">Number of Lights:</span>
                        <span className="font-medium">{selectedBooking.numberOfLights}</span>
                      </div>
                    )}
                    
                    {selectedBooking.numberOfDhols && (
                      <div className="flex justify-between">
                        <span className="text-gray-500">Number of Dhols:</span>
                        <span className="font-medium">{selectedBooking.numberOfDhols}</span>
                      </div>
                    )}
                    
                    {!selectedBooking.ghodiForBaraat && selectedBooking.ghodaBaggi && (
                      <div className="flex justify-between">
                        <span className="text-gray-500">Ghoda Baggi:</span>
                        <span className="font-medium">{selectedBooking.ghodaBaggi}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              
              {selectedBooking.customization && (
                <div className="mt-6 border-t pt-4">
                  <h3 className="font-semibold text-lg mb-2">Additional Requests</h3>
                  <div className="bg-gray-50 p-4 rounded-md">
                    <p className="text-gray-700">{selectedBooking.customization}</p>
                  </div>
                </div>
              )}
              
              <DialogFooter className="mt-6 pt-4 border-t flex justify-between">
                <Button 
                  variant="destructive" 
                  onClick={() => setIsDeleteDialogOpen(true)}
                  className="bg-red-600 hover:bg-red-700"
                >
                  Delete Booking
                </Button>
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Close</Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Booking Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Booking?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this booking? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteBooking}
              disabled={isDeleting}
              className="bg-red-600 hover:bg-red-700"
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Delete Past Bookings Confirmation Dialog */}
      <AlertDialog open={isDeletePastDialogOpen} onOpenChange={setIsDeletePastDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete All Past Bookings?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete all bookings with event dates in the past. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeletePastBookings}
              disabled={isDeleting}
              className="bg-red-600 hover:bg-red-700"
            >
              {isDeleting ? "Deleting..." : "Delete Past Bookings"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
} 