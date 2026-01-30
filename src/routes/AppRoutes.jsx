import { BrowserRouter, Routes, Route } from "react-router-dom";

import Dashboard from "../pages/dashboard/Dashboard";
import AddService from "../pages/service/AddService";
import AddRO from "../pages/ro/AddRO";
import AMCTracker from "../pages/amc/AMCTracker";
import CustomerList from "../pages/customers/CustomerList";
import CustomerProfile from "../pages/customers/CustomerProfile";

const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/add-service" element={<AddService />} />
        <Route path="/add-ro" element={<AddRO />} />
        <Route path="/amc" element={<AMCTracker />} />
        <Route path="/customers" element={<CustomerList />} />
        <Route path="/customer/:id" element={<CustomerProfile />} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;