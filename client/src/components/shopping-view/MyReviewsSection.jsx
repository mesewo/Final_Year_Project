import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchMyReviews } from "@/store/shop/user-slice";

// Simple star rating display component
function StarRating({ rating = 0, max = 5 }) {
  return (
    <span className="flex items-center gap-0.5">
      {[...Array(max)].map((_, i) =>
        i < Math.round(rating) ? (
          <svg key={i} className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
            <polygon points="10,1 12.59,7.36 19.51,7.64 14,12.14 15.82,19.02 10,15.27 4.18,19.02 6,12.14 0.49,7.64 7.41,7.36" />
          </svg>
        ) : (
          <svg key={i} className="w-4 h-4 text-gray-300" fill="currentColor" viewBox="0 0 20 20">
            <polygon points="10,1 12.59,7.36 19.51,7.64 14,12.14 15.82,19.02 10,15.27 4.18,19.02 6,12.14 0.49,7.64 7.41,7.36" />
          </svg>
        )
      )}
    </span>
  );
}

// Avatar fallback with initials
function Avatar({ name }) {
  const initials = name
    ? name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
    : "?";
  return (
    <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center font-bold text-gray-600 text-lg border">
      {initials}
    </div>
  );
}

// Status badge component
function StatusBadge({ status }) {
  let color = "bg-gray-200 text-gray-700";
  if (status === "approved") color = "bg-green-100 text-green-700 border border-green-300";
  else if (status === "pending") color = "bg-yellow-100 text-yellow-800 border border-yellow-300";
  else if (status === "rejected") color = "bg-red-100 text-red-700 border border-red-300";
  return (
    <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${color}`}>
      {status}
    </span>
  );
}

export default function MyReviews() {
  const dispatch = useDispatch();
  const { myReviews } = useSelector(state => state.user);

  useEffect(() => {
    dispatch(fetchMyReviews());
  }, [dispatch]);

  return (
    <div className="bg-white rounded-lg shadow p-6">
      {/* <h2 className="text-xl font-bold mb-4">My Reviews</h2> */}
      {(!myReviews || myReviews.length === 0) && (
        <div className="text-gray-500">No reviews yet.</div>
      )}
      <ul className="grid gap-4">
        {myReviews?.map(fb => (
          <li key={fb._id} className="flex gap-4 items-start bg-gray-50 rounded-lg p-4 shadow-sm">
            <Avatar name={fb.userName} />
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <span className="font-semibold">{fb.product?.title}</span>
                <StatusBadge status={fb.status} />
              </div>
              <div className="flex items-center gap-1 mb-2">
                <StarRating rating={fb.rating} />
                <span className="text-xs text-gray-500">{fb.rating}</span>
              </div>
              <div className="text-gray-700">{fb.comment}</div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}