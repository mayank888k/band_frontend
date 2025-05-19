"use client";

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { format } from 'date-fns';
import { 
  Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter 
} from '@/components/ui/card';
import { 
  Form, FormControl, FormField, FormItem, FormLabel, FormMessage 
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { 
  Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow 
} from '@/components/ui/table';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Loader2, User, Phone, Mail, Download, Building, Calendar, IndianRupee } from 'lucide-react';
import { getEmployeeDetails } from '@/lib/api';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

// Define types for Employee and Payment
interface Employee {
  id: number;
  name: string;
  username: string;
  email: string;
  mobileNumber: string;
  address: string;
  totalAmountToBePaid: number;
  totalAmountPaidInAdvance: number;
  isEmployee: boolean;
  createdAt?: string;
  updatedAt?: string;
  payments?: Payment[];
}

interface Payment {
  id: number;
  amountPaid: number;
  date: string;
  employeeId: number;
  createdAt?: string;
}

// Schema for the username search form
const searchSchema = z.object({
  username: z.string().min(1, 'Username is required')
});

export default function EmployeePage() {
  const [employee, setEmployee] = useState<Employee | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isPdfGenerating, setIsPdfGenerating] = useState(false);
  
  // Initialize form with schema validation
  const form = useForm<z.infer<typeof searchSchema>>({
    resolver: zodResolver(searchSchema),
    defaultValues: {
      username: '',
    },
  });

  // Handler for form submission
  const onSubmit = async (values: z.infer<typeof searchSchema>) => {
    setIsLoading(true);
    setError(null);
    setEmployee(null);
    
    try {
      const response = await getEmployeeDetails(values.username);
      setEmployee(response as unknown as Employee);
    } catch (err: any) {
      setError(err.message || 'Error fetching employee details');
    } finally {
      setIsLoading(false);
    }
  };

  // Calculate totals for the employee
  const calculateTotals = (emp: Employee) => {
    if (!emp || !emp.payments) return { totalPaid: 0, totalWithAdvance: 0, remaining: 0 };
    
    const totalPaid = emp.payments.reduce((acc: number, payment: Payment) => acc + payment.amountPaid, 0);
    const totalWithAdvance = totalPaid + (emp.totalAmountPaidInAdvance || 0);
    const remaining = (emp.totalAmountToBePaid || 0) - totalWithAdvance;
    
    return { totalPaid, totalWithAdvance, remaining };
  };

  // Generate PDF report for employee details
  const generateEmployeePDF = () => {
    if (!employee) return;
    
    setIsPdfGenerating(true);
    
    try {
      const doc = new jsPDF();
      
      // Add title
      doc.setFontSize(18);
      doc.text('Employee Details Report', 14, 22);
      
      // Add subtitle with employee name and date
      doc.setFontSize(11);
      doc.setTextColor(100);
      doc.text(`Generated on ${format(new Date(), 'PPP')}`, 14, 30);
      doc.text(`Employee: ${employee.name} (${employee.username})`, 14, 38);
      
      // Reset text color
      doc.setTextColor(0);
      
      // Add employee personal information
      doc.setFontSize(14);
      doc.text('Personal Information', 14, 50);
      
      // Employee info table
      autoTable(doc, {
        startY: 55,
        head: [['Field', 'Details']],
        body: [
          ['Name', employee.name],
          ['Username', employee.username],
          ['Email', employee.email],
          ['Mobile Number', employee.mobileNumber],
          ['Address', employee.address],
          ['Date Joined', employee.createdAt ? format(new Date(employee.createdAt), 'PPP') : 'N/A']
        ],
        headStyles: {
          fillColor: [41, 128, 185],
          textColor: [255, 255, 255],
          fontStyle: 'bold'
        },
        theme: 'striped',
        margin: { left: 14, right: 14 }
      });
      
      // Get position after the table
      let yPos = (doc as any).lastAutoTable.finalY + 15;
      
      // Financial information
      doc.setFontSize(14);
      doc.text('Financial Information', 14, yPos);
      
      const { totalPaid, totalWithAdvance, remaining } = calculateTotals(employee);
      
      // Financial table
      autoTable(doc, {
        startY: yPos + 5,
        head: [['Category', 'Amount (₹)']],
        body: [
          ['Total to be Paid', employee.totalAmountToBePaid.toFixed(2)],
          ['Advance Payment', employee.totalAmountPaidInAdvance.toFixed(2)],
          ['Total Paid', totalWithAdvance.toFixed(2)],
          ['Remaining Balance', remaining.toFixed(2)]
        ],
        headStyles: {
          fillColor: [41, 128, 185],
          textColor: [255, 255, 255],
          fontStyle: 'bold'
        },
        bodyStyles: {
          halign: 'left'
        },
        columnStyles: {
          1: { halign: 'right' }
        },
        theme: 'striped',
        margin: { left: 14, right: 14 }
      });
      
      // Get position after financial table
      yPos = (doc as any).lastAutoTable.finalY + 15;
      
      // Payment history
      doc.setFontSize(14);
      doc.text('Payment History', 14, yPos);
      
      if (employee.payments && employee.payments.length > 0) {
        // Payment history table
        autoTable(doc, {
          startY: yPos + 5,
          head: [['Date', 'Amount (₹)']],
          body: employee.payments.map((payment: Payment) => [
            format(new Date(payment.date), 'PPP'),
            payment.amountPaid.toFixed(2)
          ]),
          headStyles: {
            fillColor: [41, 128, 185],
            textColor: [255, 255, 255],
            fontStyle: 'bold'
          },
          columnStyles: {
            1: { halign: 'right' }
          },
          theme: 'striped',
          margin: { left: 14, right: 14 }
        });
      } else {
        doc.setFontSize(10);
        doc.text('No payment records found', 14, yPos + 10);
      }
      
      // Add footer with page numbers
      const pageCount = doc.getNumberOfPages();
      for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setFontSize(10);
        doc.setTextColor(150);
        doc.text(`Page ${i} of ${pageCount}`, doc.internal.pageSize.getWidth() / 2, doc.internal.pageSize.getHeight() - 10, { align: 'center' });
        doc.text('Confidential - For Internal Use Only', 14, doc.internal.pageSize.getHeight() - 10);
      }
      
      // Save the PDF
      doc.save(`${employee.username}_employee_report.pdf`);
      
    } catch (err) {
      console.error('Error generating PDF:', err);
      setError(`Failed to generate PDF: ${err instanceof Error ? err.message : 'Unknown error'}`);
    } finally {
      setIsPdfGenerating(false);
    }
  };

  const { totalPaid, totalWithAdvance, remaining } = employee ? calculateTotals(employee) : { totalPaid: 0, totalWithAdvance: 0, remaining: 0 };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Employee Details</h1>
      
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Search Employee</CardTitle>
          <CardDescription>Enter an employee username to view their details</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Username</FormLabel>
                    <FormControl>
                      <div className="flex gap-2">
                        <Input placeholder="Enter username" {...field} />
                        <Button 
                          type="submit" 
                          disabled={isLoading}
                          className="whitespace-nowrap"
                        >
                          {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : 'Search'}
                        </Button>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </form>
          </Form>
        </CardContent>
      </Card>

      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {employee && (
        <div id="employee-details" className="space-y-6">
          <div className="flex justify-end mb-2">
            <Button 
              onClick={generateEmployeePDF} 
              disabled={isPdfGenerating}
              variant="outline"
              className="flex items-center gap-2"
            >
              {isPdfGenerating ? <Loader2 className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />}
              Download PDF
            </Button>
          </div>
          
          <Card className="shadow-md">
            <CardHeader className="bg-primary/5">
              <CardTitle className="flex items-center gap-2 text-primary">
                <User className="h-5 w-5" />
                Employee Information
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground">Name</h4>
                    <p className="text-lg font-medium">{employee.name}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground">Username</h4>
                    <p>{employee.username}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <p>{employee.mobileNumber}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <p>{employee.email}</p>
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground">Address</h4>
                    <p className="flex items-start gap-2">
                      <Building className="h-4 w-4 text-muted-foreground mt-1" />
                      <span>{employee.address}</span>
                    </p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground">Date Joined</h4>
                    <p className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span>{employee.createdAt ? format(new Date(employee.createdAt), 'PPP') : 'N/A'}</span>
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-md">
            <CardHeader className="bg-primary/5">
              <CardTitle className="flex items-center gap-2 text-primary">
                <IndianRupee className="h-5 w-5" />
                Financial Information
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-primary/5 p-4 rounded-lg">
                  <h4 className="text-sm font-medium text-muted-foreground">Total to be Paid</h4>
                  <p className="text-2xl font-bold">₹{employee.totalAmountToBePaid.toFixed(2)}</p>
                </div>
                <div className="bg-green-50 p-4 rounded-lg">
                  <h4 className="text-sm font-medium text-muted-foreground">Total Paid</h4>
                  <p className="text-2xl font-bold text-green-600">₹{totalWithAdvance.toFixed(2)}</p>
                </div>
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h4 className="text-sm font-medium text-muted-foreground">Advance Payment</h4>
                  <p className="text-2xl font-bold text-blue-600">₹{employee.totalAmountPaidInAdvance.toFixed(2)}</p>
                </div>
                <div className="bg-amber-50 p-4 rounded-lg">
                  <h4 className="text-sm font-medium text-muted-foreground">Remaining</h4>
                  <p className="text-2xl font-bold text-amber-600">₹{remaining.toFixed(2)}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-md">
            <CardHeader className="bg-primary/5">
              <CardTitle className="flex items-center gap-2 text-primary">
                Payment History
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              {employee.payments && employee.payments.length > 0 ? (
                <ScrollArea className="h-[300px] w-full rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Date</TableHead>
                        <TableHead>Amount</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {employee.payments.map((payment) => (
                        <TableRow key={payment.id}>
                          <TableCell className="font-medium">
                            {format(new Date(payment.date), 'PPP')}
                          </TableCell>
                          <TableCell>₹{payment.amountPaid.toFixed(2)}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                    <TableCaption>
                      Total payments: {employee.payments.length}
                    </TableCaption>
                  </Table>
                </ScrollArea>
              ) : (
                <div className="text-center py-6 text-muted-foreground">
                  No payment records found
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
} 