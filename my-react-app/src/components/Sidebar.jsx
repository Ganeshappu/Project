import { Link, useLocation } from "react-router-dom";
import { useState } from "react";
import {
  FiHome,
  FiUsers,
  FiCalendar,
  FiBell,
  FiAward,
  FiMail,
  FiSettings,
  FiHelpCircle,
  FiLogOut,
  FiMenu,
  FiX,
  FiChevronDown,
  FiBarChart2,
  FiShield,FiUpload
} from "react-icons/fi";

const Sidebar = () => {
  const location = useLocation();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  
  const navItems = [
    { 
      path: "/admin-dashboard", 
      label: "Dashboard", 
      icon: <FiHome />,
      color: "blue"
    },
    { 
      path: "/announcements", 
      label: "Announcements", 
      icon: <FiBell />,
      color: "orange"
    },
    { 
      path: "/generate-certificate", 
      label: "Certificate Generator", 
      icon: <FiAward />,
      color: "yellow"
    },
    { 
      path: "/email-Generator", 
      label: "Mail Generator", 
      icon: <FiMail />,
      color: "red"
    },
    {
      path: "/admin-events",
      label: "Events",
      icon: <FiCalendar />,
      color: "green"
    },
    {
      path: "/resource-uploader",
      label: "Resource Uploader",
      icon: <FiUpload />,
      color: "purple"
    },
    {
      path: "/user-details",
      label: "User Details",
      icon: <FiUsers />,
      color: "blue"
    }

  ];

  const bottomItems = [
    { icon: <FiSettings />, label: "Settings", color: "gray" },
    { icon: <FiHelpCircle />, label: "Help & Support", color: "gray" }
  ];

  const getColorClasses = (color, isActive = false) => {
    const colors = {
      blue: isActive ? "bg-blue-50 text-blue-700 border-blue-200" : "hover:bg-blue-50 hover:text-blue-700",
      green: isActive ? "bg-green-50 text-green-700 border-green-200" : "hover:bg-green-50 hover:text-green-700",
      purple: isActive ? "bg-purple-50 text-purple-700 border-purple-200" : "hover:bg-purple-50 hover:text-purple-700",
      orange: isActive ? "bg-orange-50 text-orange-700 border-orange-200" : "hover:bg-orange-50 hover:text-orange-700",
      yellow: isActive ? "bg-yellow-50 text-yellow-700 border-yellow-200" : "hover:bg-yellow-50 hover:text-yellow-700",
      red: isActive ? "bg-red-50 text-red-700 border-red-200" : "hover:bg-red-50 hover:text-red-700",
      gray: isActive ? "bg-gray-50 text-gray-700 border-gray-200" : "hover:bg-gray-50 hover:text-gray-700"
    };
    return colors[color] || colors.gray;
  };

  return (
    <div className={`${isCollapsed ? 'w-20' : 'w-72'} transition-all duration-300 ease-in-out`}>
      <aside className="h-full bg-white border-r border-gray-200 shadow-lg flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center justify-between">
            {!isCollapsed && (
              <div className="flex items-center">
                <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                  <FiShield className="text-white text-xl" />
                </div>
                <div className="ml-3">
                  <h1 className="text-xl font-bold text-gray-800">AdminHub</h1>
                  <p className="text-xs text-gray-500">Management Portal</p>
                </div>
              </div>
            )}
            <button
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              {isCollapsed ? <FiMenu className="text-gray-600" /> : <FiX className="text-gray-600" />}
            </button>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-6 overflow-y-auto">
          <div className="space-y-2">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`group flex items-center px-3 py-3 rounded-xl transition-all duration-200 border-2 border-transparent ${
                    getColorClasses(item.color, isActive)
                  } ${isActive ? 'shadow-sm' : ''}`}
                  title={isCollapsed ? item.label : ''}
                >
                  <div className={`flex items-center justify-center w-8 h-8 rounded-lg ${
                    isActive 
                      ? `bg-${item.color}-100` 
                      : `group-hover:bg-${item.color}-100 bg-gray-100`
                  } transition-colors duration-200`}>
                    <span className="text-lg">{item.icon}</span>
                  </div>
                  
                  {!isCollapsed && (
                    <div className="ml-3 flex-1">
                      <span className="font-medium text-sm">{item.label}</span>
                    </div>
                  )}
                  
                  {isActive && !isCollapsed && (
                    <div className={`w-2 h-2 rounded-full bg-${item.color}-500`}></div>
                  )}
                </Link>
              );
            })}
          </div>
        </nav>
      </aside>
    </div>
  );
};

export default Sidebar;