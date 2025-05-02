import React, { useState, useEffect, useRef } from "react";
import { GiHamburgerMenu } from "react-icons/gi";
import { FaBell, FaLinkedinIn, FaInstagram } from "react-icons/fa";
import { Link, useLocation } from "react-router-dom";
import NotificationModal from "./NotificationModal";

export const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isNotificationModalOpen, setIsNotificationModalOpen] = useState(false);
  const [notifications, setNotifications] = useState([
    // Example notifications; replace with your data source (e.g., API)
    { id: 1, message: "New event added!", isRead: false },
    { id: 2, message: "Alumni meet scheduled!", isRead: false },
    { id: 3, message: "Welcome to the platform!", isRead: true },
  ]);
  const location = useLocation();
  const menuRef = useRef(null);

  // Calculate the number of unread notifications
  const unreadCount = notifications.filter((notification) => !notification.isRead).length;

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 0) {
        document.querySelector(".navbar").classList.add("shadow-xl");
      } else {
        document.querySelector(".navbar").classList.remove("shadow-xl");
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const isActive = (path) => location.pathname === path;

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const toggleNotificationModal = () => {
    setIsNotificationModalOpen(!isNotificationModalOpen);
    // Optional: Mark all notifications as read when the modal is opened
    if (!isNotificationModalOpen) {
      setNotifications((prev) =>
        prev.map((notification) => ({ ...notification, isRead: true }))
      );
    }
  };

  return (
    <div className="py-2 fixed bg-fixed w-full bg-[#ffffff] z-50 navbar duration-700">
      <nav className="flex justify-between items-center max-w-[95%] md:max-w-[85%] mx-auto text-lg">
        <div className="w-16">
          <img src="/images/logo.png" alt="Punjabi University" />
        </div>
        <div className="md:hidden flex items-center gap-4">
          <button onClick={toggleNotificationModal} className="relative text-2xl">
            <FaBell />
            {unreadCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                {unreadCount}
              </span>
            )}
          </button>
          <button onClick={toggleMenu} className="text-2xl">
            <GiHamburgerMenu />
          </button>
        </div>
        {isMenuOpen && (
          <div
            ref={menuRef}
            className="absolute top-full left-0 w-full bg-[#000] bg-opacity-75 shadow-md z-40 flex flex-col md:hidden"
          >
            <ul className="flex flex-col gap-4 text-[#fff] font-medium items-center py-4">
              <li
                className={`hover:underline hover:text-lightBlue decoration-2 ${
                  isActive("/") ? "underline text-lightBlue" : ""
                }`}
              >
                <Link to="/" onClick={toggleMenu}>
                  Home
                </Link>
              </li>
              <li
                className={`hover:underline hover:text-lightBlue decoration-2 ${
                  isActive("/Alumni") ? "underline text-lightBlue" : ""
                }`}
              >
                <Link to="/Alumni" onClick={toggleMenu}>
                  Alumni
                </Link>
              </li>
              <li
                className={`hover:underline hover:text-lightBlue decoration-2 ${
                  isActive("/Events") ? "underline text-lightBlue" : ""
                }`}
              >
                <Link to="/Events" onClick={toggleMenu}>
                  Events
                </Link>
              </li>
              <li
              className={`hover:underline hover:text-darkBlue decoration-2 ${
                isActive("/Faculty") ? "underline text-darkBlue" : ""
              }`}
            >
              <Link to="/Faculty">Faculty</Link>
            </li>
              <li
                className={`hover:underline hover:text-lightBlue decoration-2 ${
                  isActive("/ReachUs") ? "underline text-lightBlue" : ""
                }`}
              >
                <Link to="/ReachUs" onClick={toggleMenu}>
                  Reach Us
                </Link>
              </li>
              <li>
                <Link to="/Register" onClick={toggleMenu}>
                  <button className="bg-darkBlue hover:bg-[#222363] text-[#fff] font-semibold rounded-lg py-2 px-3">
                    Register Now!
                  </button>
                </Link>
              </li>
            </ul>
            <div className="flex justify-center gap-6 pb-4 text-2xl text-white">
              <a
                href="https://www.linkedin.com/school/punjabi-university-patiala/"
                className="hover:text-[#0a66c2] transition-colors"
                target="_blank"
                rel="noopener noreferrer"
              >
                <FaLinkedinIn />
              </a>
              <a
                href="https://www.instagram.com/dcs.pupatiala?igsh=ejUwNG4waTR4Ym1r"
                className="hover:text-[#e1306c] transition-colors"
                target="_blank"
                rel="noopener noreferrer"
              >
                <FaInstagram />
              </a>
              <button
                onClick={toggleNotificationModal}
                className="relative text-2xl text-white hover:text-lightBlue"
              >
                <FaBell />
                {unreadCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {unreadCount}
                  </span>
                )}
              </button>
            </div>
          </div>
        )}
        <div className="hidden md:flex">
          <ul className="flex gap-8 font-medium items-center underline-offset-8">
            <li
              className={`hover:underline hover:text-darkBlue decoration-2 ${
                isActive("/") ? "underline text-darkBlue" : ""
              }`}
            >
              <Link to="/">Home</Link>
            </li>
            <li
              className={`hover:underline hover:text-darkBlue decoration-2 ${
                isActive("/Alumni") ? "underline text-darkBlue" : ""
              }`}
            >
              <Link to="/Alumni">Alumni</Link>
            </li>
            <li
              className={`hover:underline hover:text-darkBlue decoration-2 ${
                isActive("/Events") ? "underline text-darkBlue" : ""
              }`}
            >
              <Link to="/Events">Events</Link>
            </li>
            <li
              className={`hover:underline hover:text-darkBlue decoration-2 ${
                isActive("/Faculty") ? "underline text-darkBlue" : ""
              }`}
            >
              <Link to="/Faculty">Faculty</Link>
            </li>
            <li
              className={`hover:underline hover:text-darkBlue decoration-2 ${
                isActive("/ReachUs") ? "underline text-darkBlue" : ""
              }`}
            >
              <Link to="/ReachUs">Reach Us</Link>
            </li>
            <li>
              <Link to="/Register">
                <button className="bg-darkBlue hover:bg-[#222363] text-[#fff] font-semibold rounded-lg py-2 px-3">
                  Register Now!
                </button>
              </Link>
            </li>
            <li>
              <button
                onClick={toggleNotificationModal}
                className="relative text-2xl text-darkBlue hover:text-lightBlue"
              >
                <FaBell />
                {unreadCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {unreadCount}
                  </span>
                )}
              </button>
            </li>
            <div className="flex justify-center md:justify-start mt-1 gap-4 text-2xl text-darkBlue">
              <a
                href="https://www.linkedin.com/school/punjabi-university-patiala/"
                className="hover:text-[#0a66c2] transition-colors"
                target="_blank"
                rel="noopener noreferrer"
              >
                <FaLinkedinIn />
              </a>
              <a
                href="https://www.instagram.com/dcs.pupatiala?igsh=ejUwNG4waTR4Ym1r"
                className="hover:text-[#e1306c] transition-colors"
                target="_blank"
                rel="noopener noreferrer"
              >
                <FaInstagram />
              </a>
            </div>
          </ul>
        </div>
      </nav>
      {isNotificationModalOpen && (
        <NotificationModal
          notifications={notifications}
          onClose={toggleNotificationModal}
        />
      )}
    </div>
  );
};