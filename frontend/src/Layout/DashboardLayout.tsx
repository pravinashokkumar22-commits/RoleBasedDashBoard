import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Navbar } from './Navbar';

export function DashboardLayout() {
  return (
    <div className="layout">
      <Sidebar />
      <div className="main-content">
        <Navbar />
        <main className="page-body fade-in">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
