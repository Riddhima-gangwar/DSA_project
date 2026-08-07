import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import LandingPage from './pages/LandingPage';
import DashboardLayout from './layouts/DashboardLayout';
import Dashboard from './pages/Dashboard';
import ResourceManagement from './pages/ResourceManagement';
import ReliefCenters from './pages/ReliefCenters';
import DisasterRequests from './pages/DisasterRequests';
import ResourceAllocation from './pages/ResourceAllocation';
import Reports from './pages/Reports';
import DSALab from './pages/DSALab';
import SortingVisualizer from './pages/SortingVisualizer';
import AlgorithmLab from './pages/AlgorithmLab';
import SearchVisualizer from './pages/SearchVisualizer';
import PerformanceGraph from './pages/PerformanceGraph';
import SearchAnalytics from './pages/SearchAnalytics';
import LearnAlgorithms from './pages/LearnAlgorithms';

function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/dashboard" element={<DashboardLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="inventory" element={<ResourceManagement />} />
            <Route path="centers" element={<ReliefCenters />} />
            <Route path="requests" element={<DisasterRequests />} />
            <Route path="allocation" element={<ResourceAllocation />} />
            <Route path="reports" element={<Reports />} />
            <Route path="dsa-lab" element={<DSALab />}>
              {/* Nested DSA Lab Routes */}
              <Route path="sorting" element={<SortingVisualizer />} />
              <Route path="searching" element={<SearchVisualizer />} />
              <Route path="algorithms" element={<AlgorithmLab />} />
              <Route path="performance" element={<PerformanceGraph />} />
              <Route path="search-analytics" element={<SearchAnalytics />} />
              <Route path="learn" element={<LearnAlgorithms />} />
            </Route>
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AppProvider>
  );
}

export default App;
