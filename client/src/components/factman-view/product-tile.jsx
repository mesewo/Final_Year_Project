import { Button } from "../ui/button";
import { Card, CardContent, CardFooter } from "../ui/card";

function FactmanProductTile({
  product,
  setFormData,
  setOpenCreateProductsDialog,
  setCurrentEditedId,
  handleDelete,
  onViewDetails, // <-- new prop for viewing details
}) {
  return (
    <Card className="w-full max-w-sm mx-auto">
      <div>
        <div className="relative">
          <img
            src={product?.image}
            alt={product?.title}
            className="w-full h-[300px] object-cover rounded-t-lg"
          />
         {product?.totalStock === 0 ? (
            <span className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 rounded text-xs font-bold">
              Out of Stock
            </span>
          ) : product?.totalStock < 5 ? (
            <span className="absolute top-2 left-2 bg-yellow-500 text-white px-2 py-1 rounded text-xs font-bold">
              {product?.totalStock} items left
            </span>
          ) : product?.totalStock < 10 ? (
            <span className="absolute top-2 left-2 bg-yellow-500 text-white px-2 py-1 rounded text-xs font-bold">
              Low Stock
            </span>
          ) : null}
        </div>
        <CardContent>
          <h2 className="text-xl font-bold mb-2 mt-2">{product?.title}</h2>
          <div className="flex justify-between items-center mb-2">
            <span
              className={`${
                product?.salePrice > 0 ? "line-through" : ""
              } text-lg font-semibold text-primary`}
            >
              Br{product?.price}
            </span>
            {product?.salePrice > 0 ? (
              <span className="text-lg font-bold">Br{product?.salePrice}</span>
            ) : null}
          </div>
        </CardContent>
        <CardFooter className="flex justify-between items-center">
          <Button
            onClick={() => {
              setOpenCreateProductsDialog(true);
              setCurrentEditedId(product?._id);
              setFormData(product);
            }}
          >
            Edit
          </Button>
          <Button onClick={() => handleDelete(product?._id)}>Delete</Button>
          <Button variant="outline" onClick={() => onViewDetails(product?._id)}>
            View
          </Button>
        </CardFooter>
      </div>
    </Card>
  );
}

export default FactmanProductTile;