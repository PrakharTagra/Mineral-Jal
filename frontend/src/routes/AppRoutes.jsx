import { Routes, Route, Navigate } from "react-router-dom";

import MainLayout from "../components/layout/MainLayout";
import Dashboard from "../pages/dashboard/Dashboard";
import AddService from "../pages/service/AddService";
import AddRO from "../pages/ro/AddRO";
import AMCTracker from "../pages/amc/AMCTracker";
import CustomerList from "../pages/customers/CustomerList";
import CustomerProfile from "../pages/customers/CustomerProfile";
import BillView from "../pages/bills/BillView";
import Bills from "../pages/bills/Bills";
import AdminLogin from "../pages/AdminLogin";

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem("adminToken");
  return token ? children : <Navigate to="/admin-login" replace />;
};

const AppRoutes = () => {
  return (
    <Routes>

      {/* Default Route → Redirect to Login */}
      <Route path="/" element={<Navigate to="/admin-login" replace />} />

      {/* Login Route */}
      <Route path="/admin-login" element={<AdminLogin />} />

      {/* Protected Routes */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <MainLayout>
              <Dashboard />
            </MainLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/add-service"
        element={
          <ProtectedRoute>
            <MainLayout>
              <AddService />
            </MainLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/add-ro"
        element={
          <ProtectedRoute>
            <MainLayout>
              <AddRO />
            </MainLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/amc"
        element={
          <ProtectedRoute>
            <MainLayout>
              <AMCTracker />
            </MainLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/customers"
        element={
          <ProtectedRoute>
            <MainLayout>
              <CustomerList />
            </MainLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/customer/:id"
        element={
          <ProtectedRoute>
            <MainLayout>
              <CustomerProfile />
            </MainLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/bills"
        element={
          <ProtectedRoute>
            <MainLayout>
              <Bills />
            </MainLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/bill/:invoiceNumber"
        element={
          <ProtectedRoute>
            <MainLayout>
              <BillView />
            </MainLayout>
          </ProtectedRoute>
        }
      />

    </Routes>
  );
};

export default AppRoutes;