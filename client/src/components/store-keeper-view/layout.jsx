import { Outlet } from "react-router-dom";
import StoreKeeperSideBar from "./sidebar";
import StoreKeeperHeader from "./header";
import { useState } from "react";

function StoreKeeperLayout() {
  const [openSidebar, setOpenSidebar] = useState(false);

  return (
    <div className="flex min-h-screen w-full">
      {/* admin sidebar */}
      <StoreKeeperSideBar open={openSidebar} setOpen={setOpenSidebar} />
      <div className="flex flex-1 flex-col">
        {/* admin header */}
        <StoreKeeperHeader setOpen={setOpenSidebar} />
        <main className="flex-1 flex-col flex bg-muted/40 p-4 md:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default StoreKeeperLayout;
