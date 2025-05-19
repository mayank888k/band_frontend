"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { User, Phone, Mail, DollarSign, Filter, X, Search, Plus, Trash2, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
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
import { format } from "date-fns";
import { DatePicker } from "@/components/ui/date-picker";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { getEmployees, getEmployeeDetails, deleteEmployee, addPayment, deletePayment } from "@/lib/api";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import React from "react";

// Define type for Employee
interface Employee {
  id: string;
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
  role?: string;
}

// Define type for Payment
interface Payment {
  id: string;
  amountPaid: number;
  date: string;
  employeeId: string;
  createdAt?: string;
}

// Payment form schema
const paymentSchema = z.object({
  amountPaid: z.coerce.number().min(1, "Amount must be greater than 0"),
  date: z.date({ required_error: "Date is required" }),
});

export default function EmployeesPage() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [filteredEmployees, setFilteredEmployees] = useState<Employee[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isDeletePaymentDialogOpen, setIsDeletePaymentDialogOpen] = useState(false);
  const [selectedPaymentId, setSelectedPaymentId] = useState<string | null>(null);
  const [isFormLoading, setIsFormLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  
  // Filters
  const [nameFilter, setNameFilter] = useState("");
  const [usernameFilter, setUsernameFilter] = useState("");
  const [phoneFilter, setPhoneFilter] = useState("");
  
  // Payment form
  const paymentForm = useForm({
    resolver: zodResolver(paymentSchema),
    defaultValues: {
      amountPaid: 0,
      date: new Date(),
    },
  });

  // Get authentication token
  const getAuthToken = () => {
    const adminTokenStr = localStorage.getItem('adminToken');
    if (!adminTokenStr) {
      throw new Error('You must be logged in as admin');
    }

    try {
      const tokenData = JSON.parse(adminTokenStr);
      const token = tokenData.token || tokenData.username;
      
      if (!token) {
        throw new Error('Invalid admin token');
      }
      
      return token;
    } catch (e) {
      throw new Error('Invalid admin token. Please log in again.');
    }
  };

  // Fetch all employees
  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        setIsLoading(true);
        const token = getAuthToken();
        const data = await getEmployees(token);
        // Cast the API response to the correct type
        setEmployees(data.employees as Employee[] || []);
        setFilteredEmployees(data.employees as Employee[] || []);
      } catch (error) {
        console.error('Error fetching employees:', error);
        setErrorMessage(error instanceof Error ? error.message : 'Failed to fetch employees');
      } finally {
        setIsLoading(false);
      }
    };

    fetchEmployees();
  }, []);

  // Filter employees when filter values change
  useEffect(() => {
    const filtered = employees.filter(employee => {
      const nameMatch = nameFilter === "" || employee.name.toLowerCase().includes(nameFilter.toLowerCase());
      const usernameMatch = usernameFilter === "" || employee.username.toLowerCase().includes(usernameFilter.toLowerCase());
      const phoneMatch = phoneFilter === "" || employee.mobileNumber.includes(phoneFilter);
      
      return nameMatch && usernameMatch && phoneMatch;
    });
    
    setFilteredEmployees(filtered);
  }, [nameFilter, usernameFilter, phoneFilter, employees]);

  // Reset filters
  const resetFilters = () => {
    setNameFilter("");
    setUsernameFilter("");
    setPhoneFilter("");
  };

  // Open employee details modal
  const handleViewDetails = async (employee: Employee) => {
    try {
      setErrorMessage("");
      const token = getAuthToken();
      const data = await getEmployeeDetails(employee.username, token);
      
      // The response is the employee object directly
      setSelectedEmployee(data as unknown as Employee);
      setIsDetailsOpen(true);
    } catch (error) {
      console.error('Error fetching employee details:', error);
      setErrorMessage(error instanceof Error ? error.message : 'Failed to fetch employee details');
    }
  };

  // Handle employee deletion
  const handleDeleteEmployee = async () => {
    if (!selectedEmployee) return;
    
    try {
      setIsFormLoading(true);
      setErrorMessage("");
      
      const token = getAuthToken();
      await deleteEmployee(selectedEmployee.username, token);
      
      // Update employees list
      setEmployees(prevEmployees => 
        prevEmployees.filter(emp => emp.username !== selectedEmployee.username)
      );
      
      // Close dialogs
      setIsDeleteDialogOpen(false);
      setIsDetailsOpen(false);
      
      setSuccessMessage("Employee deleted successfully");
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (error) {
      console.error('Error deleting employee:', error);
      setErrorMessage(error instanceof Error ? error.message : 'Failed to delete employee');
    } finally {
      setIsFormLoading(false);
    }
  };

  // Handle payment addition
  const handleAddPayment = async (values: z.infer<typeof paymentSchema>) => {
    if (!selectedEmployee) return;
    
    try {
      setIsFormLoading(true);
      setErrorMessage("");
      
      const token = getAuthToken();
      const paymentData = {
        amountPaid: values.amountPaid,
        date: format(values.date, 'yyyy-MM-dd')
      };
      
      await addPayment(selectedEmployee.username, paymentData, token);
      
      // Refresh employee details to include the new payment
      const updatedData = await getEmployeeDetails(selectedEmployee.username, token);
      setSelectedEmployee(updatedData as unknown as Employee);
      
      // Reset form
      paymentForm.reset({
        amountPaid: 0,
        date: new Date(),
      });
      
      setSuccessMessage("Payment added successfully");
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (error) {
      console.error('Error adding payment:', error);
      setErrorMessage(error instanceof Error ? error.message : 'Failed to add payment');
    } finally {
      setIsFormLoading(false);
    }
  };

  // Handle payment deletion
  const handleDeletePayment = async () => {
    if (!selectedEmployee || selectedPaymentId === null) return;
    
    try {
      setIsFormLoading(true);
      setErrorMessage("");
      
      const token = getAuthToken();
      await deletePayment(selectedEmployee.username, selectedPaymentId, token);
      
      // Refresh employee details to update payments list
      const updatedData = await getEmployeeDetails(selectedEmployee.username, token);
      setSelectedEmployee(updatedData as unknown as Employee);
      
      // Close dialog
      setIsDeletePaymentDialogOpen(false);
      
      setSuccessMessage("Payment deleted successfully");
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (error) {
      console.error('Error deleting payment:', error);
      setErrorMessage(error instanceof Error ? error.message : 'Failed to delete payment');
    } finally {
      setIsFormLoading(false);
    }
  };

  // Calculate total amount paid (advance + all payments)
  const getTotalPaid = (employee: Employee) => {
    const advancePaid = employee.totalAmountPaidInAdvance || 0;
    const paymentSum = employee.payments 
      ? employee.payments.reduce((sum, payment) => sum + payment.amountPaid, 0) 
      : 0;
    
    return advancePaid + paymentSum;
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
          <h1 className="text-3xl font-bold tracking-tight">Employees</h1>
          <p className="text-gray-500 dark:text-gray-400">
            Manage your band members and staff
          </p>
        </div>

        <div className="flex w-full sm:w-auto">
          <Button 
            variant="outline" 
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-1 w-full sm:w-auto justify-center"
            size="sm"
          >
            <Filter className="h-4 w-4" />
            <span className="hidden sm:inline">{showFilters ? "Hide Filters" : "Show Filters"}</span>
            <span className="sm:hidden">Filters</span>
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
            <CardTitle className="text-lg">Filter Employees</CardTitle>
            <CardDescription>Use the options below to filter the employee list</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="nameFilter">Name</Label>
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
                <Label htmlFor="usernameFilter">Username</Label>
                <div className="relative">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
                  <Input
                    id="usernameFilter"
                    placeholder="Filter by username"
                    value={usernameFilter}
                    onChange={(e) => setUsernameFilter(e.target.value)}
                    className="pl-8"
                  />
                  {usernameFilter && (
                    <button 
                      onClick={() => setUsernameFilter("")}
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
            </div>
          </CardContent>
          <CardFooter className="flex justify-between border-t pt-6">
            <div className="text-sm text-gray-500">
              Showing {filteredEmployees.length} of {employees.length} employees
            </div>
            <Button variant="outline" onClick={resetFilters}>
              Reset Filters
            </Button>
          </CardFooter>
        </Card>
      )}

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {filteredEmployees.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <p className="text-gray-500 dark:text-gray-400">No employees found</p>
            </CardContent>
          </Card>
        ) : (
          filteredEmployees.map((employee, index) => (
            <Card key={index} className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => handleViewDetails(employee)}>
              <CardHeader>
                <CardTitle>{employee.name}</CardTitle>
                <CardDescription>{employee.role || 'Band Member'}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-gray-500" />
                    <span className="text-sm">{employee.username}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-gray-500" />
                    <span className="text-sm">{employee.mobileNumber}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-gray-500" />
                    <span className="text-sm">{employee.email}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <DollarSign className="h-4 w-4 text-gray-500" />
                    <span className="text-sm">₹{employee.totalAmountToBePaid || 0}</span>
                  </div>
                  <div className="mt-2 pt-2 border-t">
                    <div className="text-sm">
                      <span className="font-medium">Advance Paid: </span>
                      <span>₹{employee.totalAmountPaidInAdvance || 0}</span>
                    </div>
                    <div className="text-sm text-blue-600 mt-1">
                      <span className="italic">Click for detailed payment info</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Employee Details Dialog */}
      <Dialog open={isDetailsOpen} onOpenChange={(open) => !isFormLoading && setIsDetailsOpen(open)}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          {selectedEmployee && (
            <>
              <DialogHeader>
                <DialogTitle className="text-xl">Employee Details</DialogTitle>
                <DialogDescription>
                  View and manage details for {selectedEmployee.name}
                </DialogDescription>
              </DialogHeader>

              {errorMessage && (
                <div className="bg-red-50 border border-red-200 text-red-700 p-3 rounded-md text-sm">
                  {errorMessage}
                </div>
              )}

              {/* Employee Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                <div className="space-y-4">
                  <h3 className="font-semibold text-lg border-b pb-2">Personal Information</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-500">Name:</span>
                      <span className="font-medium">{selectedEmployee.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Username:</span>
                      <span className="font-medium">{selectedEmployee.username}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Email:</span>
                      <span className="font-medium">{selectedEmployee.email}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Phone:</span>
                      <span className="font-medium">{selectedEmployee.mobileNumber}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Address:</span>
                      <span className="font-medium">{selectedEmployee.address}</span>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <h3 className="font-semibold text-lg border-b pb-2">Payment Information</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-500">Total Amount:</span>
                      <span className="font-medium">₹{selectedEmployee.totalAmountToBePaid}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Advance Payment:</span>
                      <span className="font-medium">₹{selectedEmployee.totalAmountPaidInAdvance}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Other Payments:</span>
                      <span className="font-medium">
                        ₹{selectedEmployee.payments?.reduce((sum, payment) => sum + payment.amountPaid, 0) || 0}
                      </span>
                    </div>
                    <div className="flex justify-between pt-2 border-t border-gray-200">
                      <span className="text-gray-500 font-semibold">Total Paid:</span>
                      <span className="font-semibold text-green-600">
                        ₹{getTotalPaid(selectedEmployee)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500 font-semibold">Remaining:</span>
                      <span className="font-semibold text-amber-600">
                        ₹{Math.max(0, selectedEmployee.totalAmountToBePaid - getTotalPaid(selectedEmployee))}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Add Payment Form */}
              <div className="mt-6 border-t pt-4">
                <h3 className="font-semibold text-lg mb-4">Add Payment</h3>
                <Form {...paymentForm}>
                  <form onSubmit={paymentForm.handleSubmit(handleAddPayment)} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={paymentForm.control}
                        name="amountPaid"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Amount</FormLabel>
                            <FormControl>
                              <Input 
                                type="number" 
                                placeholder="Enter payment amount" 
                                {...field} 
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={paymentForm.control}
                        name="date"
                        render={({ field }) => {
                          const [open, setOpen] = React.useState(false);
                          return (
                          <FormItem className="flex flex-col">
                            <FormLabel>Date</FormLabel>
                            <Popover open={open} onOpenChange={setOpen}>
                              <PopoverTrigger asChild>
                                <FormControl>
                                  <Button
                                    variant={"outline"}
                                    className={`w-full pl-3 text-left font-normal ${
                                      !field.value && "text-muted-foreground"
                                    }`}
                                  >
                                    {field.value ? (
                                      format(field.value, "PPP")
                                    ) : (
                                      <span>Pick a date</span>
                                    )}
                                    <Calendar className="ml-auto h-4 w-4 opacity-50" />
                                  </Button>
                                </FormControl>
                              </PopoverTrigger>
                              <PopoverContent className="w-auto p-0" align="start">
                                <DatePicker
                                  mode="single"
                                  selected={field.value}
                                  onSelect={(date) => {
                                    field.onChange(date);
                                    setOpen(false);
                                  }}
                                  initialFocus
                                />
                              </PopoverContent>
                            </Popover>
                            <FormMessage />
                          </FormItem>
                          );
                        }}
                      />
                    </div>
                    <Button type="submit" disabled={isFormLoading}>
                      {isFormLoading ? "Processing..." : "Add Payment"}
                    </Button>
                  </form>
                </Form>
              </div>

              {/* Payment History */}
              <div className="mt-6 border-t pt-4">
                <h3 className="font-semibold text-lg mb-4">Payment History</h3>
                {selectedEmployee.payments && selectedEmployee.payments.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left py-2">Date</th>
                          <th className="text-right py-2">Amount</th>
                          <th className="text-right py-2">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {selectedEmployee.payments.map((payment) => (
                          <tr key={payment.id} className="border-b">
                            <td className="py-2">
                              {payment.date ? new Date(payment.date).toLocaleDateString() : "N/A"}
                            </td>
                            <td className="text-right py-2">₹{payment.amountPaid}</td>
                            <td className="text-right py-2">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setSelectedPaymentId(payment.id);
                                  setIsDeletePaymentDialogOpen(true);
                                }}
                                className="h-8 w-8 p-0 text-red-600"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <p className="text-gray-500">No payment records found</p>
                )}
              </div>

              <DialogFooter className="gap-2 mt-6 pt-2 border-t">
                <Button 
                  variant="primary" 
                  onClick={() => setIsDeleteDialogOpen(true)}
                  disabled={isFormLoading}
                  className="bg-red-600 hover:bg-red-700 text-white"
                >
                  Delete Employee
                </Button>
                <Button variant="outline" onClick={() => setIsDetailsOpen(false)} disabled={isFormLoading}>
                  Close
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Employee Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the employee and all their payment records. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isFormLoading}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteEmployee}
              disabled={isFormLoading}
              className="bg-red-600 hover:bg-red-700"
            >
              {isFormLoading ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Delete Payment Confirmation Dialog */}
      <AlertDialog open={isDeletePaymentDialogOpen} onOpenChange={setIsDeletePaymentDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Payment?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete this payment record. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isFormLoading}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeletePayment}
              disabled={isFormLoading}
              className="bg-red-600 hover:bg-red-700"
            >
              {isFormLoading ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
} 