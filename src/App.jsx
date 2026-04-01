import { Navigate, Route, Routes } from 'react-router-dom';
import Layout from './components/Layout';
import ClientsPage from './pages/ClientsPage';
import DashboardPage from './pages/DashboardPage';
import EventsPage from './pages/EventsPage';
import FinancesPage from './pages/FinancesPage';
import TeamPage from './pages/TeamPage';
import VendorsPage from './pages/VendorsPage';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Navigate to="/dashboard" replace />} />
        <Route path="dashboard" element={<DashboardPage />} />
        <Route path="events" element={<EventsPage />} />
        <Route path="team" element={<TeamPage />} />
        <Route path="clients" element={<ClientsPage />} />
        <Route path="vendors" element={<VendorsPage />} />
        <Route path="finances" element={<FinancesPage />} />
      </Route>
    </Routes>
  );
}

export default App;
