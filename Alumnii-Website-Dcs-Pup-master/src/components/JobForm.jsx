import React, { useState } from 'react';
import API from '../api/api';
import { toast } from 'react-toastify';
import { FaBriefcase } from 'react-icons/fa';

const JobForm = () => {
  const [formData, setFormData] = useState({
    title: '',
    company: '',
    location: '',
    type: 'Full-Time',
    description: '',
    applyLink: ''
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      await API.post('/jobs', formData, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      toast.success('Job opportunity posted successfully!');
      setFormData({
        title: '',
        company: '',
        location: '',
        type: 'Full-Time',
        description: '',
        applyLink: ''
      });
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to post job');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-8 rounded-xl shadow-2xl border-t-4 border-lightBlue mt-8">
      <div className="flex items-center gap-3 mb-6">
        <FaBriefcase className="text-lightBlue text-2xl" />
        <h2 className="text-2xl font-bold text-darkBlue">Post an Opportunity</h2>
      </div>
      <p className="text-gray-500 mb-6">
        Help fellow alumni and current students by posting job openings or internships from your organization.
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-gray-700 text-sm font-semibold mb-1">Job Title</label>
            <input required type="text" name="title" value={formData.title} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-lightBlue bg-gray-50" placeholder="e.g. Software Engineer Intern" />
          </div>
          <div>
            <label className="block text-gray-700 text-sm font-semibold mb-1">Company</label>
            <input required type="text" name="company" value={formData.company} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-lightBlue bg-gray-50" placeholder="e.g. Google, Microsoft" />
          </div>
          <div>
            <label className="block text-gray-700 text-sm font-semibold mb-1">Location</label>
            <input required type="text" name="location" value={formData.location} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-lightBlue bg-gray-50" placeholder="e.g. Remote, Bangalore" />
          </div>
          <div>
            <label className="block text-gray-700 text-sm font-semibold mb-1">Job Type</label>
            <select required name="type" value={formData.type} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-lightBlue bg-gray-50">
              <option value="Full-Time">Full-Time</option>
              <option value="Part-Time">Part-Time</option>
              <option value="Internship">Internship</option>
              <option value="Contract">Contract</option>
              <option value="Remote">Remote</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-gray-700 text-sm font-semibold mb-1">Apply Link or Email</label>
          <input required type="text" name="applyLink" value={formData.applyLink} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-lightBlue bg-gray-50" placeholder="e.g. https://careers.company.com or hr@company.com" />
        </div>

        <div>
          <label className="block text-gray-700 text-sm font-semibold mb-1">Description</label>
          <textarea required name="description" value={formData.description} onChange={handleChange} rows="4" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-lightBlue bg-gray-50" placeholder="Briefly describe the role, requirements, and responsibilities."></textarea>
        </div>

        <button disabled={loading} type="submit" className="w-full bg-darkBlue text-white py-3 rounded-lg hover:bg-lightBlue transition duration-300 font-bold mt-4 shadow-md disabled:opacity-50">
          {loading ? 'Posting...' : 'Post Opportunity'}
        </button>
      </form>
    </div>
  );
};

export default JobForm;
