import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Link } from "react-router-dom"; // Updated import

export default function StoreKeeperDashboard() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Inventory Dashboard</h1>
      
      <div className="grid gap-4 md:grid-cols-3">
        <Link to="/store-keeper-view/inventory">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium">Total Items</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">1,842</p>
            </CardContent>
          </Card>
        </Link>
        
        <Link to="/store-keeper-view/inventory?filter=low">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium">Low Stock</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">27</p>
            </CardContent>
          </Card>
        </Link>
        
        <Link to="/store-keeper-view/products">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium">Pending Updates</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">12</p>
            </CardContent>
          </Card>
        </Link>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Recent Inventory Changes</CardTitle>
          </CardHeader>
          <CardContent>
            {/* Inventory change log */}
            <Link to="/store-keeper-view/inventory">
              <Button variant="outline" className="mt-4 w-full">
                View Full Inventory
              </Button>
            </Link>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button className="w-full">Add New Product</Button>
            <Button variant="outline" className="w-full">
              Request Stock Replenishment
            </Button>
            <Button variant="outline" className="w-full">
              Generate Stock Report
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}