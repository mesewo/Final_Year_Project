import { useSelector, useDispatch } from "react-redux";
import { useState, useRef, useEffect } from "react";
import { updateProfile, uploadAvatar } from "@/store/shop/user-slice";
import { Button } from "../ui/button";
import { UploadCloudIcon, XIcon, CameraIcon, HistoryIcon } from "lucide-react";
import { Skeleton } from "../ui/skeleton";
import { useToast } from "../ui/use-toast";

export default function ProfileSection({ editable }) {
  const { user, loading } = useSelector(state => state.user);
  const dispatch = useDispatch();
  const { toast } = useToast();
  const [profile, setProfile] = useState(user?.profile || {});
  const [userName, setUserName] = useState(user?.userName || "");
  const [dragActive, setDragActive] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [imageLoading, setImageLoading] = useState(false);
  const [fetchingUrl, setFetchingUrl] = useState(false);
  const [avatarHistory, setAvatarHistory] = useState([]);
  const inputRef = useRef(null);

  // Camera
  const [showCamera, setShowCamera] = useState(false);
  const videoRef = useRef(null);
  const [cameraError, setCameraError] = useState("");
  const [capturedImage, setCapturedImage] = useState(null);

  useEffect(() => {
    if (user) {
      setProfile(user.profile || {});
      setUserName(user.userName || "");
      setAvatarHistory(user.profile?.avatarHistory || []);
    }
  }, [user]);

  // Camera stream
  useEffect(() => {
    let stream;
    if (showCamera && editable) {
      setCameraError("");
      navigator.mediaDevices.getUserMedia({ video: true })
        .then(s => {
          stream = s;
          if (videoRef.current) videoRef.current.srcObject = stream;
        })
        .catch(() => setCameraError("Unable to access camera."));
    }
    return () => {
      if (stream) stream.getTracks().forEach(track => track.stop());
    };
  }, [showCamera, editable]);

  // Drag and drop handlers
  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") setDragActive(true);
    else if (e.type === "dragleave") setDragActive(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setImageFile(e.dataTransfer.files[0]);
      setCapturedImage(null);
      return;
    }
    // Handle images dragged from the web (URL)
    const htmlData = e.dataTransfer.getData("text/html");
    if (htmlData) {
      const match = htmlData.match(/<img[^>]+src="?([^"\s]+)"?\s*\/?>/i);
      if (match && match[1]) {
        setFetchingUrl(true);
        fetch(match[1])
          .then(res => {
            if (!res.ok) throw new Error("Failed to fetch image");
            return res.blob();
          })
          .then(blob => {
            const file = new File([blob], "dragged-image.jpg", { type: blob.type });
            setImageFile(file);
            setCapturedImage(null);
            setFetchingUrl(false);
          })
          .catch(() => {
            setFetchingUrl(false);
            toast({ title: "Failed to load image from URL", variant: "destructive" });
          });
      }
    }
  };

  const handleAvatarChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setImageFile(e.target.files[0]);
      setCapturedImage(null);
    }
  };

  const handleRemoveImage = () => {
    setImageFile(null);
    setCapturedImage(null);
    if (inputRef.current) inputRef.current.value = "";
  };

  // Camera capture
  const handleCapture = () => {
    if (!videoRef.current) return;
    const canvas = document.createElement("canvas");
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    canvas.getContext("2d").drawImage(videoRef.current, 0, 0);
    canvas.toBlob(blob => {
      setCapturedImage(blob);
      setImageFile(null);
      setShowCamera(false);
    }, "image/jpeg");
  };

  // Upload avatar
  const handleUploadAvatar = async () => {
    let fileToUpload = imageFile;
    if (capturedImage) {
      fileToUpload = new File([capturedImage], "captured.jpg", { type: "image/jpeg" });
    }
    if (!fileToUpload) return;
    setImageLoading(true);
    const formData = new FormData();
    formData.append("avatar", fileToUpload);
    try {
      await dispatch(uploadAvatar(formData)).unwrap();
      toast({ title: "Avatar updated successfully!" });
      setImageFile(null);
      setCapturedImage(null);
    } catch (err) {
      toast({ title: "Avatar update failed!", variant: "destructive" });
    }
    setImageLoading(false);
  };

  // Save profile
  const handleSave = async () => {
    try {
      const updatedProfile = { ...profile, avatar: user?.profile?.avatar };
      await dispatch(updateProfile({ userName, profile: updatedProfile })).unwrap();
      toast({ title: "Profile updated successfully!" });
    } catch (err) {
      toast({ title: "Profile update failed!", variant: "destructive" });
    }
  };

  // Revert to previous avatar
  const handleRevertAvatar = async (avatarUrl) => {
    try {
      const updatedProfile = { ...profile, avatar: avatarUrl };
      await dispatch(updateProfile({ userName, profile: updatedProfile })).unwrap();
      toast({ title: "Avatar reverted!" });
    } catch (err) {
      toast({ title: "Failed to revert avatar!", variant: "destructive" });
    }
  };

  // Main avatar preview logic
  let avatarPreview;
  if (imageLoading || fetchingUrl) {
    avatarPreview = (
      <Skeleton className="w-full h-full rounded-full flex items-center justify-center">
        <span className="text-xs text-blue-700">Loading...</span>
      </Skeleton>
    );
  } else if (imageFile) {
    avatarPreview = (
      <div className="flex flex-col items-center w-full h-full">
        <img
          src={URL.createObjectURL(imageFile)}
          alt="Preview"
          className="w-full h-full object-cover"
        />
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-1 right-1 text-muted-foreground hover:text-foreground"
          onClick={e => { e.stopPropagation(); handleRemoveImage(); }}
        >
          <XIcon className="w-5 h-5" />
        </Button>
      </div>
    );
  } else if (capturedImage) {
    avatarPreview = (
      <div className="flex flex-col items-center w-full h-full">
        <img
          src={URL.createObjectURL(capturedImage)}
          alt="Captured"
          className="w-full h-full object-cover"
        />
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-1 right-1 text-muted-foreground hover:text-foreground"
          onClick={e => { e.stopPropagation(); handleRemoveImage(); }}
        >
          <XIcon className="w-5 h-5" />
        </Button>
      </div>
    );
  } else {
    avatarPreview = (
      <>
        <img
          src={user?.profile?.avatar || "/default-avatar.png"}
          alt="Avatar"
          className="w-full h-full object-cover"
          onError={e => { e.target.onerror = null; e.target.src = "/default-avatar.png"; }}
        />
        {editable && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/70 opacity-0 hover:opacity-100 transition-opacity">
            <UploadCloudIcon className="w-8 h-8 text-blue-500 mb-1" />
            <span className="text-xs text-blue-700 text-center">
              Click, drag & drop, or use camera
            </span>
          </div>
        )}
      </>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-xl p-8 flex flex-col items-center w-full max-w-2xl mx-auto">
      <div
        className={`relative w-40 h-40 mb-6 rounded-full overflow-hidden border-4 border-blue-200 flex items-center justify-center transition-all duration-300 ${dragActive ? "border-blue-500" : ""}`}
        onDragEnter={editable ? handleDrag : undefined}
        onDragOver={editable ? handleDrag : undefined}
        onDragLeave={editable ? handleDrag : undefined}
        onDrop={editable ? handleDrop : undefined}
        onClick={() => editable && inputRef.current && inputRef.current.click()}
        style={{ cursor: editable ? "pointer" : "default" }}
        title={editable ? "Click, drag & drop, or use camera" : ""}
      >
        {avatarPreview}
        {editable && (
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            onChange={handleAvatarChange}
            className="hidden"
            disabled={imageLoading || fetchingUrl}
          />
        )}
        {editable && dragActive && (
          <div className="absolute inset-0 bg-blue-100 bg-opacity-70 flex items-center justify-center text-blue-700 font-bold z-10">
            Drop image here
          </div>
        )}
        {editable && (
          <Button
            variant="ghost"
            size="icon"
            className="absolute bottom-2 right-2 bg-white/80 hover:bg-white"
            onClick={e => { e.stopPropagation(); setShowCamera(v => !v); }}
            title="Take a photo"
          >
            <CameraIcon className="w-6 h-6" />
          </Button>
        )}
      </div>
      {editable && showCamera && (
        <div className="w-full flex flex-col items-center mb-4">
          <div className="relative w-64 h-48 bg-black rounded-lg overflow-hidden mb-2">
            {cameraError ? (
              <div className="flex items-center justify-center h-full text-red-500">{cameraError}</div>
            ) : (
              <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover" />
            )}
          </div>
          <Button onClick={handleCapture} className="mb-2">Capture Photo</Button>
          <Button variant="outline" onClick={() => setShowCamera(false)}>Cancel</Button>
        </div>
      )}
      {editable && (imageFile || capturedImage) && (
        <Button
          className="mb-2 w-full"
          onClick={handleUploadAvatar}
          disabled={imageLoading || fetchingUrl}
        >
          {imageLoading ? "Uploading..." : "Update Profile Picture"}
        </Button>
      )}
      <div className="text-2xl font-bold mb-1">{user?.userName}</div>
      <div className="text-gray-500 mb-4">{user?.email}</div>
      {/* Avatar history */}
      {editable && avatarHistory && avatarHistory.length > 0 && (
        <div className="w-full mb-4">
          <div className="flex items-center mb-1">
            <HistoryIcon className="w-4 h-4 mr-2 text-gray-400" />
            <span className="text-sm text-gray-500">Profile Picture History</span>
          </div>
          <div className="flex gap-2 overflow-x-auto">
            {avatarHistory.map((url, idx) => (
              <button
                key={idx}
                className="w-12 h-12 rounded-full overflow-hidden border-2 border-gray-200 hover:border-blue-400 transition"
                onClick={() => handleRevertAvatar(url)}
                type="button"
                title="Revert to this avatar"
              >
                <img src={url} alt={`Avatar ${idx + 1}`} className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        </div>
      )}
      {/* Profile fields */}
      <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
          <input
            className="border rounded px-2 py-1 w-full"
            value={profile.firstName || ""}
            onChange={e => setProfile({ ...profile, firstName: e.target.value })}
            placeholder="First Name"
            disabled={!editable}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
          <input
            className="border rounded px-2 py-1 w-full"
            value={profile.lastName || ""}
            onChange={e => setProfile({ ...profile, lastName: e.target.value })}
            placeholder="Last Name"
            disabled={!editable}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
          <input
            className="border rounded px-2 py-1 w-full"
            value={profile.phone || ""}
            onChange={e => setProfile({ ...profile, phone: e.target.value })}
            placeholder="Phone Number"
            type="tel"
            disabled={!editable}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
          <input
            className="border rounded px-2 py-1 w-full"
            value={userName}
            onChange={e => setUserName(e.target.value)}
            placeholder="Username"
            disabled={!editable}
          />
        </div>
      </div>
      {editable && (
        <Button className="mt-6 w-full" onClick={handleSave} disabled={imageLoading || loading || fetchingUrl}>
          Save Changes
        </Button>
      )}
      {editable && (
        <div className="mt-4 text-xs text-gray-500 text-center">
          <span>
            You can <b>drag & drop</b>, <b>click</b> to select, or <b>use your camera</b> to update your profile picture.
          </span>
        </div>
      )}
    </div>
  );
}