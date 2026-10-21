import React, { useEffect, useState } from 'react';
import API from '../../api/api';
import { Bell, AlertCircle, CheckCircle2, FileText, Trash2, Edit } from 'lucide-react';

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
    <section className="bg-white dark:bg-slate-800 p-6 md:p-8 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-700 animate__animated animate__fadeInUp transition-colors duration-200">
      {error && (
        <div className="text-red-700 dark:text-red-300 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 p-4 rounded-xl mb-6 flex items-center gap-2.5 text-sm font-medium animate__animated animate__shakeX">
          <AlertCircle className="w-5 h-5 shrink-0 text-red-500" />
          <span>{error}</span>
        </div>
      )}
      {success && (
        <div className="text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 p-4 rounded-xl mb-6 flex items-center gap-2.5 text-sm font-medium animate__animated animate__fadeIn">
          <CheckCircle2 className="w-5 h-5 shrink-0 text-emerald-500" />
          <span>{success}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-100 dark:border-slate-700">
        <div className="p-2.5 bg-blue-50 dark:bg-blue-500/20 rounded-xl text-blue-700 dark:text-blue-300">
          <Bell className="w-6 h-6" />
        </div>
        <div>
          <h3 className="text-xl md:text-2xl font-bold text-slate-900 dark:text-white">
            {editingNotification ? 'Edit Department Notification' : 'Publish Notification'}
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Broadcast official university circulars, guidelines, and announcements</p>
        </div>
      </div>

      <form onSubmit={handleNotificationSubmit} className="space-y-5 mb-10">
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
            Notice Title <span className="text-red-500 font-bold ml-1">*</span>
          </label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-300 dark:border-slate-600 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:bg-white dark:focus:bg-slate-900 focus:border-blue-600 focus:ring-2 focus:ring-blue-500/20 outline-none transition duration-200 text-sm shadow-sm"
            placeholder="e.g., Annual Alumni Meet Registration Open"
            required
            disabled={isUploading}
          />
        </div>

        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
            Detailed Notice / Description <span className="text-red-500 font-bold ml-1">*</span>
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-300 dark:border-slate-600 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:bg-white dark:focus:bg-slate-900 focus:border-blue-600 focus:ring-2 focus:ring-blue-500/20 outline-none transition duration-200 text-sm shadow-sm"
            rows="4"
            placeholder="Write circular content, guidelines, dates, and instructions..."
            required
            disabled={isUploading}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
              Archive Date <span className="text-red-500 font-bold ml-1">*</span>
            </label>
            <input
              type="date"
              name="archiveDate"
              value={formData.archiveDate}
              onChange={handleInputChange}
              className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-300 dark:border-slate-600 text-slate-900 dark:text-slate-100 focus:bg-white dark:focus:bg-slate-900 focus:border-blue-600 focus:ring-2 focus:ring-blue-500/20 outline-none transition duration-200 text-sm shadow-sm"
              required
              disabled={isUploading}
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
              Upload PDF or Image Document
            </label>
            <input
              type="file"
              accept="image/jpeg,image/png,image/gif,application/pdf"
              onChange={(e) => setFormData({ ...formData, files: [e.target.files[0]] })}
              className="w-full text-slate-600 dark:text-slate-300 text-sm file:mr-4 file:py-2.5 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-blue-50 file:text-blue-700 dark:file:bg-blue-900/40 dark:file:text-blue-300 hover:file:bg-blue-100 cursor-pointer"
              disabled={isUploading}
            />
          </div>
        </div>

        <div className="flex flex-wrap gap-3 pt-2">
          <button
            type="submit"
            className={`px-6 py-3 rounded-xl bg-gradient-to-r from-blue to-darkBlue text-white font-semibold shadow-md shadow-blue-900/20 hover:opacity-95 active:scale-[0.99] transition duration-200 text-sm flex items-center justify-center gap-2 ${
              isUploading ? 'opacity-50 cursor-not-allowed' : ''
            }`}
            disabled={isUploading}
          >
            <Bell className="w-4 h-4" />
            <span>{isUploading ? 'Publishing...' : editingNotification ? 'Update Notification' : 'Publish Notification'}</span>
          </button>
          {editingNotification && (
            <button
              type="button"
              onClick={handleCancelEdit}
              className="px-6 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 font-semibold transition duration-200 text-sm"
            >
              Cancel Edit
            </button>
          )}
        </div>
      </form>

      {/* Notifications List */}
      <div className="border-t border-slate-100 dark:border-slate-700 pt-6">
        <h4 className="text-lg font-bold text-slate-900 dark:text-white mb-4">
          Active Notices & Circulars ({notifications.length})
        </h4>
        {notifications.length === 0 ? (
          <p className="text-slate-400 text-sm">No notifications available in database.</p>
        ) : (
          <>
            <div className="space-y-4">
              {getPaginatedData().map((n) => (
                <div key={n._id} className="border border-slate-200 dark:border-slate-700 p-5 rounded-xl shadow-sm bg-slate-50 dark:bg-slate-900/60 hover:border-slate-300 transition duration-200">
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3 mb-2">
                    <h5 className="text-base font-bold text-slate-900 dark:text-white">{n.title}</h5>
                    <div className="flex items-center gap-2">
                      <span className="text-xs px-2.5 py-0.5 rounded-full bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 font-semibold border border-blue-200 dark:border-blue-800">
                        Archive: {new Date(n.archiveDate).toLocaleDateString()}
                      </span>
                      <span className={`text-xs px-2.5 py-0.5 rounded-full font-bold ${
                        n.isArchived ? 'bg-gray-200 text-gray-700' : 'bg-emerald-100 text-emerald-800'
                      }`}>
                        {n.isArchived ? 'Archived' : 'Active'}
                      </span>
                    </div>
                  </div>
                  <p className="text-sm text-slate-600 dark:text-slate-300 mb-3">{n.description}</p>

                  <div className="pt-2 border-t border-slate-200/60 dark:border-slate-700/60 flex flex-wrap justify-between items-center gap-2">
                    {n.fileUrl ? (
                      <a
                        href={n.fileUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 text-xs text-blue-600 dark:text-sky-300 font-semibold hover:underline"
                      >
                        <FileText className="w-4 h-4" />
                        <span>{n.fileType === 'pdf' ? 'Download PDF Circular' : 'View Attachment'}</span>
                      </a>
                    ) : <span />}

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleEditNotification(n)}
                        className="px-3.5 py-1.5 rounded-lg bg-blue-50 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 hover:bg-blue-100 font-semibold text-xs border border-blue-200 dark:border-blue-800 transition flex items-center gap-1"
                      >
                        <Edit className="w-3.5 h-3.5" />
                        <span>Edit</span>
                      </button>
                      <button
                        onClick={() => deleteNotification(n._id, n.publicId)}
                        className="px-3.5 py-1.5 rounded-lg bg-red-50 dark:bg-red-950/40 text-red-600 dark:text-red-400 hover:bg-red-100 font-semibold text-xs border border-red-200 dark:border-red-800 transition flex items-center gap-1"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Delete</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            {renderPagination()}
          </>
        )}
      </div>
    </section>
  );
};

export default AdminNotifications;
