import React, { useState, useEffect, useRef, useCallback } from 'react';
import localData from '../data/aluminiData.json';
import API from '../api/api';
import { AlumniGridSkeleton } from '../components/skeletons/AlumniCardSkeleton';
import { ChevronDown } from 'lucide-react';

export default function Alumni() {
  const [loading, setLoading] = useState(true);
  const [expandedCards, setExpandedCards] = useState({});
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCourse, setSelectedCourse] = useState('');
  const [selectedProfession, setSelectedProfession] = useState('');
  const [selectedBatch, setSelectedBatch] = useState('');
  const [professions, setProfessions] = useState([]);
  const [batches, setBatches] = useState([]);
  const [visibleCount, setVisibleCount] = useState(25);
  const [allData, setAllData] = useState([]);
  const [combinedData, setCombinedData] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [apiError, setApiError] = useState(null);
  const inputRef = useRef(null);
  const loaderRef = useRef(null);

  const slides = [
    { id: 1, image: 'images/slider1.jpg' },
    { id: 2, image: 'images/slider2.jpg' },
    { id: 3, image: 'images/slider3.jpg' },
    { id: 4, image: 'images/slider4.jpg' },
    { id: 5, image: 'images/slider5.jpg' },
  ];

  // Normalize profession field
  const getProfession = (item) => {
    return (
      item.profession ||
      item.Profession ||
      item.job ||
      item.Job ||
      ''
    )?.trim().toLowerCase();
  };

  // Normalize batch field
  const getBatch = (item) => {
    const batch = item.Batch || item.batch || item.Year || item['year of admitted'] || item['addmission year'] || item['year admitted'] || item.addmissionyear || '';
    const batchStr = String(batch); // Convert to string to handle numbers or other types
    return batchStr.trim();
  };

  // Extract unique professions and batches from data
  const updateFilters = (data) => {
    const uniqueProfessions = [...new Set(
      data
        .map(item => getProfession(item))
        .filter(prof => prof)
    )].sort();
    setProfessions(uniqueProfessions);

    const uniqueBatches = [...new Set(
      data
        .map(item => {
          const batch = getBatch(item);
          if (!batch) {
            console.warn('Empty or invalid batch for item:', item);
          }
          return batch;
        })
        .filter(batch => batch)
    )].sort((a, b) => {
      const yearA = extractYear(a);
      const yearB = extractYear(b);
      return yearB - yearA; // Sort batches in descending order
    });
    setBatches(uniqueBatches);

    console.log('Fetched professions:', uniqueProfessions);
    console.log('Fetched batches:', uniqueBatches);
  };

  // Fetch data and initial filters
  useEffect(() => {
    setLoading(true);
    API
      .get('/alumni/approved')
      .then((res) => {
        const mongoData = Array.isArray(res.data) ? res.data : [];
        const merged = [...localData, ...mongoData];
        setAllData(merged);
        setCombinedData(sortAndFilterData(merged, searchTerm, selectedCourse, selectedProfession, selectedBatch));
        updateFilters(merged);
        setApiError(null);

        // Debug: Log items without professions or batches
        const missingProfessions = merged.filter(item => !getProfession(item));
        const missingBatches = merged.filter(item => !getBatch(item));
        if (missingProfessions.length > 0) {
          console.warn('Items without professions:', missingProfessions);
        }
        if (missingBatches.length > 0) {
          console.warn('Items without batches:', missingBatches);
        }
      })
      .catch((err) => {
        console.error('Failed to fetch alumni:', err);
        setAllData(localData);
        setCombinedData(sortAndFilterData(localData, searchTerm, selectedCourse, selectedProfession, selectedBatch));
        updateFilters(localData);
        setApiError('Failed to load MongoDB data. Showing local data only.');

        // Debug: Log items without professions or batches
        const missingProfessions = localData.filter(item => !getProfession(item));
        const missingBatches = localData.filter(item => !getBatch(item));
        if (missingProfessions.length > 0) {
          console.warn('Local items without professions:', missingProfessions);
        }
        if (missingBatches.length > 0) {
          console.warn('Local items without batches:', missingBatches);
        }
      })
      .finally(() => {
        setLoading(false);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Update filtered data when filters change
  useEffect(() => {
    setCombinedData(sortAndFilterData(allData, searchTerm, selectedCourse, selectedProfession, selectedBatch));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchTerm, selectedCourse, selectedProfession, selectedBatch, allData]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % slides.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [slides.length]);

  const extractYear = (batch) => {
    if (!batch) return 0;
    const years = String(batch).match(/\d{4}/g);
    return years ? Math.max(...years.map(Number)) : 0;
  };

  const sortAndFilterData = (data, term, course, profession, batch) => {
    let results = data;

    // Apply filters
    if (term.trim()) {
      results = results.filter((item) =>
        (item.Name || item.name)?.toLowerCase().includes(term.toLowerCase())
      );
    }

    if (course) {
      results = results.filter(
        (item) =>
          (item.Course || item.course)?.trim().toLowerCase() === course.toLowerCase()
      );
    }

    if (profession) {
      results = results.filter(
        (item) =>
          getProfession(item) === profession.toLowerCase()
      );
    }

    if (batch) {
      results = results.filter(
        (item) =>
          getBatch(item) === batch
      );
    }

    // Sort by batch year (descending) and prioritize localData before mongoData within the same year
    return [...results].sort((a, b) => {
      const topAlumniNames = ["ABHINASH", "HARMANDEEP SINGH SAGGU", "HANSRAJ SINGH RISEM"];
      const nameA = (a.Name || a.name || "").trim().toUpperCase();
      const nameB = (b.Name || b.name || "").trim().toUpperCase();
      
      const isALocal = localData.includes(a);
      const isBLocal = localData.includes(b);

      const aIsTop = isALocal && topAlumniNames.includes(nameA);
      const bIsTop = isBLocal && topAlumniNames.includes(nameB);

      // Force top alumni to the very beginning
      if (aIsTop && !bIsTop) return -1;
      if (!aIsTop && bIsTop) return 1;
      if (aIsTop && bIsTop) return nameA.localeCompare(nameB);

      const yearA = extractYear(getBatch(a));
      const yearB = extractYear(getBatch(b));

      // Sort by year in descending order (2024 > 2023 > 2022)
      if (yearB !== yearA) return yearB - yearA;

      // Within the same year, localData comes first, mongoData (new data) comes last
      if (isALocal && !isBLocal) return -1;
      if (!isALocal && isBLocal) return 1;

      // Within same source, sort by presence of image
      return (b.Image || b.photo ? 1 : 0) - (a.Image || a.photo ? 1 : 0);
    });
  };

  const handleReset = () => {
    setSearchTerm('');
    setSelectedCourse('');
    setSelectedProfession('');
    setSelectedBatch('');
    setVisibleCount(25);
    inputRef.current?.focus();
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    inputRef.current?.blur();
  };

  const loadMore = useCallback(() => {
    setVisibleCount((prev) => prev + 25);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && visibleCount < combinedData.length) {
          loadMore();
        }
      },
      { threshold: 1 }
    );

    const currentLoader = loaderRef.current;
    if (currentLoader) observer.observe(currentLoader);
    return () => {
      if (currentLoader) observer.unobserve(currentLoader);
    };
  }, [loadMore, visibleCount, combinedData.length]);

  return (
    <div className="w-full mt-20">
      {/* Image Slider */}
      <div className="relative hidden md:block max-h-full h-screen">
        {slides.map((slide, index) => (
          <div
            key={slide.id}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${index === currentIndex ? 'opacity-100' : 'opacity-0'
              }`}
          >
            <img
              src={slide.image}
              alt={`Slide ${index + 1}`}
              className="w-full h-full object-contain"
            />
          </div>
        ))}
        <div className="absolute inset-0 flex justify-between items-center">
          <button
            className="text-white bg-black bg-opacity-50 p-2 rounded-full ml-4"
            onClick={() =>
              setCurrentIndex((prev) => (prev === 0 ? slides.length - 1 : prev - 1))
            }
          >
            ❮
          </button>
          <button
            className="text-white bg-black bg-opacity-50 p-2 rounded-full mr-4"
            onClick={() => setCurrentIndex((prev) => (prev + 1) % slides.length)}
          >
            ❯
          </button>
        </div>
      </div>

      {/* Heading */}
      <div className="w-full py-6 text-center">
        <h2 className="text-3xl font-semibold">All Alumni Members</h2>
      </div>

      {/* API Error Message */}
      {apiError && (
        <p className="text-center text-red-500 mt-4">{apiError}</p>
      )}

      {/* Search & Filter */}
      <div className="max-w-[85%] mx-auto">
        <form
          onSubmit={handleSubmit}
          className="flex flex-col md:flex-row justify-center items-center gap-4"
        >
          <input
            ref={inputRef}
            type="text"
            placeholder="Search Alumni by Name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full md:w-1/5 px-4 py-2 border border-gray-300 rounded-lg shadow-md"
          />
          <select
            value={selectedCourse}
            onChange={(e) => setSelectedCourse(e.target.value)}
            className="w-full md:w-1/5 px-4 py-2 border border-gray-300 rounded-lg shadow-md"
          >
            <option value="">All Courses</option>
            <option value="MCA">MCA</option>
            <option value="PhD">PhD</option>
            <option value="B.Tech">B.Tech</option>
            <option value="M.Tech">M.Tech</option>
          </select>
          <select
            value={selectedProfession}
            onChange={(e) => setSelectedProfession(e.target.value)}
            className="w-full md:w-1/5 px-4 py-2 border border-gray-300 rounded-lg shadow-md"
          >
            <option value="">All Professions</option>
            {professions.map((prof, index) => (
              <option key={index} value={prof}>
                {prof.charAt(0).toUpperCase() + prof.slice(1)}
              </option>
            ))}
          </select>
          <select
            value={selectedBatch}
            onChange={(e) => setSelectedBatch(e.target.value)}
            className="w-full md:w-1/5 px-4 py-2 border border-gray-300 rounded-lg shadow-md"
          >
            <option value="">All Batches</option>
            {batches.map((batch, index) => (
              <option key={index} value={batch}>
                {batch}
              </option>
            ))}
          </select>
          <div className="flex gap-4 w-full md:w-auto">
            <button
              type="submit"
              className="w-full md:w-auto px-4 py-2 bg-blue-600 text-white rounded-lg bg-blue shadow-md bg-blue hover:bg-lightBlue"
            >
              Search
            </button>
            <button
              type="button"
              onClick={handleReset}
              className="w-full md:w-auto px-4 py-2 bg-blue text-white rounded-lg shadow-md hover:bg-lightBlue"
            >
              Reset
            </button>
          </div>
        </form>
      </div>

      {/* Alumni Cards */}
      <div className="max-w-[90%] md:max-w-[85%] mx-auto my-10 md:my-24">
        {loading ? (
          <AlumniGridSkeleton count={8} />
        ) : combinedData.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8">
            {combinedData.slice(0, visibleCount).map((item, index) => {
              const cardKey = item._id || `${item.Name || item.name}-${index}`;
              const isExpanded = !!expandedCards[cardKey];

              return (
                <div
                  key={cardKey}
                  className="bg-white dark:bg-slate-800 shadow-lg rounded-lg overflow-hidden transition-transform transform hover:scale-105 flex flex-col justify-between"
                >
                  <div>
                    <div className="h-64 md:h-72 lg:h-96">
                      <img
                        src={item.Image || item.photo || '/images/user.jpg'}
                        alt={item.Name || item.name}
                        className="w-full h-full object-cover"
                        onError={(e) => { e.target.src = '/images/user.jpg'; }}
                      />
                    </div>

                    <div className="p-4 text-sm md:text-base">
                      <div className="space-y-1">
                        <h3 className="text-lg md:text-xl font-bold text-slate-900 dark:text-slate-100 mb-2">
                          {item.Name || item.name}
                        </h3>

                        {(item.Course || item.course) && (
                          <p className="text-slate-700 dark:text-slate-300">
                            <strong className="text-slate-900 dark:text-slate-100">Course:</strong> {item.Course || item.course}
                          </p>
                        )}

                        {(item.Batch || item.batch || getBatch(item)) && (
                          <p className="text-slate-700 dark:text-slate-300 whitespace-nowrap">
                            <strong className="text-slate-900 dark:text-slate-100">Batch:</strong> {item.Batch || item.batch || getBatch(item)}
                          </p>
                        )}

                        {getProfession(item) && (
                          <p className="text-slate-700 dark:text-slate-300">
                            <strong className="text-slate-900 dark:text-slate-100">Profession:</strong> {getProfession(item).charAt(0).toUpperCase() + getProfession(item).slice(1)}
                          </p>
                        )}

                        {(item.organization || item.InstituteName) && (
                          <p className="text-slate-700 dark:text-slate-300">
                            <strong className="text-slate-900 dark:text-slate-100">Organization:</strong> {item.organization || item.InstituteName}
                          </p>
                        )}

                        {(item.LinkedIn || item.linkedin) && (
                          <p className="text-slate-700 dark:text-slate-300">
                            <strong className="text-slate-900 dark:text-slate-100">LinkedIn:</strong>{' '}
                            <a
                              href={item.LinkedIn || item.linkedin}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue dark:text-sky-400 underline font-medium hover:text-darkBlue"
                            >
                              Profile
                            </a>
                          </p>
                        )}

                        {/* Collapsible details section */}
                        {isExpanded && (
                          <div className="pt-2 mt-2 border-t border-slate-200 dark:border-slate-700 space-y-1 animate__animated animate__fadeIn">
                            {(item.Skill || item.skill || (Array.isArray(item.skills) ? item.skills.join(', ') : item.skills)) && (
                              <p className="text-slate-700 dark:text-slate-300">
                                <strong className="text-slate-900 dark:text-slate-100">Skills:</strong> {item.Skill || item.skill || (Array.isArray(item.skills) ? item.skills.join(', ') : item.skills)}
                              </p>
                            )}

                            {(item.Class || item.class) && (
                              <p className="text-slate-700 dark:text-slate-300">
                                <strong className="text-slate-900 dark:text-slate-100">Class:</strong> {item.Class || item.class}
                              </p>
                            )}

                            {(item.WebsiteLink || item.website) && (
                              <p className="text-slate-700 dark:text-slate-300">
                                <strong className="text-slate-900 dark:text-slate-100">Website:</strong>{' '}
                                <a
                                  href={item.WebsiteLink || item.website}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-blue dark:text-sky-400 underline font-medium hover:text-darkBlue"
                                >
                                  Visit
                                </a>
                              </p>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* See More / See Less Button */}
                  <div className="p-4 pt-0">
                    <button
                      type="button"
                      onClick={() => setExpandedCards(prev => ({ ...prev, [cardKey]: !prev[cardKey] }))}
                      className="w-full py-1.5 px-3 rounded-lg bg-blue/10 hover:bg-blue/20 text-blue dark:bg-sky-400/10 dark:hover:bg-sky-400/20 dark:text-sky-300 font-semibold text-xs md:text-sm transition flex items-center justify-center gap-1.5 border border-blue/20 dark:border-sky-400/20"
                    >
                      <span>{isExpanded ? 'See Less' : 'See More'}</span>
                      <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <p className="text-center text-gray-500 mt-10">
            {searchTerm || selectedCourse || selectedProfession || selectedBatch
              ? `No alumni found matching your criteria.`
              : 'No alumni data available.'}
          </p>
        )}
      </div>

      {visibleCount < combinedData.length && (
        <div ref={loaderRef} className="text-center my-8">
          <p className="text-gray-500">Loading more alumni...</p>
        </div>
      )}
    </div>
  );
}