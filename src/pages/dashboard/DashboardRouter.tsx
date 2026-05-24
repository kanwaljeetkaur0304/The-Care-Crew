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
  const { user } = useAuth();

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
