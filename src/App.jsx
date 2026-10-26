// src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { WalletProvider } from './context/WalletContext.jsx';
import { EscrowProvider } from './context/EscrowContext.jsx';
import Navbar from './components/Navbar.jsx';
import Footer from './components/Footer.jsx';
import Home from './pages/Home.jsx';
import Marketplace from './pages/Marketplace.jsx';
import JobDetails from './pages/JobDetails.jsx';
import CreateJob from './pages/CreateJob.jsx';
import EscrowFunding from './pages/EscrowFunding.jsx';
import JobProgress from './pages/JobProgress.jsx';
import ClientReview from './pages/ClientReview.jsx';
import TransactionSuccess from './pages/TransactionSuccess.jsx';
import NotFound from './pages/NotFound.jsx';

function App() {
  return (
    <WalletProvider>
      <EscrowProvider>
        <Router>
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/marketplace" element={<Marketplace />} />
            <Route path="/jobs/:id" element={<JobDetails />} />
            <Route path="/create-job" element={<CreateJob />} />
            <Route path="/escrow/:id/fund" element={<EscrowFunding />} />
            <Route path="/jobs/:id/progress" element={<JobProgress />} />
            <Route path="/jobs/:id/review" element={<ClientReview />} />
            <Route path="/transaction-success" element={<TransactionSuccess />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
          <Footer />
        </Router>
      </EscrowProvider>
    </WalletProvider>
  );
}

export default App;
