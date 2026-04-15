import { Role } from '@/types';

const LABELS: Record<Role, string> = {
  CUSTOMER: 'Customer',
  PROVIDER: 'Provider',
  ADMIN: 'Admin',
  MANAGER: 'Manager',
  ORGANIZER: 'Organizer',
};

export function formatRoleLabel(role: string): string {
  if (role in LABELS) return LABELS[role as Role];
  return role.replace(/_/g, ' ');
}
