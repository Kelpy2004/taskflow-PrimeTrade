import type { ReactNode } from 'react';
import { HashRouter, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import Sidebar from '@/src/components/layout/Sidebar';
import Navbar from '@/src/components/layout/Navbar';
import BackgroundDecor from '@/src/components/layout/BackgroundDecor';
import DashboardPage from '@/src/pages/DashboardPage';
import TeamPage from '@/src/pages/TeamPage';
import AnalyticsPage from '@/src/pages/AnalyticsPage';
import LoginPage from '@/src/pages/LoginPage';
import RegisterPage from '@/src/pages/RegisterPage';
import TasksPage from '@/src/pages/TasksPage';
import UnauthorizedPage from '@/src/pages/UnauthorizedPage';
import ProjectsPage from '@/src/pages/ProjectsPage';
import SettingsPage from '@/src/pages/SettingsPage';
import SupportPage from '@/src/pages/SupportPage';
import ProtectedRoute from '@/src/components/ProtectedRoute';
import PublicOnlyRoute from '@/src/components/PublicOnlyRoute';
import { useAuth } from '@/src/context/AuthContext';

function AdminOnly({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  if (user?.role !== 'admin') return <Navigate to="/unauthorized" replace />;
  return children;
}

function PageContent() {
  const location = useLocation();
  const isAuthPage = ['/login', '/register'].includes(location.pathname);

  if (isAuthPage) {
    return (
      <div className="min-h-screen bg-background relative flex items-center justify-center">
        <BackgroundDecor />
        <main className="relative z-20 w-full max-w-7xl mx-auto px-4">
          {location.pathname === '/login' ? <LoginPage /> : <RegisterPage />}
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background relative flex">
      <BackgroundDecor />
      <Sidebar />

      <div className="flex-1 flex flex-col relative z-20">
        <Navbar />

        <main className="flex-1 pt-24 px-6 md:px-8 pb-12 w-full max-w-7xl mx-auto overflow-y-auto custom-scrollbar">
          <Routes>
            <Route
              path="/"
              element={
                <AdminOnly>
                  <DashboardPage />
                </AdminOnly>
              }
            />
            <Route path="/tasks" element={<TasksPage />} />
            <Route path="/projects" element={<ProjectsPage />} />
            <Route path="/team" element={<Navigate to="/users" replace />} />
            <Route
              path="/users"
              element={
                <AdminOnly>
                  <TeamPage />
                </AdminOnly>
              }
            />
            <Route path="/analytics" element={<Navigate to="/audit-logs" replace />} />
            <Route
              path="/audit-logs"
              element={
                <AdminOnly>
                  <AnalyticsPage />
                </AdminOnly>
              }
            />
            <Route path="/settings" element={<SettingsPage />} />
            <Route path="/support" element={<SupportPage />} />
            <Route path="/unauthorized" element={<UnauthorizedPage />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <HashRouter>
      <Routes>
        <Route element={<PublicOnlyRoute />}>
          <Route path="/login" element={<PageContent />} />
          <Route path="/register" element={<PageContent />} />
        </Route>
        <Route element={<ProtectedRoute />}>
          <Route path="/*" element={<PageContent />} />
        </Route>
      </Routes>
    </HashRouter>
  );
}
