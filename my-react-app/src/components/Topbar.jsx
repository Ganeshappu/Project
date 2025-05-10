// components/Topbar.jsx
import { useNavigate } from "react-router-dom";

const Topbar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token"); // Or sessionStorage if you're using that
    navigate("/admin-login"); // Make sure this matches your login route
  };

  return (
    <div className="bg-white shadow-md p-4 flex justify-end">
      <button 
        onClick={handleLogout} 
        className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
      >
        Logout
      </button>
    </div>
  );
};

export default Topbar;
