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
  FiShield
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
      path: "/manage-students", 
      label: "Manage Students", 
      icon: <FiUsers />,
      color: "green"
    },
    { 
      path: "/schedule", 
      label: "Schedule", 
      icon: <FiCalendar />,
      color: "purple"
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

          {/* Analytics Section */}
          {!isCollapsed && (
            <div className="mt-8 pt-6 border-t border-gray-100">
              <div className="mb-4">
                <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider px-3">
                  Analytics
                </h3>
              </div>
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-4 border border-blue-100">
                <div className="flex items-center justify-between mb-2">
                  <FiBarChart2 className="text-blue-600" />
                  <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                    +12%
                  </span>
                </div>
                <h4 className="font-semibold text-gray-800 text-sm">Monthly Growth</h4>
                <p className="text-xs text-gray-600 mt-1">1,847 new users this month</p>
              </div>
            </div>
          )}
        </nav>

        {/* Bottom Section */}
        <div className="border-t border-gray-100 p-4">
          {/* Quick Settings */}
          <div className="space-y-1 mb-4">
            {bottomItems.map((item, index) => (
              <button
                key={index}
                className={`w-full flex items-center px-3 py-2 rounded-lg transition-colors duration-200 ${
                  getColorClasses(item.color)
                }`}
                title={isCollapsed ? item.label : ''}
              >
                <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-gray-100 group-hover:bg-gray-200 transition-colors duration-200">
                  <span className="text-lg">{item.icon}</span>
                </div>
                {!isCollapsed && (
                  <span className="ml-3 font-medium text-sm">{item.label}</span>
                )}
              </button>
            ))}
          </div>

          {/* User Profile */}
          <div className={`bg-gray-50 rounded-xl p-3 ${isCollapsed ? 'text-center' : ''}`}>
            <div className="flex items-center">
              <div className="relative">
                <img
                  src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face&auto=format"
                  alt="Admin"
                  className="w-10 h-10 rounded-full object-cover border-2 border-white shadow-sm"
                />
                <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-400 border-2 border-white rounded-full"></div>
              </div>
              
              {!isCollapsed && (
                <div className="ml-3 flex-1 min-w-0">
                  <p className="font-semibold text-gray-800 text-sm truncate">John Anderson</p>
                  <p className="text-xs text-gray-500 truncate">Super Admin</p>
                </div>
              )}
              
              {!isCollapsed && (
                <button className="p-1 hover:bg-gray-200 rounded-lg transition-colors">
                  <FiLogOut className="text-gray-400 hover:text-red-500 transition-colors" size={16} />
                </button>
              )}
            </div>
            
            {!isCollapsed && (
              <div className="mt-3 flex items-center justify-between text-xs">
                <div className="flex items-center text-green-600">
                  <div className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse"></div>
                  <span>Online</span>
                </div>
                <span className="text-gray-400">Last login: 2m ago</span>
              </div>
            )}
          </div>
        </div>
      </aside>
    </div>
  );
};

export default Sidebar;