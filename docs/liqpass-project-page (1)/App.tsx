import React from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import ProjectDetailPage from './ProjectDetailPage';

const App: React.FC = () => {
  return (
    <HashRouter>
      <Routes>
        <Route path="/project/:id" element={<ProjectDetailPage />} />
        <Route path="/" element={<Navigate to="/project/liqpass" replace />} />
      </Routes>
    </HashRouter>
  );
};

export default App;