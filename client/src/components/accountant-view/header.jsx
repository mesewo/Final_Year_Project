import { AlignJustify, LogOut } from "lucide-react";
import { Button } from "../ui/button";
import { useDispatch } from "react-redux";
import { logoutUser } from "@/store/auth-slice";
import { useLocation } from "react-router-dom";

function AccountantHeader({ setOpen }) {
  const dispatch = useDispatch();
  const location = useLocation();

  function handleLogout() {
    dispatch(logoutUser());
  }

  const getHeaderTitle = () => {
    const path = location.pathname;
    if (path.includes("reports")) return "Financial Reports";
    if (path.includes("finances")) return "Financial Management";
    return "Accountant Dashboard";
  };

  return (
    <header className="flex items-center justify-between px-4 py-3 bg-background border-b">
      <div className="flex items-center gap-4">
        <Button onClick={() => setOpen(true)} className="lg:hidden sm:block">
          <AlignJustify />
          <span className="sr-only">Toggle Menu</span>
        </Button>
        <h1 className="text-xl font-bold">{getHeaderTitle()}</h1>
      </div>
      <Button
        onClick={handleLogout}
        variant="outline"
        className="inline-flex gap-2 items-center"
      >
        <LogOut className="w-4 h-4" />
        Logout
      </Button>
    </header>
  );
}

export default AccountantHeader;