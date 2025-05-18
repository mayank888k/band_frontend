"use client";

import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, DollarSign, Users, Clock } from "lucide-react";
import Link from 'next/link';
import { Badge } from "@/components/ui/badge";
import { getBookings, getEmployees } from "@/lib/api";

// Import ApexCharts types and our custom wrapper
import { ApexOptions } from 'apexcharts';
import { ApexChartWrapper } from '@/components/ui/ApexChartWrapper';

interface StatsCardProps {
  title: string;
  value: string;
  description: string;
  icon: React.ReactNode;
  change?: string;
  trend?: 'up' | 'down' | 'neutral';
}

export default function AdminDashboard() {
  const [bookings, setBookings] = useState<any[]>([]);
  const [employees, setEmployees] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [chartSeries, setChartSeries] = useState<Array<{name: string, data: number[]}>>([]);
  const [bookingStats, setBookingStats] = useState({
    total: 0,
    thisMonth: 0,
    upcoming: 0,
  });

  // Fetch all data on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        
        // Fetch bookings and employees using our API
        const bookingsData = await getBookings();
        const employeesData = await getEmployees();
        
        setBookings(bookingsData.bookings || []);
        setEmployees(employeesData.employees || []);
        
        // Process booking stats
        if (bookingsData.bookings) {
          const now = new Date();
          const currentMonth = now.getMonth();
          const currentYear = now.getFullYear();
          
          const thisMonthBookings = bookingsData.bookings.filter((booking: any) => {
            const bookingDate = new Date(booking.date);
            return bookingDate.getMonth() === currentMonth && bookingDate.getFullYear() === currentYear;
          });
          
          const upcomingBookings = bookingsData.bookings.filter((booking: any) => {
            const bookingDate = new Date(booking.date);
            return bookingDate > now;
          });
          
          setBookingStats({
            total: bookingsData.bookings.length,
            thisMonth: thisMonthBookings.length,
            upcoming: upcomingBookings.length,
          });
          
          // Prepare chart data - bookings by month
          const monthlyData = Array(12).fill(0);
          bookingsData.bookings.forEach((booking: any) => {
            const date = new Date(booking.date);
            if (date.getFullYear() === currentYear) {
              monthlyData[date.getMonth()]++;
            }
          });
          
          setChartSeries([
            {
              name: 'Bookings',
              data: monthlyData,
            }
          ]);
        }
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  // Calculate employee payment statistics
  const employeeStats = {
    totalAmount: employees.reduce((total, emp) => total + emp.totalAmountToBePaid, 0),
    advanceAmount: employees.reduce((total, emp) => total + emp.totalAmountPaidInAdvance, 0),
    remainingAmount: employees.reduce((total, emp) => total + (emp.totalAmountToBePaid - emp.totalAmountPaidInAdvance), 0),
  };

  // Card for displaying statistics
  const StatsCard = ({ title, value, description, icon, change, trend }: StatsCardProps) => (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <div className="p-2 bg-gray-100 dark:bg-gray-800 rounded-full">
          {icon}
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{description}</p>
        {change && (
          <div className={`flex items-center mt-1 text-xs font-medium ${
            trend === 'up' ? 'text-green-500' : trend === 'down' ? 'text-red-500' : 'text-gray-500'
          }`}>
            {change}
          </div>
        )}
      </CardContent>
    </Card>
  );

  // Define chart options with proper typing
  const chartOptions: ApexOptions = {
    chart: {
      background: 'transparent',
      toolbar: {
        show: false,
      }
    },
    colors: ['#3b82f6'],
    dataLabels: {
      enabled: false,
    },
    stroke: {
      curve: 'smooth',
      width: 3,
    },
    xaxis: {
      categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
      labels: {
        style: {
          colors: '#9ca3af',
        },
      },
    },
    yaxis: {
      labels: {
        style: {
          colors: '#9ca3af',
        },
      },
    },
    tooltip: {
      theme: 'dark',
    },
    grid: {
      borderColor: '#334155',
      xaxis: {
        lines: {
          show: true,
        },
      },
    },
    responsive: [
      {
        breakpoint: 500,
        options: {
          chart: {
            height: 300,
          },
        },
      },
    ],
  };

  // Employee payment distribution chart
  const paymentDistributionOptions: ApexOptions = {
    chart: {
      type: 'pie',
      background: 'transparent',
    },
    colors: ['#3b82f6', '#ef4444'],
    labels: ['Paid', 'Remaining'],
    tooltip: {
      theme: 'dark',
    },
    legend: {
      position: 'bottom',
      labels: {
        colors: '#9ca3af',
      },
    },
    responsive: [
      {
        breakpoint: 480,
        options: {
          chart: {
            height: 280,
          },
          legend: {
            position: 'bottom',
          },
        },
      },
    ],
  };

  const paymentDistributionSeries = [
    employeeStats.advanceAmount,
    employeeStats.remainingAmount
  ];

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
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-gray-500 dark:text-gray-400">
            Welcome to your admin dashboard
          </p>
        </div>
      </div>

      {/* Stats cards */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Total Bookings"
          value={bookingStats.total.toString()}
          description="All-time bookings"
          icon={<Calendar className="h-5 w-5 text-blue-500" />}
        />
        <StatsCard
          title="This Month"
          value={bookingStats.thisMonth.toString()}
          description="Bookings for current month"
          icon={<Clock className="h-5 w-5 text-green-500" />}
          change="+5% from last month"
          trend="up"
        />
        <StatsCard
          title="Employees"
          value={employees.length.toString()}
          description="Active band members"
          icon={<Users className="h-5 w-5 text-orange-500" />}
        />
        <StatsCard
          title="Payments"
          value={`₹${employeeStats.totalAmount.toLocaleString()}`}
          description="Total employee payments"
          icon={<DollarSign className="h-5 w-5 text-purple-500" />}
          change={`${Math.round(employeeStats.advanceAmount / (employeeStats.totalAmount || 1) * 100)}% paid`}
          trend="neutral"
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Bookings Chart */}
        <Card className="col-span-1 lg:col-span-2">
          <CardHeader>
            <CardTitle>Booking Trends</CardTitle>
            <CardDescription>Monthly booking distribution for this year</CardDescription>
          </CardHeader>
          <CardContent>
            <ApexChartWrapper
              options={chartOptions}
              series={chartSeries}
              type="line"
              height={350}
            />
          </CardContent>
        </Card>

        {/* Employee Payment Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Employee Payment Distribution</CardTitle>
            <CardDescription>Paid vs. Remaining amount</CardDescription>
          </CardHeader>
          <CardContent>
            <ApexChartWrapper
              options={paymentDistributionOptions}
              series={paymentDistributionSeries}
              type="pie"
              height={300}
            />
          </CardContent>
        </Card>

        {/* Recent Bookings */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Bookings</CardTitle>
            <CardDescription>Latest booking activities</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {bookings.slice(0, 5).map((booking, i) => (
                <div key={i} className="flex items-center justify-between border-b pb-2 last:border-0">
                  <div>
                    <p className="font-medium">{booking.name}</p>
                    <div className="text-xs text-gray-500">
                      {new Date(booking.date).toLocaleDateString()} • {booking.city}
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">₹{booking.amount}</p>
                    <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300">
                      {booking.packageType.split(' ')[0]}
                    </Badge>
                  </div>
                </div>
              ))}

              <div className="pt-2">
                <Link 
                  href="/admin/bookings" 
                  className="text-sm text-blue-600 hover:underline dark:text-blue-400"
                >
                  View all bookings →
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 