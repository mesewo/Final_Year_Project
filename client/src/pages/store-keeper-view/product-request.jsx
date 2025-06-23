import React, { useEffect, useState } from "react";
import { RefreshCw, Filter, ChevronDown, ChevronUp } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchAllRequests,
  approveRequest,
  rejectRequest,
  markRequestDelivered,
} from "@/store/productRequest-slice";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";

const mainCategories = ["men", "women", "kids"];

const timeOptions = [
  { label: "All Time", value: "all" },
  { label: "Today", value: "today" },
  { label: "Yesterday", value: "yesterday" },
  { label: "This Week", value: "thisWeek" },
  { label: "Last Week", value: "lastWeek" },
  { label: "This Month", value: "thisMonth" },
  { label: "Last Month", value: "lastMonth" },
  { label: "This Year", value: "thisYear" },
];

const quickTimeOptions = [
  { label: "All Requests", value: "all" }, // <-- Add this line
  { label: "Today", value: "today" },
  { label: "Yesterday", value: "yesterday" },
  { label: "This Week", value: "thisWeek" },
  { label: "Last Week", value: "lastWeek" },
  { label: "This Month", value: "thisMonth" },
  { label: "Last Month", value: "lastMonth" },
  { label: "This Year", value: "thisYear" },
];

// Helper for time filtering
const isInTimeRange = (date, range) => {
  const now = new Date();
  const d = new Date(date);
  const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const startOfWeek = new Date(now);
  startOfWeek.setDate(now.getDate() - now.getDay());
  startOfWeek.setHours(0, 0, 0, 0); // Fix: reset time to 00:00:00
  const startOfLastWeek = new Date(startOfWeek);
  startOfLastWeek.setDate(startOfWeek.getDate() - 7);
  startOfLastWeek.setHours(0, 0, 0, 0); // Fix: reset time to 00:00:00
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  const startOfYear = new Date(now.getFullYear(), 0, 1);

  switch (range) {
    case "today":
      return d >= startOfDay;
    case "yesterday":
      const yesterday = new Date(startOfDay);
      yesterday.setDate(yesterday.getDate() - 1);
      return d >= yesterday && d < startOfDay;
    case "thisWeek":
      return d >= startOfWeek;
    case "lastWeek":
      return d >= startOfLastWeek && d < startOfWeek;
    case "thisMonth":
      return d >= startOfMonth;
    case "lastMonth":
      return d >= startOfLastMonth && d < startOfMonth;
    case "thisYear":
      return d >= startOfYear;
    default:
      return true;
  }
};

export default function StorekeeperProductRequests() {
  const dispatch = useDispatch();
  const { toast } = useToast();
  const requests = useSelector((state) => state.productRequest.allRequests || []);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [requestorFilter, setRequestorFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [timeRange, setTimeRange] = useState("all");
  const [expandedRequestors, setExpandedRequestors] = useState({});
  const [sellerStatusTab, setSellerStatusTab] = useState({});
  const user = useSelector((state) => state.auth.user);
  const [bulkExpanded, setBulkExpanded] = useState(false);
  const [expandedBuyer, setExpandedBuyer] = useState(null);

  useEffect(() => {
    dispatch(fetchAllRequests());
  }, [dispatch]);

  // Group all requests by seller (not buyer)
  const groupedSellerRequests = requests
    .filter(request => request.requestedBy?.role !== "buyer")
    .reduce((acc, request) => {
      const requestor = request.requestedBy || request.seller;
      if (!requestor) return acc;
      const requestorId = requestor._id;
      if (!acc[requestorId]) {
        acc[requestorId] = {
          requestor,
          requests: [],
        };
      }
      acc[requestorId].requests.push(request);
      return acc;
    }, {});

  // Group all requests by buyer (role === "buyer")
  const groupedBuyerRequests = requests
    .filter(request => request.requestedBy?.role === "buyer")
    .reduce((acc, request) => {
      const requestor = request.requestedBy;
      if (!requestor) return acc;
      const requestorId = requestor._id;
      if (!acc[requestorId]) {
        acc[requestorId] = {
          requestor,
          requests: [],
        };
      }
      acc[requestorId].requests.push(request);
      return acc;
    }, {});

  // Group requests by seller (for filter dropdown)
  const groupedRequests = requests.reduce((acc, request) => {
    const requestor = request.requestedBy || request.seller;
    if (!requestor) return acc;
    const requestorId = requestor._id;
    if (!acc[requestorId]) {
      acc[requestorId] = {
        requestor,
        requests: [],
      };
    }
    acc[requestorId].requests.push(request);
    return acc;
  }, {});

  // Get unique sellers for filter dropdown
  const uniqueRequestors = Object.values(groupedRequests).map(group => group.requestor);

  // Filter logic for sellers
  const filteredRequests = Object.values(groupedRequests)
    .filter(group => group.requestor.role !== "buyer") // Only sellers
    .map(group => {
      const filtered = group.requests.filter(request => {
        if (statusFilter !== "all" && request.status !== statusFilter) return false;
        if (
          categoryFilter !== "all" &&
          (!request.product.categories ||
            !request.product.categories.some(cat =>
              mainCategories.includes(cat.toLowerCase()) && cat.toLowerCase() === categoryFilter
            )
          )
        ) {
          return false;
        }
        if (searchTerm && !request.product.title.toLowerCase().includes(searchTerm.toLowerCase())) {
          return false;
        }
        if (timeRange !== "all" && request.createdAt) {
          if (!isInTimeRange(request.createdAt, timeRange)) return false;
        }
        return true;
      });
      return { ...group, requests: filtered };
    })
    .filter(group => {
      if (requestorFilter !== "all" && group.requestor._id !== requestorFilter) return false;
      return group.requests.length > 0;
    });

  // Filtered buyer requests (bulk)
  const filteredBuyerRequests = Object.values(groupedBuyerRequests)
    .map(group => ({
      ...group,
      requests: group.requests.filter(request => {
        // Filter by time
        if (timeRange !== "all" && request.createdAt) {
          if (!isInTimeRange(request.createdAt, timeRange)) return false;
        }
        // You can add more filters here if needed (status, category, etc)
        return true;
      })
    }))
    .filter(group => group.requests.length > 0);

  // Sort filtered buyer requests by request length descending
  const sortedFilteredBuyerRequests = filteredBuyerRequests.sort((a, b) => b.requests.length - a.requests.length);

  // Count requests for each quick time option
  const quickCounts = quickTimeOptions.reduce((acc, opt) => {
    acc[opt.value] = requests.filter(r => isInTimeRange(r.createdAt, opt.value)).length;
    return acc;
  }, {});

  const toggleSellerExpansion = (sellerId) => {
    setExpandedRequestors(prev => ({
      ...prev,
      [sellerId]: !prev[sellerId]
    }));
  };

  const handleApprove = async (requestId) => {
    const result = await dispatch(approveRequest(requestId));
    if (result.type.endsWith("/fulfilled")) {
      toast({
        title: "Request Approved",
        description: "Product request approved successfully.",
        variant: "success",
      });
      dispatch(fetchAllRequests());
    } else if (
      result.type.endsWith("/rejected") &&
      result.error?.message?.includes("Not enough factory stock")
    ) {
      toast({
        title: "Low Stock",
        description: "Not enough factory stock to approve this request.",
        variant: "destructive",
      });
    } else if (result.type.endsWith("/rejected")) {
      toast({
        title: "Error",
        description: "Failed to approve product request.",
        variant: "destructive",
      });
    }
  };

  const handleReject = async (requestId) => {
    await dispatch(rejectRequest(requestId));
    dispatch(fetchAllRequests());
  };

  const handleMarkDelivered = async (requestId) => {
    await dispatch(markRequestDelivered(requestId));
    dispatch(fetchAllRequests());
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "approved":
        return <Badge className="bg-green-100 text-green-800 px-3 py-1 text-sm">Approved</Badge>;
      case "rejected":
        return <Badge className="bg-red-100 text-red-800 px-3 py-1 text-sm">Rejected</Badge>;
      case "delivered":
        return <Badge className="bg-blue-100 text-blue-800 px-3 py-1 text-sm">Delivered</Badge>;
      default:
        return <Badge className="bg-yellow-100 text-yellow-800 px-3 py-1 text-sm">Pending</Badge>;
    }
  };

  return (
    <div className="container mx-auto px-4 py-6 text-base">
      <div className="flex flex-col space-y-6">
        {/* Header and Filters */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Product Requests</h1>
            <p className="text-sm md:text-base text-gray-500">Manage and review product requests from sellers</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1 min-w-[200px]">
              <Input
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 w-full text-base h-11"
              />
              <svg
                className="absolute left-3 top-3.5 h-5 w-5 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="flex items-center gap-2 h-11 px-4">
                  <Filter className="h-5 w-5" />
                  <span className="text-base">Filters</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56 text-base">
                <div className="px-3 py-2 text-sm font-medium text-gray-500">
                  Status
                </div>
                <DropdownMenuItem onClick={() => setStatusFilter("all")} className="px-3 py-2 text-base">
                  All Statuses
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setStatusFilter("pending")} className="px-3 py-2 text-base">
                  Pending
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setStatusFilter("approved")} className="px-3 py-2 text-base">
                  Approved
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setStatusFilter("rejected")} className="px-3 py-2 text-base">
                  Rejected
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setStatusFilter("delivered")} className="px-3 py-2 text-base">
                  Delivered
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <div className="px-3 py-2 text-sm font-medium text-gray-500">
                  Sellers
                </div>
                <DropdownMenuItem onClick={() => setRequestorFilter("all")} className="px-3 py-2 text-base">
                  All Sellers
                </DropdownMenuItem>
                {uniqueRequestors.map(requestor => (
                  <DropdownMenuItem
                    key={requestor._id}
                    onClick={() => setRequestorFilter(requestor._id)}
                    className="px-3 py-2 text-base flex items-center gap-2"
                  >
                    <span className="truncate">{requestor.userName}</span>
                  </DropdownMenuItem>
                ))}
                <DropdownMenuSeparator />
                <div className="px-3 py-2 text-sm font-medium text-gray-500">
                  Categories
                </div>
                <DropdownMenuItem onClick={() => setCategoryFilter("all")} className="px-3 py-2 text-base">
                  All Categories
                </DropdownMenuItem>
                {mainCategories.map(category => (
                  <DropdownMenuItem
                    key={category}
                    onClick={() => setCategoryFilter(category)}
                    className="px-3 py-2 text-base"
                  >
                    {category.charAt(0).toUpperCase() + category.slice(1)}
                  </DropdownMenuItem>
                ))}
                <DropdownMenuSeparator />
                <div className="px-3 py-2 text-sm font-medium text-gray-500">
                  Time
                </div>
                <DropdownMenuItem onClick={() => setTimeRange("all")} className="px-3 py-2 text-base">
                  All Time
                </DropdownMenuItem>
                {timeOptions.slice(1).map(option => (
                  <DropdownMenuItem
                    key={option.value}
                    onClick={() => setTimeRange(option.value)}
                    className="px-3 py-2 text-base"
                  >
                    {option.label}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
            <Button
              variant="outline"
              onClick={() => {
                setSearchTerm("");
                setStatusFilter("all");
                setRequestorFilter("all");
                setCategoryFilter("all");
                setTimeRange("all");
                dispatch(fetchAllRequests());
              }}
              className="shrink-0 h-11 px-4 text-base"
            >
              Reset
            </Button>
          </div>
        </div>

        {/* Quick Time Filters */}
        <div className="flex flex-wrap gap-2 mb-2">
          {quickTimeOptions.map(opt => (
            <Button
              key={opt.value}
              variant={timeRange === opt.value ? "default" : "outline"}
              className="px-3 py-1 text-sm flex items-center gap-2"
              onClick={() => {
                setTimeRange(opt.value);
                setStatusFilter("all");
                setRequestorFilter("all");
                setCategoryFilter("all");
                setSearchTerm("");
              }}
            >
              {opt.label}
              <span className="bg-gray-200 text-gray-700 rounded px-2 py-0.5 text-xs font-semibold">{quickCounts[opt.value]}</span>
            </Button>
          ))}
        </div>

        {/* Active Filters */}
        {(statusFilter !== "all" || requestorFilter !== "all" || categoryFilter !== "all" || searchTerm || timeRange !== "all") && (
          <div className="flex flex-wrap gap-3">
            {statusFilter !== "all" && (
              <Badge className="flex items-center gap-1 px-3 py-1.5 text-sm cursor-pointer hover:bg-gray-200">
                Status: {statusFilter}
                <button
                  onClick={() => setStatusFilter("all")}
                  className="ml-1 p-1 rounded-full hover:bg-gray-300"
                >
                  <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </Badge>
            )}
            {requestorFilter !== "all" && (
              <Badge className="flex items-center gap-1 px-3 py-1.5 text-sm cursor-pointer hover:bg-gray-200">
                Seller: {uniqueRequestors.find(s => s._id === requestorFilter)?.userName || "Unknown"}
                <button
                  onClick={() => setRequestorFilter("all")}
                  className="ml-1 p-1 rounded-full hover:bg-gray-300"
                >
                  <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </Badge>
            )}
            {categoryFilter !== "all" && (
              <Badge className="flex items-center gap-1 px-3 py-1.5 text-sm cursor-pointer hover:bg-gray-200">
                Category: {categoryFilter}
                <button
                  onClick={() => setCategoryFilter("all")}
                  className="ml-1 p-1 rounded-full hover:bg-gray-300"
                >
                  <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </Badge>
            )}
            {searchTerm && (
              <Badge className="flex items-center gap-1 px-3 py-1.5 text-sm cursor-pointer hover:bg-gray-200">
                Search: {searchTerm}
                <button
                  onClick={() => setSearchTerm("")}
                  className="ml-1 p-1 rounded-full hover:bg-gray-300"
                >
                  <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </Badge>
            )}
            {timeRange !== "all" && (
              <Badge className="flex items-center gap-1 px-3 py-1.5 text-sm cursor-pointer hover:bg-gray-200">
                Time: {timeOptions.find(t => t.value === timeRange)?.label}
                <button
                  onClick={() => setTimeRange("all")}
                  className="ml-1 p-1 rounded-full hover:bg-gray-300"
                >
                  <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </Badge>
            )}
          </div>
        )}

        {/* Requests List */}
        {filteredRequests.length === 0 && sortedFilteredBuyerRequests.length === 0 ? (
          <Card className="flex flex-col items-center justify-center py-16 text-center">
            <div className="text-muted-foreground">
              <svg
                className="mx-auto h-14 w-14 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1}
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                />
              </svg>
              <h3 className="mt-4 text-lg md:text-xl font-medium text-gray-900">No requests found</h3>
              <p className="mt-2 text-sm md:text-base text-gray-500 max-w-md mx-auto">
                {searchTerm || statusFilter !== "all" || requestorFilter !== "all" || categoryFilter !== "all" || timeRange !== "all"
                  ? "Try adjusting your filters or search term"
                  : "There are currently no product requests"}
              </p>
            </div>
          </Card>
        ) : (
          <div className="space-y-5">
            {/* Seller Requests: only show if bulkExpanded is false */}
            {!bulkExpanded && filteredRequests.map((group) => {
              const pendingCount = group.requests.filter(r => r.status === "pending").length;
              const approvedCount = group.requests.filter(r => r.status === "approved").length;
              const rejectedCount = group.requests.filter(r => r.status === "rejected").length;
              const deliveredCount = group.requests.filter(r => r.status === "delivered").length;
              const activeTab = sellerStatusTab[group.requestor._id] || "pending";
              return (
                <Card key={group.requestor._id} className="overflow-hidden hover:shadow-md transition-shadow">
                  <div
                    className="bg-gray-50 px-5 py-4 flex justify-between items-center cursor-pointer hover:bg-gray-100 transition-colors"
                    onClick={() => {
                      setBulkExpanded(false); // Hide bulk when seller opens
                      setExpandedRequestors({ [group.requestor._id]: !expandedRequestors[group.requestor._id] });
                    }}
                  >
                    <div className="flex items-center gap-4 w-full">
                      <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 font-medium text-lg">
                        {group.requestor?.userName ? group.requestor.userName.charAt(0).toUpperCase() : "?"}
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between items-start">
                          <h3 className="font-medium text-gray-800 text-base md:text-lg">{group.requestor.userName}</h3>
                          <div className="text-sm md:text-base text-gray-500">
                            {group.requests.length} request{group.requests.length !== 1 ? 's' : ''}
                          </div>
                        </div>
                        <div className="flex gap-3 mt-3">
                          {[
                            { key: "all", label: "All", count: group.requests.length },
                            { key: "pending", label: "Pending", count: pendingCount },
                            { key: "approved", label: "Approved", count: approvedCount },
                            { key: "rejected", label: "Rejected", count: rejectedCount },
                            { key: "delivered", label: "Delivered", count: deliveredCount },
                          ].map(tab => (
                            <div
                              key={tab.key}
                              className={`flex flex-col items-center px-3 py-1.5 rounded-md cursor-pointer text-sm md:text-base ${activeTab === tab.key ? "bg-blue-200 text-blue-900" : "hover:bg-gray-100"}`}
                              onClick={e => {
                                e.stopPropagation();
                                setSellerStatusTab(tabs => ({ ...tabs, [group.requestor._id]: tab.key }));
                              }}
                            >
                              <span className="font-medium">{tab.count}</span>
                              <span className="text-xs">{tab.label}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-gray-500 hover:text-gray-700 p-2"
                    >
                      {expandedRequestors[group.requestor._id] ? (
                        <ChevronUp className="h-5 w-5" />
                      ) : (
                        <ChevronDown className="h-5 w-5" />
                      )}
                    </Button>
                  </div>
                  {expandedRequestors[group.requestor._id] && (
                    <div className="divide-y">
                      {group.requests
                        .filter(request => activeTab === "all" || request.status === activeTab)
                        .map((request) => (
                          <div key={request._id} className="p-5 flex flex-col sm:flex-row sm:items-center gap-4 hover:bg-gray-50 transition-colors">
                            <div className="flex items-start gap-4 flex-1">
                              <div className="w-20 h-20 flex-shrink-0 rounded-md border overflow-hidden">
                                <img
                                  src={request.product.image}
                                  alt={request.product.title}
                                  className="w-full h-full object-cover"
                                  onError={e => { e.target.src = "/fallback.png"; }}
                                />
                              </div>
                              <div className="grid gap-1.5">
                                <h4 className="font-medium text-gray-900 text-base md:text-lg">{request.product.title}</h4>
                                <div className="flex flex-wrap gap-2">
                                  {request.product.categories?.map(category => (
                                    <Badge key={category} variant="outline" className="text-xs px-2 py-0.5">
                                      {category}
                                    </Badge>
                                  ))}
                                </div>
                                <div className="text-sm md:text-base text-gray-500">
                                  <span className="font-medium">Quantity:</span> {request.quantity}
                                </div>
                                <div className="text-xs text-gray-400">
                                  Requested on {new Date(request.createdAt).toLocaleDateString()}
                                </div>
                              </div>
                            </div>
                            <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                              <div className="flex justify-end">
                                {getStatusBadge(request.status)}
                              </div>
                              {request.status === "pending" && (
                                <div className="flex gap-3">
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    className="bg-green-50 hover:bg-green-100 text-green-700 h-10 px-4 text-base"
                                    onClick={() => handleApprove(request._id)}
                                  >
                                    Approve
                                  </Button>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    className="bg-red-50 hover:bg-red-100 text-red-700 h-10 px-4 text-base"
                                    onClick={() => handleReject(request._id)}
                                  >
                                    Reject
                                  </Button>
                                </div>
                              )}
                              {request.status === "approved" && (
                                <div className="flex gap-3">
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    className="bg-blue-50 hover:bg-blue-100 text-blue-700 h-10 px-4 text-base"
                                    onClick={() => handleMarkDelivered(request._id)}
                                  >
                                    Mark as Delivered
                                  </Button>
                                </div>
                              )}
                            </div>
                          </div>
                        ))}
                    </div>
                  )}
                </Card>
              );
            })}

            {/* Bulk Requests (Buyers): only show if no seller is expanded */}
            {Object.values(expandedRequestors).every(v => !v) && (
              <Card className="overflow-hidden hover:shadow-md transition-shadow">
                <div
                  className="bg-blue-50 px-5 py-4 flex justify-between items-center cursor-pointer hover:bg-blue-100 transition-colors"
                  onClick={() => {
                    setBulkExpanded(exp => !exp); // Toggle bulk
                    setExpandedRequestors({});    // Hide all sellers when bulk opens
                    setExpandedBuyer(null);
                  }}
                >
                  <div className="flex items-center gap-4 w-full">
                    <div className="w-12 h-12 rounded-full bg-blue-200 flex items-center justify-center text-blue-700 font-bold text-lg">
                      B
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-start">
                        <h3 className="font-semibold text-blue-800 text-lg">Bulk Requests</h3>
                        <div className="text-base text-gray-500">
                          {sortedFilteredBuyerRequests.reduce((sum, g) => sum + g.requests.length, 0)} request
                        </div>
                      </div>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-gray-500 hover:text-gray-700 p-2"
                  >
                    {bulkExpanded ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
                  </Button>
                </div>
                {bulkExpanded && (
                  <div className="divide-y">
                    {sortedFilteredBuyerRequests.length === 0 ? (
                      <div className="p-6 text-center text-gray-500">No bulk requests.</div>
                    ) : (
                      sortedFilteredBuyerRequests.map(group => {
                        const statusCounts = {
                          all: group.requests.length,
                          pending: group.requests.filter(r => r.status === "pending").length,
                          approved: group.requests.filter(r => r.status === "approved").length,
                          rejected: group.requests.filter(r => r.status === "rejected").length,
                          delivered: group.requests.filter(r => r.status === "delivered").length,
                        };
                        const activeTab = sellerStatusTab[group.requestor._id] || "pending";
                        return (
                          <div key={group.requestor._id}>
                            <div
                              className="flex items-center justify-between px-6 py-3 cursor-pointer hover:bg-blue-100"
                              onClick={() => setExpandedBuyer(expandedBuyer === group.requestor._id ? null : group.requestor._id)}
                            >
                              <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-blue-300 flex items-center justify-center text-blue-800 font-bold text-lg">
                                  {group.requestor.userName?.charAt(0).toUpperCase() || "B"}
                                </div>
                                <div className="flex flex-col">
                                  <span className="font-semibold text-blue-900">{group.requestor.userName || "Buyer"}</span>
                                  <span className="text-xs text-gray-500">{group.requestor.email}</span>
                                </div>
                                <span className="ml-2 text-gray-500 text-base">{group.requests.length} requests</span>
                              </div>
                              <div>
                                {expandedBuyer === group.requestor._id ? <ChevronUp /> : <ChevronDown />}
                              </div>
                            </div>
                            {expandedBuyer === group.requestor._id && (
                              <div className="bg-blue-50">
                                <div className="flex gap-3 px-8 py-2">
                                  {["all", "pending", "approved", "rejected", "delivered"].map(key => (
                                    <div
                                      key={key}
                                      className={`flex flex-col items-center px-3 py-1.5 rounded-md cursor-pointer text-base ${
                                        activeTab === key ? "bg-blue-200 text-blue-900" : "hover:bg-blue-100"
                                      }`}
                                      onClick={e => {
                                        e.stopPropagation();
                                        setSellerStatusTab(tabs => ({ ...tabs, [group.requestor._id]: key }));
                                      }}
                                    >
                                      <span className="font-medium">{statusCounts[key]}</span>
                                      <span className="text-xs">{key.charAt(0).toUpperCase() + key.slice(1)}</span>
                                    </div>
                                  ))}
                                </div>
                                <div className="divide-y">
                                  {group.requests
                                    .filter(request => activeTab === "all" || request.status === activeTab)
                                    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
                                    .map(request => (
                                      <div key={request._id} className="p-5 flex flex-col sm:flex-row sm:items-center gap-4 hover:bg-blue-100 transition-colors">
                                        <div className="flex items-start gap-4 flex-1">
                                          <div className="w-20 h-20 flex-shrink-0 rounded-md border overflow-hidden">
                                            <img
                                              src={request.product.image}
                                              alt={request.product.title}
                                              className="w-full h-full object-cover"
                                              onError={e => { e.target.src = "/fallback.png"; }}
                                            />
                                          </div>
                                          <div className="grid gap-1.5">
                                            <h4 className="font-medium text-gray-900 text-base md:text-lg">{request.product.title}</h4>
                                            <div className="flex flex-wrap gap-2">
                                              {request.product.categories?.map(category => (
                                                <Badge key={category} variant="outline" className="text-xs px-2 py-0.5">
                                                  {category}
                                                </Badge>
                                              ))}
                                            </div>
                                            <div className="text-sm md:text-base text-gray-500">
                                              <span className="font-medium">Quantity:</span> {request.quantity}
                                            </div>
                                            <div className="text-xs text-gray-400">
                                              Requested on {new Date(request.createdAt).toLocaleDateString()}
                                            </div>
                                          </div>
                                        </div>
                                        <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                                          <div className="flex justify-end">{getStatusBadge(request.status)}</div>
                                          {request.status === "pending" && (
                                            <div className="flex gap-3">
                                              <Button
                                                variant="outline"
                                                size="sm"
                                                className="bg-green-50 hover:bg-green-100 text-green-700 h-10 px-4 text-base"
                                                onClick={() => handleApprove(request._id)}
                                              >
                                                Approve
                                              </Button>
                                              <Button
                                                variant="outline"
                                                size="sm"
                                                className="bg-red-50 hover:bg-red-100 text-red-700 h-10 px-4 text-base"
                                                onClick={() => handleReject(request._id)}
                                              >
                                                Reject
                                              </Button>
                                            </div>
                                          )}
                                          {request.status === "approved" && (
                                            <div className="flex gap-3">
                                              <Button
                                                variant="outline"
                                                size="sm"
                                                className="bg-blue-50 hover:bg-blue-100 text-blue-700 h-10 px-4 text-base"
                                                onClick={() => handleMarkDelivered(request._id)}
                                              >
                                                Mark as Delivered
                                              </Button>
                                            </div>
                                          )}
                                        </div>
                                      </div>
                                    ))}
                                </div>
                              </div>
                            )}
                          </div>
                        );
                      })
                    )}
                  </div>
                )}
              </Card>
            )}
          </div>
        )}
      </div>
    </div>
  );
}