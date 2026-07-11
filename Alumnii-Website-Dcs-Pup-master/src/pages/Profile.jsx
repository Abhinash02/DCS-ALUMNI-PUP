// components/ProfilePage.jsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api/api';
import { toast } from 'react-toastify';
import { FaUserEdit, FaSignOutAlt, FaGraduationCap, FaBriefcase, FaStar } from 'react-icons/fa';
import JobForm from '../components/JobForm';
import { FaTrash, FaEdit } from 'react-icons/fa';


// UI Components
const Container = ({ children }) => {
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto pt-20 animate-fadeInTop">
        {children}
      </div>
    </div>
  );
};

const Card = ({ children }) => {
  return (
    <div className="bg-white p-8 rounded-xl shadow-2xl border-t-4 border-blue-600">
      {children}
    </div>
  );
};

const FormField = ({ name, label, value, onChange }) => {
  return (
    <div className="flex flex-col">
      <label className="block text-gray-700 text-sm font-semibold mb-1 font-poppins">
        {label}
      </label>
      <input
        type="text"
        name={name}
        value={value || ''}
        onChange={onChange}
        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200 font-poppins bg-gray-50 hover:bg-white"
      />
    </div>
  );
};

const FileUpload = ({ name, label, onChange }) => {
  return (
    <div className="flex flex-col">
      <label className="block text-gray-700 text-sm font-semibold mb-1 font-poppins">
        {label}
      </label>
      <input
        type="file"
        name={name}
        onChange={onChange}
        className="w-full text-gray-700 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-600 file:text-white hover:file:bg-blue-700 transition duration-200"
      />
    </div>
  );
};

// Profile Components
const FormSection = ({ title, icon, children }) => {
  return (
    <div className="border-b border-gray-200 pb-8 mb-6">
      <div className="flex items-center gap-2 mb-6">
        {icon}
        <h3 className="text-xl font-bold text-gray-800 font-mons">{title}</h3>
      </div>
      {children}
    </div>
  );
};

const ProfileHeader = ({ onLogout }) => {
  return (
    <div className="flex justify-between items-center mb-8 border-b border-gray-200 pb-4">
      <h2 className="text-3xl font-bold text-gray-800 font-mons flex items-center gap-3">
        <FaUserEdit className="text-blue-600" /> My Profile
      </h2>
      <button
        onClick={onLogout}
        className="flex items-center gap-2 bg-red-600 text-white px-5 py-2.5 rounded-lg hover:bg-red-700 transition duration-200 font-semibold shadow-md hover:shadow-lg"
      >
        <FaSignOutAlt /> Logout
      </button>
    </div>
  );
};

const ProfileForm = ({ 
  formData, 
  onChange, 
  onSkillsChange, 
  onFileChange, 
  onSubmit 
}) => {
  const personalFields = [
    { name: 'name', label: 'Full Name' },
    { name: 'fathername', label: 'Father\'s Name' },
    { name: 'phone', label: 'Phone Number' },
    { name: 'address', label: 'Address' }
  ];

  const academicFields = [
    { name: 'course', label: 'Course' },
    { name: 'batch', label: 'Batch' }
  ];

  const professionalFields = [
    { name: 'profession', label: 'Current Profession' },
    { name: 'organization', label: 'Organization' },
    { name: 'website', label: 'Website' },
    { name: 'linkedin', label: 'LinkedIn Profile' }
  ];

  const otherFields = [
    { name: 'otherSkill', label: 'Other Skills' },
    { name: 'sessionConsent', label: 'Session Consent' }
  ];

  return (
    <form onSubmit={onSubmit} className="space-y-8">
      <FormSection title="Personal Information" icon={<FaUserEdit className="text-blue-500 text-xl" />}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {personalFields.map(field => (
            <FormField
              key={field.name}
              name={field.name}
              label={field.label}
              value={formData[field.name]}
              onChange={onChange}
            />
          ))}
        </div>
      </FormSection>

      <FormSection title="Academic Information" icon={<FaGraduationCap className="text-blue-500 text-xl" />}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {academicFields.map(field => (
            <FormField
              key={field.name}
              name={field.name}
              label={field.label}
              value={formData[field.name]}
              onChange={onChange}
            />
          ))}
        </div>
      </FormSection>

      <FormSection title="Professional Information" icon={<FaBriefcase className="text-blue-500 text-xl" />}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {professionalFields.map(field => (
            <FormField
              key={field.name}
              name={field.name}
              label={field.label}
              value={formData[field.name]}
              onChange={onChange}
            />
          ))}
        </div>
      </FormSection>

      <FormSection title="Skills & Additional Info" icon={<FaStar className="text-blue-500 text-xl" />}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            name="skills"
            label="Skills (comma-separated)"
            value={formData.skills.join(', ')}
            onChange={onSkillsChange}
          />
          <FileUpload
            name="photo"
            label="Update Profile Photo"
            onChange={onFileChange}
          />
          {otherFields.map(field => (
            <FormField
              key={field.name}
              name={field.name}
              label={field.label}
              value={formData[field.name]}
              onChange={onChange}
            />
          ))}
        </div>
      </FormSection>

      <button
        type="submit"
        className="w-full bg-blue text-white py-4 px-6 rounded-xl hover:bg-blue-700 transition duration-300 font-bold font-mons text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-1"
      >
        Save Changes
      </button>
    </form>
  );
};

// Main Component
const ProfilePage = () => {
    const [formData, setFormData] = useState({
      name: '',
      fathername: '',
      phone: '',
      course: '',
      batch: '',
      address: '',
      linkedin: '',
      profession: '',
      organization: '',
      website: '',
      skills: [],
      otherSkill: '',
      sessionConsent: '',
      photo: null
    });
    const [myJobs, setMyJobs] = useState([]);
    const [editingJob, setEditingJob] = useState(null);
    const [editFormData, setEditFormData] = useState({});

    const navigate = useNavigate();
  
    useEffect(() => {
      const token = localStorage.getItem('token');
  
      if (!token) {
        navigate('/UserLogin'); // Redirect if no token
      } else {
        loadProfileData();
        fetchMyJobs(token);
      }
    }, [navigate]);

    const fetchMyJobs = async (token) => {
      try {
        const response = await API.get('/jobs/myjobs', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setMyJobs(response.data);
      } catch (error) {
        console.error('Error fetching my jobs', error);
      }
    };

    const handleDeleteJob = async (jobId) => {
      if (window.confirm('Are you sure you want to delete this job posting?')) {
        try {
          const token = localStorage.getItem('token');
          await API.delete(`/jobs/${jobId}`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          setMyJobs(myJobs.filter(job => job._id !== jobId));
          toast.success('Job deleted successfully');
        } catch (error) {
          toast.error('Failed to delete job');
        }
      }
    };

    const handleEditClick = (job) => {
      setEditingJob(job._id);
      setEditFormData({
        title: job.title,
        company: job.company,
        location: job.location,
        type: job.type,
        description: job.description,
        applyLink: job.applyLink
      });
    };

    const handleUpdateJob = async (e) => {
      e.preventDefault();
      try {
        const token = localStorage.getItem('token');
        const response = await API.put(`/jobs/${editingJob}`, editFormData, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setMyJobs(myJobs.map(job => job._id === editingJob ? response.data : job));
        setEditingJob(null);
        toast.success('Job updated successfully');
      } catch (error) {
        toast.error('Failed to update job');
      }
    };
  
    const loadProfileData = () => {
      const alumni = JSON.parse(localStorage.getItem('alumni'));
      if (alumni) {
        setFormData(prev => ({
          ...prev,
          ...alumni,
          photo: null
        }));
      }
    };
  
    const handleChange = (e) => {
      const { name, value } = e.target;
      setFormData({ ...formData, [name]: value });
    };
  
    const handleSkillsChange = (e) => {
      const skillsArray = e.target.value.split(',').map(skill => skill.trim());
      setFormData({ ...formData, skills: skillsArray });
    };
  
    const handleFileChange = (e) => {
      setFormData({ ...formData, photo: e.target.files[0] });
    };
  
    const handleSubmit = async (e) => {
      e.preventDefault();
  
      try {
        const response = await updateProfile();
        toast.success('Profile updated successfully!');
        localStorage.setItem('alumni', JSON.stringify(response.data.alumni));
      } catch (err) {
        const errorMessage = err.response?.data?.error || 'Update failed';
        toast.error(errorMessage);
      }
    };
  
    const updateProfile = async () => {
      const data = new FormData();
      Object.keys(formData).forEach(key => {
        if (key === 'skills') {
          data.append(key, JSON.stringify(formData[key]));
        } else if (key === 'photo' && formData[key]) {
          data.append(key, formData[key]);
        } else {
          data.append(key, formData[key]);
        }
      });
  
      const token = localStorage.getItem('token');
      return await API.put('/alumni/profile', data, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });
    };
  
    const handleLogout = () => {
      localStorage.removeItem('token');
      localStorage.removeItem('alumni');
      navigate('/login');
    };
  
    return (
      <Container>
        <Card>
          <ProfileHeader onLogout={handleLogout} />
  
        <ProfileForm
          formData={formData}
          onChange={handleChange}
          onSkillsChange={handleSkillsChange}
          onFileChange={handleFileChange}
          onSubmit={handleSubmit}
        />
      </Card>
      
      {/* My Posted Jobs Section */}
      <div className="mt-8 bg-white p-8 rounded-xl shadow-2xl border-t-4 border-green-600">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
          <FaBriefcase className="text-green-600" /> My Posted Jobs
        </h2>
        {myJobs.length === 0 ? (
          <p className="text-gray-500 italic">You haven't posted any jobs yet.</p>
        ) : (
          <div className="space-y-4">
            {myJobs.map(job => (
              <div key={job._id} className="border border-gray-200 rounded-lg p-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 hover:shadow-md transition-shadow">
                {editingJob === job._id ? (
                  <form onSubmit={handleUpdateJob} className="w-full space-y-3">
                    <input type="text" name="title" value={editFormData.title} onChange={e => setEditFormData({...editFormData, title: e.target.value})} className="w-full px-3 py-2 border rounded" placeholder="Job Title" required />
                    <input type="text" name="company" value={editFormData.company} onChange={e => setEditFormData({...editFormData, company: e.target.value})} className="w-full px-3 py-2 border rounded" placeholder="Company" required />
                    <input type="text" name="location" value={editFormData.location} onChange={e => setEditFormData({...editFormData, location: e.target.value})} className="w-full px-3 py-2 border rounded" placeholder="Location" required />
                    <select name="type" value={editFormData.type} onChange={e => setEditFormData({...editFormData, type: e.target.value})} className="w-full px-3 py-2 border rounded">
                      <option value="Full-Time">Full-Time</option>
                      <option value="Part-Time">Part-Time</option>
                      <option value="Internship">Internship</option>
                      <option value="Remote">Remote</option>
                    </select>
                    <textarea name="description" value={editFormData.description} onChange={e => setEditFormData({...editFormData, description: e.target.value})} className="w-full px-3 py-2 border rounded" rows="3" placeholder="Description" required></textarea>
                    <input type="url" name="applyLink" value={editFormData.applyLink} onChange={e => setEditFormData({...editFormData, applyLink: e.target.value})} className="w-full px-3 py-2 border rounded" placeholder="Application URL" required />
                    <div className="flex gap-2">
                      <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded font-bold hover:bg-green-700">Save</button>
                      <button type="button" onClick={() => setEditingJob(null)} className="bg-gray-400 text-white px-4 py-2 rounded font-bold hover:bg-gray-500">Cancel</button>
                    </div>
                  </form>
                ) : (
                  <>
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-gray-800">{job.title}</h3>
                      <p className="text-gray-600 font-semibold">{job.company} • {job.location}</p>
                      <span className="inline-block mt-1 px-2 py-1 bg-blue-100 text-blue-800 text-xs font-bold rounded-full">{job.type}</span>
                    </div>
                    <div className="flex gap-3">
                      <button onClick={() => handleEditClick(job)} className="text-blue-500 hover:text-blue-700 flex items-center gap-1 bg-blue-50 px-3 py-2 rounded-lg transition-colors">
                        <FaEdit /> Edit
                      </button>
                      <button onClick={() => handleDeleteJob(job._id)} className="text-red-500 hover:text-red-700 flex items-center gap-1 bg-red-50 px-3 py-2 rounded-lg transition-colors">
                        <FaTrash /> Delete
                      </button>
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Job Form Component for Posting Opportunities */}
      <div className="mt-8">
        <JobForm />
      </div>
    </Container>

    );
  };
  
  export default ProfilePage;