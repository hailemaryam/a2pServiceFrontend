import { BrowserRouter as Router, Routes, Route } from "react-router";
import SignIn from "./pages/AuthPages/SignIn";
import SignUp from "./pages/AuthPages/SignUp";
import NotFound from "./pages/OtherPage/NotFound";

import LineChart from "./pages/Charts/LineChart";
import BarChart from "./pages/Charts/BarChart";

import BasicTables from "./pages/Tables/BasicTables";
import FormElements from "./pages/Forms/FormElements";
import Blank from "./pages/Blank";
import AppLayout from "./layout/AppLayout";
import { ScrollToTop } from "./components/common/ScrollToTop";
// Home component not used directly in routes; import removed to avoid unused declaration
import Admin from "./pages/Admin/Admin";
import Billings from "./pages/Billings/Billings";
import BillingsForm from "./pages/Billings/BillingsForm";
import SendSMS from "./pages/SMS/SendSMS";
import SMSLog from "./pages/SMS/SMSLog";
import ReceivedSMS from "./pages/SMS/ReceivedSMS";
import Contact from "./pages/Contact/Contact";
import API from "./pages/API/API";

export default function App() {
  return (
    <>
      <Router>
        <ScrollToTop />
        <Routes>
          {/* Dashboard Layout */}
          <Route element={<AppLayout />}>
            <Route index path="/" element={<Admin />} />
            <Route path="/blank" element={<Blank />} />

            {/* Admin */}
            <Route path="/admin" element={<Admin />} />

            {/* Billings */}
            <Route path="/billings" element={<Billings />} />
            <Route path="/billings-form" element={<BillingsForm />} />

            {/* SMS */}
            <Route path="/send-sms" element={<SendSMS />} />
            <Route path="/sms-log" element={<SMSLog />} />
            <Route path="/received-sms" element={<ReceivedSMS />} />

            {/* Contact */}
            <Route path="/contact" element={<Contact />} />

            {/* API */}
            <Route path="/api" element={<API />} />

            {/* Forms */}
            <Route path="/form-elements" element={<FormElements />} />

            {/* Tables */}
            <Route path="/basic-tables" element={<BasicTables />} />

            {/* Charts */}
            <Route path="/line-chart" element={<LineChart />} />
            <Route path="/bar-chart" element={<BarChart />} />
          </Route>

          {/* Auth Layout */}
          <Route path="/signin" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />

          {/* Fallback Route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </>
  );
}
