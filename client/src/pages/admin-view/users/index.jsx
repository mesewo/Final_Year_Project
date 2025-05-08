import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Select, SelectItem, SelectTrigger, SelectValue, SelectContent } from "@/components/ui/select";
import { DataTable } from "@/components/common/data-table";
import { StatusBadge } from "@/components/common/status-badge";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchAllUsers,
  blockUser,
  unblockUser,
  createUser,
  updateUser,
  deleteUser,
} from "@/store/admin/users-slice";
import { useToast } from "@/components/ui/use-toast";

export default function AdminUsers() {
  const dispatch = useDispatch();
  const { users, loading, error } = useSelector((state) => state.adminUsers);
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null); // new
  const [formData, setFormData] = useState({
    userName: "",
    email: "",
    password: "",
    role: "buyer",
  });

  useEffect(() => {
    dispatch(fetchAllUsers());
  }, [dispatch]);
  
  useEffect(() => {
    console.log(users); // Log users to verify the data structure
  }, [users]);
  const resetForm = () => {
    setFormData({ userName: "", email: "", password: "", role: "buyer" });
    setEditingUser(null);
  };

  const handleToggleBlock = (user) => {
    user.isBlocked ? dispatch(unblockUser(user._id)) : dispatch(blockUser(user._id));
  };

  const handleSubmit = () => {
    if (editingUser) {
      const { password, ...dataToSend } = formData; // skip password if empty
      dispatch(updateUser({ id: editingUser._id, data: dataToSend })).then((res) => {
        if (!res.error) {
          toast({
            title: "user updated successfully",
          }); // <-- Success toast for update
          setOpen(false);
          resetForm();
        } else {
          toast({
            title: "error updating user",
          });// <-- Error toast for update
        }
      });
    } else {
      dispatch(createUser(formData)).then((res) => {
        if (!res.error) {
          toast({
            title: "user created successfully",
          }); 
          setOpen(false);
          resetForm();
        } else {
          toast({
            title: "error creating user",
          });
        }
      });
    }
  };

  const columns = [
    { header: "Username", accessor: "userName" },
    { header: "Email", accessor: "email" },
    {
      header: "Role",
      accessor: "role",
      cell: ({ row }) => <span className="capitalize">{row.role}</span>,
    },
    {
      header: "Status",
      accessor: "isBlocked",
      cell: ({ row }) => (
        <StatusBadge status={row.isBlocked ? "blocked" : "active"} />
      ),
    },
    {
      header: "Actions",
      cell: ({ row }) => (
        <div className="flex gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={() => {
              setEditingUser(row);
              setFormData({
                userName: row.userName || "",
                email: row.email || "",
                password: "",
                role: row.role || "buyer",
              });
              setOpen(true);
            }}
          >
            Edit
          </Button>
          <Button
            size="sm"
            variant="destructive"
            onClick={() => {
              dispatch(deleteUser(row._id)).then((res) => {
                if (!res.error) {
                  toast({
                    title: "user deleted successfully",
                  }); 
                } else {
                  toast({
                    title: "error deleting user",
                  });
                }
              });
            }}
          >
            Delete
          </Button>
          <Button
            size="sm"
            variant={row.isBlocked ? "default" : "destructive"}
            onClick={() => handleToggleBlock(row)}
          >
            {row.isBlocked ? "Unblock" : "Block"}
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Users</h2>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => dispatch(fetchAllUsers())}>
            Refresh
          </Button>
          <Button
            variant="primary"
            onClick={() => {
              resetForm();
              setOpen(true);
            }}
          >
            Add User
          </Button>
        </div>
      </div>

      {error && <p className="text-red-500 text-sm">{error}</p>}

      <div className="rounded-md border">
        <DataTable columns={columns} data={users} loading={loading} />
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>
              {editingUser ? "Edit User" : "Create New User"}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Input
              placeholder="Username"
              value={formData.userName}
              onChange={(e) =>
                setFormData({ ...formData, userName: e.target.value })
              }
            />
            <Input
              type="email"
              placeholder="Email"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
            />
            {!editingUser && (
              <Input
                type="password"
                placeholder="Password"
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
              />
            )}
            <Select
              value={formData.role}
              onValueChange={(value) =>
                setFormData({ ...formData, role: value })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="admin">Admin</SelectItem>
                <SelectItem value="seller">Seller</SelectItem>
                <SelectItem value="store_keeper">Store Keeper</SelectItem>
                <SelectItem value="accountant">Accountant</SelectItem>
                <SelectItem value="buyer">Buyer</SelectItem>
              </SelectContent>
            </Select>
            <Button onClick={handleSubmit} variant="primary" className="w-full">
              {editingUser ? "Update" : "Create"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
