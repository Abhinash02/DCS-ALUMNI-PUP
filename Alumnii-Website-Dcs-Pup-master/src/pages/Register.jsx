import React, { useState } from 'react';
import API from '../api/api';
import Select from 'react-select';
import { Upload, CheckCircle, ChevronRight, Eye, EyeOff, AlertCircle, Check } from 'lucide-react';
import { useForm, Controller } from 'react-hook-form';

// PasswordField with real-time requirements validation and visible red indication
const PasswordField = ({ label, id, name, required, register, rules, errors, watch }) => {
  const [showPassword, setShowPassword] = useState(false);
  const value = watch ? (watch(name) || '') : '';
  const errorId = `${id}-error`;

  const hasMinLength = value.length >= 8;
  const hasUpper = /[A-Z]/.test(value);
  const hasLower = /[a-z]/.test(value);
  const hasNumber = /\d/.test(value);
  const hasSpecial = /[@$!%*?&]/.test(value);

  return (
    <div className="mb-5">
      <label htmlFor={id} className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
        {label} {required && <span className="text-red-500 font-bold">*</span>}
      </label>

      <div className="relative">
        <input
          id={id}
          type={showPassword ? 'text' : 'password'}
          {...register(name, rules)}
          placeholder="Enter a secure password"
          className="w-full px-4 py-2.5 pr-11 border border-slate-300 dark:border-slate-600 rounded-xl shadow-sm focus:ring-2 focus:ring-blue/30 focus:border-blue bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 placeholder-slate-400 transition-all font-medium text-sm"
          aria-describedby={errors[name] ? errorId : undefined}
        />
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors p-1 focus:outline-none"
          aria-label={showPassword ? 'Hide password' : 'Show password'}
        >
          {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
        </button>
      </div>

      {/* Password Requirement Indication in Red */}
      <div className="mt-2.5 p-3 rounded-xl bg-red-50/80 dark:bg-red-950/40 border border-red-200 dark:border-red-900/60 shadow-sm">
        <div className="flex items-center gap-1.5 text-xs font-bold text-red-600 dark:text-red-400 mb-2">
          <AlertCircle className="w-4 h-4 flex-shrink-0 text-red-500" />
          <span>Password must include uppercase, lowercase, number, and special character</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-[11px] font-semibold">
          <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg border transition-all ${
            hasMinLength 
              ? 'text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/50 border-emerald-300 dark:border-emerald-800' 
              : 'text-red-600 dark:text-red-400 bg-white/90 dark:bg-slate-800/90 border-red-200 dark:border-red-900/50'
          }`}>
            {hasMinLength ? <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 flex-shrink-0" /> : <span className="w-1.5 h-1.5 rounded-full bg-red-500 flex-shrink-0"></span>}
            <span>At least 8 characters</span>
          </div>
          <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg border transition-all ${
            hasUpper 
              ? 'text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/50 border-emerald-300 dark:border-emerald-800' 
              : 'text-red-600 dark:text-red-400 bg-white/90 dark:bg-slate-800/90 border-red-200 dark:border-red-900/50'
          }`}>
            {hasUpper ? <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 flex-shrink-0" /> : <span className="w-1.5 h-1.5 rounded-full bg-red-500 flex-shrink-0"></span>}
            <span>Uppercase letter (A-Z)</span>
          </div>
          <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg border transition-all ${
            hasLower 
              ? 'text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/50 border-emerald-300 dark:border-emerald-800' 
              : 'text-red-600 dark:text-red-400 bg-white/90 dark:bg-slate-800/90 border-red-200 dark:border-red-900/50'
          }`}>
            {hasLower ? <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 flex-shrink-0" /> : <span className="w-1.5 h-1.5 rounded-full bg-red-500 flex-shrink-0"></span>}
            <span>Lowercase letter (a-z)</span>
          </div>
          <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg border transition-all ${
            hasNumber 
              ? 'text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/50 border-emerald-300 dark:border-emerald-800' 
              : 'text-red-600 dark:text-red-400 bg-white/90 dark:bg-slate-800/90 border-red-200 dark:border-red-900/50'
          }`}>
            {hasNumber ? <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 flex-shrink-0" /> : <span className="w-1.5 h-1.5 rounded-full bg-red-500 flex-shrink-0"></span>}
            <span>Number (0-9)</span>
          </div>
          <div className={`sm:col-span-2 flex items-center gap-1.5 px-2.5 py-1 rounded-lg border transition-all ${
            hasSpecial 
              ? 'text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/50 border-emerald-300 dark:border-emerald-800' 
              : 'text-red-600 dark:text-red-400 bg-white/90 dark:bg-slate-800/90 border-red-200 dark:border-red-900/50'
          }`}>
            {hasSpecial ? <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 flex-shrink-0" /> : <span className="w-1.5 h-1.5 rounded-full bg-red-500 flex-shrink-0"></span>}
            <span>Special character (@$!%*?&)</span>
          </div>
        </div>
      </div>

      {errors[name] && (
        <p id={errorId} className="mt-1.5 text-xs font-bold text-red-600 dark:text-red-400 flex items-center gap-1">
          <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
          {errors[name].message}
        </p>
      )}
    </div>
  );
};

const Register = () => {
  const {
    register,
    handleSubmit,
    control,
    watch,
    formState: { errors, isSubmitting },
    setValue,
    trigger,
    setError,
    clearErrors
  } = useForm({
    defaultValues: {
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
      photo: null,
      sessionConsent: '',
      skills: [],
      otherSkill: '',
      password: '', // Added password field
    },
  });

  const [activeStep, setActiveStep] = useState(1);
  const [formSubmitted, setFormSubmitted] = useState(false);

  const selectedCourse = watch('course');

  // Dynamic Batch Options based on selected Course
  const getCourseDuration = (course) => {
    switch (course) {
      case 'BCA': return 3;
      case 'B.TECH': return 4;
      case 'M.TECH': return 2;
      case 'PHD': return 5;
      case 'MCA': return 2; // Can adjust logic here if MCA was 3 years in the past
      default: return 2; // Default fallback
    }
  };

  const duration = getCourseDuration(selectedCourse);

  // Generate batch options (1998-2030)
  const batchOptions = Array.from({ length: 33 }, (_, i) => {
    const start = 1998 + i;
    // Specific logic for MCA: 3 years before 2020, 2 years from 2020 onwards
    const end = (selectedCourse === 'MCA' && start < 2020) ? start + 3 : start + duration;
    return { label: `${start}-${end}`, value: `${start}-${end}` };
  });

  const courseOptions = ['BCA', 'MCA', 'B.TECH', 'M.TECH', 'PHD'];
  const professionOptions = [
    'Trainee', 'Govt Job','MERN Stack', 'Own Business', 'Internship', 'Teacher/Professor',
    'Full Stack Developer', 'Data Scientist', 'Cybersecurity Analyst', 'Network Engineer',
    'Cloud Security Expert', 'DevOps Engineer', 'Research Scientist', 'IT Consultant',
    'System Administrator', 'Blockchain Developer',
  ];

  const skillOptions = [
    'Python', 'C', 'C++', 'Java', 'JavaScript', 'PHP', 'SQL', 'Power BI',
    'MERN Stack', 'MEAN Stack Devloper', 'Full Stack Developer',
    'AI', 'ML', 'DL', 'CN',
    'Java & Spring Boot', 'Microservices Architecture', 'Cloud-Native Apps',
    'Team Lead - Quality Assurance', 'Scrum Master',
    'UI/UX & Design', 'Front-End Development', 'Mobile App Development',
    'Cloud & Security', 'Database Management & Backend Development', 'Others',
  ];

  const nextStep = async () => {
    let isValid = false;
    if (activeStep === 1) {
      isValid = await trigger(['name', 'fathername', 'email', 'phone', 'password', 'address']);
    } else if (activeStep === 2) {
      isValid = await trigger(['course', 'batch', 'profession', 'organization', 'linkedin', 'website']);
    } else if (activeStep === 3) {
      isValid = await trigger(['skills', 'otherSkill', 'sessionConsent']);
      const photo = watch('photo');
      if (!photo) {
        setError('photo', { type: 'manual', message: 'Profile photo is required' });
        isValid = false;
      } else if (photo.size > 10 * 1024 * 1024) {
        setError('photo', { type: 'manual', message: 'File size must be less than 10MB' });
        isValid = false;
      } else {
        clearErrors('photo');
      }
    } else {
      isValid = true;
    }

    if (isValid) {
      setActiveStep((prev) => prev + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const prevStep = () => {
    setActiveStep((prev) => prev - 1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const onSubmit = async (data) => {
    try {
      const formData = new FormData();
      for (const key in data) {
        if (key === 'skills') {
          formData.append(key, JSON.stringify(data[key]));
        } else if (key === 'photo' && data[key]) {
          formData.append(key, data[key]);
        } else {
          formData.append(key, data[key]);
        }
      }

      await API.post('/alumni', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      setFormSubmitted(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err) {
      console.error('Upload Error:', err.response?.data || err.message);
      alert('Registration failed. Please try again.');
    }
  };

  const FormField = ({
    label,
    id,
    name,
    type = 'text',
    required = false,
    options,
    children,
    control,
    rules = {},
    ...rest
  }) => {
    const errorId = `${id}-error`;
    const hasError = !!errors[name];

    if (type === 'select') {
      return (
        <div className="mb-5">
          <label htmlFor={id} className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
            {label} {required && <span className="text-red-500 font-bold ml-1">*</span>}
          </label>
          <Controller
            name={name}
            control={control}
            rules={rules}
            render={({ field }) => (
              <select
                id={id}
                {...field}
                className={`w-full px-4 py-2.5 border rounded-xl shadow-sm transition-all font-medium text-sm text-slate-800 dark:text-slate-100 ${
                  hasError
                    ? 'border-red-500 focus:ring-2 focus:ring-red-500/30 focus:border-red-500 bg-red-50/20 dark:bg-red-950/20'
                    : 'border-slate-300 dark:border-slate-600 focus:ring-2 focus:ring-blue/30 focus:border-blue bg-white dark:bg-slate-800'
                }`}
                aria-describedby={hasError ? errorId : undefined}
              >
                <option value="">Select {label}</option>
                {options.map((option) => (
                  <option key={typeof option === 'object' ? option.value : option} value={typeof option === 'object' ? option.value : option}>
                    {typeof option === 'object' ? option.label : option}
                  </option>
                ))}
              </select>
            )}
          />
          {hasError && (
            <p id={errorId} className="mt-1.5 text-xs font-bold text-red-600 dark:text-red-400 flex items-center gap-1.5 animate-fadeIn">
              <AlertCircle className="w-3.5 h-3.5 flex-shrink-0 text-red-500" />
              <span>{errors[name].message}</span>
            </p>
          )}
        </div>
      );
    } else if (type === 'textarea') {
      return (
        <div className="mb-5">
          <label htmlFor={id} className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
            {label} {required && <span className="text-red-500 font-bold ml-1">*</span>}
          </label>
          <textarea
            id={id}
            {...register(name, rules)}
            rows="3"
            className={`w-full px-4 py-2.5 border rounded-xl shadow-sm placeholder-slate-400 transition-all font-medium text-sm text-slate-800 dark:text-slate-100 ${
              hasError
                ? 'border-red-500 focus:ring-2 focus:ring-red-500/30 focus:border-red-500 bg-red-50/20 dark:bg-red-950/20'
                : 'border-slate-300 dark:border-slate-600 focus:ring-2 focus:ring-blue/30 focus:border-blue bg-white dark:bg-slate-800'
            }`}
            aria-describedby={hasError ? errorId : undefined}
            {...rest}
          ></textarea>
          {hasError && (
            <p id={errorId} className="mt-1.5 text-xs font-bold text-red-600 dark:text-red-400 flex items-center gap-1.5 animate-fadeIn">
              <AlertCircle className="w-3.5 h-3.5 flex-shrink-0 text-red-500" />
              <span>{errors[name].message}</span>
            </p>
          )}
        </div>
      );
    } else if (type === 'radio') {
      return (
        <div className="mb-5">
          <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2.5">
            {label} {required && <span className="text-red-500 font-bold ml-1">*</span>}
          </label>
          <div className="flex space-x-6">
            {children}
          </div>
          {hasError && (
            <p id={errorId} className="mt-1.5 text-xs font-bold text-red-600 dark:text-red-400 flex items-center gap-1.5 animate-fadeIn">
              <AlertCircle className="w-3.5 h-3.5 flex-shrink-0 text-red-500" />
              <span>{errors[name].message}</span>
            </p>
          )}
        </div>
      );
    } else {
      return (
        <div className="mb-5">
          <label htmlFor={id} className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
            {label} {required && <span className="text-red-500 font-bold ml-1">*</span>}
          </label>
          <input
            id={id}
            type={type}
            {...register(name, rules)}
            className={`w-full px-4 py-2.5 border rounded-xl shadow-sm placeholder-slate-400 transition-all font-medium text-sm text-slate-800 dark:text-slate-100 ${
              hasError
                ? 'border-red-500 focus:ring-2 focus:ring-red-500/30 focus:border-red-500 bg-red-50/20 dark:bg-red-950/20'
                : 'border-slate-300 dark:border-slate-600 focus:ring-2 focus:ring-blue/30 focus:border-blue bg-white dark:bg-slate-800'
            }`}
            aria-describedby={hasError ? errorId : undefined}
            {...rest}
          />
          {hasError && (
            <p id={errorId} className="mt-1.5 text-xs font-bold text-red-600 dark:text-red-400 flex items-center gap-1.5 animate-fadeIn">
              <AlertCircle className="w-3.5 h-3.5 flex-shrink-0 text-red-500" />
              <span>{errors[name].message}</span>
            </p>
          )}
        </div>
      );
    }
  };

  const SectionCard = ({ title, children, icon }) => (
    <div className="bg-white/95 dark:bg-slate-800/90 backdrop-blur-md p-6 sm:p-8 rounded-3xl border border-slate-200/80 dark:border-slate-700 shadow-sm hover:shadow-md transition-shadow mb-8">
      <div className="flex items-center mb-6 pb-3 border-b border-slate-100 dark:border-slate-700/80">
        {icon && <span className="mr-3 text-blue dark:text-sky-400 text-xl">{icon}</span>}
        <h2 className="text-xl font-bold text-darkBlue dark:text-sky-300 tracking-tight">{title}</h2>
      </div>
      {children}
    </div>
  );

  const steps = [
    { id: 1, name: 'Personal Details' },
    { id: 2, name: 'Academic & Career' },
    { id: 3, name: 'Skills & Photo' },
    { id: 4, name: 'Review & Finish' },
  ];

  const Button = ({ onClick, type = 'button', disabled = false, variant = 'primary', children }) => {
    const baseClasses = 'px-6 py-2.5 font-semibold rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 transition-all duration-200 active:scale-95 text-sm';
    const variants = {
      primary: 'bg-darkBlue text-white hover:bg-blue focus:ring-blue disabled:opacity-50 shadow-md hover:shadow-lg',
      secondary: 'bg-white dark:bg-slate-800 text-darkBlue dark:text-sky-400 border border-darkBlue dark:border-sky-400/50 hover:bg-blue-50 dark:hover:bg-slate-700 focus:ring-blue',
      success: 'bg-emerald-600 text-white hover:bg-emerald-700 focus:ring-emerald-500 shadow-md',
    };

    return (
      <button
        type={type}
        onClick={onClick}
        disabled={disabled}
        className={`${baseClasses} ${variants[variant]}`}
      >
        {children}
      </button>
    );
  };

  if (formSubmitted) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-slate-950 pt-24 pb-16 px-4">
        <div className="max-w-md mx-auto p-8 sm:p-10 bg-white dark:bg-slate-900 rounded-3xl shadow-xl border border-slate-100 dark:border-slate-800 text-center animate-loader-fade-in">
          <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto mb-5 shadow-inner">
            <CheckCircle className="h-10 w-10" />
          </div>
          <span className="inline-block px-3 py-1 rounded-full bg-blue/10 dark:bg-sky-400/10 text-blue dark:text-sky-400 text-xs font-bold uppercase tracking-wider mb-2">
            Verification Pending
          </span>
          <h1 className="text-2xl font-extrabold text-darkBlue dark:text-sky-300 mb-2">
            Registration Submitted!
          </h1>
          <p className="text-slate-600 dark:text-slate-300 text-sm mb-6 leading-relaxed">
            Thank you for registering with DCS Alumni Portal. Once verified by our department administrators, your profile will be published on the directory.
          </p>
          <Button variant="primary" onClick={() => window.location.href = '/'}>
            Return to Homepage
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0b1120] pt-20 transition-colors duration-300">
      {/* Header Banner */}
      <div className="relative overflow-hidden bg-gradient-to-r from-darkBlue via-[#005b96] to-darkBlue py-10 sm:py-14 mb-8 shadow-md">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-sky-400/20 via-transparent to-transparent pointer-events-none" />
        <div className="container mx-auto px-4 relative z-10 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white/90 text-xs font-semibold uppercase tracking-wider mb-3 shadow-sm">
            🎓 Punjabi University Patiala
          </div>
          <h1 className="text-2xl xs:text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            DCS Alumni Registration
          </h1>
          <p className="text-xs xs:text-sm sm:text-base text-blue-100 mt-2.5 max-w-2xl mx-auto leading-relaxed">
            Join thousands of DCS alumni worldwide. Complete this verified registration form to showcase your professional profile in our official portal.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 max-w-4xl pb-16">
        {/* Progress Indicator Stepper */}
        <div className="mb-10 bg-white/80 dark:bg-slate-800/80 backdrop-blur-md p-5 sm:p-6 rounded-2xl border border-slate-200/80 dark:border-slate-700 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            {steps.map((step) => {
              const isPassed = activeStep > step.id;
              const isCurrent = activeStep === step.id;

              return (
                <div
                  key={step.id}
                  className={`flex flex-col items-center flex-1 ${
                    isCurrent 
                      ? 'text-darkBlue dark:text-sky-400 font-bold' 
                      : isPassed 
                        ? 'text-blue dark:text-sky-300' 
                        : 'text-slate-400 dark:text-slate-500'
                  }`}
                >
                  <div
                    className={`flex items-center justify-center w-8 h-8 sm:w-9 sm:h-9 rounded-full font-bold text-xs sm:text-sm mb-1.5 transition-all duration-300 shadow-sm
                      ${isPassed 
                        ? 'bg-darkBlue dark:bg-sky-500 text-white' 
                        : isCurrent 
                          ? 'bg-blue text-white ring-4 ring-blue/20 dark:ring-sky-400/30' 
                          : 'bg-slate-100 dark:bg-slate-700 text-slate-400 dark:text-slate-400 border border-slate-300 dark:border-slate-600'}`}
                  >
                    {isPassed ? <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5" /> : step.id}
                  </div>
                  <span className="text-[10px] sm:text-xs text-center font-medium leading-tight">
                    {step.name}
                  </span>
                </div>
              );
            })}
          </div>
          <div className="relative mx-3 sm:mx-6">
            <div className="h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-darkBlue via-blue to-sky-400 rounded-full transition-all duration-500 ease-out"
                style={{ width: `${(activeStep - 1) * 100 / (steps.length - 1)}%` }}
              ></div>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)}>
          {/* Step 1: Personal Information */}
          {activeStep === 1 && (
            <SectionCard title="Personal Information">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6">
                <FormField
                  label="Full Name"
                  id="name"
                  name="name"
                  control={control}
                  rules={{ required: 'Full name is required' }}
                  required
                />
                <FormField
                  label="Father's Name"
                  id="fathername"
                  name="fathername"
                  control={control}
                  rules={{ required: "Father's name is required" }}
                  required
                />
                <FormField
                  label="Email Address"
                  id="email"
                  name="email"
                  type="email"
                  control={control}
                  rules={{
                    required: 'Email is required',
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: 'Invalid email address',
                    },
                  }}
                  required
                />
                <FormField
                  label="Phone Number"
                  id="phone"
                  name="phone"
                  type="tel"
                  control={control}
                  rules={{
                    required: 'Phone number is required',
                    pattern: {
                      value: /^[0-9]{10,15}$/,
                      message: 'Invalid phone number',
                    },
                  }}
                  required
                />
                <PasswordField
                  label="Password"
                  id="password"
                  name="password"
                  register={register}
                  watch={watch}
                  errors={errors}
                  rules={{
                    required: 'Password is required',
                    minLength: {
                      value: 8,
                      message: 'Password must be at least 8 characters long',
                    },
                    pattern: {
                      value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
                      message: 'Password must include uppercase, lowercase, number, and special character',
                    },
                  }}
                  required
                />
                <div className="md:col-span-2">
                  <FormField
                    label="Full Address"
                    id="address"
                    name="address"
                    type="textarea"
                    control={control}
                    rules={{ required: 'Address is required' }}
                    required
                  />
                </div>
              </div>
              <div className="flex justify-end mt-6">
                <Button onClick={nextStep}>
                  <span className="flex items-center">
                    Next Step <ChevronRight className="ml-1 h-4 w-4" />
                  </span>
                </Button>
              </div>
            </SectionCard>
          )}

          {/* Step 2: Academic & Professional Information */}
          {activeStep === 2 && (
            <>
              <SectionCard title="Academic Information">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6">
                  <FormField
                    label="Course"
                    id="course"
                    name="course"
                    type="select"
                    control={control}
                    options={courseOptions}
                    rules={{ required: 'Course selection is required' }}
                    required
                  />
                  <FormField
                    label="Batch"
                    id="batch"
                    name="batch"
                    type="select"
                    control={control}
                    options={batchOptions}
                    rules={{ required: 'Batch selection is required' }}
                    required
                  />
                </div>
              </SectionCard>
              <SectionCard title="Professional Information">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6">
                  <FormField
                    label="Current Profession"
                    id="profession"
                    name="profession"
                    type="select"
                    control={control}
                    options={professionOptions}
                    rules={{ required: 'Profession selection is required' }}
                    required
                  />
                  <FormField
                    label="Organization/Company"
                    id="organization"
                    name="organization"
                    control={control}
                    rules={{ required: 'Organization is required' }}
                    required
                  />
                  <FormField
                    label="LinkedIn Profile URL"
                    id="linkedin"
                    name="linkedin"
                    type="url"
                    control={control}
                    rules={{
                      pattern: {
                        value: /^(https?:\/\/)?([\w\d-]+\.)?linkedin\.com\/.*/i,
                        message: 'Please enter a valid LinkedIn URL',
                      },
                    }}
                  />
                  <FormField
                    label="Personal/Company Website"
                    id="website"
                    name="website"
                    type="url"
                    control={control}
                    rules={{
                      pattern: {
                        value: /^(https?:\/\/)?(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&//=]*)/i,
                        message: 'Please enter a valid website URL',
                      },
                    }}
                  />
                </div>
              </SectionCard>
              <div className="flex justify-between mt-6">
                <Button onClick={prevStep} variant="secondary">
                  Back
                </Button>
                <Button onClick={nextStep}>
                  <span className="flex items-center">
                    Next Step <ChevronRight className="ml-1 h-4 w-4" />
                  </span>
                </Button>
              </div>
            </>
          )}

          {/* Step 3: Skills & Photo */}
          {activeStep === 3 && (
            <>
              <SectionCard title="Skills & Expertise">
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Skills (Select Multiple) <span className="text-red-500">*</span>
                  </label>
                  <Controller
                    name="skills"
                    control={control}
                    rules={{ required: 'At least one skill is required' }}
                    render={({ field }) => (
                      <Select
                        isMulti
                        options={skillOptions.map((skill) => ({ label: skill, value: skill }))}
                        className="basic-multi-select"
                        classNamePrefix="select"
                        onChange={(selected) => {
                          const selectedValues = selected ? selected.map((s) => s.value) : [];
                          field.onChange(selectedValues);
                          setValue('skills', selectedValues);
                        }}
                        value={field.value?.map((val) => ({ label: val, value: val }))}
                        styles={{
                          control: (base) => ({
                            ...base,
                            borderRadius: '0.5rem',
                            padding: '2px',
                            borderColor: errors.skills ? '#ef4444' : '#d1d5db',
                            '&:hover': {
                              borderColor: errors.skills ? '#ef4444' : '#6366f1',
                            },
                          }),
                          multiValue: (base) => ({
                            ...base,
                            backgroundColor: '#e0f2fe',
                            borderRadius: '0.375rem',
                          }),
                          multiValueLabel: (base) => ({
                            ...base,
                            color: '#1e40af',
                          }),
                          multiValueRemove: (base) => ({
                            ...base,
                            color: '#1e40af',
                            '&:hover': {
                              backgroundColor: '#bfdbfe',
                              color: '#1e3a8a',
                            },
                          }),
                        }}
                      />
                    )}
                  />
                  {errors.skills && (
                    <p className="mt-1 text-sm text-red-600">{errors.skills.message}</p>
                  )}
                  {watch('skills')?.includes('Others') && (
                    <div className="mt-3">
                      <FormField
                        label="Please specify other skills"
                        id="otherSkill"
                        name="otherSkill"
                        control={control}
                        rules={{
                          required: watch('skills')?.includes('Others') ? 'Please specify your other skills' : false,
                        }}
                      />
                    </div>
                  )}
                </div>
                <div className="mt-6 p-5 bg-lightBlue/10 rounded-lg border border-lightBlue/20">
                  <FormField
                    label="Will you be able to deliver a talk or conduct an interaction session (Online/offline) with your alma mater's students to guide them in their careers and employment?"
                    type="radio"
                    required
                  >
                    <label className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="radio"
                        value="Yes"
                        {...register('sessionConsent', { required: 'This selection is required' })}
                        className="focus:ring-blue h-4 w-4 text-blue border-gray-300"
                      />
                      <span className="text-gray-700 dark:text-gray-300 font-medium">Yes</span>
                    </label>
                    <label className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="radio"
                        value="No"
                        {...register('sessionConsent')}
                        className="focus:ring-blue h-4 w-4 text-blue border-gray-300"
                      />
                      <span className="text-gray-700 dark:text-gray-300 font-medium">No</span>
                    </label>
                  </FormField>
                  {errors.sessionConsent && (
                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.sessionConsent.message}</p>
                  )}
                </div>
              </SectionCard>
              <SectionCard title="Photo Upload">
                <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-blue/20 border-dashed rounded-2xl bg-blue/5 dark:bg-slate-800/50">
                  <div className="space-y-1.5 text-center">
                    <Upload className="mx-auto h-12 w-12 text-blue dark:text-sky-400" />
                    <div className="flex text-sm text-gray-600 dark:text-gray-300 justify-center">
                      <label
                        htmlFor="photo-upload"
                        className="relative cursor-pointer bg-white dark:bg-slate-800 rounded-xl font-semibold text-blue dark:text-sky-400 hover:text-darkBlue focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue px-4 py-2 shadow-sm border border-slate-200 dark:border-slate-700"
                      >
                        <span>Choose Photo</span>
                        <input
                          id="photo-upload"
                          type="file"
                          accept="image/*"
                          className="sr-only"
                          onChange={(e) => {
                            const file = e.target.files[0];
                            setValue('photo', file);
                            if (file) {
                              if (file.size > 10 * 1024 * 1024) {
                                setError('photo', { type: 'manual', message: 'File size must be less than 10MB' });
                              } else {
                                clearErrors('photo');
                              }
                            } else {
                               setError('photo', { type: 'manual', message: 'Profile photo is required' });
                            }
                          }}
                        />
                      </label>
                      <p className="pl-2 flex items-center font-medium">or drag and drop</p>
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400">PNG, JPG, JPEG up to 10MB</p>
                    {watch('photo') && (
                      <div className="mt-3 bg-white dark:bg-slate-800 px-4 py-2 rounded-xl border border-blue/20 dark:border-sky-400/20 shadow-sm inline-block">
                        <p className="text-sm text-blue dark:text-sky-300 font-semibold flex items-center">
                          <CheckCircle className="h-4 w-4 mr-1.5 text-emerald-500" />
                          {watch('photo').name}
                        </p>
                      </div>
                    )}
                    {errors.photo && (
                      <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.photo.message}</p>
                    )}
                  </div>
                </div>
              </SectionCard>
              <div className="flex justify-between mt-6">
                <Button onClick={prevStep} variant="secondary">
                  Back
                </Button>
                <Button onClick={nextStep}>
                  Review & Submit
                </Button>
              </div>
            </>
          )}

          {/* Step 4: Review & Submit */}
          {activeStep === 4 && (
            <>
              <SectionCard title="Review Your Information">
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                    <div>
                      <h3 className="text-sm font-semibold text-gray-500">Full Name</h3>
                      <p className="text-base text-gray-800">{watch('name') || 'Not provided'}</p>
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-gray-500">Father's Name</h3>
                      <p className="text-base text-gray-800">{watch('fathername') || 'Not provided'}</p>
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-gray-500">Email Address</h3>
                      <p className="text-base text-gray-800">{watch('email') || 'Not provided'}</p>
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-gray-500">Phone Number</h3>
                      <p className="text-base text-gray-800">{watch('phone') || 'Not provided'}</p>
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-gray-500">Password</h3>
                      <p className="text-base text-gray-800">********</p> {/* Masked for security */}
                    </div>
                    <div className="md:col-span-2">
                      <h3 className="text-sm font-semibold text-gray-500">Address</h3>
                      <p className="text-base text-gray-800">{watch('address') || 'Not provided'}</p>
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-gray-500">Course</h3>
                      <p className="text-base text-gray-800">{watch('course') || 'Not provided'}</p>
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-gray-500">Batch</h3>
                      <p className="text-base text-gray-800">{watch('batch') || 'Not provided'}</p>
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-gray-500">Current Profession</h3>
                      <p className="text-base text-gray-800">{watch('profession') || 'Not provided'}</p>
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-gray-500">Organization/Company</h3>
                      <p className="text-base text-gray-800">{watch('organization') || 'Not provided'}</p>
                    </div>
                    <div className="md:col-span-2">
                      <h3 className="text-sm font-semibold text-gray-500">Selected Skills</h3>
                      <div className="flex flex-wrap mt-1">
                        {watch('skills')?.length > 0 ? (
                          watch('skills').map((skill) => (
                            <span key={skill} className="bg-lightBlue/20 text-darkBlue text-xs font-medium mr-2 mb-2 px-2.5 py-1 rounded-full">
                              {skill}
                            </span>
                          ))
                        ) : (
                          <p className="text-base text-gray-800">No skills selected</p>
                        )}
                      </div>
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-gray-500">Can conduct sessions?</h3>
                      <p className="text-base text-gray-800">{watch('sessionConsent') || 'Not provided'}</p>
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-gray-500">Photo</h3>
                      <p className="text-base text-gray-800">{watch('photo')?.name || 'Not uploaded'}</p>
                    </div>
                  </div>
                </div>
              </SectionCard>
              <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6 rounded">
                <div className="flex">
                  <div className="ml-3">
                    <p className="text-sm text-yellow-700">
                      Please review your information carefully before submitting. After submission, you won't be able to make changes.
                    </p>
                  </div>
                </div>
              </div>
              <div className="flex justify-between mt-6">
                <Button onClick={prevStep} variant="secondary">
                  Back
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? 'Submitting...' : 'Complete Registration'}
                </Button>
              </div>
            </>
          )}
        </form>

        {/* Footer */}
        <div className="mt-12 text-center text-sm text-gray-500">
          <p>© {new Date().getFullYear()} University Alumni Association. All rights reserved.</p>
          <p className="mt-1">Thank you for registering with your alma mater. Your information helps us build a stronger alumni community. After approval from the admin, your data will be visible on the website.</p>
        </div>
      </div>
    </div>
  );
};

export default Register;