import React, { useEffect, useState } from 'react';
import API from '../../api/api';

const AdminApproved = () => {
  const [approved, setApproved] = useState([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [expandedCards, setExpandedCards] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

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

  useEffect(() => {
    fetchApproved();
  }, []);

  const remove = async (id) => {
    if (!window.confirm('Are you sure you want to delete this alumni?')) return;
    try {
      await API.delete(`/alumni/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      setSuccess('Alumni removed successfully.');
      setError('');
      fetchApproved();
    } catch (err) {
      console.error('Error deleting:', err);
      setError('Failed to delete alumni.');
      setSuccess('');
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
    return approved.slice(startIndex, endIndex);
  };

  const renderPagination = () => {
    const totalPages = Math.ceil(approved.length / itemsPerPage);
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

      <h3 className="text-2xl font-semibold text-blue mb-6">Approved Alumni</h3>
      {approved.length === 0 ? (
        <p className="text-gray">No approved alumni yet.</p>
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

export default AdminApproved;
