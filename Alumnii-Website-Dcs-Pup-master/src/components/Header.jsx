import React, { useState, useEffect } from "react";
import API from "../api/api";
import NotificationModal from "./NotificationModal";

const Header = () => {
  const [notificationCount, setNotificationCount] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchNotificationCount = async () => {
      try {
        const response = await API.get("/notifications");
        const activeCount = response.data.filter((n) => !n.isArchived).length;
        setNotificationCount(activeCount); // Display full count
      } catch (err) {
        console.error("Error fetching notification count:", err);
      }
    };

    // Initial fetch
    fetchNotificationCount();

    // Poll every 30 seconds for real-time updates
    const interval = setInterval(fetchNotificationCount, 30000);

    return () => clearInterval(interval); // Cleanup interval on unmount
  }, []);

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <header className="bg-darkBlue text-white p-4 flex justify-between items-center">
      <div className="flex items-center space-x-3">
        <img
          src="/images/logo.png"
          alt="Punjabi University"
          className="w-12 h-12 object-contain"
        />
        <h1 className="text-2xl font-semibold">DCS Punjabi University</h1>
      </div>
      <div className="relative">
        <button onClick={handleOpenModal} className="focus:outline-none">
          <svg
            className="w-6 h-6 text-white hover:text-lightBlue"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
            />
          </svg>
          {notificationCount > 0 && (
            <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center min-w-[1.25rem] px-1">
              {notificationCount}
            </span>
          )}
        </button>
        {isModalOpen && <NotificationModal onClose={handleCloseModal} />}
      </div>
    </header>
  );
};

export default Header;