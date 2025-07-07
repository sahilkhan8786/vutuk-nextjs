// routes.ts
export const publicRoutes = ["/", "/log-in", "/register","/about-us","/projects","/services","/contact-us", "/cart","/products","/request/custom-3d-print-on-demand"];
export const authRoutes = ["/log-in", "/register"];
export const DEFAULT_LOGIN_REDIRECT = "/dashboard";
export const apiAuthPrefix = "/api/auth";

// 🔐 Role-based protected routes
export const roleProtectedRoutes: Record<string, string[]> = {
  "/admin": ["admin"],
  "/admin/team": ["admin"],
  "/admin/services": ["admin"],
  "/admin/projects": ["admin"],
  "/admin/blogs": ["admin"],
  "/admin/products": ["admin"],
  "/admin/additional-data": ["admin"],
  "/admin/settings": ["admin"],
  "/dashboard": [ "user"],
  "/dashboard/profile": [ "user"],
  "/dashboard/orders": [ "user"],
  "/dashboard/favourites": [ "user"],
};
