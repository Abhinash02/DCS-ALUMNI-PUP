import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminSidebar from '../components/admin/AdminSidebar';
import AdminPending from '../components/admin/AdminPending';
import AdminApproved from '../components/admin/AdminApproved';
import AdminDenied from '../components/admin/AdminDenied';
import AdminFaculty from '../components/admin/AdminFaculty';
import AdminEvents from '../components/admin/AdminEvents';
import AdminNotifications from '../components/admin/AdminNotifications';
import AdminBulkEmail from '../components/admin/AdminBulkEmail';

export default function Admindashboard() {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState('pending');

  useEffect(() => {
    const token = localStorage.getItem('token');

    if (!token) {
      navigate('/Login');
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/Login');
  };

  const renderActiveSection = () => {
    switch (activeSection) {
      case 'pending':
        return <AdminPending />;
      case 'approved':
        return <AdminApproved />;
      case 'denied':
        return <AdminDenied />;
      case 'faculty':
        return <AdminFaculty />;
      case 'events':
        return <AdminEvents />;
      case 'notification':
        return <AdminNotifications />;
      case 'bulkEmail':
        return <AdminBulkEmail />;
      default:
        return <AdminPending />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 flex flex-col md:flex-row pt-20 lg:pt-24">
      <AdminSidebar
        activeSection={activeSection}
        setActiveSection={setActiveSection}
        handleLogout={handleLogout}
      />

      <div className="flex-1 p-4 md:p-8 overflow-auto animate__animated animate__fadeIn">
        <header className="bg-gradient-to-r from-gray-800 to-gray-700 rounded-xl shadow-lg py-4 mb-6 text-center animate__animated animate__bounceIn border border-gray-600">
          <h1 className="text-2xl md:text-3xl font-bold text-kajal font-poppins px-4">
            Welcome Admin DCS Punjabi University, Patiala
          </h1>
        </header>

        {renderActiveSection()}
      </div>
    </div>
  );
}