// pages/AdminDashboard.jsx
import Sidebar from "../components/Sidebar";   // Check if Sidebar.jsx exists inside components folder
import Topbar from "../components/Topbar";     // Check if Topbar.jsx exists inside components folder
import { Outlet } from "react-router-dom";    

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

export default AdminDashboard;
