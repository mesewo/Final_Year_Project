import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function SystemSettings() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">System Settings</h1>
      
      <Tabs defaultValue="general">
        <TabsList>
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="payment">Payment Methods</TabsTrigger>
          <TabsTrigger value="roles">User Roles</TabsTrigger>
        </TabsList>
        
        <TabsContent value="general">
          <div className="space-y-4 p-4 border rounded-lg">
            <h2 className="text-xl font-semibold">General Settings</h2>
            {/* Add general settings form */}
            <Button>Save Changes</Button>
          </div>
        </TabsContent>
        
        <TabsContent value="payment">
          <div className="space-y-4 p-4 border rounded-lg">
            <h2 className="text-xl font-semibold">Payment Methods</h2>
            {/* Payment methods management */}
          </div>
        </TabsContent>
        
        <TabsContent value="roles">
          <div className="space-y-4 p-4 border rounded-lg">
            <h2 className="text-xl font-semibold">User Roles</h2>
            {/* User roles management */}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}