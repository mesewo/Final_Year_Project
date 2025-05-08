import { Card } from "@/components/ui/card";
import { InventoryTable } from "@/components/store-keeper-view/inventory-table";
import { useDispatch, useSelector } from "react-redux";
import { 
  fetchInventory, 
  updateStock,
  requestStockReplenishment 
} from "@/store/store-keeper/inventory-slice";

export default function InventoryManagement() {
  const dispatch = useDispatch();
  const { inventory, loading } = useSelector(state => state.inventory);

  useEffect(() => {
    dispatch(fetchInventory());
  }, [dispatch]);

  const handleUpdateStock = (productId, quantity) => {
    dispatch(updateStock({ productId, quantity }));
  };

  const handleRequestStock = (productId, quantity) => {
    dispatch(requestStockReplenishment({ productId, quantity }));
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Inventory Management</h1>
      <Card>
        <InventoryTable
          inventory={inventory}
          onUpdateStock={handleUpdateStock}
          onRequestStock={handleRequestStock}
        />
      </Card>
    </div>
  );
}