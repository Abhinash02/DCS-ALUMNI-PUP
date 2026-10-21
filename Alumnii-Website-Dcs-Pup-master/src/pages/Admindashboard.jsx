import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminSidebar from '../components/admin/AdminSidebar';
import AdminOverviewDashboard from '../components/AdminOverviewDashboard';
import AdminAppearance from '../components/admin/AdminAppearance';
import AdminPending from '../components/admin/AdminPending';
import AdminApproved from '../components/admin/AdminApproved';
import AdminDenied from '../components/admin/AdminDenied';
import AdminFaculty from '../components/admin/AdminFaculty';
import AdminEvents from '../components/admin/AdminEvents';
import AdminNotifications from '../components/admin/AdminNotifications';
import AdminBulkEmail from '../components/admin/AdminBulkEmail';

export default function Admindashboard() {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState('overview');

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
      case 'overview':
        return <AdminOverviewDashboard />;
      case 'appearance':
        return <AdminAppearance />;
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
        return <AdminOverviewDashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-900 text-slate-800 dark:text-gray-100 flex flex-col md:flex-row pt-20 lg:pt-24 transition-colors duration-200">
      <AdminSidebar
        activeSection={activeSection}
        setActiveSection={setActiveSection}
        handleLogout={handleLogout}
      />

      <div className="flex-1 p-4 md:p-8 overflow-auto animate__animated animate__fadeIn">
        <header className="bg-white dark:bg-slate-800 rounded-2xl shadow-md py-4 md:py-5 mb-6 text-center border border-slate-200 dark:border-slate-700 animate__animated animate__fadeInDown transition-colors duration-200">
          <h1 className="text-xl md:text-3xl font-extrabold text-blue-900 dark:text-amber-300 font-poppins px-4 tracking-tight drop-shadow-sm">
            Welcome Admin DCS Punjabi University, Patiala
          </h1>
        </header>

        {renderActiveSection()}
      </div>
    </div>
  );
}