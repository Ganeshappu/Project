import { Link } from "react-router-dom";

const Sidebar = () => {
  return (
    <aside className="w-64 bg-gray-800 text-white h-screen p-4 space-y-4">
      <h2 className="text-2xl font-bold mb-4">Admin Panel</h2>
      <nav className="flex flex-col space-y-2">
        <Link to="/admin-dashboard" className="hover:text-yellow-400">Dashboard</Link>
        <Link to="/manage-students" className="hover:text-yellow-400">Manage Students</Link>
        <Link to="/schedule" className="hover:text-yellow-400">Schedule</Link>
        <Link to="/announcements" className="hover:text-yellow-400">Announcements</Link>
      </nav>
    </aside>
  );
};

export default Sidebar;
