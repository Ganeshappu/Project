import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import WhyJoin from './components/WhyJoin';
import Footer from './components/Footer';
import StudentLogin from './pages/StudentLogin';
import AdminLogin from './pages/AdminLogin';
import StudentDashboard from './pages/StudentDashboard';
import AdminDashboard from './pages/AdminDashboard';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import ManageStudents from './pages/ManageStudents';
import Schedule from './pages/Schedule';
import Announcements from './pages/Announcements';
import CertificateGenerator from './components/CertificateGenerator'; 
import Feedback from './pages/Feedback';
import MailGenerator from './Email/MailGenerator'; // New import for the feedback page
function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="font-sans min-h-screen flex flex-col">
          <Navbar />
          <main className="flex-grow">
            <Routes>
              {/* Public routes */}
              <Route path="/" element={
                <>
                  <Hero />
                  <WhyJoin />
                  <content />
                </>
              } />
              <Route path="/student-login" element={<StudentLogin />} />
              <Route path="/admin-login" element={<AdminLogin />} />
               <Route path="/feedback" element={<Feedback />} /> {/* New route for feedback page */}
              {/* Protected student dashboard */}
              <Route element={<ProtectedRoute />}>
                <Route path="/student-dashboard" element={<StudentDashboard />} />
              </Route>

              {/* Admin Dashboard and Pages */}
              <Route path="/admin-dashboard" element={<AdminDashboard />} />
              <Route path="/manage-students" element={<ManageStudents />} />
              <Route path="/schedule" element={<Schedule />} />
              <Route path="/announcements" element={<Announcements />} />
              <Route path="/generate-certificate" element={<CertificateGenerator />} /> {/* New route for certificate generator */}
              <Route path="/email-generator" element={<MailGenerator />} /> {/* New route for mail generator */}
              {/* 404 Not Found */}
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
