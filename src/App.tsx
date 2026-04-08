import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import AIChat from './components/AIChat';
import HomePage from './pages/HomePage';
import ListPage from './pages/ListPage';
import PropertyDetailPage from './pages/PropertyDetailPage';
import AgentsPage from './pages/AgentsPage';
import SidebarAd from './components/SidebarAd';
import AdminPage from './pages/AdminPage';
import DebugPage from './pages/DebugPage';

function MainLayout() {
  return (
    <div className="min-h-screen bg-gray-50">
      <SidebarAd side="left" />
      <SidebarAd side="right" />
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/list" element={<ListPage />} />
        <Route path="/property/:id" element={<PropertyDetailPage />} />
        <Route path="/agents" element={<AgentsPage />} />
      </Routes>
      <AIChat />
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/admin" element={<AdminPage />} />
        <Route path="/debug" element={<DebugPage />} />
        <Route path="/*" element={<MainLayout />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
