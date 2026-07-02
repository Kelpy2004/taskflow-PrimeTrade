import { CrownIcon } from '@/components/ui/icons';
import type { UserRole } from '@/types';

/** Role chip — members get neutral glass, admins the solid gradient. */
export default function RoleChip({ role }: { role: UserRole }) {
  if (role === 'admin') {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-[7px] px-2.5 py-1 text-xs font-semibold text-on-primary bg-[linear-gradient(160deg,#a6e2ff,#7dd3fc)]">
        <CrownIcon />
        Admin
      </span>
    );
  }
  return (
    <span className="inline-flex items-center rounded-[7px] px-2.5 py-1 text-xs font-semibold text-on-surface-variant bg-surface/70 border border-primary/12">
      Member
    </span>
  );
}
