import React from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import AuthPage from './pages/AuthPage';
import DashboardPage from './pages/DashboardPage';
import { Loader2 } from 'lucide-react';

const MainLayout = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
        gap: '16px',
        color: 'var(--text-muted)'
      }}>
        <Loader2 size={40} className="animate-spin" color="var(--primary)" />
        <p style={{ fontWeight: 600 }}>Memuat ContactVault...</p>
      </div>
    );
  }

  return (
    <div>
      <Navbar />
      {user ? <DashboardPage /> : <AuthPage />}
    </div>
  );
};

const App = () => {
  return (
    <AuthProvider>
      <MainLayout />
    </AuthProvider>
  );
};

export default App;
