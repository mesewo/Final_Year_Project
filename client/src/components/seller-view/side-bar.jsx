import {
    LayoutDashboard,
    ShoppingBasket,
    BadgeCheck,
    FileText, 
    PackagePlus
  } from "lucide-react";
  import { Fragment } from "react";
  import { useNavigate } from "react-router-dom";
  import { Sheet, SheetContent, SheetHeader, SheetTitle } from "../ui/sheet";
  
  const sellerSidebarMenuItems = [
    {
      id: "dashboard",
      label: "Dashboard",
      path: "/seller/dashboard",
      icon: <LayoutDashboard className="w-5 h-5" />,
    },
    {
      id: "products",
      label: "Products",
      path: "/seller/products",
      icon: <ShoppingBasket className="w-5 h-5" />,
    },
    {
      id: "request products",
      label: "Request Products",
      path: "/seller/request-products",
      icon: <PackagePlus className="w-5 h-5" />,
    },
    {
      id: "orders",
      label: "Orders",
      path: "/seller/orders",
      icon: <BadgeCheck className="w-5 h-5" />,
    },
    {
      id: "reports",
      label: "Reports",
      path: "/seller/reports",
      icon: <FileText className="w-5 h-5" />,
    },
  ];
  
  function MenuItems({ setOpen }) {
    const navigate = useNavigate();
  
    return (
      <nav className="mt-6 flex flex-col gap-1">
        {sellerSidebarMenuItems.map((menuItem) => (
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
  
  function SellerSideBar({ open, setOpen }) {
    return (
      <Fragment>
        {/* Mobile Sidebar */}
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetContent side="left" className="w-64">
            <SheetHeader className="border-b pb-4">
              <SheetTitle className="flex items-center gap-2">
                <LayoutDashboard className="w-6 h-6" />
                <span className="text-lg font-bold">Seller Center</span>
              </SheetTitle>
            </SheetHeader>
            <MenuItems setOpen={setOpen} />
          </SheetContent>
        </Sheet>
  
        {/* Desktop Sidebar */}
        <aside className="hidden w-64 flex-col border-r bg-background p-4 lg:flex">
          <div className="flex items-center gap-2 mb-6">
            <LayoutDashboard className="w-6 h-6" />
            <h1 className="text-lg font-bold">Seller Center</h1>
          </div>
          <MenuItems />
        </aside>
      </Fragment>
    );
  }
  
  export default SellerSideBar;