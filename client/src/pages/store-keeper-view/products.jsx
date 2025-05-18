import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { useDispatch, useSelector } from "react-redux";
import { fetchInventory, requestStockReplenishment } from "@/store/store-keeper/inventory-slice";
import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";

export default function StoreKeeperProducts() {
  const dispatch = useDispatch();
  const inventory = useSelector(state => state.inventory.inventory || []);
  const loading = useSelector(state => state.inventory.loading);
  const [requestQuantities, setRequestQuantities] = useState({});

  useEffect(() => {
    dispatch(fetchInventory());
  }, [dispatch]);

  const handleRequestStock = (productId) => {
    const quantity = requestQuantities[productId] || 10; // Default to 10 if not specified
    dispatch(requestStockReplenishment({ productId, quantity }));
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Inventory Management</h1>
      
      {loading ? (
        <div>Loading inventory...</div>
      ) : (
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Product</TableHead>
                <TableHead>Current Stock</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Request Quantity</TableHead>
                <TableHead>Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {inventory?.map(product => (
                <TableRow key={product._id}>
                  <TableCell className="font-medium">{product.title}</TableCell>
                  <TableCell>{product.totalStock}</TableCell>
                  <TableCell>
                    <Badge variant={
                      product.totalStock === 0 ? 'destructive' : 
                      product.totalStock <= product.lowStockThreshold ? 'warning' : 'success'
                    }>
                      {product.totalStock === 0 ? 'Out of Stock' : 
                       product.totalStock <= product.lowStockThreshold ? 'Low Stock' : 'In Stock'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Input
                      type="number"
                      min="1"
                      value={requestQuantities[product._id] || ''}
                      onChange={(e) => setRequestQuantities({
                        ...requestQuantities,
                        [product._id]: parseInt(e.target.value) || 0
                      })}
                      className="w-24"
                      placeholder="10"
                    />
                  </TableCell>
                  <TableCell>
                    <Button 
                      size="sm"
                      variant="outline"
                      onClick={() => handleRequestStock(product._id)}
                    >
                      Request Stock
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}