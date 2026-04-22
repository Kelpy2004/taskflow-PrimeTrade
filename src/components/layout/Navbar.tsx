import { useMemo, useState } from 'react';
import { Search, Bell, Command, ChevronRight, Terminal, SquareTerminal } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';

const breadcrumbLabels: Record<string, string> = {
  tasks: 'Tasks',
  projects: 'Delivery Notes',
  users: 'Users',
  'audit-logs': 'Audit Logs',
  settings: 'Settings',
  support: 'Reviewer Hub',
  unauthorized: 'Unauthorized',
};

export default function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const [showNotifications, setShowNotifications] = useState(false);
  
  const getBreadcrumbs = () => {
    const path = location.pathname.split('/').filter(Boolean);
    if (path.length === 0) return [{ label: 'Dashboard', path: '/' }];
    return path.map((segment, index) => ({
      label: breadcrumbLabels[segment] ?? segment.charAt(0).toUpperCase() + segment.slice(1),
      path: '/' + path.slice(0, index + 1).join('/')
    }));
  };

  const breadcrumbs = getBreadcrumbs();
  const notifications = useMemo(
    () => [
      { title: 'Reviewer Hub', detail: 'Open Swagger, Postman, and health links', action: () => navigate('/support') },
      { title: 'Delivery Notes', detail: 'Review roadmap and scalability notes', action: () => navigate('/projects') },
      { title: 'Session Settings', detail: 'Check current auth session details', action: () => navigate('/settings') },
    ],
    [navigate],
  );

  return (
    <header className="fixed top-0 left-0 md:left-64 right-0 z-30 bg-background/60 backdrop-blur-xl border-b border-primary/10 px-6 h-16 flex items-center justify-between">
      <div className="flex items-center gap-4">
        {/* Breadcrumbs for Web */}
        <div className="hidden md:flex items-center gap-2">
          {breadcrumbs.map((crumb, index) => (
            <div key={crumb.path} className="flex items-center gap-2">
              <span className={index === breadcrumbs.length - 1 ? "text-on-surface font-medium text-sm" : "text-on-surface-variant text-sm"}>
                {crumb.label}
              </span>
              {index < breadcrumbs.length - 1 && (
                <ChevronRight className="w-4 h-4 text-outline" />
              )}
            </div>
          ))}
        </div>
        
        {/* Mobile Brand */}
        <div className="md:hidden font-bold text-primary tracking-tight text-xl">TaskForge</div>
      </div>

      <div className="flex items-center gap-4 flex-1 max-w-xl mx-4">
        <div className="hidden sm:flex items-center glass-panel rounded-full px-4 py-1.5 w-full focus-within:ring-1 focus-within:ring-primary/30 transition-all">
          <Search className="w-4 h-4 text-on-surface-variant mr-2" />
          <input 
            type="text" 
            placeholder="Search resources..." 
            className="bg-transparent border-none outline-none text-sm text-on-surface w-full placeholder:text-on-surface-variant/50 focus:ring-0 p-0"
          />
          <div className="flex items-center gap-1 ml-2 opacity-50">
            <kbd className="px-1.5 py-0.5 rounded bg-surface-variant border border-outline-variant text-[10px] text-on-surface-variant flex items-center">
              <Command className="w-2 h-2 mr-1" /> K
            </kbd>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <button
          type="button"
          title="Reviewer Hub"
          aria-label="Open reviewer hub"
          onClick={() => navigate('/support')}
          className="hidden sm:flex w-10 h-10 items-center justify-center rounded-full text-on-surface-variant hover:bg-primary/10 hover:text-primary transition-all"
        >
          <SquareTerminal className="w-5 h-5" />
        </button>
        <button
          type="button"
          title="Delivery Notes"
          aria-label="Open delivery notes"
          onClick={() => navigate('/projects')}
          className="hidden sm:flex w-10 h-10 items-center justify-center rounded-full text-on-surface-variant hover:bg-primary/10 hover:text-primary transition-all"
        >
          <Terminal className="w-5 h-5" />
        </button>
        <div className="relative">
          <button
            type="button"
            title="Quick Alerts"
            aria-label="Open quick alerts"
            onClick={() => setShowNotifications((current) => !current)}
            className="w-10 h-10 relative flex items-center justify-center rounded-full text-on-surface-variant hover:bg-primary/10 hover:text-primary transition-all"
          >
            <Bell className="w-5 h-5" />
            <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-primary rounded-full shadow-[0_0_8px_rgba(125,211,252,0.8)]"></span>
          </button>
          {showNotifications && (
            <div className="absolute right-0 mt-3 w-72 glass-panel rounded-xl p-3 shadow-2xl border border-primary/10">
              <div className="text-xs font-semibold uppercase tracking-wider text-on-surface-variant px-2 py-1">
                Quick Alerts
              </div>
              <div className="space-y-1">
                {notifications.map((item) => (
                  <button
                    key={item.title}
                    type="button"
                    onClick={() => {
                      setShowNotifications(false);
                      item.action();
                    }}
                    className="w-full text-left rounded-lg px-3 py-2 hover:bg-white/5 transition-colors"
                  >
                    <div className="text-sm font-medium text-on-surface">{item.title}</div>
                    <div className="text-xs text-on-surface-variant mt-0.5">{item.detail}</div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
        
        <button
          type="button"
          title="Session Settings"
          aria-label="Open session settings"
          onClick={() => navigate('/settings')}
          className="ml-2 w-8 h-8 rounded-full bg-gradient-to-tr from-primary to-tertiary p-[1px] cursor-pointer"
        >
          <img 
            className="w-full h-full rounded-full object-cover border-2 border-background"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuCr1ld8KlWdQP9MPljbmU8Y0BF1PWi-sD3Yun2DyZqDkV3LwoxB2yISv9_IlxMk_TnexUVPX_z_TRsJYYcem5fsUEhx32uKjlSyj_LixFdPkHBWoD-akbr-QWxGizCOsIMxZLrn2Qs_RhvmWM-D_ll2tXlmHg8Es5vskf2mqKNWhuymiVOQmHLjF2vVmvF02ECfX8AUod_OOl9J4vN7vD_QwOndOgK67KFBzR9ogSs7ctURC9n83dWMPP-x0oPbnmHEzse90mcIlME"
            alt="User profile"
          />
        </button>
      </div>
    </header>
  );
}
