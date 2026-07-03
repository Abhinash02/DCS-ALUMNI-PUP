import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import API from '../api/api';
import { useNavigate } from 'react-router-dom';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

export default function Admindashboard() {
  const [pending, setPending] = useState([]);
  const [approved, setApproved] = useState([]);
  const [denied, setDenied] = useState([]);
  const [faculty, setFaculty] = useState([]);
  const [events, setEvents] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    title: '',
    department: '',
    email: '',
    phone: '',
    expertise: '',
    bio: '',
    Designation: '',
    description: '',
    position: 'right',
    bgColor: 'bg-white',
    textColor: '#374151',
    files: [],
    archiveDate: '',
  });
  const [image, setImage] = useState(null);
  const [excelFile, setExcelFile] = useState(null);
  const [excelCourse, setExcelCourse] = useState('');
  const [excelBatch, setExcelBatch] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [activeSection, setActiveSection] = useState('pending');
  const [expandedCards, setExpandedCards] = useState({});
  const [editingFaculty, setEditingFaculty] = useState(null);
  const [editingNotification, setEditingNotification] = useState(null);
  const [bulkEmailSubject, setBulkEmailSubject] = useState('');
  const [bulkEmailMessage, setBulkEmailMessage] = useState('');
  const [isSendingBulkEmail, setIsSendingBulkEmail] = useState(false);
  const [emailProgress, setEmailProgress] = useState(null);
  const [abortController, setAbortController] = useState(null);
  const [currentPage, setCurrentPage] = useState({ pending: 1, approved: 1, faculty: 1, notification: 1, events: 1 });
  const itemsPerPage = { pending: 10, approved: 10, faculty: 10, notification: 2, events: 2 };
  const navigate = useNavigate();

  // Fetch Functions http://localhost:5000//
  const fetchPending = async () => {
    try {
      const response = await API.get('/alumni/pending', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      setPending(response.data);
    } catch (err) {
      console.error('Error fetching pending:', err);
      setError('Failed to fetch pending alumni.');
    }
  };

  const fetchApproved = async () => {
    try {
      const response = await API.get('/alumni/approved', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      setApproved(response.data);
    } catch (err) {
      console.error('Error fetching approved:', err);
      setError('Failed to fetch approved alumni.');
    }
  };

  const fetchDenied = async () => {
    try {
      const response = await API.get('/alumni/denied', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      setDenied(response.data);
    } catch (err) {
      console.error('Error fetching denied:', err);
      setError('Failed to fetch denied alumni.');
    }
  };

  const fetchFaculty = async () => {
    try {
      const response = await API.get('/faculty', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      setFaculty(response.data);
    } catch (err) {
      console.error('Error fetching faculty:', err);
      setError('Failed to fetch faculty.');
    }
  };

  const fetchEvents = async () => {
    try {
      const response = await API.get('/events', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      setEvents(response.data);
    } catch (err) {
      console.error('Error fetching events:', err);
      setError('Failed to fetch events.');
    }
  };

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

  // Action Functions
  const approve = async (id) => {
    try {
      await API.put(
        `/alumni/approve/${id}`,
        {},
        {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        }
      );
      fetchPending();
      fetchApproved();
    } catch (err) {
      console.error('Error approving:', err);
      setError('Failed to approve alumni.');
    }
  };

  const deny = async (id) => {
    try {
      await API.put(
        `/alumni/deny/${id}`,
        {},
        {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        }
      );
      setSuccess('Alumni denied successfully.');
      setError('');
      fetchPending();
      fetchDenied();
    } catch (err) {
      console.error('Error denying:', err);
      setError('Failed to deny alumni.');
      setSuccess('');
    }
  };

  const remove = async (id) => {
    try {
      await API.delete(`/alumni/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      fetchPending();
      fetchApproved();
      fetchDenied();
    } catch (err) {
      console.error('Error deleting:', err);
      setError('Failed to delete alumni.');
    }
  };

  const deleteFaculty = async (id) => {
    if (!window.confirm('Are you sure you want to delete this faculty member?')) return;
    try {
      await API.delete(`/faculty/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      setSuccess('Faculty member deleted successfully!');
      fetchFaculty();
    } catch (err) {
      console.error('Error deleting faculty:', err);
      setError('Failed to delete faculty member.');
    }
  };

  const deleteEvent = async (id, publicIds) => {
    if (!window.confirm('Are you sure you want to delete this event?')) return;
    try {
      if (!publicIds || !Array.isArray(publicIds) || publicIds.length === 0) {
        throw new Error('No valid public IDs provided for image deletion.');
      }
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found.');
      }
      await API.delete(`/events/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
        data: { publicIds },
      });
      setSuccess('Event deleted successfully!');
      fetchEvents();
    } catch (err) {
      console.error('Error deleting event:', err);
      setError(
        err.response?.status === 401
          ? 'Unauthorized: Please log in again.'
          : err.response?.status === 404
          ? 'Event not found.'
          : err.message || 'Failed to delete event.'
      );
    }
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

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    if (selectedFiles.length > 5) {
      setError('Maximum 5 images allowed.');
      setFormData({ ...formData, files: [] });
      return;
    }
    for (const file of selectedFiles) {
      if (!['image/jpeg', 'image/png'].includes(file.type)) {
        setError('Please upload valid images (JPEG, PNG).');
        setFormData({ ...formData, files: [] });
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        setError('Each image must be under 5MB.');
        setFormData({ ...formData, files: [] });
        return;
      }
    }
    setFormData({ ...formData, files: selectedFiles });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file && !['image/jpeg', 'image/png'].includes(file.type)) {
      setError('Please upload a valid image (JPEG, PNG).');
      setImage(null);
      return;
    }
    if (file && file.size > 5 * 1024 * 1024) {
      setError('Image must be under 5MB.');
      setImage(null);
      return;
    }
    setImage(file);
  };

  const handleExcelFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.name.match(/\.(xlsx|xls|csv)$/)) {
        setError('Please upload a valid Excel file (.xlsx, .xls, .csv)');
        setExcelFile(null);
        return;
      }
      setExcelFile(file);
    }
  };

  const handleExcelUpload = async (e) => {
    e.preventDefault();
    if (!excelFile) {
      setError('Please select an Excel file first.');
      return;
    }
    setError('');
    setSuccess('');
    setIsUploading(true);

    const data = new FormData();
    if (excelCourse) data.append('course', excelCourse);
    if (excelBatch) data.append('batch', excelBatch);
    data.append('file', excelFile);

    try {
      const token = localStorage.getItem('token');
      const response = await API.post('/alumni/upload-excel', data, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });
      setSuccess(response.data.message || 'Excel data uploaded successfully!');
      setExcelFile(null);
      setExcelCourse('');
      setExcelBatch('');
      e.target.reset();
      fetchPending(); // Refresh the list
    } catch (err) {
      console.error('Excel upload error:', err);
      setError(err.response?.data?.error || 'Failed to upload Excel file.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleEventSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setIsUploading(true);

    const { title, description, position, bgColor, textColor, files } = formData;
    if (!title || !description || files.length === 0) {
      setError('Title, description, and at least one image are required.');
      setIsUploading(false);
      return;
    }

    const data = new FormData();
    data.append('title', title);
    data.append('description', description);
    data.append('position', position);
    data.append('bgColor', bgColor);
    data.append('textColor', textColor);
    files.forEach((file) => data.append('images', file));

    try {
      const token = localStorage.getItem('token');
      await API.post('/events', data, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });
      setSuccess('Event uploaded successfully!');
      setFormData({
        ...formData,
        title: '',
        description: '',
        position: 'right',
        bgColor: 'bg-white',
        textColor: '#374151',
        files: [],
      });
      e.target.reset();
      fetchEvents();
    } catch (err) {
      console.error('Event upload error:', err);
      setError(err.response?.data?.error || 'Failed to upload event.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleFacultySubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setIsUploading(true);

    const { name, title, department, email, phone, expertise, bio, Designation } = formData;
    if (!name) {
      setError('Name is required.');
      setIsUploading(false);
      return;
    }

    const data = new FormData();
    data.append('name', name);
    data.append('title', title);
    data.append('department', department);
    data.append('email', email);
    data.append('phone', phone);
    data.append('expertise', expertise);
    data.append('bio', bio);
    data.append('Designation', Designation);
    if (image) data.append('image', image);

    try {
      const token = localStorage.getItem('token');
      const url = editingFaculty
        ? `/faculty/${editingFaculty._id}`
        : '/faculty';
      const method = editingFaculty ? API.put : API.post;

      await method(url, data, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });
      setSuccess(editingFaculty ? 'Faculty updated successfully!' : 'Faculty member added successfully!');
      setFormData({
        name: '',
        title: '',
        department: '',
        email: '',
        phone: '',
        expertise: '',
        bio: '',
        Designation: '',
        description: '',
        position: 'right',
        bgColor: 'bg-white',
        textColor: '#374151',
        files: [],
      });
      setImage(null);
      setEditingFaculty(null);
      e.target.reset();
      fetchFaculty();
    } catch (err) {
      console.error('Faculty operation error:', err);
      setError(err.response?.data?.error || `Failed to ${editingFaculty ? 'update' : 'add'} faculty member.`);
    } finally {
      setIsUploading(false);
    }
  };

  const handleNotificationSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setIsUploading(true);

    const { title, description, files, archiveDate } = formData;
    if (!title || !description || !files[0] || !archiveDate) {
      setError('Title, description, file, and archive date are required.');
      setIsUploading(false);
      return;
    }

    const data = new FormData();
    data.append('title', title);
    data.append('description', description);
    data.append('file', files[0]);
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
        name: '',
        title: '',
        department: '',
        email: '',
        phone: '',
        expertise: '',
        bio: '',
        Designation: '',
        description: '',
        position: 'right',
        bgColor: 'bg-white',
        textColor: '#374151',
        files: [],
        archiveDate: '',
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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleEditFaculty = (faculty) => {
    setEditingFaculty(faculty);
    setFormData({
      ...formData,
      name: faculty.name,
      title: faculty.title || '',
      department: faculty.department || '',
      email: faculty.email || '',
      phone: faculty.phone || '',
      expertise: faculty.expertise?.join(', ') || '',
      bio: faculty.bio || '',
      Designation: faculty.Designation || '',
    });
    setImage(null);
  };

  const handleEditNotification = (notification) => {
    setEditingNotification(notification);
    setFormData({
      ...formData,
      title: notification.title,
      description: notification.description,
      archiveDate: new Date(notification.archiveDate).toISOString().split('T')[0],
      files: [],
    });
  };

  const handleCancelEdit = () => {
    setEditingFaculty(null);
    setEditingNotification(null);
    setFormData({
      name: '',
      title: '',
      department: '',
      email: '',
      phone: '',
      expertise: '',
      bio: '',
      Designation: '',
      description: '',
      position: 'right',
      bgColor: 'bg-white',
      textColor: '#374151',
      files: [],
      archiveDate: '',
    });
    setImage(null);
  };

  const handleRemoveEvent = async (id) => {
    if (!window.confirm('Are you sure you want to remove this event?')) return;
    try {
      await API.delete(`/events/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setEvents(events.filter(e => e._id !== id));
      setSuccess('Event removed successfully.');
    } catch (err) {
      console.error('Remove Event Error:', err);
      setError('Failed to remove event.');
    }
  };

  const handleBulkEmailSubmit = async (e) => {
    e.preventDefault();
    if (!bulkEmailSubject.trim() || !bulkEmailMessage.trim()) {
      setError('Subject and message are required.');
      return;
    }
    
    setIsSendingBulkEmail(true);
    setError('');
    setSuccess('');
    setEmailProgress(null);
    
    try {
      const token = localStorage.getItem('token');
      // Using API baseURL config usually set in axios, but fetch needs absolute URL if API is on another port.
      // We can derive it from API.defaults.baseURL.
      const baseUrl = API.defaults.baseURL || 'http://localhost:5000/api';
      
      const controller = new AbortController();
      setAbortController(controller);
      
      let lastParsedIndex = 0;
      
      await axios.post(`${baseUrl}/alumni/bulk-email`, {
        subject: bulkEmailSubject,
        message: bulkEmailMessage
      }, {
        headers: { Authorization: `Bearer ${token}` },
        signal: controller.signal,
        responseType: 'text',
        onDownloadProgress: (progressEvent) => {
          const target = progressEvent.event.target || progressEvent.event.currentTarget;
          if (!target || typeof target.responseText !== 'string') return;
          
          const buffer = target.responseText;
          if (!buffer) return;
          
          // Get only the new data since last parse
          const newChunks = buffer.substring(lastParsedIndex);
          
          const lines = newChunks.split('\n\n');
          for (let i = 0; i < lines.length - 1; i++) {
            const line = lines[i];
            if (line.startsWith('data: ')) {
              try {
                const data = JSON.parse(line.substring(6));
                if (data.status === 'error') {
                  setError(data.error);
                } else {
                  setEmailProgress(data);
                  if (data.status === 'completed') {
                    setSuccess(`Successfully sent bulk email to ${data.sent} recipients!`);
                    setBulkEmailSubject('');
                    setBulkEmailMessage('');
                  }
                }
              } catch (e) {
                // Ignore parse errors
              }
            }
            // Update last parsed index to avoid parsing the same chunks
            lastParsedIndex += line.length + 2;
          }
        }
      });
    } catch (err) {
      console.error('Bulk Email Error:', err);
      if (err.name === 'AbortError') {
        setSuccess('Bulk email sending was cancelled.');
        setEmailProgress(prev => prev ? { ...prev, status: 'cancelled' } : null);
      } else {
        setError(err.message || 'Failed to send bulk emails.');
      }
    } finally {
      setIsSendingBulkEmail(false);
      setAbortController(null);
      setTimeout(() => setEmailProgress(null), 5000); // Hide progress after 5s
    }
  };

  const cancelBulkEmail = () => {
    if (abortController) {
      abortController.abort();
    }
  };

  const handleLogout = useCallback(() => {
    localStorage.removeItem('token');
    navigate('/login');
  }, [navigate]);

  const resetTimeout = useCallback(() => {
    const timeout = setTimeout(() => {
      handleLogout();
    }, 5 * 60 * 1000); // 5 minutes
    return timeout;
  }, [handleLogout]);

  const toggleCardDetails = (id) => {
    setExpandedCards((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  // Pagination Logic
  const getPaginatedData = (data, section) => {
    const startIndex = (currentPage[section] - 1) * itemsPerPage[section];
    const endIndex = startIndex + itemsPerPage[section];
    return data.slice(startIndex, endIndex);
  };

  const handlePageChange = (section, page) => {
    setCurrentPage((prev) => ({ ...prev, [section]: page }));
  };

  const renderPagination = (section, totalItems) => {
    const totalPages = Math.ceil(totalItems / itemsPerPage[section]);
    const pages = [];
    for (let i = 1; i <= totalPages; i++) {
      pages.push(i);
    }

    return (
      <div className="flex justify-center gap-2 mt-6">
        <button
          onClick={() => handlePageChange(section, currentPage[section] - 1)}
          disabled={currentPage[section] === 1}
          className="px-4 py-2 bg-blue text-white rounded-lg disabled:opacity-50"
        >
          Previous
        </button>
        {pages.map((page) => (
          <button
            key={page}
            onClick={() => handlePageChange(section, page)}
            className={`px-4 py-2 rounded-lg ${
              currentPage[section] === page ? 'bg-blue text-white' : 'bg-gray-700 text-gray-300'
            }`}
          >
            {page}
          </button>
        ))}
        <button
          onClick={() => handlePageChange(section, currentPage[section] + 1)}
          disabled={currentPage[section] === totalPages}
          className="px-4 py-2 bg-blue text-white rounded-lg disabled:opacity-50"
        >
          Next
        </button>
      </div>
    );
  };

  useEffect(() => {
    // Load animate.css
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://cdnjs.cloudflare.com/ajax/libs/animate.css/4.1.1/animate.min.css';
    document.head.appendChild(link);

    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
    } else {
      fetchPending();
      fetchApproved();
      fetchDenied();
      fetchFaculty();
      fetchEvents();
      fetchNotifications();
    }

    let timeout = resetTimeout();

    const resetTimer = () => {
      clearTimeout(timeout);
      timeout = resetTimeout();
    };

    window.addEventListener('mousemove', resetTimer);
    window.addEventListener('keypress', resetTimer);
    window.addEventListener('click', resetTimer);

    return () => {
      clearTimeout(timeout);
      window.removeEventListener('mousemove', resetTimer);
      window.removeEventListener('keypress', resetTimer);
      window.removeEventListener('click', resetTimer);
      document.head.removeChild(link);
    };
  }, [navigate, resetTimeout]);

  const renderAlumniCard = (a, isPending) => (
    <div key={a._id} className="border p-6 rounded-xl shadow-lg bg-white transform hover:scale-105 transition-transform duration-300 animate__animated animate__fadeIn">
      <img
        src={a.photo}
        alt={a.name}
        className="w-24 h-24 object-cover rounded-full mb-4 mx-auto"
        onError={(e) => (e.target.src = '/images/placeholder.png')}
      />
      <p className="text-gray-700"><strong>Name:</strong> {a.name}</p>
      <p className="text-gray-700"><strong>Class:</strong> {a.course}</p>
      <p className="text-gray-700"><strong>Batch:</strong> {a.batch}</p>
      <p className="text-gray-700"><strong>Profession:</strong> {a.profession || 'N/A'}</p>
      {expandedCards[a._id] && (
        <div className="mt-4">
          <p className="text-gray-700"><strong>Father's Name:</strong> {a.fathername}</p>
          <p className="text-gray-700"><strong>Email:</strong> {a.email}</p>
          <p className="text-gray-700"><strong>Phone:</strong> {a.phone}</p>
          <p className="text-gray-700"><strong>Address:</strong> {a.address}</p>
          <p className="text-gray-700">
            <strong>LinkedIn:</strong>{' '}
            {a.linkedin ? (
              <a href={a.linkedin} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                {a.linkedin}
              </a>
            ) : (
              'N/A'
            )}
          </p>
          <p className="text-gray-700"><strong>Organization:</strong> {a.organization || 'N/A'}</p>
          <p className="text-gray-700">
            <strong>Website:</strong>{' '}
            {a.website ? (
              <a href={a.website} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                {a.website}
              </a>
            ) : (
              'N/A'
            )}
          </p>
          <p className="text-gray-700"><strong>Skills:</strong> {a.skills?.length ? a.skills.join(', ') : 'None'}</p>
          {a.otherSkill && <p className="text-gray-700"><strong>Other Skill:</strong> {a.otherSkill}</p>}
          <p className="text-gray-700"><strong>Session Consent:</strong> {a.sessionConsent || 'N/A'}</p>
        </div>
      )}
      <div className="flex flex-col sm:flex-row gap-2 mt-4 justify-center sm:flex-wrap">
        <button
          onClick={() => toggleCardDetails(a._id)}
          className="bg-blue hover:bg-blue text-white py-1 px-4 rounded-lg transition-colors transform hover:scale-110 animate__animated animate__pulse animate__infinite"
        >
          {expandedCards[a._id] ? 'Hide Details' : 'See Full Details'}
        </button>
        {isPending && (
          <>
            <button
              onClick={() => approve(a._id)}
              className="bg-green-600 hover:bg-green-700 text-white py-1 px-4 rounded-lg transition-colors transform hover:scale-110 animate__animated animate__pulse animate__infinite"
            >
              Approve
            </button>
            <button
              onClick={() => deny(a._id)}
              className="bg-yellow-600 hover:bg-yellow-700 text-white py-1 px-4 rounded-lg transition-colors transform hover:scale-110 animate__animated animate__pulse animate__infinite"
            >
              Deny
            </button>
          </>
        )}
        <button
          onClick={() => remove(a._id)}
          className="bg-red-600 hover:bg-red-700 text-white py-1 px-4 rounded-lg transition-colors transform hover:scale-110 animate__animated animate__pulse animate__infinite"
        >
          Remove
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 flex flex-col md:flex-row">
      {/* Sidebar */}
      <div className="w-full md:w-64 bg-lightBlue p-4 flex flex-col justify-between animate__animated animate__slideInLeft shrink-0">
        <div>
          <h2 className="text-2xl font-bold text-black mb-6">Admin Dashboard</h2>
          <nav className="space-y-2">
            {[
              { id: 'pending', label: 'Pending Approvals', icon: '📝' },
              { id: 'approved', label: 'Approved Alumni', icon: '✅' },
              { id: 'denied', label: 'Denied Alumni', icon: '❌' },
              { id: 'faculty', label: 'Faculty', icon: '👨‍🏫' },
              { id: 'events', label: 'Events', icon: '🎉' },
              { id: 'notification', label: 'Notifications', icon: '🔔' },
              { id: 'bulkEmail', label: 'Send Bulk Email', icon: '📧' },
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveSection(item.id)}
                className={`w-full text-left px-4 py-2 rounded-lg flex items-center gap-2 transition-colors transform hover:scale-105 ${
                  activeSection === item.id
                    ? 'bg-blue text-white'
                    : 'bg-gray-700 text-gray-300 hover:bg-lightBlue'
                }`}
              >
                <span>{item.icon}</span>
                {item.label}
              </button>
            ))}
          </nav>
        </div>
        <button
          onClick={handleLogout}
          className="bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-lg transition-colors transform hover:scale-105 animate__animated animate__pulse animate__infinite"
        >
          Logout
        </button>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-8 overflow-auto animate__animated animate__fadeIn">
        <header className="bg-gray-800 rounded-xl shadow-lg pb-3 mb-3 mt-16 text-center animate__animated animate__bounceIn">
          <h1 className="text-3xl font-bold text-blue-400">
            Welcome Admin DCS Punjabi University, Patiala
          </h1>
        </header>

        {/* Error/Success Messages */}
        {error && (
          <p className="text-black bg-red-900 bg-opacity-50 p-4 rounded-lg mb-4 animate__animated animate__shakeX">{error}</p>
        )}
        {success && (
          <p className="text-white bg-green-900 bg-opacity-50 p-4 rounded-lg mb-4 animate__animated animate__shakeX">{success}</p>
        )}

        {/* Bulk Email Section */}
        {activeSection === 'bulkEmail' && (
          <section className="bg-gray-800 p-8 rounded-xl shadow-2xl animate__animated animate__fadeInUp">
            <h3 className="text-2xl font-semibold text-blue-400 mb-6">Send Bulk Email</h3>
            <p className="text-gray-300 mb-6">This will send an email to all approved alumni in the database as well as those listed in the aluminiData.json file.</p>
            
            <form onSubmit={handleBulkEmailSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Subject</label>
                <input
                  type="text"
                  value={bulkEmailSubject}
                  onChange={(e) => setBulkEmailSubject(e.target.value)}
                  className="mt-1 block w-full bg-gray-700 border-1.5 border-black rounded-lg text-black shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm p-3"
                  placeholder="Enter email subject"
                  required
                  disabled={isSendingBulkEmail}
                />
              </div>
              
              <div className="bg-white rounded-lg text-black overflow-hidden">
                <ReactQuill 
                  theme="snow" 
                  value={bulkEmailMessage} 
                  onChange={setBulkEmailMessage}
                  className="h-64 mb-12"
                  placeholder="Type your rich text message here... (Bold, Italics, Lists, etc.)"
                  readOnly={isSendingBulkEmail}
                  modules={{
                    toolbar: [
                      [{ 'header': [1, 2, 3, false] }],
                      ['bold', 'italic', 'underline', 'strike'],
                      [{'list': 'ordered'}, {'list': 'bullet'}],
                      ['link'],
                      ['clean']
                    ],
                  }}
                />
              </div>
              
              {/* Live Progress Bar */}
              {emailProgress && (
                <div className="bg-gray-800 border border-gray-700 rounded-lg p-6 mb-6 mt-6 shadow-lg animate__animated animate__fadeIn">
                  <div className="flex justify-between items-center mb-4">
                    <h4 className="text-lg font-semibold text-white flex items-center">
                      <span className="mr-2">
                        {emailProgress.status === 'completed' ? '✅' : emailProgress.status === 'cancelled' ? '🚫' : '🚀'}
                      </span>
                      Sending Bulk Email
                    </h4>
                    {isSendingBulkEmail && (
                      <button
                        type="button"
                        onClick={cancelBulkEmail}
                        className="bg-red-600 hover:bg-red-700 text-white text-sm font-semibold py-1 px-3 rounded-lg transition-colors"
                      >
                        Cancel
                      </button>
                    )}
                  </div>
                  <div className="flex justify-between text-sm text-gray-300 mb-2 font-medium">
                    <span className={emailProgress.sent > 0 ? "text-green-400 font-bold" : ""}>
                      {emailProgress.sent} Sent Successfully
                    </span>
                    <span>{emailProgress.total} Total Recipients</span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-4 mb-2 shadow-inner overflow-hidden flex">
                    <div 
                      className="bg-green-500 h-4 transition-all duration-500 ease-out" 
                      style={{ width: `${emailProgress.total > 0 ? (emailProgress.sent / emailProgress.total) * 100 : 0}%` }}
                    ></div>
                    <div 
                      className="bg-red-500 h-4 transition-all duration-500 ease-out" 
                      style={{ width: `${emailProgress.total > 0 ? (emailProgress.failed / emailProgress.total) * 100 : 0}%` }}
                    ></div>
                  </div>
                  <div className="flex justify-between text-xs mt-3">
                    <span className="text-gray-400">Status: <span className="text-blue-400 capitalize">{emailProgress.status}</span></span>
                    {emailProgress.failed > 0 && (
                      <span className="text-red-400 font-bold text-sm bg-red-900 bg-opacity-30 px-2 py-1 rounded">
                        {emailProgress.failed} Failed (Google rate limit)
                      </span>
                    )}
                  </div>
                </div>
              )}

              <button
                type="submit"
                className={`w-full bg-blue hover:bg-blue text-white font-semibold rounded-lg py-3 px-4 transition-colors transform ${
                  isSendingBulkEmail || !bulkEmailSubject.trim() || !bulkEmailMessage.trim() ? 'opacity-50 cursor-not-allowed' : 'animate__animated animate__pulse animate__infinite'
                }`}
                disabled={isSendingBulkEmail || !bulkEmailSubject.trim() || !bulkEmailMessage.trim()}
              >
                {isSendingBulkEmail ? 'Broadcasting...' : 'Send Bulk Email to All Alumni'}
              </button>
            </form>
          </section>
        )}

        {/* Notification Section */}
        {activeSection === 'notification' && (
          <section className="bg-gray-800 p-8 rounded-xl shadow-2xl animate__animated animate__fadeInUp">
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
                  className={`flex-1 bg-blue text-white font-semibold rounded-lg py-3 px-4 transition-colors transform hover:scale-105 animate__animated animate__pulse animate__infinite ${
                    isUploading ? 'opacity-50 cursor-not-allowed' : 'opacity-100'
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
                  {getPaginatedData(notifications, 'notification').map((notification) => (
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
                {renderPagination('notification', notifications.length)}
              </>
            )}
          </section>
        )}

        {/* Faculty Section */}
        {activeSection === 'faculty' && (
          <section className="bg-gray-800 p-8 rounded-xl shadow-2xl animate__animated animate__fadeInUp">
            <h3 className="text-2xl font-semibold text-blue mb-6">
              {editingFaculty ? 'Edit Faculty' : 'Manage Faculty'}
            </h3>
            <form onSubmit={handleFacultySubmit} className="space-y-6 mb-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300">Name</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="mt-1 block w-full border-1.5 border-black rounded-lg text-black shadow-sm focus:ring-blue-500 focus:border-blue sm:text-sm"
                    required
                    disabled={isUploading}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300">Title</label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    className="mt-1 block w-full bg-gray-700 border-1.5 border-black rounded-lg text-black shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    disabled={isUploading}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300">Department</label>
                  <input
                    type="text"
                    name="department"
                    value={formData.department}
                    onChange={handleInputChange}
                    className="mt-1 block w-full bg-gray-700 border-1.5 border-black rounded-lg text-black shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    disabled={isUploading}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="mt-1 block w-full bg-gray-700 border-1.5 border-black rounded-lg text-black shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    disabled={isUploading}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300">Phone</label>
                  <input
                    type="text"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="mt-1 block w-full bg-gray-700 border-1.5 border-black rounded-lg text-black shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    disabled={isUploading}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300">Expertise (comma-separated)</label>
                  <input
                    type="text"
                    name="expertise"
                    value={formData.expertise}
                    onChange={handleInputChange}
                    className="mt-1 block w-full bg-gray-700 border-1.5 border-black rounded-lg text-black shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    placeholder="e.g., JavaScript, Python"
                    disabled={isUploading}
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-300">Bio</label>
                  <textarea
                    name="bio"
                    value={formData.bio}
                    onChange={handleInputChange}
                    className="mt-1 block w-full bg-gray-700 border-1.5 border-black rounded-lg text-black shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    rows="4"
                    disabled={isUploading}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300">Designation</label>
                  <input
                    type="text"
                    name="Designation"
                    value={formData.Designation}
                    onChange={handleInputChange}
                    className="mt-1 block w-full bg-gray-700 border-1.5 border-black rounded-lg text-black shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    disabled={isUploading}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300">Image</label>
                  <input
                    type="file"
                    accept="image/jpeg,image/png"
                    onChange={handleImageChange}
                    className="mt-1 block w-full text-gray-300 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-1.5 file:border-black file:text-sm file:font-semibold file:bg-blue file:text-white hover:file:bg-lightBlue"
                    disabled={isUploading}
                  />
                </div>
              </div>
              <div className="flex gap-4">
                <button
                  type="submit"
                  className={`flex-1 bg-blue hover:bg-lightBlue text-white font-semibold rounded-lg py-3 px-4 transition-colors transform hover:scale-105 animate__animated animate__pulse animate__infinite ${
                    isUploading ? 'opacity-50 cursor-not-allowed' : 'opacity-100'
                  }`}
                  disabled={isUploading}
                >
                  {isUploading ? 'Processing...' : editingFaculty ? 'Update Faculty' : 'Add Faculty'}
                </button>
                {editingFaculty && (
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

            <h3 className="text-2xl font-semibold text-blue mb-6">Faculty List</h3>
            {faculty.length === 0 ? (
              <p className="text-gray">No faculty members available.</p>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {getPaginatedData(faculty, 'faculty').map((f) => (
                    <div
                      key={f._id}
                      className="flex justify-between items-center border p-4 rounded-lg shadow-md bg-gray-700 animate__animated animate__fadeIn"
                    >
                      <div>
                        <h4 className="text-lg font-medium text-blue">{f.name}</h4>
                        <p className="text-sm text-gray-300">{f.Designation}</p>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEditFaculty(f)}
                          className="bg-blue hover:bg-blue text-white py-1 px-4 rounded-lg transition-colors transform hover:scale-110 animate__animated animate__pulse animate__infinite"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => deleteFaculty(f._id)}
                          className="bg-red-600 hover:bg-red-700 text-white py-1 px-4 rounded-lg transition-colors transform hover:scale-110 animate__animated animate__pulse animate__infinite"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
                {renderPagination('faculty', faculty.length)}
              </>
            )}
          </section>
        )}

        {/* Events Section */}
        {activeSection === 'events' && (
          <section className="bg-gray-800 p-8 rounded-xl shadow-2xl animate__animated animate__fadeInUp">
            <h3 className="text-2xl font-semibold text-blue-400 mb-6">Upload Event</h3>
            <form onSubmit={handleEventSubmit} className="space-y-6 mb-8">
              <div>
                <label className="block text-sm font-medium text-gray-300">Title</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  className="mt-1 block w-full border-1.5 border-black rounded-lg text-black shadow-md focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
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
                <label className="block text-sm font-medium text-gray-300">Position</label>
                <select
                  name="position"
                  value={formData.position}
                  onChange={handleInputChange}
                  className="mt-1 block w-full bg-gray-700 border-1.5 border-black rounded-lg text-black shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  disabled={isUploading}
                >
                  <option value="right">Right</option>
                  <option value="left">Left</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300">Background Color (Tailwind class)</label>
                <input
                  type="text"
                  name="bgColor"
                  value={formData.bgColor}
                  onChange={handleInputChange}
                  className="mt-1 block w-full bg-gray-700 border-1.5 border-black rounded-lg text-black shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="e.g., bg-white"
                  disabled={isUploading}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300">Text Color (Hex)</label>
                <input
                  type="text"
                  name="textColor"
                  value={formData.textColor}
                  onChange={handleInputChange}
                  className="mt-1 block w-full bg-gray-700 border-1.5 border-black rounded-lg text-black shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="e.g., #374151"
                  disabled={isUploading}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300">Upload Images (up to 5, JPEG/PNG)</label>
                <input
                  type="file"
                  accept="image/jpeg,image/png"
                  multiple
                  onChange={handleFileChange}
                  className="mt-1 block w-full text-gray-300 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-1.5 file:border-black file:text-sm file:font-semibold file:bg-blue file:text-white hover:file:bg-lightBlue"
                  required
                  disabled={isUploading}
                />
              </div>
              <button
                type="submit"
                className={`w-full bg-blue hover:bg-lightBlue text-white font-semibold rounded-lg py-3 px-4 transition-colors transform hover:scale-105 animate__animated animate__pulse animate__infinite ${
                  isUploading ? 'opacity-50 cursor-not-allowed' : 'opacity-100'
                }`}
                disabled={isUploading}
              >
                {isUploading ? 'Uploading...' : 'Upload Event'}
              </button>
            </form>

            <h3 className="text-2xl font-semibold text-blue mb-6">Manage Events</h3>
            {events.length === 0 ? (
              <p className="text-gray">No events available.</p>
            ) : (
              <>
                <div className="space-y-4">
                  {getPaginatedData(events, 'events').map((event) => (
                    <div key={event._id} className="border p-4 rounded-lg shadow-md bg-gray-700 animate__animated animate__fadeIn">
                      <h4 className="text-lg font-medium text-blue">{event.title}</h4>
                      <p className="text-gray-300">{event.description}</p>
                      <p className="text-sm text-gray-400 mt-1">
                        Position: {event.position}
                      </p>
                      <p className="text-sm text-gray-400">
                        Background Color: {event.bgColor}
                      </p>
                      <p className="text-sm text-gray">
                        Text Color: {event.textColor}
                      </p>
                      <p className="text-sm text-gray">
                        Posted on: {new Date(event.createdAt).toLocaleDateString()}
                      </p>
                      {event.images?.length > 0 && (
                        <div className="flex flex-wrap gap-2 mt-2">
                          {event.images.map((image, index) => (
                            <a
                              key={index}
                              href={image.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-400 hover:underline"
                            >
                              <img
                                src={image.url}
                                alt={`Event ${event.title} ${index + 1}`}
                                className="w-24 h-24 object-cover rounded-md"
                                onError={(e) => (e.target.src = '/images/placeholder.png')}
                              />
                            </a>
                          ))}
                        </div>
                      )}
                      <button
                        onClick={() =>
                          deleteEvent(
                            event._id,
                            event.images?.map((img) => img.publicId) || []
                          )
                        }
                        className="mt-2 bg-red-600 hover:bg-red-700 text-white py-1 px-4 rounded-lg transition-colors transform hover:scale-110 animate__animated animate__pulse animate__infinite"
                      >
                        Delete
                      </button>
                    </div>
                  ))}
                </div>
                {renderPagination('events', events.length)}
              </>
            )}
          </section>
        )}

        {/* Pending Approvals */}
        {activeSection === 'pending' && (
          <section className="bg-LightSteelBlue p-8 rounded-xl shadow-2xl animate__animated animate__fadeInUp">
            <div className="mb-8 p-6 bg-white rounded-lg shadow-md">
              <h4 className="text-xl font-bold text-gray-800 mb-4">Bulk Import Alumni via Excel</h4>
              <form onSubmit={handleExcelUpload} className="flex flex-col md:flex-row items-center gap-4 flex-wrap">
                <input
                  type="file"
                  accept=".xlsx, .xls, .csv"
                  onChange={handleExcelFileChange}
                  className="block w-full md:w-auto text-gray-700 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-600 file:text-white hover:file:bg-blue-700"
                  disabled={isUploading}
                />
                <select
                  value={excelCourse}
                  onChange={(e) => setExcelCourse(e.target.value)}
                  className="w-full md:w-auto px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-blue focus:border-blue"
                  disabled={isUploading}
                  required
                >
                  <option value="" disabled>Select Course</option>
                  <option value="MCA">MCA</option>
                  <option value="PhD">PhD</option>
                  <option value="B.Tech">B.Tech</option>
                  <option value="M.Tech">M.Tech</option>
                </select>
                <input
                  type="text"
                  placeholder="Enter Batch (e.g. 2023-2025)"
                  value={excelBatch}
                  onChange={(e) => setExcelBatch(e.target.value)}
                  className="w-full md:w-auto px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-blue focus:border-blue"
                  disabled={isUploading}
                  required
                />
                <button
                  type="submit"
                  className={`px-6 py-2 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition-colors ${
                    isUploading ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                  disabled={isUploading || !excelFile}
                >
                  {isUploading ? 'Uploading...' : 'Upload Excel'}
                </button>
              </form>
            </div>

            <h3 className="text-2xl font-semibold text-blue mb-6">Pending Approvals</h3>
            {pending.length === 0 ? (
              <p className="text-gray">No pending requests.</p>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {getPaginatedData(pending, 'pending').map((a) => renderAlumniCard(a, true))}
                </div>
                {renderPagination('pending', pending.length)}
              </>
            )}
          </section>
        )}

        {/* Approved Alumni */}
        {activeSection === 'approved' && (
          <section className="bg-LightSteelBlue p-8 rounded-xl shadow-2xl animate__animated animate__fadeInUp">
            <h3 className="text-2xl font-semibold text-blue mb-6">Approved Alumni</h3>
            {approved.length === 0 ? (
              <p className="text-gray">No approved alumni yet.</p>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {getPaginatedData(approved, 'approved').map((a) => renderAlumniCard(a, false))}
                </div>
                {renderPagination('approved', approved.length)}
              </>
            )}
          </section>
        )}

        {/* Denied Alumni */}
        {activeSection === 'denied' && (
          <section className="bg-LightSteelBlue p-8 rounded-xl shadow-2xl animate__animated animate__fadeInUp">
            <h3 className="text-2xl font-semibold text-blue mb-6">Denied Alumni</h3>
            {denied.length === 0 ? (
              <p className="text-gray">No denied alumni yet.</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {denied.map((a) => renderAlumniCard(a, false))}
              </div>
            )}
          </section>
        )}
      </div>
    </div>
  );
}