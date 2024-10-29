import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
// import { config } from "../src/config"; 
import Navbar from "./components/Navbar";
import Home from './components/Home';
import PropertyListings from './components/PropertyListings';
import Transactions from './components/Transactions';
import OwnershipHistory from './components/OwnershipHistory';
import Maps from './components/Maps';
// import ExploreProperties from './components/Explore';
import AdminDashboard from './components/Admindashboard';
// import SellerDashboard from './components/Sellerdashboard';
// import UserDashboard from './components/Userdashboard';
// import Notifications from './components/Notification';
// import NotAuthorized from './components/Unauthorized';
// import DashboardOverview from './components/Dashboard';
// import AddProperty from './components/AddProperty'; 
// import FAQ from './components/Faq';

import '@rainbow-me/rainbowkit/styles.css';
import {
  getDefaultConfig,
  RainbowKitProvider,
} from '@rainbow-me/rainbowkit';
import { WagmiProvider } from 'wagmi';
import {
  liskSepolia,
  polygon,
  optimism,
  arbitrum,
  base,
} from 'wagmi/chains';
import {
  QueryClientProvider,
  QueryClient,
} from "@tanstack/react-query";

const config = getDefaultConfig({
    appName: 'My RainbowKit App',
    projectId: import.meta.env.VITE_APPKIT_PROJECT_ID,
    chains: [liskSepolia, polygon, optimism, arbitrum, base],
    ssr: true, 
  });

const queryClient = new QueryClient();
  

function App() {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider>
      <Router>
        <Navbar>
          <Routes>
            
            <Route path="/" element={<Home />} />
               <Route path="/properties" element={<PropertyListings />} /> 
            <Route path="/transactions" element={<Transactions />} />
            <Route path="/ownership-history" element={<OwnershipHistory />} /> 
              <Route path="/maps" element={<Maps />} /> 
             <Route path='/admin-dashboard' element={<AdminDashboard />} />
            {/* <Route path='/seller-dashboard' element={<SellerDashboard />} />
            <Route path='/user-dashboard' element={<UserDashboard />} />
            <Route path="/notifications" element={<Notifications />} />
            <Route path="/dashboard" element={<DashboardOverview />} />
            <Route path="/property" element={<AddProperty />} />
            <Route path="/faq" element={<FAQ />} />
            <Route path="/explore" element={<ExploreProperties />} />  */} 
          </Routes>
        </Navbar>
      </Router> 
      </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>  
  );
}

export default App;
