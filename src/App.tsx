import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import BdmRoutes from './departments/bdm/BdmRoutes';

function App() {
  return (
    <Routes>
      <Route path="/bdm/*" element={<BdmRoutes />} />
      <Route path="*" element={<Navigate to="/bdm/dashboard" replace />} />
    </Routes>
  );
}

export default App;
