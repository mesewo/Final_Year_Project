import {
  BadgeCheck,
  ChartNoAxesCombined,
  LayoutDashboard,
  ShoppingBasket,
  Users,
  FileText,
  Settings, 
  MessageSquare,
  Image,
} from "lucide-react";
import { Fragment } from "react";
import { useNavigate } from "react-router-dom";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "../ui/sheet";

const factmanSidebarMenuItems = [
  {
    id: "dashboard",
    label: "Dashboard",
    path: "/factman/dashboard",
    icon: <LayoutDashboard className="w-5 h-5" />,
  },
  {
    id: "products",
    label: "Products",
    path: "/factman/products",
    icon: <ShoppingBasket className="w-5 h-5" />,
  },
  {
    id: "orders",
    label: "Orders",
    path: "/factman/orders",
    icon: <BadgeCheck className="w-5 h-5" />,
  },
  // {
  //   id: "users",
  //   label: "Users",
  //   path: "/factman/users",
  //   icon: <Users className="w-5 h-5" />,
  // },
  {
    id: "reports",
    label: "Reports",
    path: "/factman/reports",
    icon: <FileText className="w-5 h-5" />,
  },
  {
    id: "feedback",
    label: "Feedback",
    path: "/factman/feedback",
    icon: <MessageSquare className="w-5 h-5" />,
  },
  // {
  //   id: "settings",
  //   label: "Settings",
  //   path: "/factman/settings",
  //   icon: <Settings className="w-5 h-5" />,
  // },
  {
    id: "features",
    label: "Features",
    path: "/factman/features",
    icon: <Image className="w-5 h-5" />,
  }
];

function MenuItems({ setOpen }) {
  const navigate = useNavigate();

  return (
    <nav className="mt-6 flex flex-col gap-1">
      {factmanSidebarMenuItems.map((menuItem) => (
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

function FactmanSideBar({ open, setOpen }) {
  return (
    <Fragment>
      {/* Mobile Sidebar */}
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent side="left" className="w-64">
          <SheetHeader className="border-b pb-4">
            <SheetTitle className="flex items-center gap-2">
              <ChartNoAxesCombined className="w-6 h-6" />
              <span className="text-lg font-bold">Factory Manager Panel</span>
            </SheetTitle>
          </SheetHeader>
          <MenuItems setOpen={setOpen} />
        </SheetContent>
      </Sheet>

      {/* Desktop Sidebar */}
      <aside className="hidden w-64 flex-col border-r bg-background p-4 lg:flex">
        <div className="flex items-center gap-2 mb-6">
          <ChartNoAxesCombined className="w-6 h-6" />
          <h1 className="text-lg font-bold">Factory Manager Panel</h1>
        </div>
        <MenuItems />
      </aside>
    </Fragment>
  );
}

export default FactmanSideBar;