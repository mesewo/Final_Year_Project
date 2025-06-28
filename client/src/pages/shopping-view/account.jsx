import ProfileSection from "@/components/shopping-view/ProfileSection";
import SecuritySection from "@/components/shopping-view/SecuritySection";
import SettingsSection from "@/components/shopping-view/SettingsSection";
import ShoppingOrders from "@/components/shopping-view/orders";
import Address from "@/components/shopping-view/address";
import MyReviews from "@/components/shopping-view/MyReviewsSection";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { fetchCurrentUser } from "@/store/shop/user-slice";

const sections = [
  { key: "orders", label: "Orders" },
  { key: "address", label: "Address" },
  { key: "reviews", label: "My Reviews" },
  { key: "profile", label: "Edit Profile" },
  { key: "security", label: "Security" },
  { key: "settings", label: "Settings" },
];

export default function ShoppingAccount() {
  const dispatch = useDispatch();
  const [selectedSection, setSelectedSection] = useState(null);

  useEffect(() => {
    dispatch(fetchCurrentUser());
  }, [dispatch]);

  // Mobile: show sidebar if no section selected, show main if selected
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <div className="container mx-auto py-8">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Sidebar */}
          <div
            className={`
              w-full md:w-80 flex flex-col gap-6
              ${selectedSection ? "hidden" : "flex"}
              md:flex
            `}
          >
            <ProfileSection />
            <nav className="flex flex-col gap-1">
              {sections.map((section) => (
                <button
                  key={section.key}
                  onClick={() => setSelectedSection(section.key)}
                  className={`text-left px-4 py-2 rounded font-medium transition
                    ${
                      selectedSection === section.key
                        ? "bg-blue-600 text-white shadow"
                        : "bg-white text-gray-700 hover:bg-blue-100"
                    }`}
                >
                  {section.label}
                </button>
              ))}
            </nav>
          </div>
          {/* Main Content */}
          <div
            className={`
              flex-1 min-h-[500px] max-h-[80vh] overflow-y-auto bg-white rounded-lg shadow p-6
              ${selectedSection ? "block" : "hidden"}
              md:block
            `}
          >
            {/* Mobile: show back button */}
            <div className="md:hidden mb-4">
              <button
                className="text-blue-600 font-semibold mb-2"
                onClick={() => setSelectedSection(null)}
              >
                &larr; Back
              </button>
            </div>
            <h2 className="text-2xl font-bold mb-4 capitalize">
              {sections.find((s) => s.key === selectedSection)?.label}
            </h2>
            {selectedSection === "orders" && <ShoppingOrders />}
            {selectedSection === "address" && <Address />}
            {selectedSection === "reviews" && <MyReviews />}
            {selectedSection === "profile" && <ProfileSection editable />}
            {selectedSection === "security" && <SecuritySection />}
            {selectedSection === "settings" && <SettingsSection />}
          </div>
        </div>
      </div>
    </div>
  );
}
