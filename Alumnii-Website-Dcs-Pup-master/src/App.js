
import './App.css';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { Navbar } from './components/Navbar';
import { Routes, Route, useLocation } from 'react-router-dom';
import React, { useState, useEffect, Suspense } from 'react';
import PageLoader from './components/PageLoader';
import { Footer } from './components/Footer';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Lazy loaded components
const Home = React.lazy(() => import('./pages/Home').then(module => ({ default: module.Home })));
const Alumni = React.lazy(() => import('./pages/Alumni'));
const Events = React.lazy(() => import('./pages/Events'));
const Faculty = React.lazy(() => import('./pages/Faculty'));
const ReachUs = React.lazy(() => import('./pages/ReachUs').then(module => ({ default: module.ReachUs })));
const Register = React.lazy(() => import('./pages/Register'));
const AdminDashboard = React.lazy(() => import('./pages/Admindashboard'));
const Login = React.lazy(() => import('./pages/Login'));
const Profile = React.lazy(() => import('./pages/Profile'));
const UserLogin = React.lazy(() => import('./pages/UserLogin'));
const ForgotPassword = React.lazy(() => import('./pages/ForgotPassword'));
const ResetPassword = React.lazy(() => import('./pages/ResetPassword'));

function App() {
  const [isPageLoading, setIsPageLoading] = useState(false);
  const location = useLocation();

  useEffect(() => {
    setIsPageLoading(true);
    const timer = setTimeout(() => {
      setIsPageLoading(false);
    }, 600);
    return () => clearTimeout(timer);
  }, [location.pathname]);

  return (
    <div className='relative overflow-hidden font-poppins' >
      <ToastContainer position="top-right" autoClose={3000} />
      {isPageLoading && <PageLoader />}
      <Navbar />
      <div className=' mx-auto z-0'>
        <Suspense fallback={<PageLoader />}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path='/Alumni' element={<Alumni/>} />
            <Route path='/Events' element={<Events/>} />
            <Route path='/Faculty' element={<Faculty/>} />
            <Route path="/ReachUs" element={<ReachUs />} />
            <Route path="/Register" element={<Register/>} />
            <Route path="/Admindashboard" element={<AdminDashboard />} />
            <Route path="/Login" element={<Login/>} />
            <Route path="/Profile" element={<Profile/>} />
            <Route path="/UserLogin" element={<UserLogin/>} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password/:token" element={<ResetPassword />} />
          </Routes>
        </Suspense>
      </div>
      <Footer />
    </div>
  );
}

export default App;