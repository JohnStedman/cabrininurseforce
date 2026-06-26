import { createBrowserRouter, Navigate } from 'react-router';
import { RootLayout } from './components/RootLayout';
import Dashboard from './pages/Dashboard';
import StaffDeployment from './pages/StaffDeployment';
import ShiftAllocation from './pages/ShiftAllocation';
import SmartMatch from './pages/SmartMatch';
import StaffManagement from './pages/StaffManagement';
import Providers from './pages/Providers';
import AgencyDashboard from './pages/AgencyDashboard';
import Timesheets from './pages/Timesheets';
import Compliance from './pages/Compliance';
import Costing from './pages/Costing';
import Reports from './pages/Reports';
import Communications from './pages/Communications';
import AuditLog from './pages/AuditLog';
import Admin from './pages/Admin';
import Login from './pages/Login';
import UserManual from './pages/UserManual';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    children: [
      { index: true, element: <Dashboard /> },
      { path: 'deployment', element: <StaffDeployment /> },
      { path: 'shifts', element: <ShiftAllocation /> },
      { path: 'smart-match', element: <SmartMatch /> },
      { path: 'staff', element: <StaffManagement /> },
      { path: 'providers', element: <Providers /> },
      { path: 'agency-dashboard', element: <AgencyDashboard /> },
      { path: 'timesheets', element: <Timesheets /> },
      { path: 'compliance', element: <Compliance /> },
      { path: 'costing', element: <Costing /> },
      { path: 'reports', element: <Reports /> },
      { path: 'communications', element: <Communications /> },
      { path: 'audit-log', element: <AuditLog /> },
      { path: 'admin', element: <Admin /> },
      { path: 'user-manual', element: <UserManual /> },
    ],
  },
  { path: '/login', element: <Login /> },
  { path: '*', element: <Navigate to="/" replace /> },
]);
