import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useDispatch, useSelector } from "react-redux";
import { fetchSellerProducts } from "@/store/seller/products-slice";
import { fetchMyRequests } from "@/store/productRequest-slice";
import { useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";

export default function SellerProducts() {
  const dispatch = useDispatch();
  const { products } = useSelector((state) => state.sellerProducts);
  const { user } = useSelector((state) => state.auth);
  const myRequests = useSelector((state) => state.productRequest.myRequests || []);

  useEffect(() => {
    if (user?.id) {
      dispatch(fetchSellerProducts());
      // Fetch my requests
      dispatch(fetchMyRequests());
    }
  }, [dispatch, user?.id]);


  const stockStatus = (stock) => {
    if (stock > 10) return "success";
    if (stock > 0) return "warning";
    return "destructive";
  };

  const approvedProductIds = myRequests
  .filter(r => r.status === "approved" && r.product)
  .map(r => r.product._id);

  const approvedProducts = products?.filter(product =>
  approvedProductIds.includes(product._id)
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">My Products</h1>
        <Button asChild>
          {/* <Link to="/seller-view/products/add">Add New Product</Link> */}
        </Button>
      </div>
      
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Product</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Stock</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {approvedProducts?.map((product) => (
              <TableRow key={product._id}>
                <TableCell className="font-medium flex items-center gap-3">
                  <img 
                    src={product.image} 
                    className="w-10 h-10 object-cover rounded"
                    alt={product.title}
                  />
                  {product.title}
                </TableCell>
                <TableCell>Br{product.price}</TableCell>
                <TableCell>
                  <Badge variant={stockStatus(product.totalStock)}>
                    {product.totalStock}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge variant={product.isActive ? "default" : "secondary"}>
                    {product.isActive ? "Active" : "Inactive"}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Button variant="outline" size="sm" asChild>
                    <Link to={`/seller-view/products/edit/${product._id}`}>
                      Edit
                    </Link>
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
