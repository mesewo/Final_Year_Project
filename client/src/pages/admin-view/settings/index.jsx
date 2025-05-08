import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchSettings,
  updateSetting,
  addSetting,
  deleteSetting,
} from "@/store/admin/settings-slice";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Pencil, Trash2, Save, X } from "lucide-react";

export default function SystemSettings() {
  const dispatch = useDispatch();
  const { settings, loading, error } = useSelector((state) => state.settings);
  const [newSetting, setNewSetting] = useState({ key: "", value: "" });
  const [editId, setEditId] = useState(null);
  const [editValue, setEditValue] = useState("");
  const { toast } = useToast();
  useEffect(() => {
    dispatch(fetchSettings());
  }, [dispatch]);

  const handleAddSetting = () => {
    if (!newSetting.key.trim() || !newSetting.value.trim()) {
      return (toast({
        title: "Please fill in both key and value fields",
        variant: "destructive",
      }));
    }
    dispatch(addSetting(newSetting)).then((res) => {
      if (res.meta.requestStatus === "fulfilled") {
        toast({
          title: "Setting added successfully",
          variant: "default",})
        setNewSetting({ key: "", value: "" });
      } else {
        toast({
          title: res.payload.message || "Failed to add setting",
          variant: "destructive",
        });
      }
    });
  };

  const handleUpdateSetting = (id) => {
    dispatch(updateSetting({ id, key: settings.find(s => s._id === id).key, value: editValue })).then((res) => {
      if (res.meta.requestStatus === "fulfilled") {
        toast.success("Setting updated");
        setEditId(null);
      } else {
        toast.error(res.payload.message || "Failed to update setting");
      }
    });
  };

  const handleDeleteSetting = (id) => {
    if (!confirm("Are you sure you want to delete this setting?")) return;
    dispatch(deleteSetting(id)).then((res) => {
      if (res.meta.requestStatus === "fulfilled") {
        toast.success("Setting deleted");
      } else {
        toast.error(res.payload.message || "Failed to delete setting");
      }
    });
  };

  return (
    <div className="space-y-6 p-6">
      <h1 className="text-3xl font-bold text-gray-800">⚙️ System Settings</h1>

      <Tabs defaultValue="general" className="w-full">
        <TabsList className="gap-4 bg-muted p-2 rounded-xl">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="payment">Payment</TabsTrigger>
          <TabsTrigger value="roles">User Roles</TabsTrigger>
        </TabsList>

        <TabsContent value="general">
          <div className="bg-white p-6 rounded-xl shadow-sm space-y-6">
            <h2 className="text-xl font-semibold text-gray-700">General Settings</h2>

            {/* Add new setting */}
            <div className="flex flex-col sm:flex-row items-center gap-4">
              <Input
                placeholder="Key"
                value={newSetting.key}
                onChange={(e) => setNewSetting({ ...newSetting, key: e.target.value })}
              />
              <Input
                placeholder="Value"
                value={newSetting.value}
                onChange={(e) => setNewSetting({ ...newSetting, value: e.target.value })}
              />
              <Button onClick={handleAddSetting}>Add</Button>
            </div>

            {/* Settings table */}
            {loading ? (
              <p className="text-gray-600">Loading settings...</p>
            ) : error ? (
              <p className="text-red-500">{error}</p>
            ) : (
              <div className="overflow-x-auto border rounded-md">
                <table className="min-w-full text-sm">
                  <thead className="bg-muted text-gray-600">
                    <tr>
                      <th className="text-left p-3">Key</th>
                      <th className="text-left p-3">Value</th>
                      <th className="text-left p-3">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {settings.map((setting) => (
                      <tr key={setting._id} className="border-t hover:bg-gray-50">
                        <td className="p-3 font-medium">{setting.key}</td>
                        <td className="p-3">
                          {editId === setting._id ? (
                            <Input
                              value={editValue}
                              onChange={(e) => setEditValue(e.target.value)}
                              className="w-full"
                            />
                          ) : (
                            setting.value?.toString()
                          )}
                        </td>
                        <td className="p-3 flex gap-2">
                          {editId === setting._id ? (
                            <>
                              <Button
                                size="sm"
                                onClick={() => handleUpdateSetting(setting._id)}
                              >
                                <Save className="w-4 h-4" />
                              </Button>
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => setEditId(null)}
                              >
                                <X className="w-4 h-4" />
                              </Button>
                            </>
                          ) : (
                            <>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => {
                                  setEditId(setting._id);
                                  setEditValue(setting.value);
                                }}
                              >
                                <Pencil className="w-4 h-4" />
                              </Button>
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => handleDeleteSetting(setting._id)}
                              >
                                <Trash2 className="w-4 h-4 text-red-500" />
                              </Button>
                            </>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="payment">
          <div className="bg-white p-6 rounded-xl shadow-sm space-y-6">
            <h2 className="text-xl font-semibold text-gray-700">Payment Settings</h2>

            {/* Enable toggle */}
            <div className="flex items-center gap-3">
              <label className="font-medium">Enable Payments</label>
              <input type="checkbox" className="w-5 h-5" checked />
            </div>

            {/* Payment Methods */}
            <div>
              <h3 className="text-sm text-gray-600 mb-2">Accepted Methods</h3>
              <div className="flex gap-4 flex-wrap">
                {["Telebirr", "CBE", "PayPal", "Visa"].map((method) => (
                  <label key={method} className="flex items-center gap-2">
                    <input type="checkbox" className="w-4 h-4" />
                    {method}
                  </label>
                ))}
              </div>
            </div>

            {/* Payment API Keys */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block mb-1 text-sm font-medium text-gray-700">
                  PayPal Client ID
                </label>
                <Input placeholder="Enter PayPal Client ID" />
              </div>
              <div>
                <label className="block mb-1 text-sm font-medium text-gray-700">
                  Stripe Public Key
                </label>
                <Input placeholder="Enter Stripe Public Key" />
              </div>
            </div>

            <Button className="mt-4">Save Payment Settings</Button>
          </div>

      </TabsContent>

      <TabsContent value="roles">
          <div className="space-y-4 p-4 border rounded-lg">
            <h2 className="text-xl font-semibold">User Roles</h2>

            {loading ? (
              <p>Loading...</p>
            ) : (
              <>
                <ul className="space-y-2">
                  {Array.isArray(settings.find(s => s.key === "userRoles")?.value)
                    ? settings.find(s => s.key === "userRoles").value.map((role, index) => (
                        <li key={index} className="flex items-center gap-4">
                          <Input
                            defaultValue={role}
                            onBlur={(e) => {
                              const updatedRoles = [...settings.find(s => s.key === "userRoles").value];
                              updatedRoles[index] = e.target.value;
                              const roleSetting = settings.find(s => s.key === "userRoles");
                              dispatch(updateSetting({
                                id: roleSetting._id,
                                key: "userRoles",
                                value: updatedRoles
                              }));
                            }}
                          />
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              const updatedRoles = settings.find(s => s.key === "userRoles").value.filter((_, i) => i !== index);
                              const roleSetting = settings.find(s => s.key === "userRoles");
                              dispatch(updateSetting({
                                id: roleSetting._id,
                                key: "userRoles",
                                value: updatedRoles
                              }));
                            }}
                          >
                            Delete
                          </Button>
                        </li>
                      ))
                    : <p>No roles found</p>}
                </ul>

                <div className="flex items-center gap-2 mt-4">
                  <Input
                    placeholder="New role name"
                    value={newSetting.role || ""}
                    onChange={(e) => setNewSetting({ ...newSetting, role: e.target.value })}
                  />
                  <Button
                    onClick={() => {
                      const roleSetting = settings.find(s => s.key === "userRoles");
                      const updatedRoles = [...(roleSetting?.value || []), newSetting.role];
                      dispatch(updateSetting({
                        id: roleSetting._id,
                        key: "userRoles",
                        value: updatedRoles
                      }));
                      setNewSetting({ ...newSetting, role: "" });
                    }}
                  >
                    Add Role
                  </Button>
                </div>
              </>
            )}
          </div>
        </TabsContent>

    </Tabs>
    </div>
  );
}
