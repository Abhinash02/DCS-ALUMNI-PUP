import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
  Calendar,
  Sparkles,
  Search,
  X,
  ChevronLeft,
  ChevronRight,
  Maximize2,
  Trash2,
  Edit3,
  Image as ImageIcon,
  Plus,
  GraduationCap,
  Award,
  RotateCcw,
  Cpu,
  PartyPopper,
  Plane,
} from 'lucide-react';
import { toast } from 'react-toastify';
import API from '../api/api';
import eventData from '../data/EventData.json';

// Cloudinary image optimization: delivers fast WebP/AVIF images
const getOptimizedEventImageUrl = (url, width = 900) => {
  if (!url || typeof url !== 'string') return '';
  if (url.includes('cloudinary.com') && url.includes('/upload/')) {
    if (url.includes('/upload/f_auto,q_auto')) return url;
    return url.replace('/upload/', `/upload/f_auto,q_auto,w_${width}/`);
  }
  return url;
};

// Category classifier
const getEventCategory = (title = '', description = '') => {
  const text = `${title} ${description}`.toLowerCase();
  if (
    text.includes('farewell') ||
    text.includes('annual') ||
    text.includes('celebration') ||
    text.includes('alumni meet') ||
    text.includes('meet') ||
    text.includes('teachers day') ||
    text.includes('lohri')
  ) {
    return 'celebrations';
  }
  if (
    text.includes('git') ||
    text.includes('github') ||
    text.includes('cyber') ||
    text.includes('talk') ||
    text.includes('lecture') ||
    text.includes('session') ||
    text.includes('exam') ||
    text.includes('web development')
  ) {
    return 'workshops';
  }
  if (
    text.includes('translation') ||
    text.includes('sign language') ||
    text.includes('showcase') ||
    text.includes('software') ||
    text.includes('research') ||
    text.includes('patent')
  ) {
    return 'research';
  }
  if (
    text.includes('orientation') ||
    text.includes('trip') ||
    text.includes('kasauli') ||
    text.includes('tour')
  ) {
    return 'campus';
  }
  return 'workshops';
};

// Date formatter
const formatEventDate = (dateString, title = '') => {
  const dateMatch = title.match(/(\d{1,2}(?:st|nd|rd|th)?\s+[A-Za-z]+(?:\s+\d{4})?)/);
  if (dateMatch) {
    return dateMatch[1];
  }
  const yearMatch = title.match(/\b(202[3-9])\b/);
  if (yearMatch) {
    return yearMatch[1];
  }
  if (!dateString) return 'Campus Milestone';
  try {
    const d = new Date(dateString);
    if (isNaN(d.getTime())) return 'Campus Milestone';
    return d.toLocaleDateString('en-US', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  } catch {
    return 'Campus Milestone';
  }
};

// Category styling
const getCategoryStyle = (cat) => {
  switch (cat) {
    case 'celebrations':
      return {
        label: 'Celebration & Reunion',
        icon: PartyPopper,
        badge: 'bg-amber-500/10 text-amber-700 dark:text-amber-300 border-amber-500/30 dark:border-amber-400/30',
        dot: 'bg-amber-500 shadow-amber-500/50',
        accent: 'from-amber-400 via-amber-500 to-amber-600',
        cardBorder: 'hover:border-amber-400/60 dark:hover:border-amber-400/50',
      };
    case 'workshops':
      return {
        label: 'Workshop & Tech Talk',
        icon: Cpu,
        badge: 'bg-sky-500/10 text-sky-700 dark:text-sky-300 border-sky-500/30 dark:border-sky-400/30',
        dot: 'bg-sky-500 shadow-sky-500/50',
        accent: 'from-sky-400 via-blue to-indigo-600',
        cardBorder: 'hover:border-sky-400/60 dark:hover:border-sky-400/50',
      };
    case 'research':
      return {
        label: 'Research & Innovation',
        icon: Award,
        badge: 'bg-purple-500/10 text-purple-700 dark:text-purple-300 border-purple-500/30 dark:border-purple-400/30',
        dot: 'bg-purple-500 shadow-purple-500/50',
        accent: 'from-purple-400 via-indigo-500 to-purple-600',
        cardBorder: 'hover:border-purple-400/60 dark:hover:border-purple-400/50',
      };
    case 'campus':
      return {
        label: 'Campus Life & Trips',
        icon: Plane,
        badge: 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-500/30 dark:border-emerald-400/30',
        dot: 'bg-emerald-500 shadow-emerald-500/50',
        accent: 'from-emerald-400 via-teal-500 to-emerald-600',
        cardBorder: 'hover:border-emerald-400/60 dark:hover:border-emerald-400/50',
      };
    default:
      return {
        label: 'Department Event',
        icon: Sparkles,
        badge: 'bg-blue/10 text-blue dark:text-sky-300 border-blue/20 dark:border-sky-400/30',
        dot: 'bg-blue shadow-blue/50',
        accent: 'from-blue to-indigo-600',
        cardBorder: 'hover:border-blue/60 dark:hover:border-sky-400/50',
      };
  }
};

// Progressive Image Component with Shimmer
const ProgressiveEventImage = ({ src, alt, className = '', onClick }) => {
  const finalSrc = getOptimizedEventImageUrl(src, 900) || '/images/campus.webp';

  return (
    <div
      className={`relative w-full h-full bg-slate-100 dark:bg-slate-900 overflow-hidden cursor-pointer ${className}`}
      onClick={onClick}
    >
      <div className="absolute inset-0 bg-gradient-to-r from-slate-200 via-white/50 to-slate-200 dark:from-slate-800 dark:via-slate-700 dark:to-slate-800 animate-pulse pointer-events-none" />
      <img
        src={finalSrc}
        alt={alt || 'Event'}
        loading="lazy"
        decoding="async"
        onLoad={(e) => {
          e.currentTarget.style.opacity = '1';
        }}
        onError={(e) => {
          e.currentTarget.src = '/images/campus.webp';
          e.currentTarget.style.opacity = '1';
        }}
        style={{ opacity: 0 }}
        className="relative z-10 w-full h-full object-cover transition-opacity duration-500 hover:scale-105"
      />
    </div>
  );
};


export default function Events() {
  const [events, setEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);

  // Filters & State
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [expandedDescriptions, setExpandedDescriptions] = useState({});
  const [currentSlideIndex, setCurrentSlideIndex] = useState({});

  // Lightbox modal state
  const [lightboxData, setLightboxData] = useState(null); // { images: [], activeIndex: 0, title: '' }

  // Admin Add Modal State
  const [showAddModal, setShowAddModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    position: 'right',
    images: [],
  });

  // Admin Edit Modal State
  const [editingEvent, setEditingEvent] = useState(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const [editFormData, setEditFormData] = useState({
    title: '',
    description: '',
    position: 'right',
    newFiles: [],
    removedPublicIds: [],
  });

  // Fetch events
  const fetchEvents = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await API.get('/events');
      const mongoEvents = (response.data || []).map((event) => ({
        ...event,
        source: 'mongodb',
      }));
      const jsonEvents = (eventData || []).map((event, index) => ({
        ...event,
        _id: `json-${index}`,
        source: 'json',
      }));

      // Combine & sort by createdAt descending
      const combined = [...mongoEvents, ...jsonEvents].sort((a, b) => {
        const da = new Date(a.createdAt || 0);
        const db = new Date(b.createdAt || 0);
        return db - da;
      });

      setEvents(combined);
      setError('');
    } catch (err) {
      console.error('Error fetching events:', err);
      setError('Unable to load from live database. Showing fallback event records.');
      const fallback = (eventData || []).map((event, index) => ({
        ...event,
        _id: `json-${index}`,
        source: 'json',
      }));
      setEvents(fallback);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchEvents();
    setIsAdmin(localStorage.getItem('isAdmin') === 'true' || !!localStorage.getItem('token'));
  }, [fetchEvents]);

  // Keyboard navigation for Lightbox
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!lightboxData) return;
      if (e.key === 'Escape') setLightboxData(null);
      if (e.key === 'ArrowLeft') {
        setLightboxData((prev) => ({
          ...prev,
          activeIndex:
            prev.activeIndex === 0 ? prev.images.length - 1 : prev.activeIndex - 1,
        }));
      }
      if (e.key === 'ArrowRight') {
        setLightboxData((prev) => ({
          ...prev,
          activeIndex:
            prev.activeIndex === prev.images.length - 1 ? 0 : prev.activeIndex + 1,
        }));
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [lightboxData]);

  // Category counts
  const categoryCounts = useMemo(() => {
    const counts = {
      all: events.length,
      celebrations: 0,
      workshops: 0,
      research: 0,
      campus: 0,
    };
    events.forEach((e) => {
      const cat = getEventCategory(e.title, e.description);
      if (counts[cat] !== undefined) {
        counts[cat] += 1;
      }
    });
    return counts;
  }, [events]);

  const totalPhotosCount = useMemo(() => {
    return events.reduce((acc, curr) => acc + (curr.images?.length || 0), 0);
  }, [events]);

  // Filtered Events
  const filteredEvents = useMemo(() => {
    const q = searchTerm.trim().toLowerCase();
    return events.filter((e) => {
      const cat = getEventCategory(e.title, e.description);
      if (selectedCategory !== 'all' && cat !== selectedCategory) {
        return false;
      }
      if (q !== '') {
        const titleMatch = e.title?.toLowerCase().includes(q);
        const descMatch = e.description?.toLowerCase().includes(q);
        if (!titleMatch && !descMatch) return false;
      }
      return true;
    });
  }, [events, searchTerm, selectedCategory]);

  const toggleDescription = (id) => {
    setExpandedDescriptions((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleNextSlide = (eventId, total) => {
    setCurrentSlideIndex((prev) => ({
      ...prev,
      [eventId]: ((prev[eventId] || 0) + 1) % total,
    }));
  };

  const handlePrevSlide = (eventId, total) => {
    setCurrentSlideIndex((prev) => ({
      ...prev,
      [eventId]: ((prev[eventId] || 0) - 1 + total) % total,
    }));
  };

  const openLightbox = (images, index, title) => {
    const cleanImages = images.map((img) => (typeof img === 'string' ? img : img.url));
    setLightboxData({
      images: cleanImages,
      activeIndex: index,
      title: title || 'Event Gallery',
    });
  };

  // Admin delete event
  const handleDeleteEvent = async (id, e) => {
    e.stopPropagation();
    if (!window.confirm('Are you sure you want to delete this event permanently?')) return;
    try {
      const token = localStorage.getItem('token');
      await API.delete(`/events/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
        data: {
          publicIds:
            events.find((ev) => ev._id === id)?.images?.map((img) => img.publicId) || [],
        },
      });
      setEvents((prev) => prev.filter((ev) => ev._id !== id));
      toast.success('Event deleted successfully.');
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to delete event.');
    }
  };

  // Admin Add Event Form Handlers
  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 5) {
      toast.error('Maximum 5 images allowed per event.');
      return;
    }
    for (const f of files) {
      if (!['image/jpeg', 'image/png'].includes(f.type)) {
        toast.error('Only JPEG and PNG formats are allowed.');
        return;
      }
      if (f.size > 5 * 1024 * 1024) {
        toast.error('Each image must be under 5MB.');
        return;
      }
    }
    setFormData((prev) => ({ ...prev, images: files }));
  };

  const handleCreateEvent = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    const data = new FormData();
    data.append('title', formData.title);
    data.append('description', formData.description);
    data.append('position', formData.position);
    formData.images.forEach((img) => data.append('images', img));

    try {
      const token = localStorage.getItem('token');
      const response = await API.post('/events', data, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });
      setEvents((prev) => [{ ...response.data, source: 'mongodb' }, ...prev]);
      toast.success('Event published successfully!');
      setShowAddModal(false);
      setFormData({
        title: '',
        description: '',
        position: 'right',
        images: [],
      });
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to create event.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Admin Edit Event Handlers
  const startEditEvent = (event) => {
    setEditingEvent(event);
    setEditFormData({
      title: event.title || '',
      description: event.description || '',
      position: event.position || 'right',
      newFiles: [],
      removedPublicIds: [],
    });
  };

  const toggleRemoveExistingImage = (publicId) => {
    setEditFormData((prev) => {
      const isAlreadyMarked = prev.removedPublicIds.includes(publicId);
      return {
        ...prev,
        removedPublicIds: isAlreadyMarked
          ? prev.removedPublicIds.filter((p) => p !== publicId)
          : [...prev.removedPublicIds, publicId],
      };
    });
  };

  const handleEditFilesChange = (e) => {
    const selected = Array.from(e.target.files);
    if (selected.length > 5) {
      toast.error('You can add up to 5 new images at a time.');
      return;
    }
    for (const f of selected) {
      if (!['image/jpeg', 'image/png'].includes(f.type)) {
        toast.error('Only JPEG and PNG formats are allowed.');
        return;
      }
      if (f.size > 5 * 1024 * 1024) {
        toast.error('Each image must be under 5MB.');
        return;
      }
    }
    setEditFormData((prev) => ({ ...prev, newFiles: selected }));
  };

  const handleUpdateEvent = async (e) => {
    e.preventDefault();
    if (!editingEvent) return;
    setIsUpdating(true);

    try {
      const token = localStorage.getItem('token');
      const data = new FormData();
      data.append('title', editFormData.title);
      data.append('description', editFormData.description);
      data.append('position', editFormData.position);
      data.append('removedPublicIds', JSON.stringify(editFormData.removedPublicIds));

      editFormData.newFiles.forEach((file) => {
        data.append('images', file);
      });

      const response = await API.put(`/events/${editingEvent._id}`, data, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });

      setEvents((prev) =>
        prev.map((ev) =>
          ev._id === editingEvent._id
            ? { ...response.data, source: 'mongodb' }
            : ev
        )
      );

      toast.success(`Event "${response.data.title}" updated successfully!`);
      setEditingEvent(null);
    } catch (err) {
      console.error('Error updating event:', err);
      toast.error(err.response?.data?.error || 'Failed to update event.');
    } finally {
      setIsUpdating(false);
    }
  };

  const categories = [
    { id: 'all', label: 'All Events', icon: Sparkles, count: categoryCounts.all },
    {
      id: 'celebrations',
      label: 'Celebrations & Reunions',
      icon: PartyPopper,
      count: categoryCounts.celebrations,
    },
    {
      id: 'workshops',
      label: 'Workshops & Tech Talks',
      icon: Cpu,
      count: categoryCounts.workshops,
    },
    {
      id: 'research',
      label: 'Research & Innovations',
      icon: Award,
      count: categoryCounts.research,
    },
    {
      id: 'campus',
      label: 'Campus Life & Trips',
      icon: Plane,
      count: categoryCounts.campus,
    },
  ];

  return (
    <div className="w-full min-h-screen bg-slate-50/70 dark:bg-[#0b1120] text-slate-800 dark:text-slate-100 transition-colors duration-300 pt-24 sm:pt-28 pb-24">
      {/* 1. HERO BANNER */}
      <section className="relative overflow-hidden border-b border-slate-200/80 dark:border-slate-800/80 bg-gradient-to-b from-white via-sky-50/20 to-slate-50/50 dark:from-slate-900/90 dark:via-[#002147]/20 dark:to-[#0b1120] py-12 sm:py-16 px-4 sm:px-6 lg:px-8">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue/10 dark:bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-indigo-500/10 dark:bg-indigo-400/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-blue/10 dark:bg-sky-400/10 border border-blue/20 dark:border-sky-400/20 text-blue dark:text-sky-300 text-xs sm:text-sm font-semibold tracking-wide mb-5 shadow-xs">
            <GraduationCap className="w-4 h-4 text-blue dark:text-sky-400" />
            <span>Department of Computer Science • Punjabi University, Patiala</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold font-mons tracking-tight text-darkBlue dark:text-white max-w-4xl mx-auto leading-tight">
            Campus Chronicles &{' '}
            <span className="bg-gradient-to-r from-blue via-sky-500 to-indigo-600 dark:from-sky-400 dark:via-blue-400 dark:to-indigo-300 bg-clip-text text-transparent">
              Events Timeline
            </span>
          </h1>

          <p className="mt-4 sm:mt-5 text-sm sm:text-base lg:text-lg text-slate-600 dark:text-slate-300 max-w-3xl mx-auto font-poppins leading-relaxed">
            Relive memorable reunions, national tech symposiums, academic milestones, and student celebrations shaping our 38+ year legacy.
          </p>

          {/* Metric Badges */}
          <div className="mt-8 sm:mt-10 grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 max-w-4xl mx-auto">
            <div className="p-4 rounded-2xl bg-white/80 dark:bg-slate-800/80 backdrop-blur-md border border-slate-200/80 dark:border-slate-700/60 shadow-sm flex flex-col items-center">
              <span className="text-2xl sm:text-3xl font-extrabold text-blue dark:text-sky-400 font-mons">
                {events.length}+
              </span>
              <span className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-medium mt-1">
                Documented Events
              </span>
            </div>

            <div className="p-4 rounded-2xl bg-white/80 dark:bg-slate-800/80 backdrop-blur-md border border-slate-200/80 dark:border-slate-700/60 shadow-sm flex flex-col items-center">
              <span className="text-2xl sm:text-3xl font-extrabold text-amber-500 dark:text-amber-400 font-mons">
                {totalPhotosCount}+
              </span>
              <span className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-medium mt-1">
                Memories & Photos
              </span>
            </div>

            <div className="p-4 rounded-2xl bg-white/80 dark:bg-slate-800/80 backdrop-blur-md border border-slate-200/80 dark:border-slate-700/60 shadow-sm flex flex-col items-center">
              <span className="text-2xl sm:text-3xl font-extrabold text-purple-600 dark:text-purple-400 font-mons">
                {categoryCounts.workshops + categoryCounts.research}
              </span>
              <span className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-medium mt-1">
                Tech Talks & Research
              </span>
            </div>

            <div className="p-4 rounded-2xl bg-white/80 dark:bg-slate-800/80 backdrop-blur-md border border-slate-200/80 dark:border-slate-700/60 shadow-sm flex flex-col items-center">
              <span className="text-2xl sm:text-3xl font-extrabold text-emerald-600 dark:text-emerald-400 font-mons">
                {categoryCounts.celebrations}
              </span>
              <span className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-medium mt-1">
                Reunions & Meets
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* 2. CONTROLS: SEARCH, CATEGORY PILLS & ADMIN BUTTON */}
      <section className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        <div className="p-4 sm:p-6 rounded-3xl bg-white dark:bg-slate-800/90 border border-slate-200/80 dark:border-slate-700/60 shadow-lg backdrop-blur-md space-y-4">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 dark:text-slate-500" />
              <input
                type="text"
                placeholder="Search events by title or keyword (e.g. Farewell, Git, AI, Lohri)..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-10 py-3 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-blue dark:focus:ring-sky-400 transition-all shadow-inner"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1"
                  title="Clear search"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Admin Add Button */}
            {isAdmin && (
              <button
                onClick={() => setShowAddModal(true)}
                className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-darkBlue dark:bg-sky-500 text-white dark:text-slate-950 font-bold text-sm shadow-md hover:opacity-90 transition-all shrink-0"
              >
                <Plus className="w-4 h-4" />
                <span>Add Event</span>
              </button>
            )}
          </div>

          {/* Category Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none pt-2 border-t border-slate-100 dark:border-slate-700/60">
            {categories.map((cat) => {
              const Icon = cat.icon;
              const isActive = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold whitespace-nowrap transition-all duration-200 shrink-0 ${
                    isActive
                      ? 'bg-darkBlue dark:bg-sky-500 text-white dark:text-slate-950 shadow-md shadow-blue/20 dark:shadow-sky-500/20 scale-[1.02]'
                      : 'bg-slate-100 dark:bg-slate-900/60 text-slate-600 dark:text-slate-300 hover:bg-slate-200/80 dark:hover:bg-slate-700/70'
                  }`}
                >
                  <Icon
                    className={`w-4 h-4 ${
                      isActive ? 'text-white dark:text-slate-950' : 'text-slate-400 dark:text-slate-500'
                    }`}
                  />
                  <span>{cat.label}</span>
                  <span
                    className={`text-[11px] px-2 py-0.5 rounded-full font-bold ${
                      isActive
                        ? 'bg-white/20 dark:bg-black/20 text-white dark:text-slate-950'
                        : 'bg-slate-200 dark:bg-slate-800 text-slate-500 dark:text-slate-400'
                    }`}
                  >
                    {cat.count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Active Filter Indicators */}
          {(searchTerm || selectedCategory !== 'all') && (
            <div className="flex items-center justify-between pt-2 text-xs text-slate-500 dark:text-slate-400">
              <div className="flex items-center gap-2">
                <span>Active filters:</span>
                {searchTerm && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-blue/10 text-blue dark:text-sky-300 font-medium">
                    Search: "{searchTerm}"
                    <X className="w-3 h-3 cursor-pointer" onClick={() => setSearchTerm('')} />
                  </span>
                )}
                {selectedCategory !== 'all' && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-indigo-500/10 text-indigo-700 dark:text-indigo-300 font-medium">
                    Category: {categories.find((c) => c.id === selectedCategory)?.label}
                    <X className="w-3 h-3 cursor-pointer" onClick={() => setSelectedCategory('all')} />
                  </span>
                )}
              </div>

              <button
                onClick={() => {
                  setSearchTerm('');
                  setSelectedCategory('all');
                }}
                className="inline-flex items-center gap-1.5 text-blue dark:text-sky-400 hover:underline font-semibold ml-auto"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset filters</span>
              </button>
            </div>
          )}
        </div>
      </section>

      {/* 3. TIMELINE BODY (WIDE EXPANSIVE CARDS SPANNING FULL LEFT AND RIGHT SECTIONS) */}
      <main className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 mt-12">
        {/* Results Count Header */}
        <div className="flex items-center justify-between mb-8 sm:mb-12">
          <div className="flex items-center gap-2.5">
            <h2 className="text-xl sm:text-2xl font-bold font-mons text-slate-900 dark:text-white">
              Timeline Journey
            </h2>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold">
              {filteredEvents.length} {filteredEvents.length === 1 ? 'Milestone' : 'Milestones'}
            </span>
          </div>
        </div>

        {/* Error Notice */}
        {error && (
          <div className="mb-6 p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-amber-700 dark:text-amber-300 text-sm flex items-center justify-between">
            <span>{error}</span>
            <button onClick={fetchEvents} className="text-xs font-bold underline">
              Retry
            </button>
          </div>
        )}

        {/* Loading Skeletons */}
        {isLoading ? (
          <div className="space-y-8">
            {[1, 2, 3].map((n) => (
              <div
                key={n}
                className="p-6 rounded-3xl bg-white dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700 animate-pulse space-y-4"
              >
                <div className="h-5 bg-slate-200 dark:bg-slate-700 rounded-md w-1/3" />
                <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded-md w-2/3" />
                <div className="h-48 bg-slate-100 dark:bg-slate-700/50 rounded-2xl" />
              </div>
            ))}
          </div>
        ) : filteredEvents.length === 0 ? (
          /* Empty Search State */
          <div className="text-center py-16 px-4 rounded-3xl bg-white dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 shadow-sm max-w-xl mx-auto my-6">
            <div className="w-16 h-16 rounded-3xl bg-blue/10 dark:bg-sky-400/10 text-blue dark:text-sky-400 flex items-center justify-center mx-auto mb-4">
              <Search className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold font-mons text-slate-900 dark:text-white">
              No matching events found
            </h3>
            <p className="mt-2 text-sm text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
              We couldn't find any events matching your search or category filter. Try clearing filters.
            </p>
            <button
              onClick={() => {
                setSearchTerm('');
                setSelectedCategory('all');
              }}
              className="mt-6 inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-darkBlue dark:bg-sky-500 text-white dark:text-slate-950 text-sm font-semibold shadow-md hover:opacity-90 transition-all"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Reset all filters</span>
            </button>
          </div>
        ) : (
          /* TIMELINE LISTING */
          <div className="relative pb-16">
            {/* Center Vertical Timeline Rail on Desktop/Laptop */}
            <div className="hidden md:block absolute left-1/2 top-4 bottom-4 w-1 -translate-x-1/2 bg-gradient-to-b from-blue/40 via-sky-400/80 to-indigo-500/40 dark:from-sky-500/40 dark:via-blue-500/60 dark:to-indigo-500/40 rounded-full shadow-[0_0_12px_rgba(56,189,248,0.35)]" />

            {/* Left Rail for Mobile & Tablet (< md) */}
            <div className="md:hidden absolute left-5 top-4 bottom-4 w-0.5 bg-gradient-to-b from-blue via-sky-400 to-indigo-500 opacity-40 rounded-full" />

            <div className="space-y-12 md:space-y-16">
              {filteredEvents.map((item, index) => {
                const category = getEventCategory(item.title, item.description);
                const catStyle = getCategoryStyle(category);
                const dateText = formatEventDate(item.createdAt, item.title);
                const images = item.images || [];
                const activeIndex = currentSlideIndex[item._id] || 0;
                const isExpanded = expandedDescriptions[item._id];
                // Alternate left and right: left event on left, right event on right
                const isLeft = item.position ? item.position === 'left' : index % 2 === 0;

                const currentImageObj = images[activeIndex];
                const currentImageUrl =
                  typeof currentImageObj === 'string'
                    ? currentImageObj
                    : currentImageObj?.url || '';

                return (
                  <div
                    key={item._id}
                    className={`relative flex flex-col md:flex-row items-center justify-between w-full ${
                      isLeft ? '' : 'md:flex-row-reverse'
                    }`}
                  >
                    {/* Event Card: Takes 48-48.5% width on laptop/desktop to fully cover its half */}
                    <div className="w-full pl-12 md:pl-0 md:w-[48%] lg:w-[48.5%] z-10">
                      <div
                        className={`group rounded-3xl bg-white/95 dark:bg-slate-800/95 backdrop-blur-md border border-slate-200/90 dark:border-slate-700/80 shadow-xl hover:shadow-2xl dark:shadow-slate-950/50 transition-all duration-300 overflow-hidden hover:-translate-y-1.5 flex flex-col justify-between ${catStyle.cardBorder}`}
                      >
                        {/* Top Accent Gradient Line */}
                        <div className={`h-2.5 w-full bg-gradient-to-r ${catStyle.accent}`} />

                        <div className="p-6 sm:p-7 lg:p-8 space-y-4">
                          {/* Date Chip + Category Badge */}
                          <div className="flex flex-wrap items-center justify-between gap-2">
                            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-100 dark:bg-slate-900/90 border border-slate-200 dark:border-slate-700/80 text-xs font-bold text-slate-700 dark:text-slate-300 shadow-2xs">
                              <Calendar className="w-3.5 h-3.5 text-blue dark:text-sky-400" />
                              <span>{dateText}</span>
                            </div>

                            <span
                              className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold border uppercase tracking-wider ${catStyle.badge}`}
                            >
                              <catStyle.icon className="w-3.5 h-3.5" />
                              <span>{catStyle.label}</span>
                            </span>
                          </div>

                          {/* Event Title */}
                          <div className="flex items-start justify-between gap-3">
                            <h3 className="text-xl sm:text-2xl lg:text-[1.65rem] font-bold font-mons text-slate-900 dark:text-white group-hover:text-blue dark:group-hover:text-sky-400 transition-colors leading-snug">
                              {item.title}
                            </h3>

                            {/* Admin Actions (Edit & Delete) */}
                            {isAdmin && item.source === 'mongodb' && (
                              <div className="flex items-center gap-1.5 shrink-0">
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    startEditEvent(item);
                                  }}
                                  className="p-1.5 rounded-xl bg-blue/10 text-blue dark:bg-sky-500/20 dark:text-sky-300 hover:bg-blue/20 transition-colors"
                                  title="Edit event text & add images"
                                >
                                  <Edit3 className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={(e) => handleDeleteEvent(item._id, e)}
                                  className="p-1.5 rounded-xl bg-red-50 text-red-600 dark:bg-red-950/50 dark:text-red-400 hover:bg-red-100 transition-colors"
                                  title="Delete this event"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            )}
                          </div>

                          {/* Event Description */}
                          <div className="text-slate-600 dark:text-slate-300 text-sm sm:text-base leading-relaxed text-justify">
                            <p>
                              {item.description
                                ? isExpanded || item.description.length <= 220
                                  ? item.description
                                  : `${item.description.slice(0, 220)}...`
                                : 'Memorable department gathering and milestone event.'}
                            </p>
                            {item.description && item.description.length > 220 && (
                              <button
                                onClick={() => toggleDescription(item._id)}
                                className="mt-1.5 text-xs sm:text-sm font-bold text-blue dark:text-sky-400 hover:underline inline-flex items-center gap-1"
                              >
                                <span>{isExpanded ? 'Read Less' : 'Read Full Story'}</span>
                                <ChevronRight
                                  className={`w-3.5 h-3.5 transition-transform ${
                                    isExpanded ? 'rotate-90' : ''
                                  }`}
                                />
                              </button>
                            )}
                          </div>

                          {/* Image Gallery Showcase (Wider, expansive aspect ratio) */}
                          {images.length > 0 && (
                            <div className="pt-2">
                              {images.length === 1 ? (
                                /* Single Photo */
                                <div className="relative rounded-2xl overflow-hidden group/img shadow-md border border-slate-200/80 dark:border-slate-700/70 h-64 sm:h-72 lg:h-84">
                                  <ProgressiveEventImage
                                    src={currentImageUrl}
                                    alt={item.title}
                                    onClick={() => openLightbox(images, 0, item.title)}
                                  />
                                  <div
                                    className="absolute inset-0 bg-black/30 opacity-0 group-hover/img:opacity-100 transition-opacity flex items-center justify-center text-white gap-2 font-semibold text-xs backdrop-blur-2xs cursor-pointer pointer-events-none"
                                  >
                                    <Maximize2 className="w-5 h-5" />
                                    <span>Click to view full photo</span>
                                  </div>
                                </div>
                              ) : (
                                /* Multiple Photos Interactive Carousel */
                                <div className="space-y-3">
                                  <div className="relative rounded-2xl overflow-hidden group/img shadow-md border border-slate-200/80 dark:border-slate-700/70 h-64 sm:h-72 lg:h-84">
                                    <ProgressiveEventImage
                                      src={currentImageUrl}
                                      alt={`${item.title} #${activeIndex + 1}`}
                                      onClick={() => openLightbox(images, activeIndex, item.title)}
                                    />

                                    {/* Navigation Arrows */}
                                    <button
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        handlePrevSlide(item._id, images.length);
                                      }}
                                      className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-black/60 hover:bg-black/85 text-white flex items-center justify-center transition-all shadow-lg z-10"
                                      title="Previous photo"
                                    >
                                      <ChevronLeft className="w-5 h-5" />
                                    </button>
                                    <button
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        handleNextSlide(item._id, images.length);
                                      }}
                                      className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-black/60 hover:bg-black/85 text-white flex items-center justify-center transition-all shadow-lg z-10"
                                      title="Next photo"
                                    >
                                      <ChevronRight className="w-5 h-5" />
                                    </button>

                                    {/* Counter Pill */}
                                    <div
                                      onClick={() => openLightbox(images, activeIndex, item.title)}
                                      className="absolute bottom-3 right-3 px-3 py-1.5 rounded-full bg-black/75 backdrop-blur-sm text-white text-xs font-bold flex items-center gap-1.5 shadow-md z-10 cursor-pointer hover:bg-black/90 transition-colors"
                                    >
                                      <Maximize2 className="w-3.5 h-3.5 text-sky-400" />
                                      <span>
                                        {activeIndex + 1} / {images.length} Photos
                                      </span>
                                    </div>
                                  </div>

                                  {/* Dot Indicators */}
                                  <div className="flex items-center justify-center gap-1.5 pt-1">
                                    {images.map((_, dotIdx) => (
                                      <button
                                        key={dotIdx}
                                        onClick={() =>
                                          setCurrentSlideIndex((prev) => ({
                                            ...prev,
                                            [item._id]: dotIdx,
                                          }))
                                        }
                                        className={`h-2.5 rounded-full transition-all ${
                                          activeIndex === dotIdx
                                            ? 'w-7 bg-blue dark:bg-sky-400'
                                            : 'w-2.5 bg-slate-300 dark:bg-slate-700 hover:bg-slate-400'
                                        }`}
                                        title={`Go to photo ${dotIdx + 1}`}
                                      />
                                    ))}
                                  </div>
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Milestone Center Glowing Node: sits right on the center line */}
                    {/* Desktop/Laptop Center Node */}
                    <div className="hidden md:flex absolute left-1/2 top-10 -translate-x-1/2 z-20 items-center justify-center">
                      <div
                        className={`w-12 h-12 rounded-full border-4 border-white dark:border-slate-900 flex items-center justify-center shadow-xl transition-transform duration-300 hover:scale-125 ${catStyle.dot}`}
                        title={catStyle.label}
                      >
                        <catStyle.icon className="w-5 h-5 text-white" />
                      </div>
                    </div>

                    {/* Mobile Node (left rail) */}
                    <div className="md:hidden absolute left-5 top-8 -translate-x-1/2 z-20 flex items-center justify-center">
                      <div
                        className={`w-8 h-8 rounded-full border-2 border-white dark:border-slate-900 flex items-center justify-center shadow-md ${catStyle.dot}`}
                      >
                        <catStyle.icon className="w-3.5 h-3.5 text-white" />
                      </div>
                    </div>

                    {/* Spacer on Opposite Side to balance the alternating grid on Desktop */}
                    <div className="hidden md:block md:w-[48%] lg:w-[48.5%]" />
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </main>

      {/* 4. FULL-SCREEN LIGHTBOX GALLERY MODAL */}
      {lightboxData && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-md animate-fadeIn"
          onClick={() => setLightboxData(null)}
        >
          {/* Top Control Bar */}
          <div className="absolute top-4 left-4 right-4 flex items-center justify-between text-white z-20">
            <div className="flex items-center gap-3">
              <span className="text-xs font-bold px-3 py-1 rounded-full bg-white/20 backdrop-blur-sm">
                Photo {lightboxData.activeIndex + 1} of {lightboxData.images.length}
              </span>
              <h4 className="text-sm font-semibold truncate max-w-md hidden sm:block">
                {lightboxData.title}
              </h4>
            </div>

            <button
              onClick={() => setLightboxData(null)}
              className="w-10 h-10 rounded-full bg-white/20 hover:bg-white/30 text-white flex items-center justify-center transition-colors"
              title="Close (Esc)"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Navigation Controls */}
          {lightboxData.images.length > 1 && (
            <>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setLightboxData((prev) => ({
                    ...prev,
                    activeIndex:
                      prev.activeIndex === 0 ? prev.images.length - 1 : prev.activeIndex - 1,
                  }));
                }}
                className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 hover:bg-white/25 text-white flex items-center justify-center transition-all z-20"
                title="Previous photo (Left Arrow)"
              >
                <ChevronLeft className="w-7 h-7" />
              </button>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setLightboxData((prev) => ({
                    ...prev,
                    activeIndex:
                      prev.activeIndex === prev.images.length - 1 ? 0 : prev.activeIndex + 1,
                  }));
                }}
                className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 hover:bg-white/25 text-white flex items-center justify-center transition-all z-20"
                title="Next photo (Right Arrow)"
              >
                <ChevronRight className="w-7 h-7" />
              </button>
            </>
          )}

          {/* Center Image */}
          <div
            className="max-w-5xl max-h-[85vh] p-4 flex flex-col items-center justify-center relative z-10"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={getOptimizedEventImageUrl(
                lightboxData.images[lightboxData.activeIndex],
                1200
              )}
              alt="Expanded Event"
              className="max-w-full max-h-[80vh] object-contain rounded-2xl shadow-2xl"
              onError={(e) => (e.target.src = '/images/campus.webp')}
            />
            <p className="mt-3 text-center text-xs text-slate-300 font-poppins">
              {lightboxData.title} • Punjabi University, Patiala
            </p>
          </div>
        </div>
      )}

      {/* 5. ADMIN ADD EVENT MODAL */}
      {showAddModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fadeIn"
          onClick={() => setShowAddModal(false)}
        >
          <div
            className="w-full max-w-xl bg-white dark:bg-slate-900 rounded-3xl overflow-hidden shadow-2xl border border-slate-200 dark:border-slate-800 relative z-10"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-darkBlue via-[#00385c] to-indigo-900 p-6 text-white flex items-center justify-between">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-sky-300">
                  Administrative Portal
                </span>
                <h3 className="text-xl font-bold font-mons">Publish New Event</h3>
              </div>
              <button
                onClick={() => setShowAddModal(false)}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleCreateEvent} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase text-slate-700 dark:text-slate-300 mb-1">
                  Event Title
                </label>
                <input
                  type="text"
                  name="title"
                  placeholder="e.g. Annual Alumni Meet 2025"
                  value={formData.title}
                  onChange={handleFormChange}
                  required
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm focus:outline-none focus:ring-2 focus:ring-blue dark:focus:ring-sky-400"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-700 dark:text-slate-300 mb-1">
                  Event Description & Narrative
                </label>
                <textarea
                  name="description"
                  placeholder="Detail the activities, achievements, attendees, and highlights..."
                  value={formData.description}
                  onChange={handleFormChange}
                  required
                  rows={4}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm focus:outline-none focus:ring-2 focus:ring-blue dark:focus:ring-sky-400"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-700 dark:text-slate-300 mb-1">
                  Upload Event Photos (Up to 5)
                </label>
                <input
                  type="file"
                  multiple
                  accept="image/jpeg,image/png"
                  onChange={handleFileChange}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:bg-blue file:text-white file:font-semibold"
                />
                <p className="text-[11px] text-slate-400 mt-1">
                  Accepts JPEG, PNG (max 5MB each). Images will be automatically compressed.
                </p>
              </div>

              <div className="pt-4 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-sm font-semibold hover:bg-slate-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-2 rounded-xl bg-darkBlue dark:bg-sky-500 text-white dark:text-slate-950 text-sm font-bold shadow-md hover:opacity-90 disabled:opacity-50 transition-all"
                >
                  {isSubmitting ? 'Publishing...' : 'Publish Event'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 6. ADMIN EDIT EVENT MODAL */}
      {editingEvent && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fadeIn"
          onClick={() => setEditingEvent(null)}
        >
          <div
            className="w-full max-w-2xl bg-white dark:bg-slate-900 rounded-3xl overflow-hidden shadow-2xl border border-slate-200 dark:border-slate-800 max-h-[90vh] flex flex-col relative z-10"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-darkBlue via-[#00385c] to-indigo-900 p-6 text-white flex items-center justify-between">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-sky-300">
                  Administrative Editor
                </span>
                <h3 className="text-xl font-bold font-mons">Edit Event & Add Images</h3>
              </div>
              <button
                onClick={() => setEditingEvent(null)}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleUpdateEvent} className="p-6 overflow-y-auto space-y-5">
              <div>
                <label className="block text-xs font-bold uppercase text-slate-700 dark:text-slate-300 mb-1">
                  Event Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={editFormData.title}
                  onChange={(e) =>
                    setEditFormData({ ...editFormData, title: e.target.value })
                  }
                  required
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm focus:outline-none focus:ring-2 focus:ring-blue dark:focus:ring-sky-400"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-700 dark:text-slate-300 mb-1">
                  Description & Narrative <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={editFormData.description}
                  onChange={(e) =>
                    setEditFormData({ ...editFormData, description: e.target.value })
                  }
                  required
                  rows={4}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm focus:outline-none focus:ring-2 focus:ring-blue dark:focus:ring-sky-400"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-700 dark:text-slate-300 mb-1">
                  Timeline Alignment
                </label>
                <select
                  value={editFormData.position}
                  onChange={(e) =>
                    setEditFormData({ ...editFormData, position: e.target.value })
                  }
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm"
                >
                  <option value="right">Right Side</option>
                  <option value="left">Left Side</option>
                </select>
              </div>

              {/* Current Event Images with Remove Option */}
              {editingEvent.images && editingEvent.images.length > 0 && (
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-700 dark:text-slate-300 mb-2">
                    Current Event Images (Click 'Remove' to delete on save)
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {editingEvent.images.map((img, i) => {
                      const isMarked = editFormData.removedPublicIds.includes(img.publicId);
                      return (
                        <div
                          key={i}
                          className={`relative rounded-xl overflow-hidden border transition-all ${
                            isMarked
                              ? 'border-red-500 opacity-40 scale-95'
                              : 'border-slate-200 dark:border-slate-700'
                          }`}
                        >
                          <img
                            src={img.url || img}
                            alt="Event"
                            className="w-full h-24 object-cover"
                          />
                          <button
                            type="button"
                            onClick={() => toggleRemoveExistingImage(img.publicId)}
                            className={`absolute bottom-1 right-1 px-2 py-0.5 rounded-lg text-[10px] font-bold ${
                              isMarked
                                ? 'bg-slate-800 text-white'
                                : 'bg-red-600 text-white hover:bg-red-700'
                            }`}
                          >
                            {isMarked ? 'Undo' : 'Remove'}
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Upload New Additional Images */}
              <div>
                <label className="block text-xs font-bold uppercase text-slate-700 dark:text-slate-300 mb-1 flex items-center gap-1.5">
                  <ImageIcon className="w-4 h-4 text-blue dark:text-sky-400" />
                  <span>Add New Images (Appends to event gallery)</span>
                </label>
                <input
                  type="file"
                  multiple
                  accept="image/jpeg,image/png"
                  onChange={handleEditFilesChange}
                  className="w-full text-xs text-slate-600 dark:text-slate-300 file:mr-3 file:py-1.5 file:px-3 file:rounded-xl file:border-0 file:bg-blue file:text-white file:font-semibold"
                />
                <p className="text-[11px] text-slate-400 mt-1">
                  Selected images will be uploaded to Cloudinary and added to this event.
                </p>
                {editFormData.newFiles.length > 0 && (
                  <div className="mt-2 text-xs text-emerald-600 dark:text-emerald-400 font-medium">
                    {editFormData.newFiles.length} new {editFormData.newFiles.length === 1 ? 'image' : 'images'} selected to add
                  </div>
                )}
              </div>

              {/* Modal Actions */}
              <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setEditingEvent(null)}
                  className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-semibold hover:bg-slate-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isUpdating}
                  className="px-5 py-2 rounded-xl bg-darkBlue dark:bg-sky-500 text-white dark:text-slate-950 text-xs font-bold shadow-md hover:opacity-90 disabled:opacity-50"
                >
                  {isUpdating ? 'Saving Changes...' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}