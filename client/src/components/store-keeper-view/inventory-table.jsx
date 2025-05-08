import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DataTable } from "@/components/common/data-table";
import { StatusBadge } from "@/components/common/status-badge";

export function InventoryTable({ inventory, onUpdateStock, onRequestStock }) {
  const [editingId, setEditingId] = useState(null);
  const [stockValues, setStockValues] = useState({});

  const columns = [
    {
      header: "Product",
      accessor: "title",
      cell: ({ row }) => (
        <div className="flex items-center gap-3">
          <img 
            src={row.image} 
            className="w-10 h-10 object-cover rounded"
            alt={row.title}
          />
          <span>{row.title}</span>
        </div>
      )
    },
    {
      header: "Current Stock",
      accessor: "totalStock",
      cell: ({ row }) => (
        editingId === row._id ? (
          <Input
            type="number"
            value={stockValues[row._id] || row.totalStock}
            onChange={(e) => setStockValues({
              ...stockValues,
              [row._id]: parseInt(e.target.value) || 0
            })}
            className="w-24"
          />
        ) : row.totalStock
      )
    },
    {
      header: "Status",
      accessor: "status",
      cell: ({ row }) => (
        <StatusBadge status={
          row.totalStock === 0 ? 'out_of_stock' : 
          row.totalStock <= row.lowStockThreshold ? 'low_stock' : 'in_stock'
        } />
      )
    },
    {
      header: "Actions",
      cell: ({ row }) => (
        <div className="flex gap-2">
          {editingId === row._id ? (
            <>
              <Button 
                size="sm" 
                onClick={() => {
                  onUpdateStock(row._id, stockValues[row._id]);
                  setEditingId(null);
                }}
              >
                Save
              </Button>
              <Button 
                size="sm" 
                variant="outline"
                onClick={() => setEditingId(null)}
              >
                Cancel
              </Button>
            </>
          ) : (
            <>
              <Button 
                size="sm" 
                variant="outline"
                onClick={() => {
                  setEditingId(row._id);
                  setStockValues({
                    ...stockValues,
                    [row._id]: row.totalStock
                  });
                }}
              >
                Update
              </Button>
              <Button 
                size="sm" 
                variant="outline"
                onClick={() => onRequestStock(row._id, 10)} // Default 10 units
              >
                Request Stock
              </Button>
            </>
          )}
        </div>
      )
    }
  ];

  return (
    <DataTable 
      columns={columns} 
      data={inventory} 
    />
  );
}