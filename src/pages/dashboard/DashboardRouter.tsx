import { useAuth } from '../../context/AuthContext';
import { Navigate } from 'react-router-dom';

// Overview components
import FamilyOverview from './family/FamilyOverview';
import CaregiverOverview from './caregiver/CaregiverOverview';
import FamilyProfile from './family/FamilyProfile';
import CaregiverProfile from './caregiver/CaregiverProfile';
import FamilyContactRequests from './family/FamilyContactRequests';
import CaregiverContactRequests from './caregiver/CaregiverContactRequests';

interface DashboardRouterProps {
  page?: 'overview' | 'profile' | 'contact-requests';
}

export default function DashboardRouter({ page = 'overview' }: DashboardRouterProps) {
  const { user, isLoading } = useAuth();

  // Only block render if we have no user yet AND are still checking auth.
  // If a user is already set (demo or real), show the page immediately.
  if (isLoading && !user) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-8 h-8 rounded-full border-4 border-maroon border-t-transparent animate-spin" />
      </div>
    );
  }

  if (!user) return <Navigate to="/" replace />;

  const isCaregiver = user.role === 'caregiver';

  if (page === 'profile') {
    return isCaregiver ? <CaregiverProfile /> : <FamilyProfile />;
  }

  if (page === 'contact-requests') {
    return isCaregiver ? <CaregiverContactRequests /> : <FamilyContactRequests />;
  }

  // Default: overview
  return isCaregiver ? <CaregiverOverview /> : <FamilyOverview />;
}
