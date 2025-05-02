import React, { useState, useEffect } from "react";
import axios from "axios";

const NotificationModal = ({ onClose }) => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/notifications");
        setNotifications(response.data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };
    fetchNotifications();
  }, []);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-lg w-full max-h-[80vh] overflow-y-auto">
      <div className="flex justify-between items-center mb-4">
  <div className="flex items-center space-x-3">
    <img
      src="/images/logo.png"
      alt="Punjabi University"
      className="w-10 h-10 object-contain"
    />
    <h2 className="text-2xl font-semibold text-darkBlue">Dcs Pup Notifications</h2>
  </div>
  <button
    onClick={onClose}
    className="text-xl font-bold text-darkBlue hover:text-lightBlue"
  >
    ×
  </button>
</div>
        {loading && <p className="text-center">Loading...</p>}
        {error && <p className="text-center text-red-500">{error}</p>}
        {!loading && !error && notifications.length === 0 && (
          <p className="text-center">No notifications available.</p>
        )}
        <div className="space-y-4">
          {notifications.map((notification) => (
            <div
              key={notification._id}
              className="border-b pb-4 last:border-b-0"
            >
              <h3 className="text-lg font-medium text-darkBlue">{notification.title}</h3>
              <p className="text-gray-700 mt-1">{notification.description}</p>
              {(notification.fileType === "image" || notification.fileType === "pdf") && (
                <div className="mt-2">
                  <a
                    href={notification.fileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-lightBlue hover:underline inline-block"
                  >
                    {notification.fileType === "image" ? "View Image" : "View/Download PDF"}
                  </a>
                </div>
              )}
              <p className="text-sm text-gray-500 mt-2">
                Posted on: {new Date(notification.createdAt).toLocaleDateString()}
              </p>
            </div>
            
          ))}
        </div>
        
      </div>
    </div>
  );
};

export default NotificationModal;