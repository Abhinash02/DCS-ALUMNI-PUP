import React, { useEffect, useState } from 'react';
import API from '../../api/api';

const AdminPending = () => {
  const [pending, setPending] = useState([]);
  const [excelFile, setExcelFile] = useState(null);
  const [excelCourse, setExcelCourse] = useState('');
  const [excelBatch, setExcelBatch] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [expandedCards, setExpandedCards] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

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

  useEffect(() => {
    fetchPending();
  }, []);

  const approve = async (id) => {
    try {
      await API.put(
        `/alumni/approve/${id}`,
        {},
        {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        }
      );
      setSuccess('Alumni approved successfully.');
      setError('');
      fetchPending();
    } catch (err) {
      console.error('Error approving:', err);
      setError('Failed to approve alumni.');
      setSuccess('');
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
    } catch (err) {
      console.error('Error denying:', err);
      setError('Failed to deny alumni.');
      setSuccess('');
    }
  };

  const remove = async (id) => {
    if (!window.confirm('Are you sure you want to delete this alumni?')) return;
    try {
      await API.delete(`/alumni/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      setSuccess('Alumni removed successfully.');
      setError('');
      fetchPending();
    } catch (err) {
      console.error('Error deleting:', err);
      setError('Failed to delete alumni.');
      setSuccess('');
    }
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

  const toggleCardDetails = (id) => {
    setExpandedCards((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const getPaginatedData = () => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return pending.slice(startIndex, endIndex);
  };

  const renderPagination = () => {
    const totalPages = Math.ceil(pending.length / itemsPerPage);
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

  const renderAlumniCard = (a) => (
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
    <section className="bg-LightSteelBlue p-8 rounded-xl shadow-2xl animate__animated animate__fadeInUp">
      {error && (
        <p className="text-black bg-red-900 bg-opacity-50 p-4 rounded-lg mb-4 animate__animated animate__shakeX">{error}</p>
      )}
      {success && (
        <p className="text-white bg-green-900 bg-opacity-50 p-4 rounded-lg mb-4 animate__animated animate__shakeX">{success}</p>
      )}

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
            className={`px-6 py-2 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition-colors ${isUploading ? 'opacity-50 cursor-not-allowed' : ''
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
            {getPaginatedData().map((a) => renderAlumniCard(a))}
          </div>
          {renderPagination()}
        </>
      )}
    </section>
  );
};

export default AdminPending;
