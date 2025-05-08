import AdminProductTile from "@/components/admin-view/product-tile";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Fragment, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllProducts } from "@/store/admin/products-slice";

function AdminProducts() {
  const [openProductDetailsDialog, setOpenProductDetailsDialog] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const { productList } = useSelector((state) => state.adminProducts);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchAllProducts());
  }, [dispatch]);

  function handleSeeDetails(product) {
    setSelectedProduct(product);
    setOpenProductDetailsDialog(true);
  }

  return (
    <Fragment>
      <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-4">
        {productList && productList.length > 0
          ? productList.map((productItem) => (
              <AdminProductTile
                key={productItem._id}
                product={productItem}
                handleSeeDetails={() => handleSeeDetails(productItem)}
              />
            ))
          : null}
      </div>
      <Sheet
        open={openProductDetailsDialog}
        onOpenChange={() => {
          setOpenProductDetailsDialog(false);
          setSelectedProduct(null);
        }}
      >
        <SheetContent side="right" className="overflow-auto">
          <SheetHeader>
            <SheetTitle>Product Details</SheetTitle>
          </SheetHeader>
          {selectedProduct && (
            <div className="py-6 space-y-4">
              <div>
                <strong>Title:</strong> {selectedProduct.title}
              </div>
              <div>
                <strong>Description:</strong> {selectedProduct.description}
              </div>
              <div>
                <strong>Category:</strong> {selectedProduct.category}
              </div>
              <div>
                <strong>Brand:</strong> {selectedProduct.brand}
              </div>
              <div>
                <strong>Price:</strong> Br{selectedProduct.price}
              </div>
              <div>
                <strong>Sale Price:</strong> Br{selectedProduct.salePrice || "N/A"}
              </div>
              <div>
                <strong>Total Stock:</strong> {selectedProduct.totalStock}
              </div>
              <div>
                <strong>Average Review:</strong> {selectedProduct.averageReview}
              </div>
              <div>
                <strong>Image:</strong>
                <img
                  src={selectedProduct.image}
                  alt={selectedProduct.title}
                  className="w-full h-auto mt-2"
                />
              </div>
            </div>
          )}
        </SheetContent>
      </Sheet>
    </Fragment>
  );
}

export default AdminProducts;