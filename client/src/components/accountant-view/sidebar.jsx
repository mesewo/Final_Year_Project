import { Fragment } from "react";
import { useNavigate } from "react-router-dom";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  LayoutDashboard,
  FileText,
  DollarSign,
  BarChart2,
  Settings,
  Users,
} from "lucide-react";

const accountantSidebarMenuItems = [
  {
    id: "dashboard",
    label: "Dashboard",
    path: "/accountant/Dashboard",
    icon: <LayoutDashboard className="w-5 h-5" />,
  },
  {
    id: "finance",
    label: "Finance Charts",
    path: "/accountant/finance",
    icon: <BarChart2 className="w-5 h-5" />,
  },
  {
    id: "reports",
    label: "Reports",
    path: "/accountant/reports",
    icon: <FileText className="w-5 h-5" />,
  },
  {
    id: "transactions",
    label: "Transactions",
    path: "/accountant/transactions",
    icon: <DollarSign className="w-5 h-5" />,
  },
  {
    id: "users",
    label: "Users",
    path: "/accountant/users",
    icon: <Users className="w-5 h-5" />,
  },
  {
    id: "settings",
    label: "Settings",
    path: "/accountant/settings",
    icon: <Settings className="w-5 h-5" />,
  },
];

function MenuItems({ setOpen }) {
  const navigate = useNavigate();

  return (
    <nav className="mt-6 flex flex-col gap-1">
      {accountantSidebarMenuItems.map((menuItem) => (
        <button
          key={menuItem.id}
          onClick={() => {
            navigate(menuItem.path);
            setOpen?.(false);
          }}
          className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
        >
          {menuItem.icon}
          <span className="text-sm font-medium">{menuItem.label}</span>
        </button>
      ))}
    </nav>
  );
}

function AccountantSideBar({ open, setOpen }) {
  return (
    <Fragment>
      {/* Mobile Sidebar */}
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent side="left" className="w-64">
          <SheetHeader className="border-b pb-4">
            <SheetTitle className="flex items-center gap-2">
              <BarChart2 className="w-6 h-6" />
              <span className="text-lg font-bold">Accountant Panel</span>
            </SheetTitle>
          </SheetHeader>
          <MenuItems setOpen={setOpen} />
        </SheetContent>
      </Sheet>

      {/* Desktop Sidebar */}
      <aside className="hidden w-64 flex-col border-r bg-background p-4 lg:flex">
        <div className="flex items-center gap-2 mb-6">
          <BarChart2 className="w-6 h-6" />
          <h1 className="text-lg font-bold">Accountant Panel</h1>
        </div>
        <MenuItems />
      </aside>
    </Fragment>
  );
}

export default AccountantSideBar;