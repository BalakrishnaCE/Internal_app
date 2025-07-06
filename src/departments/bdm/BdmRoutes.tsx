import React from 'react';
import { Routes, Route, Navigate, Outlet } from 'react-router-dom';
import Dashboard from './dashboard/Dashboard';
import TasksList from './tasks/TasksList';
import ProspectDetails from './prospects/ProspectDetails';

const BdmRoutes: React.FC = () => (
  <Routes>
    <Route path="/" element={<Outlet />}> 
      <Route path="dashboard" element={<Dashboard />} />
      <Route path="tasks" element={<TasksList />} />
      <Route path="prospects/:prospectId" element={<ProspectDetails />} />
      <Route path="*" element={<Navigate to="dashboard" replace />} />
    </Route>
  </Routes>
);

export default BdmRoutes;

