import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
// import { config } from "../src/config"; 
import Navbar from "./components/Navbar";
import Home from './components/Home';
import PropertyListings from './components/PropertyListings';
import Transactions from './components/Transactions';
import OwnershipHistory from './components/OwnershipHistory';
import Maps from './components/Maps';
 import Properties from './components/Properties';
import AdminDashboard from './components/Admindashboard';
import SellerDashboard from './components/Sellerdashboard';
// import UserDashboard from './components/Userdashboard';
import Notifications from './components/Notification';

 import Overview from './components/Overview';
import AddProperty from './components/AddProperty'; 
import FAQ from './components/faq';
import { PropertyRefreshProvider } from './components/PropertyRefresh';

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
        <PropertyRefreshProvider>
      <Router>
        <Navbar>
          <Routes>
            
            <Route path="/" element={<Home />} />
               <Route path="/properties" element={<PropertyListings />} /> 
            <Route path="/transactions" element={<Transactions />} />
            <Route path="/ownership-history" element={<OwnershipHistory />} /> 
              <Route path="/maps" element={<Maps />} /> 
             <Route path='/admin-dashboard' element={<AdminDashboard />} />
              <Route path='/seller-dashboard' element={<SellerDashboard />} /> 
            {/* <Route path='/user-dashboard' element={<UserDashboard />} /> */}
            <Route path="/notifications" element={<Notifications />} />
            <Route path="/dashboard" element={<Overview />} /> 
            <Route path="/property" element={<AddProperty />} /> 
            <Route path="/faq" element={<FAQ />} />
             <Route path="/properties" element={<Properties />} />   
          </Routes>
        </Navbar>
      </Router> 
      </PropertyRefreshProvider>
      </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>  
  );
}

export default App;
