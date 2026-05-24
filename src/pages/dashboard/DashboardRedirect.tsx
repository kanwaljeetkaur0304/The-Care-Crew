import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function DashboardRedirect() {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 rounded-full border-4 border-maroon border-t-transparent animate-spin" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/" replace />;
  }

  // Both family and caregiver land on /dashboard/overview
  return <Navigate to="/dashboard" replace />;
}
