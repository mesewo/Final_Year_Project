import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useDispatch, useSelector } from "react-redux";
import { fetchApprovedSellerProducts } from "@/store/seller/products-slice";
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
      dispatch(fetchApprovedSellerProducts());
      // Fetch my requests
      dispatch(fetchMyRequests());
    }
  }, [dispatch, user?.id]);


  const stockStatus = (stock) => {
    if (stock > 10) return "success";
    if (stock > 0) return "warning";
    return "destructive";
  };


  const approvedQuantities = myRequests
  .filter(r => r.status === "approved" && r.product)
  .reduce((acc, r) => {
    const id = r.product._id;
    acc[id] = (acc[id] || 0) + (r.quantity || 0);
    return acc;
  }, {});

  const approvedProductIds = Object.keys(approvedQuantities);

  const approvedProducts = products?.filter(product =>
  approvedProductIds.includes(product._id)
  );

  const uniqueApprovedProducts = approvedProducts
  ? Object.values(
      approvedProducts.reduce((acc, product) => {
        acc[product._id] = product;
        return acc;
      }, {})
    )
  : [];

  const approvedRequestDates = myRequests
  .filter(r => r.status === "approved" && r.product)
  .reduce((acc, r) => {
    const id = r.product._id;
    const reqDate = new Date(r.createdAt);
    if (!acc[id] || reqDate > acc[id]) {
      acc[id] = reqDate;
    }
    return acc;
  }, {});

  const sortedApprovedProducts = [...uniqueApprovedProducts].sort((a, b) => {
    const dateA = approvedRequestDates[a._id] || new Date(0);
    const dateB = approvedRequestDates[b._id] || new Date(0);
    return dateB - dateA;
  });


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
              {/* <TableHead>Actions</TableHead> */}
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedApprovedProducts?.map((product) => (
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
                {/* <TableCell>
                  <Button variant="outline" size="sm" asChild>
                    <Link to={`/seller-view/products/edit/${product._id}`}>
                      Edit
                    </Link>
                  </Button>
                </TableCell> */}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
