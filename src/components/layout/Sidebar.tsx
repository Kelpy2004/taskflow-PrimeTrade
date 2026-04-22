import { LayoutDashboard, CheckSquare, Users, ScrollText, Settings, Cloud, LogOut } from 'lucide-react';
import { NavLink, useNavigate } from 'react-router-dom';
import { cn } from '@/src/lib/utils';
import { useAuth } from '@/src/context/AuthContext';

const navItems = [
  { icon: LayoutDashboard, label: 'Dashboard', path: '/' },
  { icon: CheckSquare, label: 'Tasks', path: '/tasks' },
  { icon: Users, label: 'Users', path: '/users' },
  { icon: ScrollText, label: 'Audit Logs', path: '/audit-logs' },
];

export default function Sidebar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <aside className="hidden md:flex flex-col h-full sticky top-0 bg-background/75 backdrop-blur-2xl w-64 border-r border-primary/10 shadow-2xl z-40">
      <div className="p-6 flex items-center gap-3">
        <div className="w-10 h-10 rounded-lg glass-elevated flex items-center justify-center text-primary">
          <Cloud className="w-6 h-6 fill-current" />
        </div>
        <div>
          <h1 className="text-lg font-black text-primary tracking-tight">TaskForge</h1>
          <p className="text-xs text-on-surface-variant font-medium uppercase tracking-wider">Review Build</p>
        </div>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-1">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              cn(
                "flex items-center gap-3 px-4 py-3 transition-all rounded-lg group hover:bg-white/5",
                isActive
                  ? "bg-primary/10 text-primary border-r-4 border-primary"
                  : "text-on-surface-variant hover:text-on-surface"
              )
            }
          >
            <item.icon className={cn("w-5 h-5 transition-colors", "group-hover:text-primary")} />
            <span className="font-medium text-sm">{item.label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="p-3 mt-auto border-t border-primary/10 space-y-1">
        <NavLink
          to="/settings"
          className={({ isActive }) =>
            cn(
              "flex items-center gap-3 px-4 py-3 transition-all rounded-lg text-on-surface-variant hover:bg-white/5 hover:text-on-surface",
              isActive && "text-primary"
            )
          }
        >
          <Settings className="w-5 h-5" />
          <span className="font-medium text-sm">Settings</span>
        </NavLink>
        <div className="mt-4 pt-4 border-t border-primary/10 flex items-center gap-3 px-4 pb-2">
          <img
            alt="User profile"
            className="w-8 h-8 rounded-full border border-primary/30 object-cover"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuCfMJhztfv-cBmzqN0nxzuU88N1kjQs7s5YpmeIMdGtypGOmEDocvWqqvOVUD7iet2MZvphmSmu3CDNXzB-slHc4-k5SvVp4RtV8DVRUKFda_wxsfApy7FhRupaRiVJOzf5duN1LSD_icoDHYQb7wb9W8Bwclu7qutRYVjAZqwJ4Z2qYtZySQIJ1Axa8dpiFBiE7U4VHF69dF5zmy8Wj7TIGtaxlGDd9-BhVL6aHG-PqWndfhU4LeCaoVmcsFMQkleNofcNVTxbM60"
          />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-on-surface truncate">{user?.name || 'Workspace User'}</p>
            <p className="text-xs text-on-surface-variant truncate">{user?.email || 'No session'}</p>
          </div>
          <button
            onClick={handleLogout}
            className="text-on-surface-variant hover:text-error transition-colors"
            aria-label="Logout"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </aside>
  );
}
