import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  fetchStores,
  addStore,
  updateStore,
  deleteStore,
} from "../../store/store-keeper/store-slice";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Search, Check, RefreshCw} from "lucide-react";

export default function StoreKeeperStores() {
  const dispatch = useDispatch();
  const stores = useSelector((state) => state.storeKeeperStore.stores || []);
  const storeStatus = useSelector((state) => state.storeKeeperStore.status || "idle");
  const error = useSelector((state) => state.storeKeeperStore.error || null);

  const [open, setOpen] = useState(false);
  const [editingStore, setEditingStore] = useState(null);
  const [formData, setFormData] = useState({ name: "", location: "", assignedSellers: [] });
  const [searchTerm, setSearchTerm] = useState("");
  const [availableSellers, setAvailableSellers] = useState([]);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [storeToDelete, setStoreToDelete] = useState(null);
  const [allSellers, setAllSellers] = useState([]);

  // Fetch stores
  useEffect(() => {
    if (storeStatus === "idle") {
      dispatch(fetchStores());
    }
  }, [storeStatus, dispatch]);

  // Fetch all sellers once on component mount
  useEffect(() => {
    fetch("/api/storekeeper/users?role=seller")
      .then((res) => res.json())
      .then((data) => {
        if (data.success) setAllSellers(data.users || []);
      });
  }, []);

  // Fetch sellers when dialog opens
  useEffect(() => {
    if (open) {
      fetch("/api/storekeeper/users?role=seller")
        .then((res) => res.json())
        .then((data) => {
          if (data.success) setAvailableSellers(data.users || []);
        });
    }
  }, [open]);

  // Get all assigned seller IDs except for the current store being edited
  const assignedSellerIds = stores
    .filter((store) => !editingStore || store._id !== editingStore._id)
    .flatMap((store) => store.assignedSellers || []);

  // Only show sellers not already assigned, or assigned to this store
  const selectableSellers = availableSellers.filter(
    (seller) =>
      !assignedSellerIds.includes(seller._id) ||
      (editingStore && formData.assignedSellers.includes(seller._id))
  );

  const resetForm = () => {
    setFormData({ name: "", location: "", assignedSellers: [] });
    setEditingStore(null);
  };

  const handleSubmit = () => {
    if (!formData.name || !formData.location) return;

    const payload = {
      name: formData.name,
      location: formData.location,
      assignedSellers: formData.assignedSellers,
    };

    const action = editingStore
      ? updateStore({ id: editingStore._id, updatedData: payload })
      : addStore(payload);

    dispatch(action).then((res) => {
      if (!res.error) {
        setOpen(false);
        resetForm();
      }
    });
  };

  const handleEdit = (store) => {
    setEditingStore(store);
    setFormData({
      name: store.name,
      location: store.location,
      assignedSellers: store.assignedSellers || [],
    });
    setOpen(true);
  };

  const handleDelete = (id) => {
    setStoreToDelete(id);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (storeToDelete) {
      dispatch(deleteStore(storeToDelete));
      setDeleteDialogOpen(false);
      setStoreToDelete(null);
    }
  };

  const cancelDelete = () => {
    setDeleteDialogOpen(false);
    setStoreToDelete(null);
  };

  const filteredStores = stores.filter(
    (store) =>
      store.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      store.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Stores</h2>
        <Button variant="primary" onClick={() => { resetForm(); setOpen(true); }}>
          Add Store
        </Button>
      </div>

      {/* Search bar */}
    <div className="flex items-center gap-2 mb-4 justify-between">
      <div className="relative w-full max-w-xs flex items-center">
        <Search className="ml-2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search stores..."
          className="pl-3 ml-2" // add ml-2 for space between icon and input
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      <Button variant="outline" onClick={() => dispatch(fetchStores())} size="icon">
        <RefreshCw className="h-5 w-5" />
      </Button>
    </div>

      {error && <p className="text-red-500 text-sm">{error}</p>}

      {/* Stores Table */}
      <div className="rounded-md border bg-white">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="bg-muted">
              <th className="px-4 py-2 text-left font-semibold">Store Name</th>
              <th className="px-4 py-2 text-left font-semibold">Location</th>
              <th className="px-4 py-2 text-left font-semibold">Allocated Sellers</th>
              <th className="px-4 py-2 text-left font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {storeStatus === "loading" ? (
              <tr>
                <td colSpan={4} className="text-center py-4">Loading...</td>
              </tr>
            ) : filteredStores.length === 0 ? (
              <tr>
                <td colSpan={4} className="text-center py-4">No stores found.</td>
              </tr>
            ) : (
              filteredStores.map((store) => (
                <tr key={store._id} className="border-t hover:bg-muted/50">
                  <td className="px-4 py-2">{store.name}</td>
                  <td className="px-4 py-2">{store.location}</td>
                  <td className="px-4 py-2">
                    {store.assignedSellers && store.assignedSellers.length > 0 ? (
                      <ul className="list-disc list-inside space-y-1">
                        {store.assignedSellers.map((sellerId) => {
                          const seller = allSellers.find((s) => s._id === sellerId);
                          return (
                            <li key={sellerId}>
                              {seller ? (
                                <span>
                                  {seller.userName} <span className="text-xs text-muted-foreground">({seller.email})</span>
                                </span>
                              ) : (
                                <span className="text-xs text-muted-foreground">Unknown</span>
                              )}
                            </li>
                          );
                        })}
                      </ul>
                    ) : (
                      <span className="text-xs text-muted-foreground">None</span>
                    )}
                  </td>
                  <td className="px-4 py-2">
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" onClick={() => handleEdit(store)}>
                        Edit
                      </Button>
                      <Button size="sm" variant="destructive" onClick={() => handleDelete(store._id)}>
                        Delete
                      </Button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Add/Edit Store Dialog */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{editingStore ? "Edit Store" : "Add New Store"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Input
              placeholder="Store Name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
            <Input
              placeholder="Location"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
            />

            {/* Seller Assignment UI */}
            <div>
              <label className="block text-sm font-medium mb-1">Assign Sellers</label>
              <div className="grid grid-cols-1 gap-1 max-h-40 overflow-y-auto border rounded p-2 bg-muted/30">
                {selectableSellers.length === 0 && (
                  <span className="text-xs text-muted-foreground">No available sellers</span>
                )}
                {selectableSellers.map((seller) => (
                  <label
                    key={seller._id}
                    className={`flex items-center gap-2 cursor-pointer rounded px-2 py-1 hover:bg-muted transition ${
                      formData.assignedSellers.includes(seller._id)
                        ? "bg-primary/10 font-semibold"
                        : ""
                    }`}
                  >
                    <input
                      type="checkbox"
                      className="accent-primary"
                      checked={formData.assignedSellers.includes(seller._id)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setFormData({
                            ...formData,
                            assignedSellers: [...formData.assignedSellers, seller._id],
                          });
                        } else {
                          setFormData({
                            ...formData,
                            assignedSellers: formData.assignedSellers.filter((id) => id !== seller._id),
                          });
                        }
                      }}
                    />
                    <span>
                      {seller.userName} <span className="text-xs text-muted-foreground">({seller.email})</span>
                    </span>
                    {formData.assignedSellers.includes(seller._id) && (
                      <Check className="h-4 w-4 text-primary" />
                    )}
                  </label>
                ))}
              </div>
            </div>

            <Button onClick={handleSubmit} variant="primary" className="w-full">
              {editingStore ? "Update Store" : "Create Store"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Are you sure?</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p>Do you really want to delete this store? This action cannot be undone.</p>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={cancelDelete}>
                No
              </Button>
              <Button variant="destructive" onClick={confirmDelete}>
                Yes
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}