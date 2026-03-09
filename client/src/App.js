import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Papers from './pages/Papers';
import PaperDetails from './pages/PaperDetails';
import SubmitPaper from './pages/SubmitPaper';
import Issues from './pages/Issues';
import Indexing from './pages/Indexing';
import EditorialTeam from './pages/EditorialTeam';
import PublicationEthics from './pages/PublicationEthics';
import OpenAccessPolicy from './pages/OpenAccessPolicy';
import PeerReviewPolicy from './pages/PeerReviewPolicy';
import PlagiarismPolicy from './pages/PlagiarismPolicy';
import AuthorsGuide from './pages/AuthorsGuide';
import AimsScope from './pages/AimsScope';
import ContactUs from './pages/ContactUs';
import AdminLogin from './pages/AdminLogin';
import Dashboard from './pages/Dashboard';

const ProtectedRoute = ({ children }) => {
  const { admin, loading } = useAuth();
  if (loading) return <div className="spinner" style={{ marginTop: 120 }} />;
  return admin ? children : <Navigate to="/x7k-admin/login" replace />;
};

const PublicLayout = ({ children }) => (
  <>
    <Navbar />
    <main>{children}</main>
    <Footer />
  </>
);

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<PublicLayout><Home /></PublicLayout>} />
      <Route path="/issues" element={<PublicLayout><Issues /></PublicLayout>} />
      <Route path="/indexing" element={<PublicLayout><Indexing /></PublicLayout>} />
      <Route path="/editorial-team" element={<PublicLayout><EditorialTeam /></PublicLayout>} />
      <Route path="/publication-ethics" element={<PublicLayout><PublicationEthics /></PublicLayout>} />
      <Route path="/open-access-policy" element={<PublicLayout><OpenAccessPolicy /></PublicLayout>} />
      <Route path="/peer-review-policy" element={<PublicLayout><PeerReviewPolicy /></PublicLayout>} />
      <Route path="/plagiarism-policy" element={<PublicLayout><PlagiarismPolicy /></PublicLayout>} />
      <Route path="/authors-guide" element={<PublicLayout><AuthorsGuide /></PublicLayout>} />
      <Route path="/aims-scope" element={<PublicLayout><AimsScope /></PublicLayout>} />
      <Route path="/contact" element={<PublicLayout><ContactUs /></PublicLayout>} />
      <Route path="/papers" element={<PublicLayout><Papers /></PublicLayout>} />
      <Route path="/papers/:id" element={<PublicLayout><PaperDetails /></PublicLayout>} />
      <Route path="/submit" element={<PublicLayout><SubmitPaper /></PublicLayout>} />
      <Route path="/x7k-admin/login" element={<AdminLogin />} />
      <Route path="/x7k-admin/dashboard" element={
        <ProtectedRoute><Dashboard /></ProtectedRoute>
      } />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppRoutes />
      </Router>
    </AuthProvider>
  );
}

export default App;
