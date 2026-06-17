
import './App.css';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { Navbar } from './components/Navbar';
import { Routes, Route, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import PageLoader from './components/PageLoader';
import { Home } from './pages/Home';
import { Footer } from './components/Footer';
import Alumni from './pages/Alumni';
import Events from './pages/Events';
import Login from './pages/Login';
import Faculty from './pages/Faculty';
import { ReachUs } from './pages/ReachUs';

import Register from './pages/Register';
import AdminDashboard from './pages/Admindashboard';
import UserLogin from './pages/UserLogin';
import Profile from './pages/Profile';

function App() {
  const [isPageLoading, setIsPageLoading] = useState(false);
  const location = useLocation();

  useEffect(() => {
    // Show the loader when the path changes
    setIsPageLoading(true);
    
    // Hide the loader after a short delay
    const timer = setTimeout(() => {
      setIsPageLoading(false);
    }, 600); // 600ms transition effect

    return () => clearTimeout(timer);
  }, [location.pathname]);

  return (
    <div className='relative overflow-hidden font-poppins' >
      {isPageLoading && <PageLoader />}
      <Navbar />
      <div className=' mx-auto z-0'>
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
        </Routes>
      </div>
      <Footer/>
    </div>
  );
}

export default App;