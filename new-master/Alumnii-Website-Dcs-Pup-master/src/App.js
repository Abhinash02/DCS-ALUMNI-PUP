import './App.css';
import { Navbar } from './components/Navbar';
import { Routes, Route } from 'react-router-dom';
import { Home } from './pages/Home';
import { Footer } from './components/Footer';
import Alumni from './pages/Alumni';
import Events from './pages/Events';
import Login from './pages/Login';
import Faculty from './pages/Faculty';
import { ReachUs } from './pages/ReachUs';
import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css";
import Register from './pages/Register';
import AdminDashboard from './pages/Admindashboard';

function App() {
  return (
    <div className='overflow-hidden font-poppins' >
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
        </Routes>
      </div>
      <Footer/>
    </div>
  );
}

export default App;

