import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import useAuthStore from './store/authStore';

import LandingPage   from './pages/LandingPage';
import AuthPage      from './pages/AuthPage';
import HealthProfile from './pages/HealthProfile';
import Dashboard     from './pages/Dashboard';

function ProtectedRoute({ children }) {
  const token = useAuthStore((s) => s.token);
  return token ? children : <Navigate to="/login" />;
}

function GuestRoute({ children }) {
  const token = useAuthStore((s) => s.token);
  return !token ? children : <Navigate to="/dashboard" />;
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/"               element={<GuestRoute><LandingPage /></GuestRoute>} />
        <Route path="/login"          element={<GuestRoute><AuthPage /></GuestRoute>} />
        <Route path="/register"       element={<GuestRoute><AuthPage /></GuestRoute>} />
        <Route path="/health-profile" element={<ProtectedRoute><HealthProfile /></ProtectedRoute>} />
        <Route path="/dashboard"      element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
      </Routes>
    </BrowserRouter>
  );
}