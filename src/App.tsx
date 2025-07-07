import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import DashboardLayout from './layouts/DashboardLayout';
import BdmRoutes from './departments/bdm/BdmRoutes';

function App() {
  return (
      <DashboardLayout>
        <Routes>
          <Route path="/bdm/*" element={<BdmRoutes />} />
          {/* Add other department routes here */}
        </Routes>
      </DashboardLayout>
  );
}

export default App;
