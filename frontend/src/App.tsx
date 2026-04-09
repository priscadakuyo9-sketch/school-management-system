import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Students from './pages/Students';
import Teachers from './pages/Teachers';
import Finances from './pages/Finances';
import Planning from './pages/Planning';
import Login from './pages/Login';
import Landing from './pages/Landing';
import Complaints from './pages/Complaints';
import Security from './pages/Security';

const AuthGuard = ({ isAuthenticated }: { isAuthenticated: boolean }) => {
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  return <Outlet />;
};

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('token'));

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsAuthenticated(true);
    }
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        {/* Route Publique : Page d'accueil du site de l'école */}
        <Route index element={<Landing />} />
        
        {/* Route Publique : Connexion au portail admin */}
        <Route path="/login" element={<Login setIsAuthenticated={setIsAuthenticated} />} />
        
        {/* Routes Protégées : Nécessitent d'être connecté au portail Admin */}
        <Route path="/dashboard" element={<AuthGuard isAuthenticated={isAuthenticated} />}>
          <Route element={<Layout />}>
             <Route index element={<Dashboard />} />
             <Route path="students" element={<Students />} />
             <Route path="teachers" element={<Teachers />} />
             <Route path="finances" element={<Finances />} />
             <Route path="planning" element={<Planning />} />
             <Route path="complaints" element={<Complaints />} />
             <Route path="security" element={<Security />} />
             <Route path="settings" element={<div className="p-8 font-black">Paramètres en construction...</div>} />
          </Route>
        </Route>

        {/* Catch all : Redirection vers Landing Page */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
