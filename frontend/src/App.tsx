import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { StiggProvider } from '@stigg/react-sdk';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import AppNav from './components/AppNav';
import Templates from './components/Templates';
import Analytics from './components/Analytics';

function App() {
  return (
    // initialize the StiggProvider with the client API key and customer ID
    <StiggProvider apiKey={import.meta.env.VITE_STIGG_CLIENT_API_KEY} customerId={import.meta.env.VITE_STIGG_CUSTOMER_ID}>
      <BrowserRouter>
        <ToastContainer position="top-right" theme="dark" />
        <AppNav />
        <Routes>
          <Route path="/" element={<Templates />} />
          <Route path="/analytics" element={<Analytics />} />
        </Routes>
      </BrowserRouter>
    </StiggProvider>
  );
}
export default App;
