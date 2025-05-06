import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllUsers, blockUser, unblockUser } from "@/store/admin/users-slice";
import { useEffect } from "react";
import { Badge } from "@/components/ui/badge";

export default function AdminUsers() {
  const dispatch = useDispatch();
  const { users, loading } = useSelector(state => state.adminUsers);

  useEffect(() => {
    dispatch(fetchAllUsers());
  }, [dispatch]);

  const handleBlockUser = (userId) => {
    dispatch(blockUser(userId));
  };

  const handleUnblockUser = (userId) => {
    dispatch(unblockUser(userId));
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">User Management</h1>
      
      {loading ? (
        <div>Loading users...</div>
      ) : (
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Username</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users?.map(user => (
                <TableRow key={user._id}>
                  <TableCell className="font-medium">{user.userName}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{user.role}</Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={user.isBlocked ? "destructive" : "success"}>
                      {user.isBlocked ? "Blocked" : "Active"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {user.isBlocked ? (
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => handleUnblockUser(user._id)}
                      >
                        Unblock
                      </Button>
                    ) : (
                      <Button 
                        size="sm" 
                        variant="destructive"
                        onClick={() => handleBlockUser(user._id)}
                      >
                        Block
                      </Button>
                    )}
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