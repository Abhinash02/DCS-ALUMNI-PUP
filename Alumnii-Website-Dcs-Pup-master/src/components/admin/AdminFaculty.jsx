import React, { useEffect, useState } from 'react';
import API from '../../api/api';
import { GraduationCap, UserCheck, AlertCircle, CheckCircle2 } from 'lucide-react';

const AdminFaculty = () => {
  const [faculty, setFaculty] = useState([]);
  const [editingFaculty, setEditingFaculty] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    title: '',
    department: '',
    email: '',
    phone: '',
    expertise: '',
    bio: '',
    Designation: '',
  });
  const [image, setImage] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

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

  useEffect(() => {
    fetchFaculty();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
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
      const url = editingFaculty ? `/faculty/${editingFaculty._id}` : '/faculty';
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

  const handleEditFaculty = (facultyItem) => {
    setEditingFaculty(facultyItem);
    setFormData({
      name: facultyItem.name,
      title: facultyItem.title || '',
      department: facultyItem.department || '',
      email: facultyItem.email || '',
      phone: facultyItem.phone || '',
      expertise: facultyItem.expertise?.join(', ') || '',
      bio: facultyItem.bio || '',
      Designation: facultyItem.Designation || '',
    });
    setImage(null);
  };

  const handleCancelEdit = () => {
    setEditingFaculty(null);
    setFormData({
      name: '',
      title: '',
      department: '',
      email: '',
      phone: '',
      expertise: '',
      bio: '',
      Designation: '',
    });
    setImage(null);
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

  const getPaginatedData = () => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return faculty.slice(startIndex, endIndex);
  };

  const renderPagination = () => {
    const totalPages = Math.ceil(faculty.length / itemsPerPage);
    const pages = [];
    for (let i = 1; i <= totalPages; i++) {
      pages.push(i);
    }

    return (
      <div className="flex justify-center gap-2 mt-6">
        <button
          onClick={() => setCurrentPage(currentPage - 1)}
          disabled={currentPage === 1}
          className="px-4 py-2 bg-blue text-white rounded-xl disabled:opacity-50 text-sm font-semibold transition"
        >
          Previous
        </button>
        {pages.map((page) => (
          <button
            key={page}
            onClick={() => setCurrentPage(page)}
            className={`px-4 py-2 rounded-xl text-sm font-semibold transition ${
              currentPage === page ? 'bg-blue text-white shadow' : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-gray-300 hover:bg-slate-200'
            }`}
          >
            {page}
          </button>
        ))}
        <button
          onClick={() => setCurrentPage(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="px-4 py-2 bg-blue text-white rounded-xl disabled:opacity-50 text-sm font-semibold transition"
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

      {/* Form Header */}
      <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-100 dark:border-slate-700">
        <div className="p-2.5 bg-blue-50 dark:bg-blue-500/20 rounded-xl text-blue-700 dark:text-blue-300">
          <GraduationCap className="w-6 h-6" />
        </div>
        <div>
          <h3 className="text-xl md:text-2xl font-bold text-slate-900 dark:text-white">
            {editingFaculty ? 'Edit Faculty Member' : 'Manage Faculty'}
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Add or update academic staff records for Punjabi University Patiala DCS</p>
        </div>
      </div>

      <form onSubmit={handleFacultySubmit} className="space-y-5 mb-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
              Full Name <span className="text-red-500 font-bold ml-1">*</span>
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-300 dark:border-slate-600 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:bg-white dark:focus:bg-slate-900 focus:border-blue-600 focus:ring-2 focus:ring-blue-500/20 outline-none transition duration-200 text-sm shadow-sm"
              placeholder="e.g., Dr. Gurpreet Singh"
              required
              disabled={isUploading}
            />
          </div>
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
              Title
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-300 dark:border-slate-600 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:bg-white dark:focus:bg-slate-900 focus:border-blue-600 focus:ring-2 focus:ring-blue-500/20 outline-none transition duration-200 text-sm shadow-sm"
              placeholder="e.g., Professor & Head"
              disabled={isUploading}
            />
          </div>
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
              Department
            </label>
            <input
              type="text"
              name="department"
              value={formData.department}
              onChange={handleInputChange}
              className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-300 dark:border-slate-600 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:bg-white dark:focus:bg-slate-900 focus:border-blue-600 focus:ring-2 focus:ring-blue-500/20 outline-none transition duration-200 text-sm shadow-sm"
              placeholder="e.g., Department of Computer Science"
              disabled={isUploading}
            />
          </div>
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
              Email Address
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-300 dark:border-slate-600 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:bg-white dark:focus:bg-slate-900 focus:border-blue-600 focus:ring-2 focus:ring-blue-500/20 outline-none transition duration-200 text-sm shadow-sm"
              placeholder="e.g., faculty@pbi.ac.in"
              disabled={isUploading}
            />
          </div>
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
              Phone Number
            </label>
            <input
              type="text"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-300 dark:border-slate-600 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:bg-white dark:focus:bg-slate-900 focus:border-blue-600 focus:ring-2 focus:ring-blue-500/20 outline-none transition duration-200 text-sm shadow-sm"
              placeholder="e.g., +91 98765 43210"
              disabled={isUploading}
            />
          </div>
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
              Academic Designation
            </label>
            <input
              type="text"
              name="Designation"
              value={formData.Designation}
              onChange={handleInputChange}
              className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-300 dark:border-slate-600 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:bg-white dark:focus:bg-slate-900 focus:border-blue-600 focus:ring-2 focus:ring-blue-500/20 outline-none transition duration-200 text-sm shadow-sm"
              placeholder="e.g., Professor, Assistant Professor, Technical Assistance"
              disabled={isUploading}
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
              Areas of Expertise (comma-separated)
            </label>
            <input
              type="text"
              name="expertise"
              value={formData.expertise}
              onChange={handleInputChange}
              className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-300 dark:border-slate-600 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:bg-white dark:focus:bg-slate-900 focus:border-blue-600 focus:ring-2 focus:ring-blue-500/20 outline-none transition duration-200 text-sm shadow-sm"
              placeholder="e.g., Machine Learning, Cloud Computing, Cyber Security"
              disabled={isUploading}
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
              Biography / Academic Profile
            </label>
            <textarea
              name="bio"
              value={formData.bio}
              onChange={handleInputChange}
              className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-300 dark:border-slate-600 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:bg-white dark:focus:bg-slate-900 focus:border-blue-600 focus:ring-2 focus:ring-blue-500/20 outline-none transition duration-200 text-sm shadow-sm"
              rows="3"
              placeholder="Enter faculty background, research interests, and publications..."
              disabled={isUploading}
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
              Profile Photograph (JPEG, PNG under 5MB)
            </label>
            <input
              type="file"
              accept="image/jpeg,image/png"
              onChange={handleImageChange}
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
            <UserCheck className="w-4 h-4" />
            <span>{isUploading ? 'Saving...' : editingFaculty ? 'Update Faculty Member' : 'Add Faculty Member'}</span>
          </button>
          {editingFaculty && (
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

      {/* Faculty Directory List */}
      <div className="border-t border-slate-100 dark:border-slate-700 pt-6">
        <h4 className="text-lg font-bold text-slate-900 dark:text-white mb-4">
          Faculty Directory ({faculty.length})
        </h4>
        {faculty.length === 0 ? (
          <p className="text-slate-400 text-sm">No faculty members available in database.</p>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {getPaginatedData().map((f) => (
                <div
                  key={f._id}
                  className="flex justify-between items-center border border-slate-200 dark:border-slate-700 p-4 rounded-xl shadow-sm bg-slate-50 dark:bg-slate-900/60 hover:border-blue-300 transition duration-200"
                >
                  <div className="min-w-0 mr-3">
                    <h5 className="text-sm font-bold text-slate-900 dark:text-white truncate">{f.name}</h5>
                    <p className="text-xs text-slate-500 dark:text-slate-400 font-medium truncate">{f.Designation || 'Academic Staff'}</p>
                    {f.email && <p className="text-[11px] text-blue-600 dark:text-sky-300 truncate">{f.email}</p>}
                  </div>
                  <div className="flex gap-2 shrink-0">
                    <button
                      onClick={() => handleEditFaculty(f)}
                      className="px-3 py-1.5 rounded-lg bg-blue-50 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 hover:bg-blue-100 font-semibold text-xs border border-blue-200 dark:border-blue-800 transition"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => deleteFaculty(f._id)}
                      className="px-3 py-1.5 rounded-lg bg-red-50 dark:bg-red-950/40 text-red-600 dark:text-red-400 hover:bg-red-100 font-semibold text-xs border border-red-200 dark:border-red-800 transition"
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
      </div>
    </section>
  );
};

export default AdminFaculty;
