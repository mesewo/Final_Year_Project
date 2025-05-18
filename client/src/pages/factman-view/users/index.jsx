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
import { Search } from "lucide-react";

export default function AdminUsers() {
  const dispatch = useDispatch();
  const { users, loading, error } = useSelector((state) => state.adminUsers);
  const currentUser = useSelector((state) => state.auth.user); // Get current user from auth state
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [selectedRole, setSelectedRole] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [formData, setFormData] = useState({
    userName: "",
    email: "",
    password: "",
    role: "buyer",
  });

  useEffect(() => {
    dispatch(fetchAllUsers());
  }, [dispatch]);
  
  const resetForm = () => {
    setFormData({ userName: "", email: "", password: "", role: "buyer" });
    setEditingUser(null);
  };

  const roleCounts = users.reduce((acc, user) => {
    acc[user.role] = (acc[user.role] || 0) + 1;
    return acc;
  }, {});

  const totalCount = users.length;

  const filteredUsers = users.filter(user => {
    const matchesRole = selectedRole === "all" || user.role === selectedRole;
    const matchesSearch = 
      user.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesRole && matchesSearch;
  });

  const handleToggleBlock = (user) => {
    if (user._id === currentUser?._id) {
      toast({
        title: "You cannot block/unblock yourself",
        variant: "destructive",
      });
      return;
    }
    user.isBlocked ? dispatch(unblockUser(user._id)) : dispatch(blockUser(user._id));
  };

  const handleDeleteUser = (userId) => {
    if (userId === currentUser?._id) {
      toast({
        title: "You cannot delete yourself",
        variant: "destructive",
      });
      return;
    }
    dispatch(deleteUser(userId)).then((res) => {
      if (!res.error) {
        toast({
          title: "User deleted successfully",
        }); 
      } else {
        toast({
          title: "Error deleting user",
          variant: "destructive",
        });
      }
    });
  };

  const handleSubmit = () => {
    if (editingUser) {
      const { password, ...dataToSend } = formData;
      dispatch(updateUser({ id: editingUser._id, data: dataToSend })).then((res) => {
        if (!res.error) {
          toast({
            title: "User updated successfully",
          });
          setOpen(false);
          resetForm();
        } else {
          toast({
            title: "Error updating user",
            variant: "destructive",
          });
        }
      });
    } else {
      dispatch(createUser(formData)).then((res) => {
        if (!res.error) {
          toast({
            title: "User created successfully",
          }); 
          setOpen(false);
          resetForm();
        } else {
          toast({
            title: "Error creating user",
            variant: "destructive",
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
            onClick={() => handleDeleteUser(row._id)}
            disabled={row._id === currentUser?._id}
          >
            Delete
          </Button>
          <Button
            size="sm"
            variant={row.isBlocked ? "default" : "destructive"}
            onClick={() => handleToggleBlock(row)}
            disabled={row._id === currentUser?._id}
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

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex items-center gap-4">
          <span className="hidden sm:inline">Filter by Role:</span>
          <Select value={selectedRole} onValueChange={setSelectedRole}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select role" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">
                All Roles ({totalCount})
              </SelectItem>
              <SelectItem value="admin">
                Admin ({roleCounts['admin'] || 0})
              </SelectItem>
              <SelectItem value="seller">
                Seller ({roleCounts['seller'] || 0})
              </SelectItem>
              <SelectItem value="store_keeper">
                Store Keeper ({roleCounts['store_keeper'] || 0})
              </SelectItem>
              <SelectItem value="accountant">
                Accountant ({roleCounts['accountant'] || 0})
              </SelectItem>
              <SelectItem value="buyer">
                Buyer ({roleCounts['buyer'] || 0})
              </SelectItem>
              <SelectItem value="factman">
                Factory Manager ({roleCounts['factman'] || 0})
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search users..."
            className="pl-9"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {error && <p className="text-red-500 text-sm">{error}</p>}

      <div className="rounded-md border">
        <DataTable 
          columns={columns} 
          data={filteredUsers} 
          loading={loading} 
        />
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
                <SelectItem value="factman">Factory Manager</SelectItem>
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