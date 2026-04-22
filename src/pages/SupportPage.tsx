import { BookOpen, ClipboardCopy, ExternalLink, FileJson, ShieldCheck } from 'lucide-react';
import { API_BASE_URL } from '@/src/lib/api';

const apiOrigin = API_BASE_URL.replace(/\/api\/v1$/, '');

export default function SupportPage() {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h2 className="text-3xl font-bold text-on-surface tracking-tight">Reviewer Hub</h2>
        <p className="text-on-surface-variant text-sm mt-1">Quick links for testing the API, reviewing documentation, and checking service health.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="glass-panel rounded-xl p-6">
          <div className="flex items-center gap-3 mb-3">
            <BookOpen className="w-5 h-5 text-primary" />
            <h3 className="text-lg font-semibold text-on-surface">Swagger</h3>
          </div>
          <p className="text-sm text-on-surface-variant">
            Open <span className="font-mono text-xs text-on-surface">/api-docs</span> on the backend for full API docs.
          </p>
          <div className="mt-4 inline-flex items-center gap-2 text-primary text-sm font-medium">
            <ExternalLink className="w-4 h-4" />
            {apiOrigin}/api-docs
          </div>
        </div>

        <div className="glass-panel rounded-xl p-6">
          <div className="flex items-center gap-3 mb-3">
            <FileJson className="w-5 h-5 text-tertiary" />
            <h3 className="text-lg font-semibold text-on-surface">Postman</h3>
          </div>
          <p className="text-sm text-on-surface-variant">
            Import the collection from <span className="font-mono text-xs text-on-surface">backend/src/docs/postman_collection.json</span>.
          </p>
        </div>

        <div className="glass-panel rounded-xl p-6">
          <div className="flex items-center gap-3 mb-3">
            <ShieldCheck className="w-5 h-5 text-secondary" />
            <h3 className="text-lg font-semibold text-on-surface">Status</h3>
          </div>
          <p className="text-sm text-on-surface-variant">
            If the UI looks fine but data is missing, verify the backend health endpoint:
          </p>
          <div className="mt-4 flex items-center gap-2 text-on-surface">
            <ClipboardCopy className="w-4 h-4 text-on-surface-variant" />
            <span className="font-mono text-xs">{apiOrigin}/health</span>
          </div>
        </div>
      </div>
    </div>
  );
}
