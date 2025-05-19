// pages/AdminDashboard.jsx
import Sidebar from "../components/Sidebar";   // Check if Sidebar.jsx exists inside components folder
import Topbar from "../components/Topbar";     // Check if Topbar.jsx exists inside components folder
import { Outlet } from "react-router-dom";    
import CertificateGenerator from '../components/CertificateGenerator'; // Check if CertificateGenerator.jsx exists inside components folder
const AdminDashboard = () => {
  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 min-h-screen bg-gray-100">
        <Topbar />
        <main className="p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
const AdminPage = () => {
  return (
    <div className="p-6">
      {/* Your existing admin controls here */}
      <CertificateGenerator />
    </div>
  );
};

export default AdminDashboard;
