import React, { useEffect, useState } from 'react';
import API from '../../api/api';
import {
  CalendarDays,
  Upload,
  AlertCircle,
  CheckCircle2,
  Trash2,
  Edit3,
  X,
  Plus,
  Image as ImageIcon,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';

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
  const itemsPerPage = 4;

  // Edit State
  const [editingEvent, setEditingEvent] = useState(null);
  const [editFormData, setEditFormData] = useState({
    title: '',
    description: '',
    position: 'right',
    newFiles: [],
    removedPublicIds: [],
  });
  const [isUpdating, setIsUpdating] = useState(false);

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
      const token = localStorage.getItem('token');
      await API.delete(`/events/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
        data: { publicIds: publicIds || [] },
      });
      setSuccess('Event deleted successfully!');
      fetchEvents();
    } catch (err) {
      console.error('Error deleting event:', err);
      setError(err.response?.data?.error || 'Failed to delete event.');
    }
  };

  // Open Edit Modal
  const startEditEvent = (event) => {
    setEditingEvent(event);
    setEditFormData({
      title: event.title || '',
      description: event.description || '',
      position: event.position || 'right',
      newFiles: [],
      removedPublicIds: [],
    });
  };

  // Toggle mark existing image for removal
  const toggleRemoveExistingImage = (publicId) => {
    setEditFormData((prev) => {
      const isAlreadyMarked = prev.removedPublicIds.includes(publicId);
      return {
        ...prev,
        removedPublicIds: isAlreadyMarked
          ? prev.removedPublicIds.filter((p) => p !== publicId)
          : [...prev.removedPublicIds, publicId],
      };
    });
  };

  // Handle new images in edit mode
  const handleEditFilesChange = (e) => {
    const selected = Array.from(e.target.files);
    if (selected.length > 5) {
      alert('You can add up to 5 new images at a time.');
      return;
    }
    setEditFormData((prev) => ({ ...prev, newFiles: selected }));
  };

  // Submit Event Edits (PUT /api/events/:id)
  const handleEditSubmit = async (e) => {
    e.preventDefault();
    if (!editingEvent) return;
    setIsUpdating(true);

    try {
      const token = localStorage.getItem('token');
      const data = new FormData();
      data.append('title', editFormData.title);
      data.append('description', editFormData.description);
      data.append('position', editFormData.position);
      data.append('removedPublicIds', JSON.stringify(editFormData.removedPublicIds));

      // Append newly added images
      editFormData.newFiles.forEach((file) => {
        data.append('images', file);
      });

      const response = await API.put(`/events/${editingEvent._id}`, data, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });

      setSuccess(`Event "${response.data.title}" updated successfully!`);
      setEditingEvent(null);
      fetchEvents();
    } catch (err) {
      console.error('Error updating event:', err);
      setError(err.response?.data?.error || 'Failed to update event.');
    } finally {
      setIsUpdating(false);
    }
  };

  const getPaginatedData = () => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return events.slice(startIndex, startIndex + itemsPerPage);
  };

  const totalPages = Math.ceil(events.length / itemsPerPage);

  const renderPagination = () => {
    if (totalPages <= 1) return null;
    return (
      <div className="flex justify-center items-center gap-2 mt-6">
        <button
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
          className="p-2 rounded-lg border border-slate-200 dark:border-slate-700 disabled:opacity-40 hover:bg-slate-100 dark:hover:bg-slate-800 transition text-slate-700 dark:text-slate-300"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
        <span className="text-xs font-semibold text-slate-600 dark:text-slate-400">
          Page {currentPage} of {totalPages}
        </span>
        <button
          onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
          disabled={currentPage === totalPages}
          className="p-2 rounded-lg border border-slate-200 dark:border-slate-700 disabled:opacity-40 hover:bg-slate-100 dark:hover:bg-slate-800 transition text-slate-700 dark:text-slate-300"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    );
  };

  return (
    <section className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-sm">
      <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-100 dark:border-slate-800">
        <div className="w-10 h-10 rounded-2xl bg-blue/10 dark:bg-sky-500/10 text-blue dark:text-sky-400 flex items-center justify-center">
          <CalendarDays className="w-5 h-5" />
        </div>
        <div>
          <h3 className="text-xl font-bold font-mons text-slate-900 dark:text-white">
            Events & Timeline Management
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
            Publish new campus events or edit existing titles, descriptions, and photographs.
          </p>
        </div>
      </div>

      {/* Status Messages */}
      {error && (
        <div className="mb-6 p-4 rounded-2xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 text-xs sm:text-sm flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}
      {success && (
        <div className="mb-6 p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 text-xs sm:text-sm flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{success}</span>
        </div>
      )}

      {/* Add New Event Form */}
      <form onSubmit={handleEventSubmit} className="space-y-4 mb-10">
        <h4 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Plus className="w-4 h-4 text-blue dark:text-sky-400" />
          <span>Post New Event</span>
        </h4>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
              Event Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm focus:outline-none focus:ring-2 focus:ring-blue dark:focus:ring-sky-400"
              placeholder="e.g., Annual Function & Farewell 2025"
              required
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
              Description & Highlights <span className="text-red-500">*</span>
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              rows={3}
              className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm focus:outline-none focus:ring-2 focus:ring-blue dark:focus:ring-sky-400"
              placeholder="Provide a detailed narrative of the event..."
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
              Timeline Position
            </label>
            <select
              name="position"
              value={formData.position}
              onChange={handleInputChange}
              className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm"
            >
              <option value="right">Right Side</option>
              <option value="left">Left Side</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
              Photographs (Up to 5 images, max 5MB each) <span className="text-red-500">*</span>
            </label>
            <input
              type="file"
              accept="image/jpeg,image/png"
              multiple
              onChange={handleFileChange}
              className="w-full text-xs text-slate-600 dark:text-slate-300 file:mr-3 file:py-1.5 file:px-3 file:rounded-xl file:border-0 file:bg-blue file:text-white file:font-semibold"
              required
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={isUploading}
          className="px-6 py-2.5 rounded-xl bg-darkBlue dark:bg-sky-500 text-white dark:text-slate-950 font-bold text-sm shadow-md hover:opacity-90 disabled:opacity-50 transition-all flex items-center gap-2"
        >
          <Upload className="w-4 h-4" />
          <span>{isUploading ? 'Uploading Event...' : 'Publish Event'}</span>
        </button>
      </form>

      {/* Published Events List with Edit & Delete */}
      <div className="border-t border-slate-200/80 dark:border-slate-800 pt-6">
        <h4 className="text-base font-bold text-slate-900 dark:text-white mb-4">
          Published Events ({events.length})
        </h4>

        {events.length === 0 ? (
          <p className="text-slate-400 text-sm">No events available in database.</p>
        ) : (
          <div className="space-y-4">
            {getPaginatedData().map((event) => (
              <div
                key={event._id}
                className="p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/50 hover:border-slate-300 dark:hover:border-slate-700 transition space-y-3"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <h5 className="text-base font-bold font-mons text-slate-900 dark:text-white">
                    {event.title}
                  </h5>
                  <span className="text-xs px-2.5 py-0.5 rounded-full bg-blue/10 text-blue dark:text-sky-300 font-semibold self-start sm:self-auto">
                    {new Date(event.createdAt).toLocaleDateString()} • {event.position}
                  </span>
                </div>

                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                  {event.description}
                </p>

                {/* Thumbnails */}
                {event.images && event.images.length > 0 && (
                  <div className="flex flex-wrap gap-2 pt-1">
                    {event.images.map((img, idx) => (
                      <div
                        key={idx}
                        className="w-16 h-16 rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-900"
                      >
                        <img
                          src={img.url || img}
                          alt="Thumbnail"
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ))}
                    <div className="flex items-center text-xs text-slate-400 font-semibold pl-1">
                      {event.images.length} {event.images.length === 1 ? 'photo' : 'photos'}
                    </div>
                  </div>
                )}

                {/* Card Action Buttons: EDIT & DELETE */}
                <div className="pt-2 border-t border-slate-200/60 dark:border-slate-700/60 flex items-center justify-end gap-2">
                  <button
                    onClick={() => startEditEvent(event)}
                    className="px-3.5 py-1.5 rounded-xl bg-blue/10 dark:bg-sky-400/10 text-blue dark:text-sky-300 hover:bg-blue/20 font-semibold text-xs transition flex items-center gap-1.5"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    <span>Edit Text & Images</span>
                  </button>

                  <button
                    onClick={() =>
                      deleteEvent(
                        event._id,
                        event.images?.map((img) => img.publicId) || []
                      )
                    }
                    className="px-3.5 py-1.5 rounded-xl bg-red-50 dark:bg-red-950/40 text-red-600 dark:text-red-400 hover:bg-red-100 font-semibold text-xs transition flex items-center gap-1.5"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Delete</span>
                  </button>
                </div>
              </div>
            ))}
            {renderPagination()}
          </div>
        )}
      </div>

      {/* EDIT EVENT MODAL */}
      {editingEvent && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fadeIn"
          onClick={() => setEditingEvent(null)}
        >
          <div
            className="w-full max-w-2xl bg-white dark:bg-slate-900 rounded-3xl overflow-hidden shadow-2xl border border-slate-200 dark:border-slate-800 max-h-[90vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-darkBlue via-[#00385c] to-indigo-900 p-6 text-white flex items-center justify-between">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-sky-300">
                  Administrative Editor
                </span>
                <h3 className="text-xl font-bold font-mons">Edit Event & Add Images</h3>
              </div>
              <button
                onClick={() => setEditingEvent(null)}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleEditSubmit} className="p-6 overflow-y-auto space-y-5">
              <div>
                <label className="block text-xs font-bold uppercase text-slate-700 dark:text-slate-300 mb-1">
                  Event Title
                </label>
                <input
                  type="text"
                  value={editFormData.title}
                  onChange={(e) =>
                    setEditFormData({ ...editFormData, title: e.target.value })
                  }
                  required
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm focus:outline-none focus:ring-2 focus:ring-blue dark:focus:ring-sky-400"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-700 dark:text-slate-300 mb-1">
                  Description & Narrative
                </label>
                <textarea
                  value={editFormData.description}
                  onChange={(e) =>
                    setEditFormData({ ...editFormData, description: e.target.value })
                  }
                  required
                  rows={4}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm focus:outline-none focus:ring-2 focus:ring-blue dark:focus:ring-sky-400"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-700 dark:text-slate-300 mb-1">
                  Timeline Alignment
                </label>
                <select
                  value={editFormData.position}
                  onChange={(e) =>
                    setEditFormData({ ...editFormData, position: e.target.value })
                  }
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm"
                >
                  <option value="right">Right Side</option>
                  <option value="left">Left Side</option>
                </select>
              </div>

              {/* Existing Images Gallery with Remove Option */}
              {editingEvent.images && editingEvent.images.length > 0 && (
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-700 dark:text-slate-300 mb-2">
                    Current Event Images (Click 'Remove' to delete any image on save)
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {editingEvent.images.map((img, i) => {
                      const isMarked = editFormData.removedPublicIds.includes(img.publicId);
                      return (
                        <div
                          key={i}
                          className={`relative rounded-xl overflow-hidden border transition-all ${
                            isMarked
                              ? 'border-red-500 opacity-40 scale-95'
                              : 'border-slate-200 dark:border-slate-700'
                          }`}
                        >
                          <img
                            src={img.url || img}
                            alt="Event"
                            className="w-full h-24 object-cover"
                          />
                          <button
                            type="button"
                            onClick={() => toggleRemoveExistingImage(img.publicId)}
                            className={`absolute bottom-1 right-1 px-2 py-0.5 rounded-lg text-[10px] font-bold ${
                              isMarked
                                ? 'bg-slate-800 text-white'
                                : 'bg-red-600 text-white hover:bg-red-700'
                            }`}
                          >
                            {isMarked ? 'Undo' : 'Remove'}
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Upload New Additional Images */}
              <div>
                <label className="block text-xs font-bold uppercase text-slate-700 dark:text-slate-300 mb-1 flex items-center gap-1.5">
                  <ImageIcon className="w-4 h-4 text-blue dark:text-sky-400" />
                  <span>Add New Images (Appends to event gallery)</span>
                </label>
                <input
                  type="file"
                  multiple
                  accept="image/jpeg,image/png"
                  onChange={handleEditFilesChange}
                  className="w-full text-xs text-slate-600 dark:text-slate-300 file:mr-3 file:py-1.5 file:px-3 file:rounded-xl file:border-0 file:bg-blue file:text-white file:font-semibold"
                />
                <p className="text-[11px] text-slate-400 mt-1">
                  Selected images will be uploaded to Cloudinary and added to this event.
                </p>
              </div>

              {/* Modal Actions */}
              <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setEditingEvent(null)}
                  className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-semibold hover:bg-slate-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isUpdating}
                  className="px-6 py-2 rounded-xl bg-darkBlue dark:bg-sky-500 text-white dark:text-slate-950 text-xs font-bold shadow-md hover:opacity-90 disabled:opacity-50 transition-all"
                >
                  {isUpdating ? 'Saving Changes...' : 'Save & Update Event'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
};

export default AdminEvents;
