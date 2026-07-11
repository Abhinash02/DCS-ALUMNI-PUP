import React, { useEffect, useState } from 'react';
import API from '../../api/api';

const AdminNotifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [editingNotification, setEditingNotification] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    archiveDate: '',
    files: [],
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 2;

  const fetchNotifications = async () => {
    try {
      const response = await API.get('/notifications', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      setNotifications(response.data);
    } catch (err) {
      console.error('Error fetching notifications:', err);
      setError('Failed to fetch notifications.');
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleNotificationSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setIsUploading(true);

    const { title, description, files, archiveDate } = formData;
    if (!title || !description || (!files[0] && !editingNotification) || !archiveDate) {
      setError('Title, description, file, and archive date are required.');
      setIsUploading(false);
      return;
    }

    const data = new FormData();
    data.append('title', title);
    data.append('description', description);
    if (files[0]) data.append('file', files[0]);
    data.append('archiveDate', archiveDate);

    try {
      const token = localStorage.getItem('token');
      const url = editingNotification
        ? `/notifications/${editingNotification._id}`
        : '/notifications';
      const method = editingNotification ? API.put : API.post;

      await method(url, data, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });
      setSuccess(editingNotification ? 'Notification updated successfully!' : 'Notification uploaded successfully!');
      setFormData({
        title: '',
        description: '',
        archiveDate: '',
        files: [],
      });
      setEditingNotification(null);
      e.target.reset();
      fetchNotifications();
    } catch (err) {
      console.error('Notification operation error:', err);
      setError(err.response?.data?.error || `Failed to ${editingNotification ? 'update' : 'upload'} notification.`);
    } finally {
      setIsUploading(false);
    }
  };

  const handleEditNotification = (notification) => {
    setEditingNotification(notification);
    setFormData({
      title: notification.title,
      description: notification.description,
      archiveDate: new Date(notification.archiveDate).toISOString().split('T')[0],
      files: [],
    });
  };

  const handleCancelEdit = () => {
    setEditingNotification(null);
    setFormData({
      title: '',
      description: '',
      archiveDate: '',
      files: [],
    });
  };

  const deleteNotification = async (id, publicId) => {
    if (!window.confirm('Are you sure you want to delete this notification?')) return;
    try {
      await API.delete(`/notifications/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        data: { publicId },
      });
      setSuccess('Notification deleted successfully!');
      fetchNotifications();
    } catch (err) {
      console.error('Error deleting notification:', err);
      setError(err.response?.data?.error || 'Failed to delete notification.');
    }
  };

  const getPaginatedData = () => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return notifications.slice(startIndex, endIndex);
  };

  const renderPagination = () => {
    const totalPages = Math.ceil(notifications.length / itemsPerPage);
    const pages = [];
    for (let i = 1; i <= totalPages; i++) {
      pages.push(i);
    }

    return (
      <div className="flex justify-center gap-2 mt-6">
        <button
          onClick={() => setCurrentPage(currentPage - 1)}
          disabled={currentPage === 1}
          className="px-4 py-2 bg-blue text-white rounded-lg disabled:opacity-50"
        >
          Previous
        </button>
        {pages.map((page) => (
          <button
            key={page}
            onClick={() => setCurrentPage(page)}
            className={`px-4 py-2 rounded-lg ${currentPage === page ? 'bg-blue text-white' : 'bg-gray-700 text-gray-300'
              }`}
          >
            {page}
          </button>
        ))}
        <button
          onClick={() => setCurrentPage(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="px-4 py-2 bg-blue text-white rounded-lg disabled:opacity-50"
        >
          Next
        </button>
      </div>
    );
  };

  return (
    <section className="bg-gray-800 p-8 rounded-xl shadow-2xl animate__animated animate__fadeInUp">
      {error && (
        <p className="text-black bg-red-900 bg-opacity-50 p-4 rounded-lg mb-4 animate__animated animate__shakeX">{error}</p>
      )}
      {success && (
        <p className="text-white bg-green-900 bg-opacity-50 p-4 rounded-lg mb-4 animate__animated animate__shakeX">{success}</p>
      )}

      <h3 className="text-2xl font-semibold text-blue-400 mb-6">
        {editingNotification ? 'Edit Notification' : 'Upload Notification'}
      </h3>
      <form onSubmit={handleNotificationSubmit} className="space-y-6 mb-8">
        <div>
          <label className="block text-sm font-medium text-gray-300">Title</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            className="mt-1 block w-full bg-gray-700 border-1.5 border-black rounded-lg text-black shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            required
            disabled={isUploading}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300">Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            className="mt-1 block w-full bg-gray-700 border-1.5 border-black rounded-lg text-black shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            rows="4"
            required
            disabled={isUploading}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300">Archive Date</label>
          <input
            type="date"
            name="archiveDate"
            value={formData.archiveDate}
            onChange={handleInputChange}
            className="mt-1 block w-full bg-gray-700 border-1.5 border-black rounded-lg text-black shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            required
            disabled={isUploading}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300">Upload Image or PDF</label>
          <input
            type="file"
            accept="image/jpeg,image/png,image/gif,application/pdf"
            onChange={(e) => setFormData({ ...formData, files: [e.target.files[0]] })}
            className="mt-1 block w-full text-gray-300 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue file:text-white"
            disabled={isUploading}
          />
        </div>
        <div className="flex gap-4">
          <button
            type="submit"
            className={`flex-1 bg-blue text-white font-semibold rounded-lg py-3 px-4 transition-colors transform hover:scale-105 animate__animated animate__pulse animate__infinite ${isUploading ? 'opacity-50 cursor-not-allowed' : 'opacity-100'
              }`}
            disabled={isUploading}
          >
            {isUploading ? 'Processing...' : editingNotification ? 'Update Notification' : 'Upload Notification'}
          </button>
          {editingNotification && (
            <button
              type="button"
              onClick={handleCancelEdit}
              className="flex-1 bg-gray-600 hover:bg-gray-700 text-white font-semibold rounded-lg py-3 px-4 transition-colors transform hover:scale-105"
            >
              Cancel
            </button>
          )}
        </div>
      </form>

      <h3 className="text-2xl font-semibold text-blue-400 mb-6">Manage Notifications</h3>
      {notifications.length === 0 ? (
        <p className="text-gray-400">No notifications available.</p>
      ) : (
        <>
          <div className="space-y-4">
            {getPaginatedData().map((notification) => (
              <div key={notification._id} className="border p-4 rounded-lg shadow-md bg-gray-700 animate__animated animate__fadeIn">
                <h4 className="text-lg font-medium text-white">{notification.title}</h4>
                <p className="text-gray-300">{notification.description}</p>
                <p className="text-sm text-gray-400 mt-1">
                  Posted on: {new Date(notification.createdAt).toLocaleDateString()}
                </p>
                <p className="text-sm text-gray-400">
                  Archive Date: {new Date(notification.archiveDate).toLocaleDateString()}
                </p>
                <p className="text-sm text-gray-400">
                  Status: {notification.isArchived ? 'Archived' : 'Active'}
                </p>
                <p className="text-sm text-gray-400">
                  File:{' '}
                  <a
                    href={notification.fileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-400 hover:underline"
                  >
                    {notification.fileType === 'pdf' ? 'View PDF' : 'View Image'}
                  </a>
                </p>
                <div className="flex gap-2 mt-2">
                  <button
                    onClick={() => handleEditNotification(notification)}
                    className="bg-blue hover:bg-blue text-white py-1 px-4 rounded-lg transition-colors transform hover:scale-110 animate__animated animate__pulse animate__infinite"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => deleteNotification(notification._id, notification.publicId)}
                    className="bg-red-600 hover:bg-red-700 text-white py-1 px-4 rounded-lg transition-colors transform hover:scale-110 animate__animated animate__pulse animate__infinite"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
          {renderPagination()}
        </>
      )}
    </section>
  );
};

export default AdminNotifications;
