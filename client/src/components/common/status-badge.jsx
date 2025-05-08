import { Badge } from "../ui/badge";

export function StatusBadge({ status }) {
  const statusConfig = {
    pending: { label: "Pending", variant: "secondary" },
    inProcess: { label: "In Process", variant: "info" },
    processing: { label: "Processing", variant: "info" },
    inShipping: { label: "In Shipping", variant: "warning" },
    shipped: { label: "Shipped", variant: "warning" },
    delivered: { label: "Delivered", variant: "success" },
    cancelled: { label: "Cancelled", variant: "destructive" },
    rejected: { label: "Rejected", variant: "destructive" },
    active: { label: "Active", variant: "success" },
    blocked: { label: "Blocked", variant: "destructive" },
    in_stock: { label: "In Stock", variant: "success" },
    low_stock: { label: "Low Stock", variant: "warning" },
    out_of_stock: { label: "Out of Stock", variant: "destructive" },
  };

  const config = statusConfig[status] || { label: status, variant: "default" };

  return <Badge variant={config.variant}>{config.label}</Badge>;
}

