import ProductImageUpload from "@/components/factman-view/image-upload";
import { Button } from "@/components/ui/button";
import { addFeatureImage, getFeatureImages } from "@/store/common-slice";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

function FactmanFeatures() {
  const [imageFile, setImageFile] = useState(null);
  const [uploadedImageUrl, setUploadedImageUrl] = useState("");
  const [imageLoadingState, setImageLoadingState] = useState(false);
  const dispatch = useDispatch();
  const { featureImageList } = useSelector((state) => state.commonFeature);

  function handleUploadFeatureImage() {
    console.log("Trying to upload to DB:", uploadedImageUrl);
    if (!uploadedImageUrl) {
      alert("Please upload an image to Cloudinary first.");
      return;
    }

    dispatch(addFeatureImage(uploadedImageUrl)).then((data) => {
      if (data?.payload?.success) {
        dispatch(getFeatureImages());
        setImageFile(null);
        setUploadedImageUrl("");
      } else {
        console.error("Failed to add image to DB", data);
      }
    });
  }

  function handleDeleteFeatureImage(id) {
    fetch(`http://localhost:5000/api/common/feature/delete/${id}`, {
      method: "DELETE",
    })
      .then((res) => res.json())
      .then(() => dispatch(getFeatureImages()))
      .catch((err) => console.error("Delete failed:", err));
  }

  useEffect(() => {
    dispatch(getFeatureImages());
  }, [dispatch]);

  return (
    <div>
      <ProductImageUpload
        imageFile={imageFile}
        setImageFile={setImageFile}
        uploadedImageUrl={uploadedImageUrl}
        setUploadedImageUrl={setUploadedImageUrl}
        setImageLoadingState={setImageLoadingState}
        imageLoadingState={imageLoadingState}
        isCustomStyling={true}
      />
      <Button
        onClick={handleUploadFeatureImage}
        className="mt-5 w-full"
        disabled={!uploadedImageUrl || imageLoadingState}
      >
        {imageLoadingState ? "Uploading..." : "Save to Database"}
      </Button>
      <div className="flex flex-col gap-4 mt-5">
        {featureImageList?.map((featureImgItem) => (
          <div key={featureImgItem._id} className="relative">
            <img
              src={featureImgItem.image}
              className="w-full h-[300px] object-cover rounded-t-lg"
              alt="feature"
            />
            <Button
              onClick={() => handleDeleteFeatureImage(featureImgItem._id)}
              className="absolute top-2 right-2"
              variant="destructive"
            >
              Delete
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default FactmanFeatures;