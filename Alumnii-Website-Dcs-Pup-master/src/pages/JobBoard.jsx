import React, { useState, useEffect } from 'react';
import API from '../api/api';
import { FaMapMarkerAlt, FaBriefcase, FaBuilding, FaClock } from 'react-icons/fa';
import PageLoader from '../components/PageLoader';

const JobBoard = ({ isComponent = false }) => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [expandedJobs, setExpandedJobs] = useState({});
  const [jobsPerPage, setJobsPerPage] = useState(window.innerWidth < 768 ? 1 : 6);

  useEffect(() => {
    const handleResize = () => {
      setJobsPerPage(window.innerWidth < 768 ? 1 : 6);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const toggleDescription = (id) => {
    setExpandedJobs((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const [localJobsRes, externalJobsRes] = await Promise.allSettled([
          API.get('/jobs'),
          API.get('/jobs/external')
        ]);

        const localData = localJobsRes.status === 'fulfilled' ? localJobsRes.value.data : [];
        const externalData = externalJobsRes.status === 'fulfilled' ? externalJobsRes.value.data : [];

        // Merge and sort by newest
        const allJobs = [...localData, ...externalData].sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );

        setJobs(allJobs);
      } catch (error) {
        console.error('Failed to fetch jobs', error);
      } finally {
        setLoading(false);
      }
    };
    fetchJobs();
  }, []);

  // Get current jobs
  const indexOfLastJob = currentPage * jobsPerPage;
  const indexOfFirstJob = indexOfLastJob - jobsPerPage;
  const currentJobs = jobs.slice(indexOfFirstJob, indexOfLastJob);
  const totalPages = Math.ceil(jobs.length / jobsPerPage);

  const paginate = (pageNumber) => {
    if (pageNumber !== '...') setCurrentPage(pageNumber);
  };

  const getPaginationNumbers = () => {
    const pages = [];
    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      if (currentPage <= 3) {
        pages.push(1, 2, 3, 4, '...', totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1, '...', totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
      } else {
        pages.push(1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages);
      }
    }
    return pages;
  };

  if (loading) return <PageLoader />;

  return (
    <div className={`w-full bg-gray-50 ${isComponent ? 'pt-0 pb-12' : 'min-h-screen pt-8 pb-15'}`}>
      <div className="max-w-6xl mx-auto px-4 md:px-8">
        
        {/* Header */}
        <div className={`text-center ${isComponent ? 'mb-5' : 'mb-5'}`}>
          <h1 className="text-4xl md:text-5xl font-extrabold text-darkBlue mb-3">
            Alumni <span className="text-lightBlue">Job Board</span>
          </h1>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Discover exclusive career opportunities, internships, and roles posted directly by our successful Punjabi University alumni network.
          </p>
        </div>

        {/* Job Listings */}
        {jobs.length === 0 ? (
          <div className="text-center bg-white p-12 rounded-xl shadow-sm border border-gray-100">
            <h3 className="text-2xl font-bold text-gray-700 mb-2">No Opportunities Right Now</h3>
            <p className="text-gray-500">Check back later for new roles posted by our alumni!</p>
          </div>
        ) : (
          <div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
              {currentJobs.map((job) => (
                <div 
                  key={job._id} 
                className="bg-white rounded-2xl p-6 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.1)] hover:shadow-[0_8px_30px_-4px_rgba(0,145,205,0.15)] transition-all duration-300 border border-gray-100 flex flex-col h-full group"
              >
                {/* Job Header */}
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h2 className="text-xl font-bold text-darkBlue group-hover:text-lightBlue transition-colors line-clamp-2">
                      {job.title}
                    </h2>
                    <p className="text-gray-500 font-medium flex items-center mt-1">
                      <FaBuilding className="mr-2 text-lightBlue" />
                      {job.company}
                    </p>
                  </div>
                  {job.isExternal && (
                    <span className="bg-purple-100 text-purple-700 text-xs font-bold px-3 py-1 rounded-full whitespace-nowrap shadow-sm">
                      🌍 External Portal
                    </span>
                  )}
                </div>

                {/* Badges */}
                <div className="flex flex-wrap gap-2 mb-4">
                  <span className="bg-blue-50 text-lightBlue text-xs font-bold px-3 py-1 rounded-full flex items-center">
                    <FaBriefcase className="mr-1.5" />
                    {job.type}
                  </span>
                  <span className="bg-gray-100 text-gray-600 text-xs font-bold px-3 py-1 rounded-full flex items-center">
                    <FaMapMarkerAlt className="mr-1.5" />
                    {job.location}
                  </span>
                </div>

                {/* Description */}
                <div className="mb-6 flex-grow">
                  <p className={`text-gray-600 text-sm ${!expandedJobs[job._id] ? 'line-clamp-3' : ''}`}>
                    {job.description}
                  </p>
                  {job.description && job.description.length > 150 && (
                    <button 
                      onClick={() => toggleDescription(job._id)}
                      className="text-lightBlue text-xs font-semibold mt-1 hover:underline focus:outline-none"
                    >
                      {expandedJobs[job._id] ? 'See Less' : 'See More'}
                    </button>
                  )}
                </div>

                {/* Footer & CTA */}
                <div className="pt-4 border-t border-gray-100 mt-auto flex flex-col space-y-4">
                  <div className="flex justify-between items-center text-xs text-gray-400 font-medium">
                    <div className="flex items-center">
                      <FaClock className="mr-1.5" />
                      {new Date(job.createdAt).toLocaleDateString()}
                    </div>
                    <span>
                      {job.isExternal ? 'Sourced from Web' : `Posted by ${job.postedBy?.name?.split(' ')[0] || 'Alumnus'}`}
                    </span>
                  </div>
                  
                  <a 
                    href={job.applyLink.startsWith('http') ? job.applyLink : `mailto:${job.applyLink}`}
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="w-full text-center bg-darkBlue hover:bg-lightBlue text-white font-bold py-3 rounded-xl transition-all duration-300 shadow-md hover:shadow-lg"
                  >
                    Apply Now
                  </a>
                </div>
              </div>
            ))}
            </div>
            
            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center space-x-1 md:space-x-2 mt-8 overflow-x-auto pb-4">
                <button 
                  onClick={() => paginate(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="px-3 py-1.5 md:px-4 md:py-2 rounded-lg font-bold text-darkBlue bg-white border border-gray-300 hover:bg-gray-100 disabled:opacity-50 text-sm md:text-base"
                >
                  Prev
                </button>
                {getPaginationNumbers().map((num, idx) => (
                  <button
                    key={idx}
                    onClick={() => paginate(num)}
                    disabled={num === '...'}
                    className={`px-3 py-1.5 md:px-4 md:py-2 rounded-lg font-bold text-sm md:text-base ${
                      currentPage === num 
                        ? 'bg-darkBlue text-white' 
                        : num === '...' 
                          ? 'text-gray-500 bg-transparent border-none' 
                          : 'text-darkBlue bg-white border border-gray-300 hover:bg-gray-100'
                    }`}
                  >
                    {num}
                  </button>
                ))}
                <button 
                  onClick={() => paginate(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="px-3 py-1.5 md:px-4 md:py-2 rounded-lg font-bold text-darkBlue bg-white border border-gray-300 hover:bg-gray-100 disabled:opacity-50 text-sm md:text-base"
                >
                  Next
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default JobBoard;
