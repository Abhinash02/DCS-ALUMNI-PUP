import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";
import API from "../api/api";
import { FaBell, FaFilePdf, FaImage, FaCalendarAlt, FaTimes, FaArchive, FaExternalLinkAlt } from "react-icons/fa";

const NotificationModal = ({ onClose }) => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("active");

  useEffect(() => {
    // Prevent background scrolling while modal is open
    document.body.style.overflow = "hidden";

    // Close on Escape key
    const handleKeyDown = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = "unset";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [onClose]);

  useEffect(() => {
    const fetchNotifications = async () => {
      if (typeof navigator !== "undefined" && !navigator.onLine) {
        setLoading(false);
        return;
      }
      try {
        const response = await API.get("/notifications");
        setNotifications(response.data || []);
        setLoading(false);
      } catch (err) {
        if (typeof navigator === "undefined" || navigator.onLine) {
          setError(err.message || "Failed to load notifications");
        }
        setLoading(false);
      }
    };

    fetchNotifications();
    const interval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(interval);
  }, []);

  const activeNotifications = notifications.filter((n) => !n.isArchived);
  const archivedNotifications = notifications.filter((n) => n.isArchived);
  const displayList = activeTab === "active" ? activeNotifications : archivedNotifications;

  const modalContent = (
    <div 
      className="fixed inset-0 z-[9999] w-screen h-screen bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 overflow-hidden animate-loader-fade-in"
      onClick={onClose}
      style={{ margin: 0, top: 0, left: 0 }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-announcements-title"
    >
      <div 
        className="relative w-full max-w-lg sm:max-w-xl mx-auto my-auto bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-100 dark:border-slate-800 overflow-hidden flex flex-col max-h-[88vh] sm:max-h-[82vh] transition-all duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="p-5 sm:p-6 pb-4 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-gradient-to-r from-blue-50/50 via-white to-white dark:from-slate-800/50 dark:via-slate-900 dark:to-slate-900">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full bg-blue/10 dark:bg-sky-400/10 flex items-center justify-center p-1.5 shadow-sm border border-blue/15">
              <img
                src="/images/logo.png"
                alt="Punjabi University"
                className="w-full h-full object-contain"
                onError={(e) => { e.target.style.display = 'none'; }}
              />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 id="modal-announcements-title" className="text-lg sm:text-xl font-bold text-darkBlue dark:text-sky-400">
                  DCS Announcements
                </h2>
                <span className="flex h-2 w-2 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sky-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-blue"></span>
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                Official Department & Alumni Circulars
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-slate-700 transition-all flex items-center justify-center text-sm font-semibold shadow-sm focus:outline-none"
            aria-label="Close Modal"
          >
            <FaTimes />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="px-5 sm:px-6 pt-4 pb-2">
          <div className="bg-slate-100 dark:bg-slate-800/80 p-1 rounded-2xl flex text-xs font-semibold">
            <button
              className={`flex-1 py-2 px-3 rounded-xl transition-all duration-200 flex items-center justify-center gap-2 ${
                activeTab === "active"
                  ? "bg-white dark:bg-slate-900 text-blue dark:text-sky-400 shadow-sm font-bold"
                  : "text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200"
              }`}
              onClick={() => setActiveTab("active")}
            >
              <FaBell className="w-3.5 h-3.5" />
              <span>Active</span>
              <span className={`text-[10px] px-2 py-0.5 rounded-full ${
                activeTab === "active" ? "bg-blue/10 dark:bg-sky-400/20 text-blue dark:text-sky-400" : "bg-slate-200 dark:bg-slate-700"
              }`}>
                {activeNotifications.length}
              </span>
            </button>
            <button
              className={`flex-1 py-2 px-3 rounded-xl transition-all duration-200 flex items-center justify-center gap-2 ${
                activeTab === "archived"
                  ? "bg-white dark:bg-slate-900 text-blue dark:text-sky-400 shadow-sm font-bold"
                  : "text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200"
              }`}
              onClick={() => setActiveTab("archived")}
            >
              <FaArchive className="w-3.5 h-3.5" />
              <span>Archived</span>
              <span className={`text-[10px] px-2 py-0.5 rounded-full ${
                activeTab === "archived" ? "bg-blue/10 dark:bg-sky-400/20 text-blue dark:text-sky-400" : "bg-slate-200 dark:bg-slate-700"
              }`}>
                {archivedNotifications.length}
              </span>
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-5 sm:p-6 pt-2 overflow-y-auto space-y-3.5 flex-1 custom-scrollbar">
          {loading && (
            <div className="space-y-3 py-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="animate-pulse bg-slate-50 dark:bg-slate-800/60 p-4 rounded-2xl border border-slate-100 dark:border-slate-800 space-y-2">
                  <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-3/4"></div>
                  <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded w-full"></div>
                  <div className="h-3 bg-slate-100 dark:bg-slate-800 rounded w-1/3"></div>
                </div>
              ))}
            </div>
          )}

          {error && (
            <div className="text-center py-8">
              <div className="w-12 h-12 rounded-full bg-red-100 dark:bg-red-900/30 text-red-500 mx-auto flex items-center justify-center mb-2">
                <FaTimes />
              </div>
              <p className="text-sm text-red-600 dark:text-red-400 font-medium">{error}</p>
            </div>
          )}

          {!loading && !error && displayList.length === 0 && (
            <div className="text-center py-12 px-4">
              <div className="w-14 h-14 rounded-2xl bg-blue/10 dark:bg-slate-800 text-blue dark:text-sky-400 mx-auto flex items-center justify-center mb-3 text-xl shadow-inner">
                {activeTab === "active" ? <FaBell /> : <FaArchive />}
              </div>
              <h3 className="text-base font-bold text-slate-800 dark:text-slate-200">
                {activeTab === "active" ? "No Active Announcements" : "No Archived Notifications"}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-xs mx-auto">
                {activeTab === "active" 
                  ? "You're all caught up! New circulars and notices will appear right here." 
                  : "Archived circulars will be stored here for future reference."}
              </p>
            </div>
          )}

          {!loading && !error && displayList.map((notification) => (
            <div
              key={notification._id}
              className="group bg-slate-50/80 dark:bg-slate-800/50 hover:bg-white dark:hover:bg-slate-800 p-4 sm:p-5 rounded-2xl border border-slate-100 dark:border-slate-700/60 hover:border-blue/30 dark:hover:border-sky-400/40 shadow-sm hover:shadow-md transition-all duration-200"
            >
              <div className="flex items-start justify-between gap-3">
                <h4 className="text-base font-bold text-darkBlue dark:text-sky-300 group-hover:text-blue transition-colors">
                  {notification.title}
                </h4>
                {activeTab === "active" && (
                  <span className="flex-shrink-0 bg-blue/10 dark:bg-sky-400/10 text-blue dark:text-sky-400 text-[10px] font-bold px-2 py-0.5 rounded-full">
                    New
                  </span>
                )}
              </div>

              <p className="text-sm text-slate-600 dark:text-slate-300 mt-1.5 leading-relaxed">
                {notification.description}
              </p>

              {/* Attachment Button if exists */}
              {(notification.fileType === "image" || notification.fileType === "pdf") && notification.fileUrl && (
                <div className="mt-3">
                  <a
                    href={notification.fileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-xl bg-blue/10 dark:bg-sky-400/15 text-blue dark:text-sky-300 hover:bg-blue hover:text-white dark:hover:bg-sky-500 dark:hover:text-white transition-all shadow-sm"
                  >
                    {notification.fileType === "image" ? <FaImage className="w-3.5 h-3.5" /> : <FaFilePdf className="w-3.5 h-3.5" />}
                    <span>{notification.fileType === "image" ? "View Image" : "View / Download PDF"}</span>
                    <FaExternalLinkAlt className="w-2.5 h-2.5 ml-0.5" />
                  </a>
                </div>
              )}

              {/* Footer Meta */}
              <div className="flex flex-wrap items-center justify-between gap-2 mt-3 pt-2.5 border-t border-slate-100 dark:border-slate-700/50 text-[11px] text-slate-400 dark:text-slate-500 font-medium">
                <div className="flex items-center gap-1.5">
                  <FaCalendarAlt className="w-3 h-3 text-slate-400" />
                  <span>Posted: {new Date(notification.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}</span>
                </div>
                {notification.archiveDate && (
                  <span>Archive: {new Date(notification.archiveDate).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}</span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  if (typeof document !== "undefined") {
    return ReactDOM.createPortal(modalContent, document.body);
  }

  return modalContent;
};

export default NotificationModal;