import { Navigate, useLocation } from "react-router-dom";

function getDashboardPath(role) {
  switch (role) {
    case "admin":
      return "/admin/dashboard";
    case "factman":
      return "/factman/dashboard";
    case "buyer":
      return "/shop/home";
    case "seller":
      return "/seller/dashboard";
    case "accountant":
      return "/accountant/dashboard";
    case "store_keeper":
      return "/storekeeper/dashboard";
    default:
      return "/shop/home";
  }
}

function CheckAuth({ isAuthenticated, user, children }) {
  const location = useLocation();

  // Redirect root path to role-specific dashboard
  if (location.pathname === "/") {
    if (!isAuthenticated) {
      return <Navigate to="/auth/login" />;
    } else {
      return <Navigate to={getDashboardPath(user?.role)} />;
    }
  }

  // Not authenticated and not on login/register
  if (
    !isAuthenticated &&
    !(
      location.pathname.includes("/login") ||
      location.pathname.includes("/register")
    )
  ) {
    return <Navigate to="/auth/login" />;
  }

  // Authenticated and trying to access login/register
  if (
    isAuthenticated &&
    (location.pathname.includes("/login") ||
      location.pathname.includes("/register"))
  ) {
    return <Navigate to={getDashboardPath(user?.role)} />;
  }

  // Prevent users from accessing unauthorized dashboards
  const dashboardPaths = {
    admin: "/admin",
    factman: "/factman",
    seller: "/seller",
    accountant: "/accountant",
    store_keeper: "/store-keeper",
    buyer: "/shop",
  };

  for (const [role, path] of Object.entries(dashboardPaths)) {
  if (
    isAuthenticated &&
    location.pathname.startsWith(path) &&
    user?.role !== role
  ) {
    return <Navigate to="/unauth-page" />;
  }
}

  return <>{children}</>;
}

export default CheckAuth;