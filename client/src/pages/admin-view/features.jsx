import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchFeatures, deleteFeature } from "@/store/admin/features-slice";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";

export default function AdminFeatures() {
  const dispatch = useDispatch();
  const { features, loading } = useSelector((state) => state.features);

  useEffect(() => {
    dispatch(fetchFeatures());
  }, [dispatch]);

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this feature?")) {
      dispatch(deleteFeature(id));
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Manage Features</h1>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Image</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {features.map((feature) => (
                <TableRow key={feature._id}>
                  <TableCell>{feature.title}</TableCell>
                  <TableCell>{feature.description}</TableCell>
                  <TableCell>
                    <img src={feature.image} alt={feature.title} className="h-12 w-12 object-cover" />
                  </TableCell>
                  <TableCell>
                    <Button variant="outline" size="sm" onClick={() => handleDelete(feature._id)}>
                      Delete
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}