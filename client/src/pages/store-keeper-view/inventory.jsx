import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { useDispatch, useSelector } from "react-redux";
import { fetchInventory } from "@/store/inventory-slice";
import { useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { updateStock } from "@/store/inventory-slice";

export default function InventoryManagement() {
  const dispatch = useDispatch();
  const { inventory } = useSelector((state) => state.inventory);
  const [editingId, setEditingId] = useState(null);
  const [stockValues, setStockValues] = useState({});

  useEffect(() => {
    dispatch(fetchInventory());
  }, [dispatch]);

  const handleStockChange = (productId, value) => {
    setStockValues(prev => ({
      ...prev,
      [productId]: value
    }));
  };

  const handleSaveStock = (productId) => {
    dispatch(updateStock({
      productId,
      quantity: stockValues[productId]
    })).then(() => {
      setEditingId(null);
    });
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Inventory Management</h1>
      
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Product</TableHead>
              <TableHead>Current Stock</TableHead>
              <TableHead>Low Stock Threshold</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {inventory?.map((item) => (
              <TableRow key={item._id}>
                <TableCell className="font-medium flex items-center gap-3">
                  <img 
                    src={item.image} 
                    className="w-10 h-10 object-cover rounded"
                    alt={item.title}
                  />
                  {item.title}
                </TableCell>
                <TableCell>
                  {editingId === item._id ? (
                    <Input 
                      type="number" 
                      value={stockValues[item._id] || item.stock}
                      onChange={(e) => handleStockChange(item._id, e.target.value)}
                      className="w-24"
                    />
                  ) : (
                    item.stock
                  )}
                </TableCell>
                <TableCell>{item.lowStockThreshold}</TableCell>
                <TableCell>
                  <Badge variant={
                    item.stock === 0 ? "destructive" : 
                    item.stock <= item.lowStockThreshold ? "warning" : "success"
                  }>
                    {item.stock === 0 ? "Out of Stock" : 
                     item.stock <= item.lowStockThreshold ? "Low Stock" : "In Stock"}
                  </Badge>
                </TableCell>
                <TableCell>
                  {editingId === item._id ? (
                    <Button 
                      size="sm" 
                      onClick={() => handleSaveStock(item._id)}
                    >
                      Save
                    </Button>
                  ) : (
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => {
                        setEditingId(item._id);
                        setStockValues(prev => ({
                          ...prev,
                          [item._id]: item.stock
                        }));
                      }}
                    >
                      Update
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}