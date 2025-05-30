import { Dialog, DialogContent } from "@/components/ui/dialog";
// import { useDispatch, useSelector } from "react-redux";
import { fetchProductWithFeedbacks, clearProductDetails } from "@/store/factman/products-slice";
// import { useState } from "react";

import { Fragment, useEffect, useState } from "react";
import ProductImageUpload from "@/components/factman-view/image-upload";
import FactmanProductTile from "@/components/factman-view/product-tile";
import CommonForm from "@/components/common/form";
import { Button } from "@/components/ui/button";
import { useSelector, useDispatch } from "react-redux";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { addProductFormElements } from "@/config";
import {
  addNewProduct,
  deleteProduct,
  editProduct,
  fetchAllProducts,
} from "@/store/factman/products-slice";

// Helper for date filtering
function isWithinSelectedDateRange(productDate, dateRange) {
  const currentDate = new Date();
  const productCreationDate = new Date(productDate);

  function getStartOfWeek(date) {
    const d = new Date(date);
    d.setHours(0, 0, 0, 0);
    d.setDate(d.getDate() - d.getDay());
    return d;
  }
  function getEndOfWeek(date) {
    const d = getStartOfWeek(date);
    d.setDate(d.getDate() + 6);
    d.setHours(23, 59, 59, 999);
    return d;
  }

  switch (dateRange) {
    case "today":
      return productCreationDate.toDateString() === currentDate.toDateString();
    case "yesterday": {
      const yesterday = new Date(currentDate);
      yesterday.setDate(currentDate.getDate() - 1);
      return productCreationDate.toDateString() === yesterday.toDateString();
    }
    case "this_week": {
      const weekStart = getStartOfWeek(currentDate);
      const weekEnd = getEndOfWeek(currentDate);
      return productCreationDate >= weekStart && productCreationDate <= weekEnd;
    }
    case "last_week": {
      const lastWeekEnd = getStartOfWeek(currentDate);
      const lastWeekStart = new Date(lastWeekEnd);
      lastWeekStart.setDate(lastWeekEnd.getDate() - 7);
      lastWeekEnd.setDate(lastWeekEnd.getDate() - 1);
      return productCreationDate >= lastWeekStart && productCreationDate <= lastWeekEnd;
    }
    case "this_month":
      return (
        productCreationDate.getMonth() === currentDate.getMonth() &&
        productCreationDate.getFullYear() === currentDate.getFullYear()
      );
    case "last_month": {
      const lastMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1);
      return (
        productCreationDate.getMonth() === lastMonth.getMonth() &&
        productCreationDate.getFullYear() === lastMonth.getFullYear()
      );
    }
    case "this_year":
      return productCreationDate.getFullYear() === currentDate.getFullYear();
    default:
      return true;
  }
}

const initialProductFormData = {
  image: null,
  title: "",
  description: "",
  category: "",
  brand: "",
  price: "",
  salePrice: "",
  totalStock: "",
  averageReview: 0,
};

function FactmanProducts() {
  const [isCreateProductDialogOpen, setIsCreateProductDialogOpen] = useState(false);
  const [productFormData, setProductFormData] = useState(initialProductFormData);
  const [imageFile, setImageFile] = useState(null);
  const [uploadedImageUrl, setUploadedImageUrl] = useState("");
  const [isImageUploading, setIsImageUploading] = useState(false);
  const [currentlyEditingProductId, setCurrentlyEditingProductId] = useState(null);
  const [openDetailsId, setOpenDetailsId] = useState(null);
  const { productDetails } = useSelector((state) => state.factmanProducts);
  // Filters
  const [searchQuery, setSearchQuery] = useState("");
  const [searchField, setSearchField] = useState("title");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedDateRange, setSelectedDateRange] = useState("");
  const [selectedMainCategory, setSelectedMainCategory] = useState(null);

  const { productList } = useSelector((state) => state.factmanProducts);
  const dispatch = useDispatch();
  const { toast } = useToast();

  function handleProductFormSubmit(event) {
    event.preventDefault();
    
    // Validate numeric fields
    const isPriceValid = Number(productFormData.price) >= 0;
    const isSalePriceValid = productFormData.salePrice === "" || Number(productFormData.salePrice) >= 0;
    const isStockValid = Number(productFormData.totalStock) >= 0;
    
    if (!isPriceValid || !isSalePriceValid || !isStockValid) {
      toast({
        title: "Invalid input",
        description: "Price, Sale Price, and Total Stock must be positive numbers.",
        variant: "destructive",
      });
      return;
    }

    const productAction = currentlyEditingProductId !== null
      ? dispatch(editProduct({
          id: currentlyEditingProductId,
          formData: productFormData
        }))
      : dispatch(addNewProduct({
          ...productFormData,
          image: uploadedImageUrl,
        }));

    productAction.then((data) => {
      if (data?.payload?.success) {
        dispatch(fetchAllProducts());
        setIsCreateProductDialogOpen(false);
        setProductFormData(initialProductFormData);
        
        if (!currentlyEditingProductId) {
          setImageFile(null);
          toast({
            title: "Product added successfully",
          });
        }
        
        setCurrentlyEditingProductId(null);
      }
    });
  }

  function handleProductDeletion(productId) {
    // Show confirmation dialog
    if (!window.confirm("Are you sure you want to delete this product?")) {
      return;
    }
    dispatch(deleteProduct(productId)).then((data) => {
      if (data?.payload?.success) {
        dispatch(fetchAllProducts());
        toast({
          title: "Product deleted successfully",
        });
      }
    });
  }

  function handleViewDetails(productId) {
  setOpenDetailsId(productId);
  dispatch(fetchProductWithFeedbacks(productId));
  }

  function handleCloseDetails() {
    setOpenDetailsId(null);
    dispatch(clearProductDetails());
  }

  function isProductFormValid() {
    const requiredFieldsValid = Object.keys(productFormData)
      .filter(field => field !== "averageReview")
      .every(field => productFormData[field] !== "");
      
    const numericFieldsValid = 
      Number(productFormData.price) >= 0 &&
      (productFormData.salePrice === "" || Number(productFormData.salePrice) >= 0) &&
      Number(productFormData.totalStock) >= 0;
    
    return requiredFieldsValid && numericFieldsValid;
  }

  useEffect(() => {
    dispatch(fetchAllProducts());
  }, [dispatch]);

  const allProducts = productList || [];

  // Apply filters to products
  let filteredProducts = allProducts;

  // Category filter (dropdown)
  if (selectedCategory) {
    filteredProducts = filteredProducts.filter(
      product => product.category === selectedCategory
    );
  }

  // Date range filter
  if (selectedDateRange) {
    filteredProducts = filteredProducts.filter(product =>
      isWithinSelectedDateRange(product.createdAt, selectedDateRange)
    );
  }

  // Search filter
  if (searchQuery) {
    filteredProducts = filteredProducts.filter((product) => {
      const searchValue = searchQuery.toLowerCase();
      switch (searchField) {
        case "title":
          return (product.title || "").toLowerCase().includes(searchValue);
        case "price":
          return String(product.price).includes(searchQuery);
        case "category":
          return (product.category || "").toLowerCase().includes(searchValue);
        default:
          return true;
      }
    });
  }

  // Dynamically count filtered products by category
  const menCount = filteredProducts.filter(p => p.category === "men").length;
  const womenCount = filteredProducts.filter(p => p.category === "women").length;
  const kidsCount = filteredProducts.filter(p => p.category === "kids").length;
  const totalCount = filteredProducts.length;

  // Show products for selected main category (after filters)
  const displayedProducts = selectedMainCategory
    ? filteredProducts.filter(p => p.category === selectedMainCategory)
    : [];

  // Filters
  const availableCategories = productList && productList.length > 0
    ? Array.from(new Set(productList.map(product => product.category).filter(Boolean)))
    : [];

  // Date filter options for button row
  const dateOptions = [
    { value: "", label: "All Dates" },
    { value: "today", label: "Today" },
    { value: "yesterday", label: "Yesterday" },
    { value: "this_week", label: "This Week" },
    { value: "last_week", label: "Last Week" },
    { value: "this_month", label: "This Month" },
    { value: "last_month", label: "Last Month" },
    { value: "this_year", label: "This Year" },
  ];

  return (
    <Fragment>
      {/* First row: Add Product, Category Dropdown, Search */}
      <div className="mb-3 w-full flex flex-col md:flex-row md:items-center md:justify-between gap-2">
        <Button 
          onClick={() => setIsCreateProductDialogOpen(true)}
          className="bg-blue-600 hover:bg-blue-700"
        >
          Add New Product
        </Button>
        <div className="flex flex-wrap gap-2 items-center">
          <select
            name="categoryFilter"
            id="categoryFilter"
            className="border rounded px-2 py-1 bg-white shadow-sm"
            value={selectedCategory}
            onChange={e => setSelectedCategory(e.target.value)}
          >
            <option value="">All Categories</option>
            {availableCategories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
          <select
            name="searchField"
            id="searchField"
            className="border rounded px-2 py-1 bg-white shadow-sm"
            value={searchField}
            onChange={e => setSearchField(e.target.value)}
          >
            <option value="title">Search by Name</option>
            <option value="price">Search by Price</option>
            <option value="category">Search by Category</option>
          </select>
          <Input
            name="productSearch"
            id="productSearch"
            placeholder={`Search products...`}
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-48 shadow-sm"
          />
        </div>
      </div>

      {/* Second row: Date filter buttons */}
      <div className="flex gap-1 mb-6 flex-wrap">
        {dateOptions.map(opt => (
          <button
            key={opt.value}
            type="button"
            onClick={() => setSelectedDateRange(opt.value)}
            className={`px-3 py-1 rounded-full border transition
              ${selectedDateRange === opt.value
                ? "bg-blue-600 text-white border-blue-600 shadow"
                : "bg-white text-gray-700 border-gray-300 hover:bg-blue-50"}
            `}
            style={{ fontWeight: selectedDateRange === opt.value ? "bold" : "normal" }}
          >
            {opt.label}
          </button>
        ))}
      </div>

      {/* Summary Row: Total Products */}
      <div className="flex gap-4 mb-6 flex-wrap">
        <div className="px-4 py-2 rounded bg-blue-50 text-blue-900 font-semibold shadow">
          Total Products: {totalCount}
        </div>
        <div className="px-4 py-2 rounded bg-blue-100 text-blue-900 font-semibold shadow">
          Men: {menCount}
        </div>
        <div className="px-4 py-2 rounded bg-pink-100 text-pink-900 font-semibold shadow">
          Women: {womenCount}
        </div>
        <div className="px-4 py-2 rounded bg-green-100 text-green-900 font-semibold shadow">
          Kids: {kidsCount}
        </div>
      </div>

      {/* Category Cards with dynamic counts */}
      <div className="flex gap-6 mb-8">
        <div
          className={`flex-1 p-6 rounded-lg shadow cursor-pointer border-2 ${selectedMainCategory === "men" ? "border-blue-600 bg-blue-50" : "border-gray-200"}`}
          onClick={() => setSelectedMainCategory("men")}
        >
          <h3 className="text-xl font-bold mb-2">Men</h3>
          <p className="text-3xl">{menCount}</p>
        </div>
        <div
          className={`flex-1 p-6 rounded-lg shadow cursor-pointer border-2 ${selectedMainCategory === "women" ? "border-pink-600 bg-pink-50" : "border-gray-200"}`}
          onClick={() => setSelectedMainCategory("women")}
        >
          <h3 className="text-xl font-bold mb-2">Women</h3>
          <p className="text-3xl">{womenCount}</p>
        </div>
        <div
          className={`flex-1 p-6 rounded-lg shadow cursor-pointer border-2 ${selectedMainCategory === "kids" ? "border-green-600 bg-green-50" : "border-gray-200"}`}
          onClick={() => setSelectedMainCategory("kids")}
        >
          <h3 className="text-xl font-bold mb-2">Kids</h3>
          <p className="text-3xl">{kidsCount}</p>
        </div>
      </div>

      {/* Show products for selected category only */}
      {selectedMainCategory && (
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold capitalize">
              {selectedMainCategory} Products ({displayedProducts.length})
            </h2>
            <Button
              variant="outline"
              onClick={() => setSelectedMainCategory(null)}
            >
              Show All Categories
            </Button>
          </div>
          <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-4">
            {displayedProducts.length > 0 ? (
              displayedProducts.map((product) => (
                <FactmanProductTile
                  key={product._id || product.id}
                  setFormData={setProductFormData}
                  setOpenCreateProductsDialog={setIsCreateProductDialogOpen}
                  setCurrentEditedId={setCurrentlyEditingProductId}
                  product={product}
                  handleDelete={handleProductDeletion}
                  onViewDetails={handleViewDetails}
                />
              ))
            ) : (
              <div className="col-span-full text-center py-10">
                <p className="text-gray-500">No products found</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Add Product Sheet */}
      <Sheet
        open={isCreateProductDialogOpen}
        onOpenChange={() => {
          setIsCreateProductDialogOpen(false);
          setCurrentlyEditingProductId(null);
          setProductFormData(initialProductFormData);
        }}
      >
        <SheetContent side="right" className="overflow-auto">
          <SheetHeader>
            <SheetTitle>
              {currentlyEditingProductId !== null ? "Edit Product" : "Add New Product"}
            </SheetTitle>
            <SheetDescription>
              {currentlyEditingProductId !== null
                ? "Update the product details below."
                : "Fill in the form to add a new product."}
            </SheetDescription>
          </SheetHeader>
          <ProductImageUpload
            imageFile={imageFile}
            setImageFile={setImageFile}
            uploadedImageUrl={uploadedImageUrl}
            setUploadedImageUrl={setUploadedImageUrl}
            setImageLoadingState={setIsImageUploading}
            imageLoadingState={isImageUploading}
            isEditMode={currentlyEditingProductId !== null}
          />
          <div className="py-6">
            <CommonForm
              onSubmit={handleProductFormSubmit}
              formData={productFormData}
              setFormData={setProductFormData}
              buttonText={currentlyEditingProductId !== null ? "Save Changes" : "Add Product"}
              formControls={addProductFormElements}
              isBtnDisabled={!isProductFormValid()}
            />
          </div>
        </SheetContent>
      </Sheet>

      {/* Product Details Dialog */}

      <Dialog open={!!openDetailsId} onOpenChange={handleCloseDetails}>
        <DialogContent>
          {productDetails ? (
            <div>
              <h2 className="text-2xl font-bold mb-2">{productDetails.title}</h2>
              <img src={productDetails.image} alt={productDetails.title} className="w-full max-w-xs mb-4" />
              <div className="mb-2">{productDetails.description}</div>
              <div className="mb-2">Stock: {productDetails.totalStock}</div>
              <div className="mb-4">Category: {productDetails.category}</div>
              <h3 className="font-bold mb-2">Feedbacks</h3>
              {productDetails.feedbacks && productDetails.feedbacks.length > 0 ? (
                productDetails.feedbacks.map(fb => (
                  <div key={fb._id} className="border-b py-2 flex justify-between items-center">
                    <div>
                      <strong>{fb.userName}</strong>: {fb.comment}
                      <span className="ml-2 text-yellow-600">({fb.rating}★)</span>
                    </div>
                    {/* Add edit/delete buttons here if Factman can CRUD feedbacks */}
                  </div>
                ))
              ) : (
                <div className="text-muted-foreground">No feedbacks yet.</div>
              )}
            </div>
          ) : (
            <div>Loading...</div>
          )}
        </DialogContent>
      </Dialog>
    </Fragment>
  );
}

export default FactmanProducts;