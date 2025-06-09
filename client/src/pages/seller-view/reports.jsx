import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { CalendarDateRangePicker } from "@/components/ui/date-range-picker";
import { useDispatch, useSelector } from "react-redux";
import { generateSellerSalesReport } from "@/store/seller/reports-slice";
import { useEffect, useState } from "react";
import { BarChart } from "@/components/ui/charts";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export default function SellerReports() {
  const dispatch = useDispatch();
  const { salesReport, loading } = useSelector(state => state.sellerReports);
  console.log("Sales Report Data:", salesReport);
  const [dateRange, setDateRange] = useState({
    start: new Date(new Date().setMonth(new Date().getMonth() - 1)),
    end: new Date()
  });

  useEffect(() => {
    if (dateRange.start && dateRange.end) {
      dispatch(generateSellerSalesReport({
        startDate: dateRange.start.toISOString(),
        endDate: dateRange.end.toISOString()
      }));
    }
  }, [dateRange, dispatch]);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <CalendarDateRangePicker 
          dateRange={dateRange}
          onDateChange={setDateRange}
        />
      </div>

      {loading ? (
        <div>Loading sales data...</div>
      ) : (
        <>
          <Card>
            <CardHeader>
              <CardTitle>Sales Overview</CardTitle>
            </CardHeader>
            <CardContent className="h-80">
              <BarChart 
                data={salesReport}
                xKey="productName"
                yKey="totalRevenue"
                color="#4CAF50"
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Product Sales Details</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Product</TableHead>
                    <TableHead>Units Sold</TableHead>
                    <TableHead>Total Revenue</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {salesReport?.map(item => (
                    <TableRow key={item._id}>
                      <TableCell className="font-medium">{item.productName}</TableCell>
                      <TableCell>{item.totalSold}</TableCell>
                      <TableCell>Br{item.totalRevenue?.toFixed(2)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}