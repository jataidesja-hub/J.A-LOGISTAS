import { BrowserRouter, Routes, Route } from 'react-router-dom';
import StoreList from './pages/customer/StoreList';
import StoreDetails from './pages/customer/StoreDetails';
import OwnerDashboard from './pages/owner/OwnerDashboard';
import OwnerLogin from './pages/owner/OwnerLogin';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminLogin from './pages/admin/AdminLogin';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Customer Routes */}
        <Route path="/" element={<StoreList />} />
        <Route path="/loja/:storeId" element={<StoreDetails />} />
        
        {/* Owner Routes */}
        <Route path="/lojista/login" element={<OwnerLogin />} />
        <Route path="/lojista/dashboard" element={<OwnerDashboard />} />

        {/* Admin Routes */}
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/admin/login" element={<AdminLogin />} />
      </Routes>
    </BrowserRouter>
  );
}


export default App;
