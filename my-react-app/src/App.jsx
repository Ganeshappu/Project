import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Hero from './components/Hero';
import WhyJoin from './components/WhyJoin';
import Footer from './components/Footer';
import StudentLogin from './pages/StudentLogin';
import AdminLogin from './pages/AdminLogin';
import StudentDashboard from './pages/StudentDashboard';
import AdminDashboard from './pages/AdminDashboard';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Announcements from './pages/Announcements';
import CertificateGenerator from './components/CertificateGenerator'; 
import Feedback from './pages/Feedback';
import MailGenerator from './Email/MailGenerator';
import AdminEvents from './pages/AdminEvents';
import UserDetails from './pages/UserDetails';
import ChatBox from './pages/ChatBox'; // Importing ResourceUploader component  
// New import for the feedback page
function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="font-sans min-h-screen flex flex-col">
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
               <Route path="/feedback" element={<Feedback />} />
               <Route path="/chat" element={<ChatBox />} /> {/* New route for chat page */}
              {/* Protected student dashboard */}
              <Route element={<ProtectedRoute />}>
                <Route path="/student-dashboard" element={<StudentDashboard />} />
              </Route>

              {/* Admin Dashboard and Pages */}
              <Route path="/admin-dashboard" element={<AdminDashboard />} />
              <Route path="/announcements" element={<Announcements />} />
              <Route path="/admin-events" element={<AdminEvents />} />
              <Route path="/user-details" element={<UserDetails />} /> {/* New route for user details */}
              {/* Resource Uploader and Certificate Generator */}
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
