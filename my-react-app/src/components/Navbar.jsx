import { Link } from 'react-router-dom';
const Navbar = () => {
  return (
    <nav className="bg-white shadow-md p-4 flex justify-between items-center">
      <div className="flex items-center gap-2">
        <img src="\src\assets\logo.png" alt="Logo" className="w-8 h-8" />
      </div>
      <div className="flex gap-4">
        <Link to="/student-login">
          <button className="px-4 py-2 text-sm text-blue-600 border border-blue-600 rounded hover:bg-blue-50 transition">
            Student Login
          </button>
        </Link>
        <Link to="/admin-login">
          <button className="px-4 py-2 text-sm text-white bg-blue-600 rounded hover:bg-blue-700 transition">
            Admin Login
          </button>
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;
