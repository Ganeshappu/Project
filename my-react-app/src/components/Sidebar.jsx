import { Link, useLocation } from "react-router-dom";
import {
  FiHome,
  FiUsers,
  FiCalendar,
  FiBell,
  FiFileText,
  FiChevronRight,
  FiAward, // Use this for CertiForge
  FiMail    // Use this for MailMint
} from "react-icons/fi";


const Sidebar = () => {
  const location = useLocation();
  
  const navItems = [
  { path: "/admin-dashboard", label: "Dashboard", icon: <FiHome /> },
  { path: "/manage-students", label: "Manage Students", icon: <FiUsers /> },
  { path: "/schedule", label: "Schedule", icon: <FiCalendar /> },
  { path: "/announcements", label: "Announcements", icon: <FiBell /> },
  { path: "/generate-certificate", label: "Certificate Generator", icon: <FiAward /> },
  { path: "/email-Generator", label: "Mail Generator", icon: <FiMail /> },
];


  return (
    <aside className="w-59 h-[91vh] bg-gradient-to-b from-gray-800 to-gray-900 text-white flex flex-col">
      <div className="p-5 pb-5">
        <h2 className="text-2xl font-bold flex items-center">
          <span className="bg-blue-500 rounded-lg p-2 mr-3">
            <FiHome size={20} />
          </span>
          Admin Panel
        </h2>
      </div>
      
      <nav className="flex-1 px-4 space-y-1">
        {navItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`flex items-center justify-between p-3 rounded-lg transition-all 
              ${location.pathname === item.path 
                ? "bg-blue-600/20 text-blue-400 border-l-4 border-blue-400" 
                : "hover:bg-gray-700/50 hover:pl-5"}`}
          >
            <div className="flex items-center">
              <span className="mr-3 text-lg">{item.icon}</span>
              {item.label}
            </div>
            <FiChevronRight className="opacity-0 group-hover:opacity-100" />
          </Link>
        ))}
      </nav>
      
      <div className="p-4 border-t border-gray-700">
        <div className="flex items-center">
          <div className="w-10 h-10 rounded-full bg-gray-600 flex items-center justify-center mr-3">
            <span className="text-lg">A</span>
          </div>
          <div>
            <p className="font-medium">Admin User</p>
            <p className="text-xs text-gray-400">admin@example.com</p>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;