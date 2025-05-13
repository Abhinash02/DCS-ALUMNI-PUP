// components/ProfilePage.jsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

// UI Components
const Container = ({ children }) => {
  return (
    <div className="min-h-screen bg-hoverBlue p-6">
      <div className="max-w-4xl mx-auto pt-20">
        {children}
      </div>
    </div>
  );
};

const Card = ({ children }) => {
  return (
    <div className="bg-white p-8 rounded-lg shadow-lg border-t-4 border-blue">
      {children}
    </div>
  );
};

// Common Components
const AlertMessage = ({ success, error }) => {
  if (!success && !error) return null;
  
  const isSuccess = Boolean(success);
  const message = isSuccess ? success : error;
  
  return (
    <div 
      className={`mb-6 p-4 rounded-lg font-poppins ${
        isSuccess ? 'bg-hoverBlue text-blue' : 'bg-red-50 text-red-800'
      }`}
    >
      <p className="text-sm font-medium">{message}</p>
    </div>
  );
};

const FormField = ({ name, label, value, onChange }) => {
  return (
    <div className="flex flex-col">
      <label className="block text-gray text-sm font-medium mb-1 font-poppins">
        {label}
      </label>
      <input
        type="text"
        name={name}
        value={value || ''}
        onChange={onChange}
        className="w-full px-3 py-2 border border-lightBlue rounded-lg focus:ring-2 focus:ring-blue focus:border-blue transition duration-200 font-poppins"
      />
    </div>
  );
};

const FileUpload = ({ name, label, onChange }) => {
  return (
    <div className="flex flex-col">
      <label className="block text-gray-700 text-sm font-medium mb-1">
        {label}
      </label>
      <input
        type="file"
        name={name}
        onChange={onChange}
        className="w-full px-3 py-2 border border-lightBlue rounded-lg focus:ring-2 focus:ring-blue focus:border-blue transition duration-200 text-sm font-poppins"
      />
    </div>
  );
};

// Profile Components
const FormSection = ({ title, children }) => {
  return (
    <div className="border-b border-lightBlue pb-6">
      <h3 className="text-lg font-semibold text-blue mb-4 font-mons">{title}</h3>
      {children}
    </div>
  );
};

const ProfileHeader = ({ onLogout }) => {
  return (
    <div className="flex justify-between items-center mb-6">
      <h2 className="text-2xl font-bold text-darkBlue font-mons">Update Profile</h2>
      <button
        onClick={onLogout}
        className="bg-darkBlue text-white px-4 py-2 rounded-lg hover:bg-blue transition duration-200"
      >
        Logout
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
    <form onSubmit={onSubmit} className="space-y-6">
      <FormSection title="Personal Information">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

      <FormSection title="Academic Information">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

      <FormSection title="Professional Information">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

      <FormSection title="Skills & Other Information">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            name="skills"
            label="Skills (comma-separated)"
            value={formData.skills.join(', ')}
            onChange={onSkillsChange}
          />
          <FileUpload
            name="photo"
            label="Profile Photo"
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
        className="w-full bg-blue text-white py-3 px-4 rounded-lg hover:bg-darkBlue transition duration-200 font-medium font-mons"
      >
        Update Profile
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
  
    const [status, setStatus] = useState({ success: '', error: '' });
    const navigate = useNavigate();
  
    useEffect(() => {
      const token = localStorage.getItem('token');
  
      if (!token) {
        navigate('/UserLogin'); // Redirect if no token
      } else {
        loadProfileData();
      }
    }, []);
  
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
        setStatus({ success: 'Profile updated successfully', error: '' });
        localStorage.setItem('alumni', JSON.stringify(response.data.alumni));
      } catch (err) {
        setStatus({
          success: '',
          error: err.response?.data?.error || 'Update failed'
        });
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
      return await axios.put('https://dcsalumni.vishalpup.in/api/alumni/profile', data, {
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
  
          {(status.success || status.error) && (
            <AlertMessage success={status.success} error={status.error} />
          )}
  
          <ProfileForm
            formData={formData}
            onChange={handleChange}
            onSkillsChange={handleSkillsChange}
            onFileChange={handleFileChange}
            onSubmit={handleSubmit}
          />
        </Card>
      </Container>
    );
  };
  
  export default ProfilePage;