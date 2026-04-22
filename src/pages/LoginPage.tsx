import { useState, type FormEvent } from 'react';
import { motion } from 'motion/react';
import { Cloud, Mail, Lock, ArrowRight, Github, Chrome } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/src/context/AuthContext';
import { ApiError } from '@/src/lib/api';

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleEmailChange = (value: string) => {
    if (error) {
      setError('');
    }
    setEmail(value);
  };

  const handlePasswordChange = (value: string) => {
    if (error) {
      setError('');
    }
    setPassword(value);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await login({ email, password });
      const from = (location.state as { from?: { pathname?: string } } | null)?.from?.pathname;
      navigate(from || (response.user.role === 'admin' ? '/' : '/tasks'), { replace: true });
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Unable to login right now.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-elevated w-full max-w-md rounded-2xl overflow-hidden shadow-2xl relative"
      >
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary via-tertiary to-primary opacity-50" />
        
        <div className="p-8 md:p-10 flex flex-col items-center">
          <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center text-primary mb-6 shadow-[0_0_20px_rgba(125,211,252,0.15)] border border-primary/20">
            <Cloud className="w-8 h-8 fill-current" />
          </div>
          
          <h1 className="text-2xl font-bold text-on-surface tracking-tight text-center">Welcome Back</h1>
          <p className="text-on-surface-variant text-sm mt-2 text-center">Secure access to your enterprise dashboard</p>
          
          <form className="w-full mt-8 space-y-4" onSubmit={handleSubmit}>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-on-surface-variant uppercase tracking-wider ml-1">Email System</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-on-surface-variant group-focus-within:text-primary transition-colors">
                  <Mail className="w-4 h-4" />
                </div>
                <input 
                  value={email}
                  onChange={(e) => handleEmailChange(e.target.value)}
                  type="email" 
                  placeholder="name@company.com" 
                  className="glass-input w-full pl-10 pr-4 py-3 text-sm" 
                  required
                />
              </div>
            </div>
            
            <div className="space-y-1.5">
              <div className="flex items-center justify-between ml-1">
                <label className="text-xs font-semibold text-on-surface-variant uppercase tracking-wider">Access Token</label>
                <a href="#" className="text-xs text-primary hover:underline font-medium">Reset Key</a>
              </div>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-on-surface-variant group-focus-within:text-primary transition-colors">
                  <Lock className="w-4 h-4" />
                </div>
                <input 
                  value={password}
                  onChange={(e) => handlePasswordChange(e.target.value)}
                  type="password" 
                  placeholder="••••••••••••" 
                  className="glass-input w-full pl-10 pr-4 py-3 text-sm" 
                  required
                />
              </div>
            </div>

            {error && <p className="text-sm text-error">{error}</p>}
            {!error && (
              <p className="text-xs text-on-surface-variant">
                Demo access: <span className="text-on-surface">admin@taskforge.local</span> or <span className="text-on-surface">user@taskforge.local</span>
              </p>
            )}
            
            <button
              disabled={loading}
              className="w-full bg-primary/20 hover:bg-primary/30 border border-primary/30 text-primary py-3 rounded-xl font-bold text-sm tracking-wide transition-all hover:shadow-[0_0_20px_rgba(125,211,252,0.2)] active:scale-[0.98] flex items-center justify-center gap-2 mt-6 disabled:opacity-60"
            >
              {loading ? 'Establishing...' : 'Establish Connection'}
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
          
          <div className="w-full flex items-center gap-4 my-8">
            <div className="h-[1px] flex-1 bg-white/5" />
            <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-[0.2em]">Oauth Providers</span>
            <div className="h-[1px] flex-1 bg-white/5" />
          </div>
          
          <div className="grid grid-cols-2 gap-4 w-full">
            <button
              type="button"
              className="glass-panel hover:bg-white/5 py-2.5 rounded-xl flex items-center justify-center gap-2 transition-all border border-white/5 active:scale-95"
            >
              <Github className="w-4 h-4" />
              <span className="text-xs font-medium">GitHub</span>
            </button>
            <button
              type="button"
              className="glass-panel hover:bg-white/5 py-2.5 rounded-xl flex items-center justify-center gap-2 transition-all border border-white/5 active:scale-95"
            >
              <Chrome className="w-4 h-4" />
              <span className="text-xs font-medium">Google</span>
            </button>
          </div>
          
          <p className="mt-8 text-xs text-on-surface-variant">
            Don't have an endpoint? <Link to="/register" className="text-primary font-bold hover:underline">Request Access</Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
