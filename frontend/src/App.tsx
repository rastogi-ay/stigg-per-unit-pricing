import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { StiggProvider } from '@stigg/react-sdk';
import { SignIn, SignUp, useAuth, useUser } from '@clerk/react';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import AppNav from './components/AppNav';
import Templates from './components/Templates';
import Messages from './components/Messages';
import Analytics from './components/Analytics';

function ProtectedLayout() {
  const { isLoaded, isSignedIn } = useAuth();

  if (!isLoaded) {
    return <div className="app-loading">Loading…</div>;
  }
  if (!isSignedIn) {
    return <Navigate to="/sign-in" replace />;
  }
  return <Outlet />;
}

function StiggAndOutlet() {
  const { isLoaded, user } = useUser();

  if (!isLoaded) {
    return <div className="app-loading">Loading…</div>;
  }

  const customerId = user?.id ?? import.meta.env.VITE_STIGG_CUSTOMER_ID;
  if (!customerId) {
    return (
      <div className="app-loading">
        Set VITE_STIGG_CUSTOMER_ID or sign in so Stigg has a customer ID.
      </div>
    );
  }

  return (
    <StiggProvider
      apiKey={import.meta.env.VITE_STIGG_CLIENT_API_KEY}
      customerId={customerId}
    >
      <AppNav />
      <Outlet />
    </StiggProvider>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <ToastContainer position="top-right" theme="dark" />
      <Routes>
        <Route
          path="/sign-in/*"
          element={
            <div className="clerk-auth-shell">
              <SignIn routing="path" path="/sign-in" signUpUrl="/sign-up" />
            </div>
          }
        />
        <Route
          path="/sign-up/*"
          element={
            <div className="clerk-auth-shell">
              <SignUp routing="path" path="/sign-up" signInUrl="/sign-in" />
            </div>
          }
        />
        <Route element={<ProtectedLayout />}>
          <Route element={<StiggAndOutlet />}>
            <Route path="/" element={<Templates />} />
            <Route path="/messages" element={<Messages />} />
            <Route path="/analytics" element={<Analytics />} />
          </Route>
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
