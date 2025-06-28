export default function SettingsSection() {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-xl font-bold mb-4">Settings</h2>
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-semibold mb-2">Notification Preferences</h3>
          <div className="text-gray-500">Coming soon</div>
        </div>
        <div>
          <h3 className="text-lg font-semibold mb-2">Language</h3>
          <div className="text-gray-500">Coming soon</div>
        </div>
        <div>
          <h3 className="text-lg font-semibold mb-2">Theme</h3>
          <div className="flex items-center gap-4">
            <button className="px-4 py-2 rounded bg-gray-100 hover:bg-gray-200">Light</button>
            <button className="px-4 py-2 rounded bg-gray-800 text-white hover:bg-gray-700">Dark</button>
            <button className="px-4 py-2 rounded bg-blue-100 hover:bg-blue-200">System</button>
          </div>
          <div className="text-xs text-gray-400 mt-1">Theme switching coming soon</div>
        </div>
        <div>
          <h3 className="text-lg font-semibold mb-2">Privacy</h3>
          <div className="text-gray-500">Coming soon</div>
        </div>
      </div>
    </div>
  );
}