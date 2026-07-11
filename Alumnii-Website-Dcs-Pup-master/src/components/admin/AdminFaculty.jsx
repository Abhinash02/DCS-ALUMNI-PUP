import React, { useEffect, useState } from 'react';
import API from '../../api/api';

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
            className={`flex-1 bg-blue hover:bg-lightBlue text-white font-semibold rounded-lg py-3 px-4 transition-colors transform hover:scale-105 animate__animated animate__pulse animate__infinite ${isUploading ? 'opacity-50 cursor-not-allowed' : 'opacity-100'
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
            {getPaginatedData().map((f) => (
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
          {renderPagination()}
        </>
      )}
    </section>
  );
};

export default AdminFaculty;
