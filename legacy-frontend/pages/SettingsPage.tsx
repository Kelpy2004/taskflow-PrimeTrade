import { KeyRound, Link2, Shield, UserCircle2 } from 'lucide-react';
import { API_BASE_URL } from '@/src/lib/api';
import { useAuth } from '@/src/context/AuthContext';

export default function SettingsPage() {
  const { user, logout } = useAuth();

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold text-on-surface tracking-tight">Settings</h2>
          <p className="text-on-surface-variant text-sm mt-1">Environment visibility for local testing and recruiter review.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="glass-panel rounded-xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <UserCircle2 className="w-5 h-5 text-primary" />
            <h3 className="text-lg font-semibold text-on-surface">Current Session</h3>
          </div>
          <div className="text-sm text-on-surface-variant space-y-2">
            <div>
              <span className="text-on-surface font-medium">Name:</span> {user?.name || 'Unknown'}
            </div>
            <div>
              <span className="text-on-surface font-medium">Email:</span> {user?.email || 'Unknown'}
            </div>
            <div>
              <span className="text-on-surface font-medium">Role:</span> {user?.role || 'Unknown'}
            </div>
          </div>

          <button
            onClick={logout}
            className="mt-6 glass-button-secondary px-4 py-2 rounded-lg text-sm font-semibold"
          >
            Logout
          </button>
        </div>

        <div className="glass-panel rounded-xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <Link2 className="w-5 h-5 text-tertiary" />
            <h3 className="text-lg font-semibold text-on-surface">API Connection</h3>
          </div>
          <div className="text-sm text-on-surface-variant space-y-2">
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-on-surface-variant" />
              <span>JWT auth uses a Bearer token stored client-side for demo and recruiter testing.</span>
            </div>
            <div className="flex items-center gap-2">
              <KeyRound className="w-4 h-4 text-on-surface-variant" />
              <span className="text-on-surface font-medium">Base URL:</span>
              <span className="font-mono text-xs text-on-surface">{API_BASE_URL}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
