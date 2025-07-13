import { Link } from 'react-router-dom';
import { Code, Users, BookOpen, ArrowRight, Rocket } from 'lucide-react';

const Navbar = () => {
  return (
    <nav className="bg-white shadow-md p-4 flex justify-between items-center">
      <div className="flex items-center gap-2">
        <img src="https://static.vecteezy.com/system/resources/previews/005/503/271/non_2x/student-community-logo-template-this-design-use-book-people-and-hat-symbol-suitable-for-education-free-vector.jpg" alt="Logo" className="w-12 h-12" />
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

const HomeHero = () => {
  return (
    <div>
      <Navbar />
      <section className="bg-gradient-to-br from-gray-900 to-blue-800 text-white py-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          {/* Main Hero Content */}
          <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent">
            Engage. Collaborate. Grow.
          </h1>

          <p className="text-lg md:text-xl text-gray-300 mb-12 max-w-3xl mx-auto leading-relaxed">
            A centralized platform for college clubs to connect, share ideas, organize events, 
            and foster a stronger campus community through seamless collaboration.
          </p>
        </div>
      </section>
    </div>
  );
};

export default HomeHero;