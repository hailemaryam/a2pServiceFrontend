import { HashRouter as Router, Routes, Route } from "react-router";
import Landing from "./pages/Landing/Landing";
import RootRoute from "./components/auth/RootRoute";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import AdminRoute from "./components/auth/AdminRoute";

import LineChart from "./pages/Charts/LineChart";
import BarChart from "./pages/Charts/BarChart";

import BasicTables from "./pages/Tables/BasicTables";
import FormElements from "./pages/Forms/FormElements";
import Blank from "./pages/Blank";
import AppLayout from "./layout/AppLayout";
import SystemAdminLayout from "./layout/SystemAdminLayout";
import { ScrollToTop } from "./components/common/ScrollToTop";
// Home component not used directly in routes; import removed to avoid unused declaration
import Admin from "./pages/Admin/Admin";
import SystemAdminDashboard from "./pages/SystemAdmin/SystemAdminDashboard";
import TenantsPage from "./pages/SystemAdmin/TenantsPage";
import SenderApprovalsPage from "./pages/SystemAdmin/SenderApprovalsPage";
import SmsJobApprovalsPage from "./pages/SystemAdmin/SmsJobApprovalsPage";
import SmsPackagesPage from "./pages/SystemAdmin/SmsPackagesPage";
import Billings from "./pages/Billings/Billings";
import BillingsForm from "./pages/Billings/BillingsForm";
import Checkout from "./pages/Billings/Checkout";
import SendSMS from "./pages/SMS/SendSMS";
import Contact from "./pages/Contact/Contact";
import ContactGroup from "./pages/ContactGroup/ContactGroup";
import API from "./pages/API/API";
import Profile from "./pages/Profile/Profile";

export default function App() {
  return (
    <>
      <Router>
        <ScrollToTop />
        <Routes>
          {/* Landing page for unauthenticated users */}
          <Route path="/landing" element={<Landing />} />

          {/* Root path - handles role-based routing */}
          <Route index path="/" element={<RootRoute />} />

          {/* System Admin Routes - Only accessible to sys_admin */}
          <Route
            element={
              <AdminRoute redirectTo="/landing">
                <SystemAdminLayout />
              </AdminRoute>
            }
          >
            <Route path="/admin" element={<SystemAdminDashboard />} />
            <Route path="/admin/tenants" element={<TenantsPage />} />
            <Route path="/admin/senders" element={<SenderApprovalsPage />} />
            <Route path="/admin/sms-jobs" element={<SmsJobApprovalsPage />} />
            <Route path="/admin/sms-packages" element={<SmsPackagesPage />} />
          </Route>

          {/* Tenant Routes - Only accessible to tenant_admin and tenant_user */}
          <Route
            element={
              <ProtectedRoute
                allowedRoles={["tenant_admin", "tenant_user"]}
                redirectTo="/landing"
              >
                <AppLayout />
              </ProtectedRoute>
            }
          >
            <Route path="/blank" element={<Blank />} />

            {/* Dashboard */}
            <Route path="/dashboard" element={<Admin />} />

            {/* Billings */}
            <Route path="/billings" element={<Billings />} />
            <Route path="/billings-form" element={<BillingsForm />} />
            <Route path="/billing/checkout" element={<Checkout />} />

            {/* SMS */}
            <Route path="/send-sms" element={<SendSMS />} />
            {/* SMS Logs and Received SMS removed for tenants per RBAC */}

            {/* Contact */}
            <Route path="/contact" element={<Contact />} />

            {/* Contact Group */}
            <Route path="/contact-group" element={<ContactGroup />} />

            {/* API */}
            <Route path="/api" element={<API />} />

            {/* Profile */}
            <Route path="/profile" element={<Profile />} />

            {/* Forms */}
            <Route path="/form-elements" element={<FormElements />} />

            {/* Tables */}
            <Route path="/basic-tables" element={<BasicTables />} />

            {/* Charts */}
            <Route path="/line-chart" element={<LineChart />} />
            <Route path="/bar-chart" element={<BarChart />} />
          </Route>

          {/* Auth Layout - Keep for backward compatibility */}
          {/* <Route path="/signin" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} /> */}

          {/* Fallback Route */}
          <Route path="*" element={<Landing />} />
        </Routes>
      </Router>
    </>
  );
}
