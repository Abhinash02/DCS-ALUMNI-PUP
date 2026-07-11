import React, { useState, useEffect } from 'react';
import API from '../api/api';
import { FaMapMarkerAlt, FaBriefcase, FaBuilding, FaArrowRight } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const FeaturedJobs = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

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

        // Only grab the 3 most recent jobs
        setJobs(allJobs.slice(0, 3));
      } catch (error) {
        console.error('Failed to fetch featured jobs', error);
      } finally {
        setLoading(false);
      }
    };
    fetchJobs();
  }, []);

  if (loading || jobs.length === 0) return null; // Don't show the section if no jobs exist yet

  return (
    <div className="w-full bg-white py-20">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-12">
          <div>
            <h2 className="text-3xl md:text-4xl font-extrabold text-darkBlue mb-2">
              Featured <span className="text-lightBlue">Opportunities</span>
            </h2>
            <p className="text-gray-500">Exclusive roles posted by our alumni network.</p>
          </div>
          <Link 
            to="/jobs" 
            className="mt-4 md:mt-0 flex items-center text-lightBlue font-bold hover:text-darkBlue transition-colors group"
          >
            View All Jobs
            <FaArrowRight className="ml-2 transform group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Featured Job Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {jobs.map((job) => (
            <div 
              key={job._id} 
              className="bg-gray-50 rounded-2xl p-6 border border-gray-100 hover:border-lightBlue hover:shadow-lg transition-all duration-300 group flex flex-col"
            >
              <div className="mb-4 relative">
                {job.isExternal && (
                  <span className="absolute -top-2 -right-2 bg-purple-100 text-purple-700 text-[10px] font-bold px-2 py-0.5 rounded-md shadow-sm">
                    🌍 External
                  </span>
                )}
                <h3 className="text-lg font-bold text-darkBlue group-hover:text-lightBlue transition-colors line-clamp-1 pr-16">
                  {job.title}
                </h3>
                <p className="text-gray-500 text-sm font-medium flex items-center mt-1">
                  <FaBuilding className="mr-2 text-lightBlue" />
                  {job.company}
                </p>
              </div>

              <div className="flex gap-2 mb-4">
                <span className="bg-white border border-gray-200 text-gray-600 text-xs font-bold px-2.5 py-1 rounded-md flex items-center shadow-sm">
                  <FaBriefcase className="mr-1.5 text-lightBlue" />
                  {job.type}
                </span>
                <span className="bg-white border border-gray-200 text-gray-600 text-xs font-bold px-2.5 py-1 rounded-md flex items-center shadow-sm">
                  <FaMapMarkerAlt className="mr-1.5 text-lightBlue" />
                  {job.location}
                </span>
              </div>

              <p className="text-gray-500 text-sm line-clamp-2 mb-6 flex-grow">
                {job.description}
              </p>

              <a 
                href={job.applyLink.startsWith('http') ? job.applyLink : `mailto:${job.applyLink}`}
                target="_blank" 
                rel="noopener noreferrer"
                className="w-full text-center bg-white border-2 border-darkBlue text-darkBlue hover:bg-darkBlue hover:text-white font-bold py-2 rounded-lg transition-all duration-300"
              >
                Apply Now
              </a>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
};

export default FeaturedJobs;
