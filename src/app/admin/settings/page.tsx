"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { UserPlus, Users, Check, AlertCircle } from "lucide-react";
import { updateAdmin, saveEmployee } from "@/lib/api";

// Form schema for admin user creation
const adminUserSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters"),
  email: z.string()
    .min(1, "Email is required")
    .email("Please enter a valid email address")
    .regex(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, "Invalid email format"),
  mobileNumber: z.string()
    .min(1, "Mobile number is required")
    .regex(/^[0-9]{10}$/, "Mobile number must be exactly 10 digits"),
  username: z.string().min(3, "Username must be at least 3 characters"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

// Form schema for employee creation - based on backend CreateEmployeeRequest
const employeeSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters"),
  mobileNumber: z.string()
    .min(1, "Mobile number is required")
    .regex(/^[0-9]{10}$/, "Mobile number must be exactly 10 digits"),
  email: z.string()
    .min(1, "Email is required")
    .email("Please enter a valid email address")
    .regex(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, "Invalid email format"),
  address: z.string().min(5, "Please enter a valid address"),
  totalAmountToBePaid: z.coerce.number().min(0, "Amount must be 0 or greater"),
  totalAmountPaidInAdvance: z.coerce.number().min(0, "Amount must be 0 or greater"),
  username: z.string().min(3, "Username must be at least 3 characters"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
}).refine((data) => data.totalAmountPaidInAdvance <= data.totalAmountToBePaid, {
  message: "Advance payment cannot exceed total amount",
  path: ["totalAmountPaidInAdvance"],
});

type AdminFormValues = z.infer<typeof adminUserSchema>;
type EmployeeFormValues = z.infer<typeof employeeSchema>;

export default function AdminSettings() {
  const [activeTab, setActiveTab] = useState("admin");
  const [isAdminLoading, setIsAdminLoading] = useState(false);
  const [isEmployeeLoading, setIsEmployeeLoading] = useState(false);
  const [notification, setNotification] = useState<{
    type: 'success' | 'error',
    message: string
  } | null>(null);

  // Admin form
  const adminForm = useForm<AdminFormValues>({
    resolver: zodResolver(adminUserSchema),
    defaultValues: {
      name: "",
      email: "",
      mobileNumber: "",
      username: "",
      password: "",
      confirmPassword: "",
    },
  });

  // Employee form
  const employeeForm = useForm<EmployeeFormValues>({
    resolver: zodResolver(employeeSchema),
    defaultValues: {
      name: "",
      mobileNumber: "",
      email: "",
      address: "",
      totalAmountToBePaid: 0,
      totalAmountPaidInAdvance: 0,
      username: "",
      password: "",
      confirmPassword: "",
    },
  });

  // Get authentication token
  const getAuthToken = () => {
    const adminTokenStr = localStorage.getItem('adminToken');
    if (!adminTokenStr) {
      throw new Error('You must be logged in as admin to perform this action');
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

  // Handle admin form submission
  const onAdminSubmit = async (data: AdminFormValues) => {
    try {
      setIsAdminLoading(true);
      setNotification(null);

      const token = getAuthToken();
      
      // Call the API using our centralized service
      await updateAdmin({
        name: data.name,
        email: data.email,
        mobileNumber: data.mobileNumber,
        username: data.username,
        password: data.password
      }, token);

      // Show success notification
      setNotification({
        type: 'success',
        message: 'Admin user created successfully'
      });

      // Reset form
      adminForm.reset();

    } catch (error) {
      console.error('Error creating admin user:', error);
      setNotification({
        type: 'error',
        message: error instanceof Error ? error.message : 'An error occurred while creating the admin user'
      });
    } finally {
      setIsAdminLoading(false);
    }
  };

  // Handle employee form submission
  const onEmployeeSubmit = async (data: EmployeeFormValues) => {
    try {
      setIsEmployeeLoading(true);
      setNotification(null);

      const token = getAuthToken();
      
      // Prepare employee data (exclude confirmPassword as it's not needed for the API)
      const { confirmPassword, ...employeeData } = data;
      
      // Call the API using our centralized service
      await saveEmployee(employeeData, token);

      // Show success notification
      setNotification({
        type: 'success',
        message: 'Employee created successfully'
      });

      // Reset form
      employeeForm.reset();

    } catch (error) {
      console.error('Error creating employee:', error);
      setNotification({
        type: 'error',
        message: error instanceof Error ? error.message : 'An error occurred while creating the employee'
      });
    } finally {
      setIsEmployeeLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-gray-500 dark:text-gray-400">
          Manage your admin settings and preferences
        </p>
      </div>

      {notification && (
        <div className={`p-3 rounded flex items-start gap-2 ${
          notification.type === 'success' 
          ? 'bg-green-100 dark:bg-green-900/20 border border-green-200 dark:border-green-900' 
          : 'bg-red-100 dark:bg-red-900/20 border border-red-200 dark:border-red-900'
        }`}>
          {notification.type === 'success' ? (
            <Check className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
          ) : (
            <AlertCircle className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
          )}
          <span className={`text-sm ${notification.type === 'success' ? 'text-green-800 dark:text-green-200' : 'text-red-800 dark:text-red-200'}`}>
            {notification.message}
          </span>
        </div>
      )}

      <Tabs defaultValue="admin" value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList>
          <TabsTrigger value="admin">Admin Users</TabsTrigger>
          <TabsTrigger value="employee">Employees</TabsTrigger>
        </TabsList>
        
        <TabsContent value="admin" className="mt-4">
          {/* Admin User Creation */}
          <Card className="max-w-2xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <UserPlus className="h-5 w-5" />
                Create Admin User
              </CardTitle>
              <CardDescription>
                Add a new administrator to manage the system
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...adminForm}>
                <form onSubmit={adminForm.handleSubmit(onAdminSubmit)} className="space-y-4">
                  <FormField
                    control={adminForm.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Full Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter full name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={adminForm.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <Input 
                              type="email" 
                              placeholder="Enter email" 
                              {...field} 
                              onChange={(e) => {
                                field.onChange(e);
                                // Trigger validation immediately on change
                                adminForm.trigger("email");
                              }}
                              className={adminForm.formState.errors.email ? "border-red-500" : ""}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={adminForm.control}
                      name="mobileNumber"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Mobile Number</FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="Enter mobile number" 
                              {...field} 
                              onChange={(e) => {
                                // Only allow numbers
                                const value = e.target.value.replace(/[^0-9]/g, '');
                                field.onChange(value);
                                // Trigger validation immediately on change
                                adminForm.trigger("mobileNumber");
                              }}
                              maxLength={10}
                              className={adminForm.formState.errors.mobileNumber ? "border-red-500" : ""}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={adminForm.control}
                    name="username"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Username</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter username" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={adminForm.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Password</FormLabel>
                          <FormControl>
                            <Input type="password" placeholder="Enter password" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={adminForm.control}
                      name="confirmPassword"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Confirm Password</FormLabel>
                          <FormControl>
                            <Input type="password" placeholder="Confirm password" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <Button type="submit" disabled={isAdminLoading}>
                    {isAdminLoading ? "Creating..." : "Create Admin User"}
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="employee" className="mt-4">
          {/* Employee Creation */}
          <Card className="max-w-2xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Create Employee
              </CardTitle>
              <CardDescription>
                Add a new band member or staff to the system
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...employeeForm}>
                <form onSubmit={employeeForm.handleSubmit(onEmployeeSubmit)} className="space-y-4">
                  <FormField
                    control={employeeForm.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Full Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter full name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={employeeForm.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <Input 
                              type="email" 
                              placeholder="Enter email" 
                              {...field} 
                              onChange={(e) => {
                                field.onChange(e);
                                // Trigger validation immediately on change
                                employeeForm.trigger("email");
                              }}
                              className={employeeForm.formState.errors.email ? "border-red-500" : ""}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={employeeForm.control}
                      name="mobileNumber"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Mobile Number</FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="Enter mobile number" 
                              {...field} 
                              onChange={(e) => {
                                // Only allow numbers
                                const value = e.target.value.replace(/[^0-9]/g, '');
                                field.onChange(value);
                                // Trigger validation immediately on change
                                employeeForm.trigger("mobileNumber");
                              }}
                              maxLength={10}
                              className={employeeForm.formState.errors.mobileNumber ? "border-red-500" : ""}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={employeeForm.control}
                    name="address"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Address</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Enter employee address" 
                            className="min-h-[80px]" 
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={employeeForm.control}
                      name="totalAmountToBePaid"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Total Amount (₹)</FormLabel>
                          <FormControl>
                            <Input 
                              type="number" 
                              placeholder="Enter total amount" 
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={employeeForm.control}
                      name="totalAmountPaidInAdvance"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Advance Payment (₹)</FormLabel>
                          <FormControl>
                            <Input 
                              type="number" 
                              placeholder="Enter advance amount" 
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={employeeForm.control}
                    name="username"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Username</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter username" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={employeeForm.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Password</FormLabel>
                          <FormControl>
                            <Input type="password" placeholder="Enter password" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={employeeForm.control}
                      name="confirmPassword"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Confirm Password</FormLabel>
                          <FormControl>
                            <Input type="password" placeholder="Confirm password" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <Button type="submit" disabled={isEmployeeLoading}>
                    {isEmployeeLoading ? "Creating..." : "Create Employee"}
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
} 