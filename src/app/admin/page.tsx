"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useRouter } from "next/navigation";
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
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Lock, UserCircle } from "lucide-react";
import { adminLogin } from "@/lib/api";

// Define admin login response type
interface AdminLoginResponse {
  // The API might return different structures based on the backend implementation
  // This is a more flexible structure that handles various response formats
  token?: string;
  username?: string;
  isAdmin?: boolean;
  user?: {
    username?: string;
    isAdmin?: boolean;
    [key: string]: any;
  };
  [key: string]: any; // Allow for other properties
}

// Form schema with validation
const formSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type FormValues = z.infer<typeof formSchema>;

export default function AdminLoginPage() {
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const onSubmit = async (data: FormValues) => {
    try {
      setIsLoading(true);
      setError("");
      
      // Call the login API using our centralized API service
      const result = await adminLogin({
        username: data.username,
        password: data.password,
      }) as AdminLoginResponse;

      console.log("Login result:", result); // Debug the actual response

      // Extract admin status and username based on response structure
      const isAdmin = result.isAdmin || (result.user && result.user.isAdmin);
      const username = result.username || (result.user && result.user.username);

      // Check if user is admin
      if (!isAdmin) {
        setError("You don't have permission to access the admin panel");
        return;
      }

      if (!username) {
        setError("Invalid response from server");
        return;
      }

      // Store admin token and redirect to dashboard
      localStorage.setItem("adminToken", JSON.stringify({
        username: username,
        isAdmin: true,
      }));

      // Navigate to admin dashboard
      router.push("/admin/dashboard");

    } catch (error) {
      console.error("Login error:", error);
      setError(error instanceof Error ? error.message : "An error occurred during login");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-gray-900 to-gray-800 py-12 px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md border border-gray-700 bg-gray-900 shadow-xl">
        <CardHeader className="space-y-2 text-center">
          <CardTitle className="text-2xl font-bold tracking-tight text-white">
            Admin Console
          </CardTitle>
          <CardDescription className="text-gray-400">
            Enter your credentials to access the admin panel
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          {error && (
            <div className="mb-4 p-3 rounded bg-red-900/40 border border-red-800 text-red-300 text-sm">
              {error}
            </div>
          )}
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-300">Username</FormLabel>
                    <div className="relative">
                      <UserCircle className="absolute left-3 top-2.5 h-5 w-5 text-gray-500" />
                      <FormControl>
                        <Input
                          placeholder="Enter your username"
                          className="pl-10 bg-gray-800 border-gray-700 text-white"
                          {...field}
                        />
                      </FormControl>
                    </div>
                    <FormMessage className="text-red-400" />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-300">Password</FormLabel>
                    <div className="relative">
                      <Lock className="absolute left-3 top-2.5 h-5 w-5 text-gray-500" />
                      <FormControl>
                        <Input
                          type="password"
                          placeholder="••••••••"
                          className="pl-10 bg-gray-800 border-gray-700 text-white"
                          {...field}
                        />
                      </FormControl>
                    </div>
                    <FormMessage className="text-red-400" />
                  </FormItem>
                )}
              />
              
              <Button 
                type="submit" 
                className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                disabled={isLoading}
              >
                {isLoading ? "Authenticating..." : "Sign In"}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
} 