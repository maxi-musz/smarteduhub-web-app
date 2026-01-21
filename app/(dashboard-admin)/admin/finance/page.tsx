"use client";

import React, { useState } from "react";
import {
  DollarSign,
  TrendingUp,
  TrendingDown,
  FileText,
  // Calendar,
  // BarChart2,
  // PieChart,
  Download,
  Filter,
  Plus,
  X,
  Check,
  Edit,
  AlertTriangle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart as RechartsPieChart,
  Pie,
  Cell,
} from "recharts";

// Add imports for toast
import { useToast } from "@/hooks/use-toast";

const AdminFinances = () => {
  // State for modals
  const [showAddPaymentModal, setShowAddPaymentModal] = useState(false);
  // const [showExpenseModal, setShowExpenseModal] = useState(false);
  // const [showPaymentDetailModal, setShowPaymentDetailModal] = useState(false);
  // const [activePayment, setActivePayment] = useState<Payment | null>(null);
  const [activeTab, setActiveTab] = useState("overview");

  // Add payment form state
  const [paymentForm, setPaymentForm] = useState({
    studentId: "",
    paymentType: "",
    amount: "",
    paymentDate: "",
    status: "",
    notes: "",
  });

  // Add toast initialization
  const { toast } = useToast();

  // Demo data
  const monthlyRevenue = [
    { month: "Jan", amount: 45000 },
    { month: "Feb", amount: 52000 },
    { month: "Mar", amount: 48000 },
    { month: "Apr", amount: 61000 },
    { month: "May", amount: 55000 },
    { month: "Jun", amount: 67000 },
    { month: "Jul", amount: 72000 },
    { month: "Aug", amount: 78000 },
    { month: "Sep", amount: 69000 },
    { month: "Oct", amount: 74000 },
    { month: "Nov", amount: 79000 },
    { month: "Dec", amount: 82000 },
  ];

  const expensesByCategory = [
    { name: "Staff Salaries", value: 45 },
    { name: "Facilities", value: 20 },
    { name: "Learning Materials", value: 15 },
    { name: "Technology", value: 12 },
    { name: "Administrative", value: 8 },
  ];

  const recentPayments = [
    {
      id: 1,
      student: "Sarah Johnson",
      class: "Form 3A",
      amount: 45000,
      date: "2024-05-01",
      status: "Paid",
      type: "Tuition",
    },
    {
      id: 2,
      student: "Michael Obi",
      class: "Form 2B",
      amount: 35000,
      date: "2024-04-28",
      status: "Partial",
      type: "Tuition",
    },
    {
      id: 3,
      student: "Fatima Ahmed",
      class: "Form 1C",
      amount: 12000,
      date: "2024-04-27",
      status: "Paid",
      type: "Books",
    },
    {
      id: 4,
      student: "David Maina",
      class: "Form 4A",
      amount: 50000,
      date: "2024-04-25",
      status: "Paid",
      type: "Tuition",
    },
    {
      id: 5,
      student: "Grace Owuor",
      class: "Form 3B",
      amount: 28000,
      date: "2024-04-22",
      status: "Overdue",
      type: "Tuition",
    },
  ];

  const feeStructure = [
    {
      level: "Form 1",
      tuition: 35000,
      boarding: 45000,
      activity: 10000,
      books: 15000,
      total: 105000,
    },
    {
      level: "Form 2",
      tuition: 38000,
      boarding: 45000,
      activity: 10000,
      books: 12000,
      total: 105000,
    },
    {
      level: "Form 3",
      tuition: 40000,
      boarding: 45000,
      activity: 15000,
      books: 18000,
      total: 118000,
    },
    {
      level: "Form 4",
      tuition: 45000,
      boarding: 45000,
      activity: 20000,
      books: 20000,
      total: 130000,
    },
  ];

  const COLORS = ["#3b82f6", "#6366f1", "#8b5cf6", "#a855f7", "#d946ef"];

  // interface Payment {
  //   id: number;
  //   student: string;
  //   class: string;
  //   amount: number;
  //   date: string;
  //   status: string;
  //   type: string;
  // }

  // const openPaymentDetail = (payment: Payment) => {
  //   // setActivePayment(payment);
  //   // setShowPaymentDetailModal(true);
  // };

  interface StatusClassMap {
    [key: string]: string;
  }

  type PaymentStatus = "Paid" | "Partial" | "Overdue" | string;

  const getStatusClass = (status: PaymentStatus): string => {
    const statusClassMap: StatusClassMap = {
      Paid: "bg-green-100 text-green-800",
      Partial: "bg-yellow-100 text-yellow-800",
      Overdue: "bg-red-100 text-red-800",
    };
    return statusClassMap[status] || "bg-gray-100 text-gray-800";
  };

  // Add payment form submission handler
  const handlePaymentSubmit = () => {
    // Validate form
    if (
      !paymentForm.studentId ||
      !paymentForm.paymentType ||
      !paymentForm.amount ||
      !paymentForm.paymentDate ||
      !paymentForm.status
    ) {
      toast({
        title: "Missing Fields",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    // Here you would typically make an API call to save the payment
    console.log("Submitting payment:", paymentForm);

    // Close modal and reset form
    setPaymentForm({
      studentId: "",
      paymentType: "",
      amount: "",
      paymentDate: "",
      status: "",
      notes: "",
    });
    setShowAddPaymentModal(false);

    toast({
      title: "Payment Recorded",
      description: "The payment has been successfully recorded",
    });
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case "overview":
        return (
          <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <Card className="shadow-sm hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-gray-500 text-sm font-medium">
                      Total Revenue (2025)
                    </h3>
                    <DollarSign className="h-5 w-5 text-green-500" />
                  </div>
                  <div className="flex items-baseline space-x-2">
                    <span className="text-2xl font-bold">NGN 9,782,000</span>
                    <span className="text-green-500 flex items-center text-xs font-semibold">
                      <TrendingUp className="h-3 w-3 mr-1" />
                      +12%
                    </span>
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-sm hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-gray-500 text-sm font-medium">
                      Outstanding Fees
                    </h3>
                    <AlertTriangle className="h-5 w-5 text-yellow-500" />
                  </div>
                  <div className="flex items-baseline space-x-2">
                    <span className="text-2xl font-bold">NGN 3,245,000</span>
                    <span className="text-red-500 flex items-center text-xs font-semibold">
                      <TrendingDown className="h-3 w-3 mr-1" />
                      -3%
                    </span>
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-sm hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-gray-500 text-sm font-medium">
                      Monthly Expenses
                    </h3>
                    <FileText className="h-5 w-5 text-blue-500" />
                  </div>
                  <div className="flex items-baseline space-x-2">
                    <span className="text-2xl font-bold">NGN 1,325,000</span>
                    <span className="text-green-500 flex items-center text-xs font-semibold">
                      <TrendingDown className="h-3 w-3 mr-1" />
                      -2%
                    </span>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <Card className="shadow-sm hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold">
                      Revenue Trend (2024)
                    </h3>
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex items-center gap-1"
                    >
                      <Download className="h-4 w-4" />
                      Export
                    </Button>
                  </div>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={monthlyRevenue}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Line
                          type="monotone"
                          dataKey="amount"
                          stroke="#6366f1"
                          activeDot={{ r: 8 }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-sm hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold">Expense Breakdown</h3>
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex items-center gap-1"
                    >
                      <Filter className="h-4 w-4" />
                      Filter
                    </Button>
                  </div>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <RechartsPieChart>
                        <Pie
                          data={expensesByCategory}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                          label={({ name, percent }) =>
                            `${name} ${(percent * 100).toFixed(0)}%`
                          }
                        >
                          {expensesByCategory.map((entry, index) => (
                            <Cell
                              key={`cell-${index}`}
                              fill={COLORS[index % COLORS.length]}
                            />
                          ))}
                        </Pie>
                        <Tooltip />
                      </RechartsPieChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card className="shadow-sm hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold">Recent Payments</h3>
                  <div className="flex gap-2">
                    <Button
                      onClick={() => setShowAddPaymentModal(true)}
                      className="bg-indigo-600 hover:bg-indigo-700 flex items-center gap-1"
                    >
                      <Plus className="h-4 w-4" />
                      Record Payment
                    </Button>
                  </div>
                </div>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Student
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Class
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Type
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Amount
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Date
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Action
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {recentPayments.map((payment) => (
                        <tr
                          key={payment.id}
                          className="hover:bg-gray-50 cursor-pointer"
                          // onClick={() => openPaymentDetail(payment)}
                        >
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {payment.student}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {payment.class}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {payment.type}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            NGN {payment.amount.toLocaleString()}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {new Date(payment.date).toLocaleDateString()}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span
                              className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusClass(
                                payment.status
                              )}`}
                            >
                              {payment.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <button
                              className="text-brand-primary hover:text-indigo-900"
                              onClick={(e) => {
                                e.stopPropagation();
                                // openPaymentDetail(payment);
                              }}
                            >
                              View
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </>
        );
      case "fee-structure":
        return (
          <Card className="shadow-sm mb-6">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Fee Structure (2024)</h3>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex items-center gap-1"
                  >
                    <Download className="h-4 w-4" />
                    Export
                  </Button>
                  <Button
                    size="sm"
                    className="bg-indigo-600 hover:bg-indigo-700 flex items-center gap-1"
                  >
                    <Edit className="h-4 w-4" />
                    Edit Structure
                  </Button>
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Class Level
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Tuition
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Boarding
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Activity Fees
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Books & Materials
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Total
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {feeStructure.map((fee, index) => (
                      <tr key={index} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {fee.level}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          NGN {fee.tuition.toLocaleString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          NGN {fee.boarding.toLocaleString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          NGN {fee.activity.toLocaleString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          NGN {fee.books.toLocaleString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900">
                          NGN {fee.total.toLocaleString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="mt-6 bg-blue-50 p-4 rounded-md border border-blue-200">
                <h4 className="text-blue-700 text-sm font-semibold mb-2">
                  Payment Schedule
                </h4>
                <ul className="list-disc list-inside text-sm text-blue-700 space-y-1">
                  <li>First Term: 40% due by January 15th</li>
                  <li>Second Term: 30% due by May 15th</li>
                  <li>Third Term: 30% due by September 15th</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        );
      case "expenses":
        return (
          <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <Card className="shadow-sm hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-gray-500 text-sm font-medium">
                      Monthly Expenses
                    </h3>
                    <DollarSign className="h-5 w-5 text-red-500" />
                  </div>
                  <div className="flex items-baseline space-x-2">
                    <span className="text-2xl font-bold">NGN 325,000</span>
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-sm hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-gray-500 text-sm font-medium">
                      Largest Category
                    </h3>
                    <FileText className="h-5 w-5 text-blue-500" />
                  </div>
                  <div className="flex items-baseline space-x-2">
                    <span className="text-2xl font-bold">Staff Salaries</span>
                    <span className="text-blue-500 text-xs font-semibold">
                      45%
                    </span>
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-sm hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-gray-500 text-sm font-medium">
                      Budget Status
                    </h3>
                    <Check className="h-5 w-5 text-green-500" />
                  </div>
                  <div className="flex items-baseline space-x-2">
                    <span className="text-2xl font-bold">On Track</span>
                    <span className="text-green-500 text-xs font-semibold">
                      +2% under
                    </span>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card className="shadow-sm mb-6">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold">
                    Monthly Expenses (2024)
                  </h3>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex items-center gap-1"
                    >
                      <Download className="h-4 w-4" />
                      Export
                    </Button>
                    <Button
                      // onClick={() => setShowExpenseModal(true)}
                      size="sm"
                      className="bg-indigo-600 hover:bg-indigo-700 flex items-center gap-1"
                    >
                      <Plus className="h-4 w-4" />
                      Add Expense
                    </Button>
                  </div>
                </div>
                <div className="h-64 mb-6">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={monthlyRevenue}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar
                        dataKey="amount"
                        name="Expense (NGN)"
                        fill="#a855f7"
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
                <div className="bg-purple-50 p-4 rounded-md border border-purple-200 mb-6">
                  <h4 className="text-purple-700 text-sm font-semibold mb-2">
                    Expense Categories
                  </h4>
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
                    {expensesByCategory.map((category, index) => (
                      <div
                        key={index}
                        className="bg-white p-3 rounded border border-purple-100"
                      >
                        <div className="text-xs text-gray-500 mb-1">
                          {category.name}
                        </div>
                        <div className="font-semibold">{category.value}%</div>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </>
        );
      case "reports":
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="shadow-sm">
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-4">
                  Financial Reports
                </h3>
                <ul className="space-y-3">
                  <li className="flex items-center justify-between p-3 bg-gray-50 rounded-md hover:bg-gray-100 cursor-pointer">
                    <div className="flex items-center">
                      <FileText className="h-5 w-5 text-indigo-500 mr-3" />
                      <span>Monthly Revenue Report</span>
                    </div>
                    <Download className="h-4 w-4 text-gray-500" />
                  </li>
                  <li className="flex items-center justify-between p-3 bg-gray-50 rounded-md hover:bg-gray-100 cursor-pointer">
                    <div className="flex items-center">
                      <FileText className="h-5 w-5 text-indigo-500 mr-3" />
                      <span>Term Fee Collection Summary</span>
                    </div>
                    <Download className="h-4 w-4 text-gray-500" />
                  </li>
                  <li className="flex items-center justify-between p-3 bg-gray-50 rounded-md hover:bg-gray-100 cursor-pointer">
                    <div className="flex items-center">
                      <FileText className="h-5 w-5 text-indigo-500 mr-3" />
                      <span>Outstanding Fees Report</span>
                    </div>
                    <Download className="h-4 w-4 text-gray-500" />
                  </li>
                  <li className="flex items-center justify-between p-3 bg-gray-50 rounded-md hover:bg-gray-100 cursor-pointer">
                    <div className="flex items-center">
                      <FileText className="h-5 w-5 text-indigo-500 mr-3" />
                      <span>Expense Analysis</span>
                    </div>
                    <Download className="h-4 w-4 text-gray-500" />
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="shadow-sm">
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-4">
                  Generate Custom Report
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Report Type
                    </label>
                    <select className="w-full p-2 border border-gray-300 rounded-md">
                      <option>Fee Collection</option>
                      <option>Expenses</option>
                      <option>Revenue</option>
                      <option>Outstanding Balances</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Date Range
                    </label>
                    <div className="grid grid-cols-2 gap-4">
                      <input
                        type="date"
                        className="p-2 border border-gray-300 rounded-md"
                      />
                      <input
                        type="date"
                        className="p-2 border border-gray-300 rounded-md"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Format
                    </label>
                    <div className="flex gap-4">
                      <div className="flex items-center">
                        <input
                          type="radio"
                          id="pdf"
                          name="format"
                          className="mr-2"
                        />
                        <label htmlFor="pdf">PDF</label>
                      </div>
                      <div className="flex items-center">
                        <input
                          type="radio"
                          id="excel"
                          name="format"
                          className="mr-2"
                        />
                        <label htmlFor="excel">Excel</label>
                      </div>
                    </div>
                  </div>
                  <Button className="w-full bg-indigo-600 hover:bg-indigo-700">
                    Generate Report
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        );
      default:
        return <div>Loading...</div>;
    }
  };

  return (
    <div className="py-6 bg-brand-bg">
      {/* Existing tab navigation and content */}
      <div className="mb-6">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8" aria-label="Tabs">
            <button
              onClick={() => setActiveTab("overview")}
              className={`${
                activeTab === "overview"
                  ? "border-brand-primary text-brand-primary"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
            >
              Overview
            </button>
            <button
              onClick={() => setActiveTab("fee-structure")}
              className={`${
                activeTab === "fee-structure"
                  ? "border-brand-primary text-brand-primary"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
            >
              Fee Structure
            </button>
            <button
              onClick={() => setActiveTab("expenses")}
              className={`${
                activeTab === "expenses"
                  ? "border-brand-primary text-brand-primary"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
            >
              Expenses
            </button>
            <button
              onClick={() => setActiveTab("reports")}
              className={`${
                activeTab === "reports"
                  ? "border-brand-primary text-brand-primary"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
            >
              Reports
            </button>
          </nav>
        </div>
      </div>

      {/* Render tab content */}
      {renderTabContent()}

      {/* Add Payment Modal */}
      {showAddPaymentModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Record New Payment</h2>
              <button
                onClick={() => setShowAddPaymentModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Student
                </label>
                <select
                  value={paymentForm.studentId}
                  onChange={(e) =>
                    setPaymentForm({
                      ...paymentForm,
                      studentId: e.target.value,
                    })
                  }
                  className="w-full p-2 border border-gray-300 rounded-md"
                >
                  <option value="">Select Student</option>
                  {recentPayments.map((payment) => (
                    <option key={payment.id} value={payment.id}>
                      {payment.student} - {payment.class}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Payment Type
                </label>
                <select
                  value={paymentForm.paymentType}
                  onChange={(e) =>
                    setPaymentForm({
                      ...paymentForm,
                      paymentType: e.target.value,
                    })
                  }
                  className="w-full p-2 border border-gray-300 rounded-md"
                >
                  <option value="">Select Type</option>
                  <option value="tuition">Tuition</option>
                  <option value="books">Books</option>
                  <option value="activity">Activity Fees</option>
                  <option value="boarding">Boarding</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Amount (NGN)
                </label>
                <input
                  type="number"
                  value={paymentForm.amount}
                  onChange={(e) =>
                    setPaymentForm({ ...paymentForm, amount: e.target.value })
                  }
                  className="w-full p-2 border border-gray-300 rounded-md"
                  placeholder="Enter amount"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Payment Date
                </label>
                <input
                  type="date"
                  value={paymentForm.paymentDate}
                  onChange={(e) =>
                    setPaymentForm({
                      ...paymentForm,
                      paymentDate: e.target.value,
                    })
                  }
                  className="w-full p-2 border border-gray-300 rounded-md"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Payment Status
                </label>
                <select
                  value={paymentForm.status}
                  onChange={(e) =>
                    setPaymentForm({ ...paymentForm, status: e.target.value })
                  }
                  className="w-full p-2 border border-gray-300 rounded-md"
                >
                  <option value="">Select Status</option>
                  <option value="paid">Paid</option>
                  <option value="partial">Partial</option>
                  <option value="pending">Pending</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Notes
                </label>
                <textarea
                  value={paymentForm.notes}
                  onChange={(e) =>
                    setPaymentForm({ ...paymentForm, notes: e.target.value })
                  }
                  className="w-full p-2 border border-gray-300 rounded-md"
                  rows={3}
                  placeholder="Add any additional notes"
                ></textarea>
              </div>
            </div>
            <div className="mt-6 flex justify-end space-x-3">
              <Button
                variant="outline"
                onClick={() => setShowAddPaymentModal(false)}
              >
                Cancel
              </Button>
              <Button
                className="bg-indigo-600 hover:bg-indigo-700"
                onClick={handlePaymentSubmit}
              >
                Save Payment
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminFinances;
