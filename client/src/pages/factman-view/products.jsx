import ProductImageUpload from "@/components/factman-view/image-upload";
import FactmanProductTile from "@/components/factman-view/product-tile";
import CommonForm from "@/components/common/form";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
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
import { Fragment, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

// Helper for date filtering with more descriptive names
function isWithinSelectedDateRange(productDate, dateRange) {
  const currentDate = new Date();
  const productCreationDate = new Date(productDate);
  
  switch (dateRange) {
    case "today":
      return productCreationDate.toDateString() === currentDate.toDateString();
    case "yesterday": {
      const yesterday = new Date(currentDate);
      yesterday.setDate(currentDate.getDate() - 1);
      return productCreationDate.toDateString() === yesterday.toDateString();
    }
    case "this_week": {
      const firstDayOfWeek = currentDate.getDate() - currentDate.getDay();
      const lastDayOfWeek = firstDayOfWeek + 6;
      const weekStartDate = new Date(currentDate.setDate(firstDayOfWeek));
      const weekEndDate = new Date(currentDate.setDate(lastDayOfWeek));
      return productCreationDate >= weekStartDate && productCreationDate <= weekEndDate;
    }
    case "last_week": {
      const previousWeekDate = new Date();
      const firstDayOfLastWeek = previousWeekDate.getDate() - previousWeekDate.getDay() - 7;
      const lastDayOfLastWeek = firstDayOfLastWeek + 6;
      const lastWeekStartDate = new Date(previousWeekDate.setDate(firstDayOfLastWeek));
      const lastWeekEndDate = new Date(previousWeekDate.setDate(lastDayOfLastWeek));
      return productCreationDate >= lastWeekStartDate && productCreationDate <= lastWeekEndDate;
    }
    case "this_month":
      return productCreationDate.getMonth() === currentDate.getMonth() && 
             productCreationDate.getFullYear() === currentDate.getFullYear();
    case "last_month": {
      const lastMonthDate = new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1);
      return productCreationDate.getMonth() === lastMonthDate.getMonth() && 
             productCreationDate.getFullYear() === lastMonthDate.getFullYear();
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

  // Filter states with more descriptive names
  const [searchQuery, setSearchQuery] = useState("");
  const [searchField, setSearchField] = useState("title");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedDateRange, setSelectedDateRange] = useState("");

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
    dispatch(deleteProduct(productId)).then((data) => {
      if (data?.payload?.success) {
        dispatch(fetchAllProducts());
        toast({
          title: "Product deleted successfully",
        });
      }
    });
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

  // Get unique categories for filter dropdown
  const availableCategories = productList && productList.length > 0
    ? Array.from(new Set(productList.map(product => product.category).filter(Boolean)))
    : [];

  // Apply filters to products
  const allProducts = productList || [];
  const totalProductCount = allProducts.length;
  
  let filteredProducts = allProducts;
  
  // Apply category filter
  if (selectedCategory) {
    filteredProducts = filteredProducts.filter(
      product => product.category === selectedCategory
    );
  }
  
  // Apply date range filter
  if (selectedDateRange) {
    filteredProducts = filteredProducts.filter(product =>
      isWithinSelectedDateRange(product.createdAt, selectedDateRange)
    );
  }
  
  // Apply search filter
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

  // Sort by creation date (newest first)
  const sortedProducts = [...filteredProducts].sort(
    (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
  );

  const filteredProductCount = sortedProducts.length;

  // Build filter summary for display
  const activeFilters = [];
  if (selectedCategory) activeFilters.push(`Category: ${selectedCategory}`);
  if (selectedDateRange) activeFilters.push(`Date: ${selectedDateRange.replace(/_/g, " ")}`);
  if (searchQuery) activeFilters.push(`Search by ${searchField}: "${searchQuery}"`);
  
  const filterSummaryText = activeFilters.length > 0 
    ? ` (Filtered from ${totalProductCount} products)` 
    : "";

  return (
    <Fragment>
      <div className="mb-5 w-full flex flex-col md:flex-row md:items-center md:justify-between gap-2">
        <Button 
          onClick={() => setIsCreateProductDialogOpen(true)}
          className="bg-blue-600 hover:bg-blue-700"
        >
          Add New Product
        </Button>
        
        <div className="flex flex-wrap gap-2 items-center">
          <select
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
            className="border rounded px-2 py-1 bg-white shadow-sm"
            value={selectedDateRange}
            onChange={e => setSelectedDateRange(e.target.value)}
          >
            <option value="">All Dates</option>
            <option value="today">Today</option>
            <option value="yesterday">Yesterday</option>
            <option value="this_week">This Week</option>
            <option value="last_week">Last Week</option>
            <option value="this_month">This Month</option>
            <option value="last_month">Last Month</option>
            <option value="this_year">This Year</option>
          </select>
          
          <select
            className="border rounded px-2 py-1 bg-white shadow-sm"
            value={searchField}
            onChange={e => setSearchField(e.target.value)}
          >
            <option value="title">Search by Name</option>
            <option value="price">Search by Price</option>
            <option value="category">Search by Category</option>
          </select>
          
          <Input
            placeholder={`Search products...`}
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-48 shadow-sm"
          />
        </div>
      </div>
      
      <div className="mb-4 p-3 bg-gray-50 rounded-lg">
        <p className="text-sm text-gray-600">
           <span className="font-semibold">{filteredProductCount}</span> products are added
          {filterSummaryText}
        </p>
        {activeFilters.length > 0 && (
          <button 
            onClick={() => {
              setSelectedCategory("");
              setSelectedDateRange("");
              setSearchQuery("");
            }}
            className="mt-1 text-xs text-blue-600 hover:text-blue-800"
          >
            Clear all filters
          </button>
        )}
      </div>
      
      <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-4">
        {sortedProducts.length > 0 ? (
          sortedProducts.map((product) => (
            <FactmanProductTile
              key={product._id || product.id}
              setFormData={setProductFormData}
              setOpenCreateProductsDialog={setIsCreateProductDialogOpen}
              setCurrentEditedId={setCurrentlyEditingProductId}
              product={product}
              handleDelete={handleProductDeletion}
            />
          ))
        ) : (
          <div className="col-span-full text-center py-10">
            <p className="text-gray-500">No products found</p>
            {totalProductCount > 0 && filteredProductCount === 0 && (
              <button 
                onClick={() => {
                  setSelectedCategory("");
                  setSelectedDateRange("");
                  setSearchQuery("");
                }}
                className="mt-2 text-sm text-blue-600 hover:text-blue-800"
              >
                Reset filters to see all products
              </button>
            )}
          </div>
        )}
      </div>
      
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
    </Fragment>
  );
}

export default FactmanProducts;