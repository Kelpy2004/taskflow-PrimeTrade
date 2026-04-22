import { useEffect, useMemo, useState } from 'react';
import { MoreVertical, Search, Filter, UserPlus, Download, ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/src/lib/utils';
import { api } from '@/src/lib/api';
import { downloadCsv } from '@/src/lib/download';

type UiUser = {
  name: string;
  email: string;
  role: 'Admin' | 'User';
  status: 'Active' | 'Away' | 'Offline';
  avatar: string;
  joined: string;
};

function formatJoined(date: string) {
  try {
    return new Date(date).toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' });
  } catch {
    return 'Unknown';
  }
}

const avatarFallback =
  'https://lh3.googleusercontent.com/aida-public/AB6AXuCr1ld8KlWdQP9MPljbmU8Y0BF1PWi-sD3Yun2DyZqDkV3LwoxB2yISv9_IlxMk_TnexUVPX_z_TRsJYYcem5fsUEhx32uKjlSyj_LixFdPkHBWoD-akbr-QWxGizCOsIMxZLrn2Qs_RhvmWM-D_ll2tXlmHg8Es5vskf2mqKNWhuymiVOQmHLjF2vVmvF02ECfX8AUod_OOl9J4vN7vD_QwOndOgK67KFBzR9ogSs7ctURC9n83dWMPP-x0oPbnmHEzse90mcIlME';

export default function TeamPage() {
  const [users, setUsers] = useState<UiUser[]>([]);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState<'all' | 'admin' | 'user'>('all');
  const [page, setPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 5;

  useEffect(() => {
    const handle = setTimeout(() => {
      api
        .getAdminUsers({
          search,
          role: roleFilter === 'all' ? '' : roleFilter,
          page,
          limit,
        })
        .then((res) => {
          setTotalItems(res.totalItems);
          setTotalPages(res.totalPages);
          setUsers(
            res.items.map((u) => ({
              name: u.name,
              email: u.email,
              role: u.role === 'admin' ? 'Admin' : 'User',
              status: 'Active',
              avatar: avatarFallback,
              joined: formatJoined(u.createdAt),
            })),
          );
        })
        .catch(() => {
          setUsers([]);
          setTotalItems(0);
          setTotalPages(1);
        });
    }, 250);

    return () => clearTimeout(handle);
  }, [page, roleFilter, search]);

  const showing = useMemo(() => {
    const start = totalItems === 0 ? 0 : (page - 1) * limit + 1;
    const end = Math.min(page * limit, totalItems);
    return { start, end };
  }, [page, totalItems]);

  const pageButtons = useMemo(() => {
    const maxButtons = Math.min(3, totalPages);
    return Array.from({ length: maxButtons }, (_, idx) => idx + 1);
  }, [totalPages]);

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold text-on-surface tracking-tight">Users</h2>
          <p className="text-on-surface-variant text-sm mt-1">Review registered accounts, assigned roles, and access across the workspace.</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() =>
              downloadCsv(
                'users-export.csv',
                ['Name', 'Email', 'Role', 'Status', 'Joined'],
                users.map((user) => [user.name, user.email, user.role, user.status, user.joined]),
              )
            }
            className="glass-button-secondary px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2"
          >
            <Download className="w-4 h-4" />
            Export
          </button>
          <button className="glass-button-primary px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2">
            <UserPlus className="w-4 h-4" />
            Add User
          </button>
        </div>
      </div>

      <div className="glass-panel rounded-xl p-4 flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant w-4 h-4" />
          <input 
            type="text"
            value={search}
            onChange={(e) => {
              setPage(1);
              setSearch(e.target.value);
            }}
            className="glass-input w-full pl-10 pr-4 py-2 text-sm" 
            placeholder="Search users..." 
          />
        </div>
        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="flex items-center gap-1 bg-surface-container/50 border border-primary/10 rounded-lg p-1">
            <button
              onClick={() => {
                setPage(1);
                setRoleFilter('all');
              }}
              className={cn(
                "px-3 py-1.5 rounded-md text-sm font-medium",
                roleFilter === 'all'
                  ? "bg-primary/10 text-primary"
                  : "text-on-surface-variant hover:text-on-surface transition-colors"
              )}
            >
              All Users
            </button>
            <button
              onClick={() => {
                setPage(1);
                setRoleFilter('admin');
              }}
              className={cn(
                "px-3 py-1.5 rounded-md text-sm font-medium transition-colors",
                roleFilter === 'admin'
                  ? "bg-primary/10 text-primary"
                  : "text-on-surface-variant hover:text-on-surface"
              )}
            >
              Admins
            </button>
            <button
              onClick={() => {
                setPage(1);
                setRoleFilter('user');
              }}
              className={cn(
                "px-3 py-1.5 rounded-md text-sm font-medium transition-colors",
                roleFilter === 'user'
                  ? "bg-primary/10 text-primary"
                  : "text-on-surface-variant hover:text-on-surface"
              )}
            >
              Users
            </button>
          </div>
          <button className="glass-button-secondary p-2 rounded-lg">
            <Filter className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="glass-elevated rounded-xl overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-primary/10 bg-surface-container/30">
                <th className="px-6 py-4 text-xs font-semibold text-on-surface-variant uppercase tracking-wider">User</th>
                <th className="px-6 py-4 text-xs font-semibold text-on-surface-variant uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-xs font-semibold text-on-surface-variant uppercase tracking-wider">Role</th>
                <th className="px-6 py-4 text-xs font-semibold text-on-surface-variant uppercase tracking-wider">Joined Date</th>
                <th className="px-6 py-4 text-xs font-semibold text-on-surface-variant uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-primary/5">
              {users.map((user) => (
                <tr key={user.email} className="hover:bg-white/[0.02] transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <img alt={user.name} className="w-10 h-10 rounded-full border border-primary/20 object-cover" src={user.avatar} />
                        <div className={cn(
                          "absolute bottom-0 right-0 w-2.5 h-2.5 border-2 border-surface rounded-full",
                          user.status === 'Active' ? "bg-emerald-500" : user.status === 'Away' ? "bg-amber-500" : "bg-slate-500"
                        )} />
                      </div>
                      <div>
                        <div className="font-medium text-on-surface">{user.name}</div>
                        <div className="text-on-surface-variant text-xs mt-0.5">{user.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={cn(
                      "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border",
                      user.status === 'Active' ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" :
                      user.status === 'Away' ? "bg-amber-500/10 text-amber-400 border-amber-500/20" :
                      "bg-slate-500/10 text-slate-400 border-slate-500/20"
                    )}>
                      <span className={cn("w-1.5 h-1.5 rounded-full",
                         user.status === 'Active' ? "bg-emerald-500" : user.status === 'Away' ? "bg-amber-500" : "bg-slate-500"
                      )} />
                      {user.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={cn(
                      "text-sm font-medium",
                      user.role === 'Admin' ? "text-tertiary" : "text-on-surface"
                    )}>{user.role}</span>
                  </td>
                  <td className="px-6 py-4 text-sm text-on-surface-variant">
                    {user.joined}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="text-on-surface-variant hover:text-primary transition-colors p-1 group-hover:bg-white/5 rounded">
                      <MoreVertical className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
              {users.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-10 text-center text-on-surface-variant text-sm">
                    No users matched the current filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        
        <div className="px-6 py-4 border-t border-primary/10 bg-surface-container/20 flex items-center justify-between">
          <div className="text-sm text-on-surface-variant">
            Showing <span className="font-medium text-on-surface">{showing.start}</span> to <span className="font-medium text-on-surface">{showing.end}</span> of <span className="font-medium text-on-surface">{totalItems}</span> users
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              className="glass-button-secondary w-8 h-8 rounded flex items-center justify-center disabled:opacity-50"
              disabled={page <= 1}
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <div className="flex gap-1">
              {pageButtons.map((p) => (
                <button
                  key={p}
                  onClick={() => setPage(p)}
                  className={cn(
                    "w-8 h-8 rounded flex items-center justify-center font-medium text-sm transition-colors",
                    p === page
                      ? "bg-primary/20 text-primary border border-primary/30"
                      : "text-on-surface-variant hover:bg-white/5 hover:text-on-surface"
                  )}
                >
                  {p}
                </button>
              ))}
            </div>
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              className="glass-button-secondary w-8 h-8 rounded flex items-center justify-center"
              disabled={page >= totalPages}
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
