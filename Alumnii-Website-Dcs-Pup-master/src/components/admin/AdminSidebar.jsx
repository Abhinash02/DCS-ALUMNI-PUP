import React from 'react';
import { 
  ClipboardList, 
  CheckCircle, 
  XCircle, 
  GraduationCap, 
  CalendarDays, 
  Bell, 
  Mail, 
  LogOut 
} from 'lucide-react';

const AdminSidebar = ({ activeSection, setActiveSection, handleLogout }) => {
  const menuItems = [
    { id: 'pending', label: 'Pending Approvals', icon: ClipboardList },
    { id: 'approved', label: 'Approved Alumni', icon: CheckCircle },
    { id: 'denied', label: 'Denied Alumni', icon: XCircle },
    { id: 'faculty', label: 'Faculty', icon: GraduationCap },
    { id: 'events', label: 'Events', icon: CalendarDays },
    { id: 'notification', label: 'Notifications', icon: Bell },
    { id: 'bulkEmail', label: 'Send Bulk Email', icon: Mail },
  ];

  return (
    <div className="w-full md:w-72 bg-darkBlue p-3 md:p-6 flex flex-col md:justify-between animate__animated animate__fadeIn shrink-0 md:min-h-screen shadow-xl z-20 border-r border-darkBlueAlt">
      <div>
        <h2 className="text-xl md:text-2xl font-bold text-white mb-4 md:mb-8 font-poppins text-center md:text-left tracking-wide">
          Admin Portal
        </h2>
        <nav className="flex md:flex-col gap-2 md:gap-3 overflow-x-auto pb-3 md:pb-0 scrollbar-hide snap-x items-center md:items-stretch">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeSection === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveSection(item.id)}
                className={`shrink-0 text-left px-4 py-2.5 md:px-5 md:py-3 rounded-lg flex items-center gap-3 transition-all duration-200 snap-center ${
                  isActive
                    ? 'bg-blue text-white shadow-md font-semibold'
                    : 'bg-transparent text-lightBlue hover:bg-white/10 hover:text-white'
                }`}
              >
                <Icon size={20} className={isActive ? "text-white" : "text-lightBlue"} />
                <span className="whitespace-nowrap text-sm md:text-base">{item.label}</span>
              </button>
            );
          })}
          
          <div className="hidden md:block w-full h-px bg-white/20 my-4" />

          {/* Logout Button */}
          <button
            onClick={handleLogout}
            className="shrink-0 text-left px-4 py-2.5 md:px-5 md:py-3 rounded-lg flex items-center gap-3 transition-all duration-200 snap-center bg-red-600/10 text-red-400 hover:bg-red-600 hover:text-white border border-red-500/30 hover:border-red-600"
          >
            <LogOut size={20} />
            <span className="whitespace-nowrap text-sm md:text-base font-semibold">Logout</span>
          </button>
        </nav>
      </div>
    </div>
  );
};

export default AdminSidebar;
