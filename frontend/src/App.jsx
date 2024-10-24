import React, { Suspense, lazy } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import ErrorBoundary from './utils/errorBoundary';
import AdminRoute, { RoleBasedRedirect } from './utils/adminRoute';
import { AuthProvider, useAuth } from "./utils/authContext";
import { Loader2 } from "lucide-react";

// Lazy load components
// Lazy load components
const AdminDashboard = lazy(() => import("./admin/Dashboard" /* webpackChunkName: "admin-dashboard" */));
const UserDashboard = lazy(() => import("./user/Dashboard" /* webpackChunkName: "user-dashboard" */));
const ProductsDemo = lazy(() => import("./admin/product/Products" /* webpackChunkName: "products" */));
const Suppliers = lazy(() => import("./admin/supplier/Suppliers" /* webpackChunkName: "suppliers" */));
const CreateProduct = lazy(() => import("./admin/product/Create" /* webpackChunkName: "create-product" */));
const UpdateProduct = lazy(() => import("./admin/product/Update" /* webpackChunkName: "update-product" */));
const Settings = lazy(() => import("./components/others/Settings" /* webpackChunkName: "settings" */));
const Category = lazy(() => import("./admin/category/Category" /* webpackChunkName: "category" */));
const Login = lazy(() => import("./auth/Login" /* webpackChunkName: "login" */));
const Register = lazy(() => import("./auth/Register" /* webpackChunkName: "register" */));
const Unauthorized = lazy(() => import("./components/Unauthorized" /* webpackChunkName: "unauthorized" */));
// const UserProfile = lazy(() => import("./user/Profile" /* webpackChunkName: "user-profile" */));
// LoadingFallback component
  
const LoadingFallback = () => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="flex flex-col items-center space-y-4">
      <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
      <p className="text-sm text-gray-500">Loading...</p>
    </div>
  </div>
);

// PublicRoute component
const PublicRoute = ({ children }) => {
  const { isAuthenticated, user, loading } = useAuth();

  if (loading) {
    return <LoadingFallback />;
  }

  if (isAuthenticated) {
    if (user?.role === 'admin') {
      return <Navigate to="/admin/dashboard" replace />;
    }
    return <Navigate to="/user/dashboard" replace />;
  }

  return children;
};

// UserRoute component
const UserRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  
  if (loading) {
    return <LoadingFallback />;
  }
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  return children;
};

// Query client configuration
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
      staleTime: 5 * 60 * 1000,
      cacheTime: 10 * 60 * 1000,
      suspense: false,
      useErrorBoundary: true,
      onError: (error) => {
        if (error?.response?.status === 401) {
          sessionStorage.removeItem('token');
          sessionStorage.removeItem('user');
          window.location.href = '/login';
        }
      }
    },
    mutations: {
      useErrorBoundary: true,
    },
  },
});

// Route configurations
const routes = {
  public: [
    { path: "/login", element: Login },
    { path: "/register", element: Register },
  ],
  auth: [
    { path: "/unauthorized", element: Unauthorized },
  ],
  admin: [
    { path: "/dashboard", element: AdminDashboard },
    { path: "/admin/products", element: ProductsDemo },
    { path: "/admin/suppliers", element: Suppliers },
    { path: "/admin/create-product", element: CreateProduct },
    { path: "/admin/products/:productId", element: UpdateProduct },
    { path: "/admin/settings", element: Settings },
    { path: "/admin/categories", element: Category },
  ],
  user: [
    { path: "/user/dashboard", element: UserDashboard },
  ]
};

// NotFound component
const NotFound = () => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="text-center">
      <h2 className="text-2xl font-semibold text-gray-900">Page not found</h2>
      <p className="mt-2 text-gray-600">Sorry, we couldn't find the page you're looking for.</p>
    </div>
  </div>
);

const App = () => {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <div className="min-h-screen bg-gray-50">
            <div className="flex min-h-screen">
              <main className="flex-1 pb-8">
                <Suspense fallback={<LoadingFallback />}>
                  <Routes>
                    {/* Root redirect */}
                    <Route path="/" element={<RoleBasedRedirect />} />

                    {/* Public Routes (with redirect if authenticated) */}
                    {routes.public.map(({ path, element: Element }) => (
                      <Route
                        key={path}
                        path={path}
                        element={
                          <PublicRoute>
                            <ErrorBoundary>
                              <Element />
                            </ErrorBoundary>
                          </PublicRoute>
                        }
                      />
                    ))}

                    {/* Auth Routes (no protection) */}
                    {routes.auth.map(({ path, element: Element }) => (
                      <Route
                        key={path}
                        path={path}
                        element={
                          <ErrorBoundary>
                            <Element />
                          </ErrorBoundary>
                        }
                      />
                    ))}

                    {/* Admin Routes (protected) */}
                    {routes.admin.map(({ path, element: Element }) => (
                      <Route
                        key={path}
                        path={path}
                        element={
                          <AdminRoute>
                            <ErrorBoundary>
                              <Element />
                            </ErrorBoundary>
                          </AdminRoute>
                        }
                      />
                    ))}

                    {/* User Routes (protected) */}
                    {routes.user.map(({ path, element: Element }) => (
                      <Route
                        key={path}
                        path={path}
                        element={
                          <UserRoute>
                            <ErrorBoundary>
                              <Element />
                            </ErrorBoundary>
                          </UserRoute>
                        }
                      />
                    ))}

                    {/* 404 Route */}
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </Suspense>
              </main>
            </div>
          </div>
        </AuthProvider>
        {process.env.NODE_ENV === 'development' && <ReactQueryDevtools />}
      </QueryClientProvider>
    </ErrorBoundary>
  );
};

export default App;