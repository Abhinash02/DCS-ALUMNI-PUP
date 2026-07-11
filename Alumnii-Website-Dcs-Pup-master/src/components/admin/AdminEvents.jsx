import React, { useEffect, useState } from 'react';
import API from '../../api/api';

const AdminEvents = () => {
  const [events, setEvents] = useState([]);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    position: 'right',
    bgColor: 'bg-white',
    textColor: '#374151',
    files: [],
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 2;

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

  useEffect(() => {
    fetchEvents();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
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

  const getPaginatedData = () => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return events.slice(startIndex, endIndex);
  };

  const renderPagination = () => {
    const totalPages = Math.ceil(events.length / itemsPerPage);
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
          className={`w-full bg-blue hover:bg-lightBlue text-white font-semibold rounded-lg py-3 px-4 transition-colors transform hover:scale-105 animate__animated animate__pulse animate__infinite ${isUploading ? 'opacity-50 cursor-not-allowed' : 'opacity-100'
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
            {getPaginatedData().map((event) => (
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
          {renderPagination()}
        </>
      )}
    </section>
  );
};

export default AdminEvents;
