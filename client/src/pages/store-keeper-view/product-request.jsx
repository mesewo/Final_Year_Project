import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchAllRequests,
  approveRequest,
  rejectRequest,
} from "@/store/productRequest-slice";
import { Button } from "@/components/ui/button";

export default function StorekeeperProductRequests() {
  const dispatch = useDispatch();
  const requests = useSelector((state) => state.productRequest.allRequests || []);

  useEffect(() => {
    dispatch(fetchAllRequests());
  }, [dispatch]);

  const pendingRequests = requests.filter((r) => r.status === "pending");

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Pending Product Requests</h2>
      {pendingRequests.length === 0 ? (
        <div className="text-muted-foreground text-center py-8">
          No pending product requests.
        </div>
      ) : (
        pendingRequests.map((r) => (
          <div
            key={r._id}
            className="border p-4 rounded flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 bg-white shadow-sm"
          >
            <div>
              <p>
                <strong>Product:</strong> {r.product.title}
              </p>
              <p>
                <strong>Quantity:</strong> {r.quantity}
              </p>
              <p>
                <strong>Requested by:</strong> {r.seller.userName}
              </p>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={async () => {
                  await dispatch(approveRequest(r._id));
                  dispatch(fetchAllRequests());
                }}
              >
                Approve
              </Button>
              <Button
                variant="destructive"
                onClick={async () => {
                  await dispatch(rejectRequest(r._id));
                  dispatch(fetchAllRequests());
                }}
              >
                Reject
              </Button>
            </div>
          </div>
        ))
      )}
    </div>
  );
}