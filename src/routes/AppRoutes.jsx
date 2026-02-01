import { BrowserRouter, Routes, Route } from "react-router-dom";

import MainLayout from "../components/layout/MainLayout";
import Dashboard from "../pages/dashboard/Dashboard";
import AddService from "../pages/service/AddService";
import AddRO from "../pages/ro/AddRO";
import AMCTracker from "../pages/amc/AMCTracker";
import CustomerList from "../pages/customers/CustomerList";
import CustomerProfile from "../pages/customers/CustomerProfile";
import BillView from "../pages/bills/BillView"
import Bills from "../pages/bills/Bills";

const AppRoutes = () => {
  return (
    <BrowserRouter>
      <MainLayout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/add-service" element={<AddService />} />
          <Route path="/add-ro" element={<AddRO />} />
          <Route path="/amc" element={<AMCTracker />} />
          <Route path="/customers" element={<CustomerList />} />
          <Route path="/customer/:id" element={<CustomerProfile />} />
          <Route path="/bills" element={<Bills />} />
          <Route path="/bill/:invoiceNumber" element={<BillView />} />
        </Routes>
      </MainLayout>
    </BrowserRouter>
  );
};

export default AppRoutes;
