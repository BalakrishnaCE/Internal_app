import React from 'react';
import { Routes, Route, Navigate, Outlet } from 'react-router-dom';
import Dashboard from './dashboard/Dashboard';
import TasksList from './tasks/TasksList';
import ProspectDetails from './clientJourney/ProspectDetails/ProspectDetails';
import ExistingClientsList from './existingClients/ExistingClientsList';
import ClientDetails from './existingClients/ClientDetails';
import TaskDetails from './tasks/TaskDetails';
import Reports from './reports/Reports';
import ProspectsList from './prospects/ProspectsList';
import ClaimLeads from './ClaimLeads/claimLead';

const BdmRoutes: React.FC = () => (
  <Routes>
    <Route path="/" element={<Outlet />}> 
      <Route path="dashboard" element={<Dashboard />} />
      <Route path="claim-leads" element={<ClaimLeads />} />
      <Route path="tasks" element={<TasksList />} />
      <Route path="tasks/:id" element={<TaskDetails />} />
      <Route path="prospects/:prospectId" element={<ProspectDetails />} />
      <Route path="prospects" element={<ProspectsList />} />
      <Route path="clients" element={<ExistingClientsList />} />
      <Route path="clients/:clientId" element={<ClientDetails />} />
      <Route path="reports" element={<Reports />} />
      <Route path="*" element={<Navigate to="dashboard" replace />} />
    </Route>
  </Routes>
);

export default BdmRoutes;

