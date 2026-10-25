import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home.jsx';
import Marketplace from './pages/Marketplace.jsx';
import CreateJob from './pages/CreateJob.jsx';
import BuyerDashboard from './pages/BuyerDashboard.jsx';
import FreelancerDashboard from './pages/FreelancerDashboard.jsx';
import NotFound from './pages/NotFound.jsx';
import Navbar from './components/Navbar.jsx';
import Footer from './components/Footer.jsx';
import { WalletProvider } from './context/WalletContext.jsx';

function App() {
  return (
    <WalletProvider>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/marketplace" element={<Marketplace />} />
          <Route path="/create-job" element={<CreateJob />} />
          <Route path="/buyer-dashboard" element={<BuyerDashboard />} />
          <Route path="/freelancer-dashboard" element={<FreelancerDashboard />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
        <Footer />
      </Router>
    </WalletProvider>
  );
}

export default App;
