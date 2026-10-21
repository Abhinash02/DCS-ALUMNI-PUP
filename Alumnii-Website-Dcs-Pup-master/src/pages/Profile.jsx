import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api/api';
import { toast } from 'react-toastify';
import { 
  User, 
  GraduationCap, 
  Briefcase, 
  Sparkles, 
  LogOut, 
  Save, 
  Trash2, 
  Edit3, 
  Camera, 
  Globe, 
  Linkedin, 
  Phone, 
  MapPin, 
  CheckCircle2, 
  ExternalLink, 
  PlusCircle,
  Building,
  Check,
  ShieldCheck
} from 'lucide-react';
import JobForm from '../components/JobForm';

const ProfilePage = () => {
  const [formData, setFormData] = useState({
    name: '',
    fathername: '',
    email: '',
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
    photo: null,
  });

  const [existingPhotoUrl, setExistingPhotoUrl] = useState('');
  const [photoPreview, setPhotoPreview] = useState(null);
  const [myJobs, setMyJobs] = useState([]);
  const [editingJob, setEditingJob] = useState(null);
  const [editFormData, setEditFormData] = useState({});
  const [activeTab, setActiveTab] = useState('profile'); // 'profile', 'jobs', 'post-job'
  const [isSaving, setIsSaving] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/UserLogin');
    } else {
      loadProfileData();
      fetchMyJobs(token);
    }
  }, [navigate]);

  const loadProfileData = () => {
    try {
      const alumni = JSON.parse(localStorage.getItem('alumni'));
      if (alumni) {
        setFormData(prev => ({
          ...prev,
          ...alumni,
          skills: Array.isArray(alumni.skills) ? alumni.skills : (typeof alumni.skills === 'string' ? alumni.skills.split(',').map(s => s.trim()) : []),
          photo: null
        }));
        if (alumni.photo) {
          const url = alumni.photo.startsWith('http') 
            ? alumni.photo 
            : `http://localhost:5000/${alumni.photo.replace(/\\/g, '/')}`;
          setExistingPhotoUrl(url);
        }
      }
    } catch (e) {
      console.error('Error loading stored profile data', e);
    }
  };

  const fetchMyJobs = async (token) => {
    try {
      const response = await API.get('/jobs/myjobs', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMyJobs(response.data || []);
    } catch (error) {
      console.error('Error fetching my jobs', error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSkillsChange = (e) => {
    const skillsArray = e.target.value.split(',').map(skill => skill.trim());
    setFormData(prev => ({ ...prev, skills: skillsArray }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({ ...prev, photo: file }));
      setPhotoPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      const data = new FormData();
      Object.keys(formData).forEach(key => {
        if (key === 'skills') {
          data.append(key, JSON.stringify(formData[key]));
        } else if (key === 'photo' && formData[key]) {
          data.append(key, formData[key]);
        } else if (formData[key] !== null && formData[key] !== undefined) {
          data.append(key, formData[key]);
        }
      });

      const token = localStorage.getItem('token');
      const response = await API.put('/alumni/profile', data, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });

      toast.success('Profile updated successfully!');
      if (response.data?.alumni) {
        localStorage.setItem('alumni', JSON.stringify(response.data.alumni));
        if (response.data.alumni.photo) {
          const url = response.data.alumni.photo.startsWith('http') 
            ? response.data.alumni.photo 
            : `http://localhost:5000/${response.data.alumni.photo.replace(/\\/g, '/')}`;
          setExistingPhotoUrl(url);
        }
      }
    } catch (err) {
      const errorMessage = err.response?.data?.error || 'Update failed. Please try again.';
      toast.error(errorMessage);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteJob = async (jobId) => {
    if (window.confirm('Are you sure you want to delete this job posting?')) {
      try {
        const token = localStorage.getItem('token');
        await API.delete(`/jobs/${jobId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setMyJobs(prev => prev.filter(job => job._id !== jobId));
        toast.success('Job opportunity removed');
      } catch (error) {
        toast.error('Failed to delete job opportunity');
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
      setMyJobs(prev => prev.map(job => job._id === editingJob ? response.data : job));
      setEditingJob(null);
      toast.success('Job posting updated successfully');
    } catch (error) {
      toast.error('Failed to update job posting');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('alumni');
    navigate('/UserLogin');
  };

  const currentAvatar = photoPreview || existingPhotoUrl;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 py-10 px-4 sm:px-6 lg:px-8 transition-colors duration-200">
      <div className="max-w-6xl mx-auto pt-16 space-y-8 animate-fadeInTop">
        
        {/* HERO EXECUTIVE PROFILE BANNER */}
        <div className="relative rounded-3xl overflow-hidden shadow-2xl bg-gradient-to-r from-blue-950 via-indigo-950 to-slate-950 border border-slate-700/60 p-6 sm:p-10 text-white">
          <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 rounded-full bg-blue-500/10 blur-3xl pointer-events-none"></div>
          <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 rounded-full bg-indigo-500/10 blur-3xl pointer-events-none"></div>

          <div className="relative z-10 flex flex-col md:flex-row items-center md:items-start justify-between gap-6">
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 text-center sm:text-left">
              {/* Avatar with Camera Overlay */}
              <div className="relative group shrink-0">
                <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-2xl overflow-hidden ring-4 ring-white/20 shadow-xl bg-slate-800 flex items-center justify-center">
                  {currentAvatar ? (
                    <img 
                      src={currentAvatar} 
                      alt={formData.name || 'Alumni Avatar'} 
                      className="w-full h-full object-cover"
                      onError={(e) => { e.target.style.display = 'none'; }}
                    />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-blue-600 to-indigo-700 text-white font-extrabold text-3xl">
                      {(formData.name || 'Alumnus').charAt(0).toUpperCase()}
                    </div>
                  )}
                </div>
                <label 
                  htmlFor="photoUpload" 
                  className="absolute -bottom-2 -right-2 p-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white shadow-lg cursor-pointer transition transform hover:scale-110 active:scale-95"
                  title="Upload profile photo"
                >
                  <Camera className="w-4 h-4" />
                  <input 
                    type="file" 
                    id="photoUpload" 
                    name="photo" 
                    accept="image/*" 
                    onChange={handleFileChange} 
                    className="hidden" 
                  />
                </label>
              </div>

              {/* Bio & Details */}
              <div className="space-y-2">
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                  <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white drop-shadow">
                    {formData.name || 'Alumni Member'}
                  </h1>
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
                    <ShieldCheck className="w-3.5 h-3.5" /> Verified Alumnus
                  </span>
                </div>

                <p className="text-white text-sm font-bold flex items-center justify-center sm:justify-start gap-2 drop-shadow-sm">
                  <GraduationCap className="w-4 h-4 text-sky-400" />
                  <span>{formData.course || 'Degree / Course'}</span>
                  {formData.batch && <span className="text-white font-bold">• Batch {formData.batch}</span>}
                </p>

                {(formData.profession || formData.organization) && (
                  <p className="text-white text-sm font-semibold flex items-center justify-center sm:justify-start gap-2 drop-shadow-sm">
                    <Briefcase className="w-4 h-4 text-amber-400" />
                    <span>{formData.profession || 'Professional'}</span>
                    {formData.organization && <span className="text-white font-bold">at {formData.organization}</span>}
                  </p>
                )}

                {formData.address && (
                  <p className="text-white text-xs font-medium flex items-center justify-center sm:justify-start gap-1.5 pt-1 drop-shadow-sm">
                    <MapPin className="w-3.5 h-3.5 text-rose-400" />
                    <span>{formData.address}</span>
                  </p>
                )}
              </div>
            </div>

            {/* Logout Action Button */}
            <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
              <button
                onClick={handleLogout}
                className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white border border-red-500/40 text-sm font-bold transition active:scale-95 shadow-md"
              >
                <LogOut className="w-4 h-4 text-white" />
                <span>Logout</span>
              </button>
            </div>
          </div>

          {/* Quick Stats Strip */}
          <div className="mt-8 pt-6 border-t border-white/20 grid grid-cols-2 sm:grid-cols-4 gap-4 text-center sm:text-left">
            <div className="bg-white/10 rounded-2xl p-3.5 border border-white/15 backdrop-blur-sm shadow-sm">
              <div className="text-xs text-white font-bold uppercase tracking-wider drop-shadow-sm">Course / Stream</div>
              <div className="text-lg font-extrabold text-white mt-0.5 drop-shadow-sm">{formData.course || '—'}</div>
            </div>
            <div className="bg-white/10 rounded-2xl p-3.5 border border-white/15 backdrop-blur-sm shadow-sm">
              <div className="text-xs text-white font-bold uppercase tracking-wider drop-shadow-sm">Graduation Batch</div>
              <div className="text-lg font-extrabold text-white mt-0.5 drop-shadow-sm">{formData.batch || '—'}</div>
            </div>
            <div className="bg-white/10 rounded-2xl p-3.5 border border-white/15 backdrop-blur-sm shadow-sm">
              <div className="text-xs text-white font-bold uppercase tracking-wider drop-shadow-sm">Posted Jobs</div>
              <div className="text-lg font-extrabold text-white mt-0.5 drop-shadow-sm">{myJobs.length} Positions</div>
            </div>
            <div className="bg-white/10 rounded-2xl p-3.5 border border-white/15 backdrop-blur-sm shadow-sm">
              <div className="text-xs text-white font-bold uppercase tracking-wider drop-shadow-sm">Guest Sessions</div>
              <div className="text-lg font-extrabold text-emerald-300 mt-0.5 flex items-center gap-1 justify-center sm:justify-start drop-shadow-sm">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>{formData.sessionConsent ? 'Willing' : 'Available'}</span>
              </div>
            </div>
          </div>
        </div>

        {/* INTERACTIVE NAVIGATION TABS */}
        <div className="flex flex-wrap items-center gap-2 p-1.5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm">
          <button
            onClick={() => setActiveTab('profile')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-all ${
              activeTab === 'profile'
                ? 'bg-blue-600 text-white shadow-md'
                : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700/60'
            }`}
          >
            <User className="w-4 h-4" />
            <span>Edit Profile</span>
          </button>

          <button
            onClick={() => setActiveTab('jobs')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-all ${
              activeTab === 'jobs'
                ? 'bg-blue-600 text-white shadow-md'
                : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700/60'
            }`}
          >
            <Briefcase className="w-4 h-4" />
            <span>My Posted Opportunities</span>
            <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${
              activeTab === 'jobs' ? 'bg-white/20 text-white' : 'bg-blue-100 text-blue-700 dark:bg-slate-700 dark:text-slate-200'
            }`}>
              {myJobs.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('post-job')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-all ${
              activeTab === 'post-job'
                ? 'bg-blue-600 text-white shadow-md'
                : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700/60'
            }`}
          >
            <PlusCircle className="w-4 h-4" />
            <span>Post New Opportunity</span>
          </button>
        </div>

        {/* TAB 1: EDIT PROFILE */}
        {activeTab === 'profile' && (
          <form onSubmit={handleSubmit} className="space-y-8">
            
            {/* Section 1: Personal Information */}
            <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-700 shadow-md">
              <div className="flex items-center gap-3 pb-4 mb-6 border-b border-slate-100 dark:border-slate-700/80">
                <div className="p-2.5 rounded-xl bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-900/50">
                  <User className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-slate-900 dark:text-white">Personal & Contact Details</h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Keep your identity and contact information current</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                    Full Name <span className="text-red-500 font-bold ml-1">*</span>
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name || ''}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-300 dark:border-slate-600 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:bg-white dark:focus:bg-slate-900 focus:border-blue-600 focus:ring-2 focus:ring-blue-500/20 outline-none transition text-sm shadow-sm"
                    placeholder="Your Full Name"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                    Father's Name <span className="text-red-500 font-bold ml-1">*</span>
                  </label>
                  <input
                    type="text"
                    name="fathername"
                    value={formData.fathername || ''}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-300 dark:border-slate-600 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:bg-white dark:focus:bg-slate-900 focus:border-blue-600 focus:ring-2 focus:ring-blue-500/20 outline-none transition text-sm shadow-sm"
                    placeholder="Father's Full Name"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                    Phone / Mobile Number <span className="text-red-500 font-bold ml-1">*</span>
                  </label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400">
                      <Phone className="w-4 h-4" />
                    </span>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone || ''}
                      onChange={handleChange}
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-300 dark:border-slate-600 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:bg-white dark:focus:bg-slate-900 focus:border-blue-600 focus:ring-2 focus:ring-blue-500/20 outline-none transition text-sm shadow-sm"
                      placeholder="e.g., 9876543210"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                    Full Residential Address
                  </label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400">
                      <MapPin className="w-4 h-4" />
                    </span>
                    <input
                      type="text"
                      name="address"
                      value={formData.address || ''}
                      onChange={handleChange}
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-300 dark:border-slate-600 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:bg-white dark:focus:bg-slate-900 focus:border-blue-600 focus:ring-2 focus:ring-blue-500/20 outline-none transition text-sm shadow-sm"
                      placeholder="City, State, Postal Code"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Section 2: Academic Background */}
            <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-700 shadow-md">
              <div className="flex items-center gap-3 pb-4 mb-6 border-b border-slate-100 dark:border-slate-700/80">
                <div className="p-2.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-900/50">
                  <GraduationCap className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-slate-900 dark:text-white">Academic Qualifications</h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Department of Computer Science degrees and batch</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                    Course / Degree Program <span className="text-red-500 font-bold ml-1">*</span>
                  </label>
                  <select
                    name="course"
                    value={formData.course || ''}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-300 dark:border-slate-600 text-slate-900 dark:text-slate-100 focus:bg-white dark:focus:bg-slate-900 focus:border-blue-600 focus:ring-2 focus:ring-blue-500/20 outline-none transition text-sm shadow-sm"
                    required
                  >
                    <option value="">Select Course</option>
                    <option value="BCA">BCA</option>
                    <option value="MCA">MCA</option>
                    <option value="B.TECH">B.TECH</option>
                    <option value="M.TECH">M.TECH</option>
                    <option value="PHD">PHD</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                    Graduation Batch (e.g., 2021-2023) <span className="text-red-500 font-bold ml-1">*</span>
                  </label>
                  <input
                    type="text"
                    name="batch"
                    value={formData.batch || ''}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-300 dark:border-slate-600 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:bg-white dark:focus:bg-slate-900 focus:border-blue-600 focus:ring-2 focus:ring-blue-500/20 outline-none transition text-sm shadow-sm"
                    placeholder="e.g., 2021-2023"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Section 3: Professional Journey */}
            <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-700 shadow-md">
              <div className="flex items-center gap-3 pb-4 mb-6 border-b border-slate-100 dark:border-slate-700/80">
                <div className="p-2.5 rounded-xl bg-teal-50 dark:bg-teal-950/50 text-teal-600 dark:text-teal-400 border border-teal-200 dark:border-teal-900/50">
                  <Briefcase className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-slate-900 dark:text-white">Career & Professional Status</h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Highlight your current industry role and organization</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                    Current Profession / Designation
                  </label>
                  <input
                    type="text"
                    name="profession"
                    value={formData.profession || ''}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-300 dark:border-slate-600 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:bg-white dark:focus:bg-slate-900 focus:border-blue-600 focus:ring-2 focus:ring-blue-500/20 outline-none transition text-sm shadow-sm"
                    placeholder="e.g., Senior Full-Stack Engineer"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                    Organization / Company
                  </label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400">
                      <Building className="w-4 h-4" />
                    </span>
                    <input
                      type="text"
                      name="organization"
                      value={formData.organization || ''}
                      onChange={handleChange}
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-300 dark:border-slate-600 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:bg-white dark:focus:bg-slate-900 focus:border-blue-600 focus:ring-2 focus:ring-blue-500/20 outline-none transition text-sm shadow-sm"
                      placeholder="e.g., Microsoft / Google / Start-up"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                    LinkedIn Profile URL
                  </label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-blue-500">
                      <Linkedin className="w-4 h-4" />
                    </span>
                    <input
                      type="url"
                      name="linkedin"
                      value={formData.linkedin || ''}
                      onChange={handleChange}
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-300 dark:border-slate-600 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:bg-white dark:focus:bg-slate-900 focus:border-blue-600 focus:ring-2 focus:ring-blue-500/20 outline-none transition text-sm shadow-sm"
                      placeholder="https://linkedin.com/in/yourname"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                    Personal Website / Portfolio
                  </label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400">
                      <Globe className="w-4 h-4" />
                    </span>
                    <input
                      type="url"
                      name="website"
                      value={formData.website || ''}
                      onChange={handleChange}
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-300 dark:border-slate-600 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:bg-white dark:focus:bg-slate-900 focus:border-blue-600 focus:ring-2 focus:ring-blue-500/20 outline-none transition text-sm shadow-sm"
                      placeholder="https://yourportfolio.com"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Section 4: Skills & Alumni Engagement */}
            <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-700 shadow-md">
              <div className="flex items-center gap-3 pb-4 mb-6 border-b border-slate-100 dark:border-slate-700/80">
                <div className="p-2.5 rounded-xl bg-purple-50 dark:bg-purple-950/50 text-purple-600 dark:text-purple-400 border border-purple-200 dark:border-purple-900/50">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-slate-900 dark:text-white">Skills & Department Contribution</h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Share your expertise and guest interaction preferences</p>
                </div>
              </div>

              <div className="space-y-5">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                    Technical Skills (Comma separated)
                  </label>
                  <input
                    type="text"
                    name="skills"
                    value={Array.isArray(formData.skills) ? formData.skills.join(', ') : (formData.skills || '')}
                    onChange={handleSkillsChange}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-300 dark:border-slate-600 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:bg-white dark:focus:bg-slate-900 focus:border-blue-600 focus:ring-2 focus:ring-blue-500/20 outline-none transition text-sm shadow-sm"
                    placeholder="e.g., React, Node.js, Python, Cloud Architecture, DevOps"
                  />

                  {/* Dynamic Skills Badges Preview */}
                  {Array.isArray(formData.skills) && formData.skills.filter(Boolean).length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-3">
                      {formData.skills.filter(Boolean).map((skill, idx) => (
                        <span 
                          key={idx} 
                          className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-blue-50 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800"
                        >
                          <Check className="w-3 h-3 text-blue-500" />
                          {skill.trim()}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-2">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                      Other Specializations / Interests
                    </label>
                    <input
                      type="text"
                      name="otherSkill"
                      value={formData.otherSkill || ''}
                      onChange={handleChange}
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-300 dark:border-slate-600 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:bg-white dark:focus:bg-slate-900 focus:border-blue-600 focus:ring-2 focus:ring-blue-500/20 outline-none transition text-sm shadow-sm"
                      placeholder="e.g., Mentorship, AI Research, Public Speaking"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                      Session & Guest Lecture Consent
                    </label>
                    <select
                      name="sessionConsent"
                      value={formData.sessionConsent || ''}
                      onChange={handleChange}
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-300 dark:border-slate-600 text-slate-900 dark:text-slate-100 focus:bg-white dark:focus:bg-slate-900 focus:border-blue-600 focus:ring-2 focus:ring-blue-500/20 outline-none transition text-sm shadow-sm"
                    >
                      <option value="">Select Availability</option>
                      <option value="Yes">Yes, willing to take sessions / workshops</option>
                      <option value="Online Only">Yes, online sessions only</option>
                      <option value="Weekends Only">Yes, weekends only</option>
                      <option value="No">Currently not available</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            {/* Save Button */}
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={isSaving}
                className={`inline-flex items-center gap-2.5 px-8 py-3.5 rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 hover:from-blue-700 hover:to-indigo-800 text-white font-bold text-base shadow-xl shadow-blue-500/25 transition transform hover:-translate-y-0.5 active:translate-y-0 ${
                  isSaving ? 'opacity-70 cursor-not-allowed' : ''
                }`}
              >
                <Save className="w-5 h-5" />
                <span>{isSaving ? 'Saving Profile...' : 'Save Profile Changes'}</span>
              </button>
            </div>
          </form>
        )}

        {/* TAB 2: MY POSTED JOBS */}
        {activeTab === 'jobs' && (
          <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-700 shadow-md">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 mb-6 border-b border-slate-100 dark:border-slate-700/80">
              <div>
                <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2.5">
                  <Briefcase className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  My Posted Career Opportunities
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  Manage internships and job openings you posted for DCS Punjabi University students and alumni
                </p>
              </div>

              <button
                onClick={() => setActiveTab('post-job')}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition shadow-sm"
              >
                <PlusCircle className="w-4 h-4" />
                <span>Post Another Job</span>
              </button>
            </div>

            {myJobs.length === 0 ? (
              <div className="text-center py-16 px-4 bg-slate-50 dark:bg-slate-900/50 rounded-2xl border border-dashed border-slate-200 dark:border-slate-700">
                <Briefcase className="w-12 h-12 text-slate-400 mx-auto mb-3 opacity-60" />
                <h3 className="text-base font-bold text-slate-700 dark:text-slate-300">No Job Opportunities Posted Yet</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-sm mx-auto">
                  Help fellow alumni and graduating students by sharing opportunities from your organization.
                </p>
                <button
                  onClick={() => setActiveTab('post-job')}
                  className="mt-5 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition shadow-md"
                >
                  <PlusCircle className="w-4 h-4" />
                  <span>Post First Job</span>
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {myJobs.map(job => (
                  <div 
                    key={job._id} 
                    className="p-5 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50/70 dark:bg-slate-900/50 hover:shadow-md transition-shadow"
                  >
                    {editingJob === job._id ? (
                      <form onSubmit={handleUpdateJob} className="space-y-4">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <input 
                            type="text" 
                            name="title" 
                            value={editFormData.title || ''} 
                            onChange={e => setEditFormData({...editFormData, title: e.target.value})} 
                            className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white" 
                            placeholder="Job Title" 
                            required 
                          />
                          <input 
                            type="text" 
                            name="company" 
                            value={editFormData.company || ''} 
                            onChange={e => setEditFormData({...editFormData, company: e.target.value})} 
                            className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white" 
                            placeholder="Company" 
                            required 
                          />
                          <input 
                            type="text" 
                            name="location" 
                            value={editFormData.location || ''} 
                            onChange={e => setEditFormData({...editFormData, location: e.target.value})} 
                            className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white" 
                            placeholder="Location" 
                            required 
                          />
                          <select 
                            name="type" 
                            value={editFormData.type || 'Full-Time'} 
                            onChange={e => setEditFormData({...editFormData, type: e.target.value})} 
                            className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                          >
                            <option value="Full-Time">Full-Time</option>
                            <option value="Part-Time">Part-Time</option>
                            <option value="Internship">Internship</option>
                            <option value="Remote">Remote</option>
                          </select>
                        </div>
                        <textarea 
                          name="description" 
                          value={editFormData.description || ''} 
                          onChange={e => setEditFormData({...editFormData, description: e.target.value})} 
                          className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white" 
                          rows="3" 
                          placeholder="Job description..." 
                          required 
                        />
                        <input 
                          type="url" 
                          name="applyLink" 
                          value={editFormData.applyLink || ''} 
                          onChange={e => setEditFormData({...editFormData, applyLink: e.target.value})} 
                          className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white" 
                          placeholder="Application URL" 
                          required 
                        />
                        <div className="flex gap-2 justify-end pt-1">
                          <button 
                            type="button" 
                            onClick={() => setEditingJob(null)} 
                            className="px-4 py-2 rounded-xl text-xs font-semibold bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-300 transition"
                          >
                            Cancel
                          </button>
                          <button 
                            type="submit" 
                            className="px-4 py-2 rounded-xl text-xs font-semibold bg-emerald-600 text-white hover:bg-emerald-700 transition shadow"
                          >
                            Save Changes
                          </button>
                        </div>
                      </form>
                    ) : (
                      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <h3 className="text-base font-bold text-slate-900 dark:text-white">{job.title}</h3>
                            <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300">
                              {job.type}
                            </span>
                          </div>
                          <p className="text-xs font-medium text-slate-600 dark:text-slate-400">
                            {job.company} • {job.location}
                          </p>
                          {job.applyLink && (
                            <a 
                              href={job.applyLink} 
                              target="_blank" 
                              rel="noopener noreferrer" 
                              className="inline-flex items-center gap-1 text-xs text-blue-600 dark:text-blue-400 hover:underline pt-0.5"
                            >
                              <span>Apply Link</span>
                              <ExternalLink className="w-3 h-3" />
                            </a>
                          )}
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleEditClick(job)}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 hover:bg-blue-100 text-xs font-semibold transition"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                            <span>Edit</span>
                          </button>
                          <button
                            onClick={() => handleDeleteJob(job._id)}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 hover:bg-red-100 text-xs font-semibold transition"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            <span>Delete</span>
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 3: POST A JOB */}
        {activeTab === 'post-job' && (
          <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-700 shadow-md">
            <JobForm />
          </div>
        )}

      </div>
    </div>
  );
};

export default ProfilePage;