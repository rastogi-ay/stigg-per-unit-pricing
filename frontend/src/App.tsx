import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { StiggProvider } from '@stigg/react-sdk';
import AppNav from './components/AppNav';
import Templates from './components/Templates';
import Campaigns from './components/Campaigns';
import Analytics from './components/Analytics';

function App() {
  return (
    <StiggProvider apiKey={import.meta.env.VITE_STIGG_CLIENT_API_KEY} customerId={import.meta.env.VITE_STIGG_CUSTOMER_ID}>
      <BrowserRouter>
        <AppNav />
        <Routes>
          <Route path="/" element={<Templates />} />
          <Route path="/campaigns" element={<Campaigns />} />
          <Route path="/analytics" element={<Analytics />} />
        </Routes>
      </BrowserRouter>
    </StiggProvider>
  );
}
export default App;
