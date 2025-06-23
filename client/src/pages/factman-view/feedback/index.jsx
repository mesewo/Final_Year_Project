import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { RefreshCw, ChevronDown, ChevronUp, ImageIcon } from "lucide-react";
import { fetchFeedbacks, updateFeedbackStatus } from "@/store/factman/feedback-slice";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Fragment } from "react";

// Helper to group feedbacks by product
function groupFeedbacksByProduct(feedbacks) {
  const grouped = {};
  feedbacks.forEach((feedback) => {
    const productId = feedback.product?._id || feedback.productId || "unknown";
    if (!grouped[productId]) {
      grouped[productId] = {
        product: feedback.product,
        feedbacks: [],
      };
    }
    grouped[productId].feedbacks.push(feedback);
  });
  return Object.values(grouped);
}

// Helper for date filtering with more descriptive names
function isWithinSelectedDateRange(feedbackDate, dateRange) {
  const currentDate = new Date();
  const feedbackCreationDate = new Date(feedbackDate);
  
  switch (dateRange) {
    case "today":
      return feedbackCreationDate.toDateString() === currentDate.toDateString();
    case "this_week": {
      const firstDayOfWeek = currentDate.getDate() - currentDate.getDay();
      const lastDayOfWeek = firstDayOfWeek + 6;
      const weekStartDate = new Date(currentDate.setDate(firstDayOfWeek));
      const weekEndDate = new Date(currentDate.setDate(lastDayOfWeek));
      return feedbackCreationDate >= weekStartDate && feedbackCreationDate <= weekEndDate;
    }
    case "last_week": {
      const previousWeekDate = new Date();
      const firstDayOfLastWeek = previousWeekDate.getDate() - previousWeekDate.getDay() - 7;
      const lastDayOfLastWeek = firstDayOfLastWeek + 6;
      const lastWeekStartDate = new Date(previousWeekDate.setDate(firstDayOfLastWeek));
      const lastWeekEndDate = new Date(previousWeekDate.setDate(lastDayOfLastWeek));
      return feedbackCreationDate >= lastWeekStartDate && feedbackCreationDate <= lastWeekEndDate;
    }
    case "this_month":
      return feedbackCreationDate.getMonth() === currentDate.getMonth() && 
             feedbackCreationDate.getFullYear() === currentDate.getFullYear();
    case "last_month": {
      const lastMonthDate = new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1);
      return feedbackCreationDate.getMonth() === lastMonthDate.getMonth() && 
             feedbackCreationDate.getFullYear() === lastMonthDate.getFullYear();
    }
    case "this_year":
      return feedbackCreationDate.getFullYear() === currentDate.getFullYear();
    default:
      return true;
  }
}

export default function FactmanFeedback() {
  const dispatch = useDispatch();
  const { feedbacks, loading } = useSelector((state) => state.factmanFeedback);

  // Filter states with more descriptive names
  const [statusFilter, setStatusFilter] = useState("");
  const [ratingSort, setRatingSort] = useState("");
  const [dateRangeFilter, setDateRangeFilter] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [searchField, setSearchField] = useState("product");
  const [expandedProducts, setExpandedProducts] = useState({});

  useEffect(() => {
    dispatch(fetchFeedbacks());
  }, [dispatch]);

  const handleStatusChange = (feedbackId, newStatus) => {
    dispatch(updateFeedbackStatus({ id: feedbackId, status: newStatus })).then(() => {
      dispatch(fetchFeedbacks());
    });
  };

  const handleStatusToggle = (feedbackId, currentStatus) => {
    let newStatus;
    switch(currentStatus) {
      case "approved":
        newStatus = "rejected";
        break;
      case "rejected":
        newStatus = "approved";
        break;
      default:
        newStatus = "approved";
    }
    handleStatusChange(feedbackId, newStatus);
  };

  const handleRefresh = () => {
    dispatch(fetchFeedbacks());
    setExpandedProducts({});
  };

  const toggleProductExpansion = (productId) => {
    setExpandedProducts((prev) => {
      // If already open, close it; otherwise, open only this one
      if (prev[productId]) {
        return {};
      } else {
        return { [productId]: true };
      }
    });
  };

  // Filter and search logic
  let filteredFeedbacks = feedbacks || [];
  
  // Apply status filter
  if (statusFilter) {
    filteredFeedbacks = filteredFeedbacks.filter(feedback => feedback.status === statusFilter);
  }
  
  // Apply date range filter
  if (dateRangeFilter) {
    filteredFeedbacks = filteredFeedbacks.filter(feedback => 
      isWithinSelectedDateRange(feedback.createdAt, dateRangeFilter)
    );
  }
  
  // Apply search filter
  if (searchQuery) {
    filteredFeedbacks = filteredFeedbacks.filter(feedback => {
      const query = searchQuery.toLowerCase();
      
      switch (searchField) {
        case "product":
          return (feedback.product?.title || feedback.product?.name || "").toLowerCase().includes(query);
        case "user":
          return (feedback.userName || feedback.user?.userName || "").toLowerCase().includes(query);
        case "date":
          return new Date(feedback.createdAt).toLocaleDateString().includes(searchQuery);
        default:
          return true;
      }
    });
  }
  
  // Apply rating sort
  if (ratingSort === "highest") {
    filteredFeedbacks = [...filteredFeedbacks].sort((a, b) => b.rating - a.rating);
  } else if (ratingSort === "lowest") {
    filteredFeedbacks = [...filteredFeedbacks].sort((a, b) => a.rating - b.rating);
  }

  // Sort by newest feedback first
  filteredFeedbacks = [...filteredFeedbacks].sort(
    (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
  );

  // Group after filtering and sorting
  const groupedFeedbacks = filteredFeedbacks.length > 0 
    ? groupFeedbacksByProduct(filteredFeedbacks) 
    : [];

  // Count of products after all filters
  const filteredProductCount = groupedFeedbacks.length;
  const totalProductCount = feedbacks ? groupFeedbacksByProduct(feedbacks).length : 0;

  return (
    <div className="space-y-6">
      <div className="relative flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <h1 className="text-3xl font-bold">Customer Feedback Management</h1>
        <Button
          variant="outline"
          size="icon"
          onClick={handleRefresh}
          aria-label="Refresh feedbacks"
        >
          <RefreshCw size={20} className={loading ? "animate-spin" : ""} />
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2 items-center mb-2">
        <select
          className="border rounded px-2 py-1 bg-white shadow-sm"
          value={statusFilter}
          onChange={e => setStatusFilter(e.target.value)}
        >
          <option value="">All Statuses</option>
          <option value="pending">Pending</option>
          <option value="approved">Approved</option>
          <option value="rejected">Rejected</option>
        </select>
        
        <select
          className="border rounded px-2 py-1 bg-white shadow-sm"
          value={ratingSort}
          onChange={e => setRatingSort(e.target.value)}
        >
          <option value="">Sort by Rating</option>
          <option value="highest">Highest First</option>
          <option value="lowest">Lowest First</option>
        </select>
        
        <select
          className="border rounded px-2 py-1 bg-white shadow-sm"
          value={dateRangeFilter}
          onChange={e => setDateRangeFilter(e.target.value)}
        >
          <option value="">All Time Periods</option>
          <option value="today">Today</option>
          <option value="this_week">This Week</option>
          <option value="last_week">Last Week</option>
          <option value="this_month">This Month</option>
          <option value="last_month">Last Month</option>
          <option value="this_year">This Year</option>
        </select>
        
        <select
          className="border rounded px-2 py-1 bg-white shadow-sm"
          value={searchField}
          onChange={e => setSearchField(e.target.value)}
        >
          <option value="product">Search by Product</option>
          <option value="user">Search by User</option>
          <option value="date">Search by Date</option>
        </select>
        
        <Input
          placeholder={`Search feedbacks...`}
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          className="w-48 shadow-sm"
        />
      </div>

      {/* Product count after filters */}
      <div className="mb-4 p-3 bg-gray-50 rounded-lg">
        <p className="text-sm text-gray-600">
           <span className="font-semibold">{filteredProductCount}</span> Feedback are exist {" "}
          {/* <span className="font-semibold">{totalProductCount}</span>  with feedback */}
        </p>
        {(statusFilter || dateRangeFilter || searchQuery) && (
          <button 
            onClick={() => {
              setStatusFilter("");
              setDateRangeFilter("");
              setSearchQuery("");
            }}
            className="mt-1 text-xs text-blue-600 hover:text-blue-800"
          >
            Clear all filters
          </button>
        )}
      </div>

      <div className="rounded-md border overflow-x-auto">
        <Table className="text-lg"> {/* Increased base font size */}
          <TableHeader>
            <TableRow>
              <TableHead className="w-[200px] text-lg">Product</TableHead>
              <TableHead className="text-lg">User</TableHead>
              <TableHead className="text-lg">Rating</TableHead>
              <TableHead className="text-lg">Comment</TableHead>
              <TableHead className="text-lg">Date</TableHead>
              <TableHead className="text-lg">Status</TableHead>
              <TableHead className="text-lg">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8">
                  Loading feedbacks...
                </TableCell>
              </TableRow>
            ) : groupedFeedbacks.length > 0 ? (
              groupedFeedbacks.map(({ product, feedbacks }) => {
                const isExpanded = expandedProducts[product?._id || "unknown"];
                const displayFeedbacks = isExpanded ? feedbacks : [feedbacks[0]];
                console.log("Product in feedback table:", product);
                return (
                  <Fragment key={product?._id || "unknown"}>
                    {displayFeedbacks.map((feedback, idx) => (
                      <TableRow key={feedback._id}>
                        {idx === 0 ? (
                          <TableCell 
                          rowSpan={isExpanded ? feedbacks.length : 1}
                          className="align-top font-semibold"
                        >
                          <div className="flex items-center gap-2">
                            {
                            product?.image && (
                              <img
                                src={product.image}
                                alt={product?.title || product?.name}
                                className="w-10 h-10 object-cover rounded border"
                                style={{ minWidth: 40, minHeight: 40 }}
                              />
                            )}
                            <span 
                              className="cursor-pointer hover:text-blue-600 flex items-center"
                              onClick={() => toggleProductExpansion(product?._id || "unknown")}
                            >
                              {product?.title || product?.name || "Unknown Product"}
                              {feedbacks.length > 1 && (
                                isExpanded ? (
                                  <ChevronUp className="ml-1 h-4 w-4" />
                                ) : (
                                  <ChevronDown className="ml-1 h-4 w-4" />
                                )
                              )}
                            </span>
                            {/* Optional: keep the dialog icon for large preview */}
                            {product?.image && (
                              <Dialog>
                                <DialogTrigger asChild>
                                  <Button 
                                    variant="ghost" 
                                    size="icon" 
                                    className="h-8 w-8 p-0"
                                    onClick={(e) => e.stopPropagation()}
                                  >
                                    <ImageIcon className="h-4 w-4" />
                                  </Button>
                                </DialogTrigger>
                                <DialogContent aria-describedby={undefined} className="sm:max-w-[425px]">
                                  <img 
                                    src={product.image} 
                                    alt={product?.title || product?.name} 
                                    className="w-full h-auto rounded"
                                  />
                                </DialogContent>
                              </Dialog>
                            )}
                          </div>
                          {idx === 0 && feedbacks.length > 1 && !isExpanded && (
                            <div className="text-xs text-muted-foreground mt-1">
                              + {feedbacks.length - 1} more feedback{feedbacks.length > 2 ? "s" : ""}
                            </div>
                          )}
                        </TableCell>
                        ) : null}
                        <TableCell>{feedback.userName || feedback.user?.userName || "Anonymous"}</TableCell>
                        <TableCell>
                          <span className="font-semibold">{feedback.rating}</span>/5
                        </TableCell>
                        <TableCell className="max-w-[300px] truncate">
                          {feedback.comment || "No comment"}
                        </TableCell>
                        <TableCell>
                          {new Date(feedback.createdAt).toLocaleDateString()}
                        </TableCell>
                        <TableCell>
                          <span className={`font-semibold ${
                            feedback.status === "approved" ? "text-green-600" :
                            feedback.status === "rejected" ? "text-red-600" :
                            "text-yellow-600"
                          }`}>
                            {feedback.status.charAt(0).toUpperCase() + feedback.status.slice(1)}
                          </span>
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            {feedback.status === "pending" ? (
                              <>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleStatusChange(feedback._id, "approved")}
                                >
                                  Approve
                                </Button>
                                <Button
                                  variant="destructive"
                                  size="sm"
                                  onClick={() => handleStatusChange(feedback._id, "rejected")}
                                >
                                  Reject
                                </Button>
                              </>
                            ) : (
                              <Button
                                variant={feedback.status === "approved" ? "default" : "outline"}
                                size="sm"
                                onClick={() => handleStatusToggle(feedback._id, feedback.status)}
                              >
                                {feedback.status === "approved" ? "Mark as Rejected" : "Approve"}
                              </Button>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </Fragment>
                );
              })
            ) : (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8">
                  {totalProductCount > 0 ? (
                    <div>
                      <p>No feedback matches your filters</p>
                      <button 
                        onClick={() => {
                          setStatusFilter("");
                          setDateRangeFilter("");
                          setSearchQuery("");
                        }}
                        className="mt-2 text-sm text-blue-600 hover:text-blue-800"
                      >
                        Clear filters to see all feedback
                      </button>
                    </div>
                  ) : (
                    <p>No feedback available</p>
                  )}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}