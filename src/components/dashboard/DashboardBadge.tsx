type BadgeVariant = 'active' | 'paused' | 'expired' | 'pending' | 'accepted' | 'declined' | 'verified' | 'unverified';

const variantMap: Record<BadgeVariant, string> = {
  active: 'bg-emerald-100 text-emerald-700 border-emerald-200',
  paused: 'bg-amber-100 text-amber-700 border-amber-200',
  expired: 'bg-gray-100 text-gray-600 border-gray-200',
  pending: 'bg-blue-100 text-blue-700 border-blue-200',
  accepted: 'bg-emerald-100 text-emerald-700 border-emerald-200',
  declined: 'bg-red-100 text-red-600 border-red-200',
  verified: 'bg-emerald-100 text-emerald-700 border-emerald-200',
  unverified: 'bg-gray-100 text-gray-500 border-gray-200',
};

interface DashboardBadgeProps {
  variant: BadgeVariant;
  label?: string;
}

const defaultLabels: Record<BadgeVariant, string> = {
  active: 'Active',
  paused: 'Paused',
  expired: 'Expired',
  pending: 'Pending',
  accepted: 'Accepted',
  declined: 'Declined',
  verified: 'Verified',
  unverified: 'Not Verified',
};

export default function DashboardBadge({ variant, label }: DashboardBadgeProps) {
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${variantMap[variant]}`}>
      {label ?? defaultLabels[variant]}
    </span>
  );
}
