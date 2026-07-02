import { ShieldAlert } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function UnauthorizedPage() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center">
      <div className="glass-elevated rounded-2xl p-10 max-w-lg text-center">
        <div className="w-16 h-16 mx-auto rounded-2xl bg-error/10 border border-error/20 text-error flex items-center justify-center mb-6">
          <ShieldAlert className="w-8 h-8" />
        </div>
        <h1 className="text-2xl font-semibold text-on-surface">Access restricted</h1>
        <p className="text-sm text-on-surface-variant mt-3">
          Your account does not have permission to view this page.
        </p>
        <Link
          to="/tasks"
          className="inline-flex mt-6 px-5 py-2.5 rounded-xl glass-button-primary text-sm font-semibold"
        >
          Back to tasks
        </Link>
      </div>
    </div>
  );
}
