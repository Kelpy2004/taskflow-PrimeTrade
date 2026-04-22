import { Folders, Rocket, GitBranch, ShieldCheck } from 'lucide-react';

export default function ProjectsPage() {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold text-on-surface tracking-tight flex items-center gap-3">
            <Folders className="w-7 h-7 text-primary" />
            Delivery Notes
          </h2>
          <p className="text-on-surface-variant text-sm mt-1">
            Product direction, implementation scope, and backend growth notes for reviewer walkthroughs.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="glass-panel rounded-xl p-6">
          <div className="flex items-center gap-3 mb-3">
            <Rocket className="w-5 h-5 text-primary" />
            <h3 className="text-lg font-semibold text-on-surface">Delivery Roadmap</h3>
          </div>
          <p className="text-sm text-on-surface-variant">
            TaskForge ships the core assignment scope now, with clear next steps for Docker deployment, Redis caching, structured logs, and CI.
          </p>
        </div>

        <div className="glass-panel rounded-xl p-6">
          <div className="flex items-center gap-3 mb-3">
            <ShieldCheck className="w-5 h-5 text-tertiary" />
            <h3 className="text-lg font-semibold text-on-surface">Security Posture</h3>
          </div>
          <p className="text-sm text-on-surface-variant">
            JWT authentication, role guards, request validation, and audit logging are all active in the backend review build.
          </p>
        </div>

        <div className="glass-panel rounded-xl p-6">
          <div className="flex items-center gap-3 mb-3">
            <GitBranch className="w-5 h-5 text-secondary" />
            <h3 className="text-lg font-semibold text-on-surface">Scaling Path</h3>
          </div>
          <p className="text-sm text-on-surface-variant">
            The backend is already split into controllers, routes, models, middlewares, validators, and utils so new modules can be added without a rewrite.
          </p>
        </div>
      </div>
    </div>
  );
}
