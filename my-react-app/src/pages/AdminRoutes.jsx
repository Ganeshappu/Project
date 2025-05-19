// src/pages/AdminRoutes.jsx
import React from "react";
import { Routes, Route } from "react-router-dom";
import AdminDashboard from "./AdminDashboard";
import DashboardHome from "./DashboardHome";
import ManageStudents from "./ManageStudents";
import Schedule from "./Schedule";
import Announcements from "./Announcements";
import CertificateGenerator from "../components/CertificateGenerator"; // Ensure this path is correct
const AdminRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<AdminDashboard />}>
        <Route index element={<DashboardHome />} />
        <Route path="students" element={<ManageStudents />} />
        <Route path="schedule" element={<Schedule />} />
        <Route path="announcements" element={<Announcements />} />
        <Route path="certificate-generator" element={<CertificateGenerator />} />
      </Route>
    </Routes>
  );
};

export default AdminRoutes;