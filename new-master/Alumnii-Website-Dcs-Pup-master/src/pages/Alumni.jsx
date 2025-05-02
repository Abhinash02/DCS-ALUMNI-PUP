
// import React, { useState, useEffect, useRef, useCallback } from 'react';
// import localData from '../data/aluminiData.json';
// import axios from 'axios';
// import { Link } from 'react-router-dom';

// export default function Alumni() {
//   const [searchTerm, setSearchTerm] = useState('');
//   const [selectedCourse, setSelectedCourse] = useState('');
//   const [visibleCount, setVisibleCount] = useState(25);
//   const [combinedData, setCombinedData] = useState([]);
//   const [currentIndex, setCurrentIndex] = useState(0);
//   const inputRef = useRef(null);
//   const loaderRef = useRef(null);

//   const slides = [
//     { id: 1, image: 'images/slider1.jpg' },
//     { id: 2, image: 'images/slider2.jpg' },
//     { id: 3, image: 'images/slider3.jpg' },
//     { id: 4, image: 'images/slider4.jpg' },
//     { id: 5, image: 'images/slider5.jpg' },
//   ];

//   useEffect(() => {
//     axios
//       .get('http://localhost:5000/api/alumni/approved')
//       .then((res) => {
//         const mongoData = res.data;
//         const merged = [...localData, ...mongoData];
//         setCombinedData(sortAndFilterData(merged, searchTerm, selectedCourse));
//       })
//       .catch((err) => {
//         console.error('Failed to fetch alumni:', err);
//         setCombinedData(sortAndFilterData(localData, searchTerm, selectedCourse));
//       });
//   }, []);

//   useEffect(() => {
//     const merged = [...localData, ...combinedData.filter(d => !localData.includes(d))];
//     setCombinedData(sortAndFilterData(merged, searchTerm, selectedCourse));
//     setVisibleCount(25);
//   }, [searchTerm, selectedCourse]);

//   useEffect(() => {
//     const interval = setInterval(() => {
//       setCurrentIndex((prev) => (prev + 1) % slides.length);
//     }, 3000);
//     return () => clearInterval(interval);
//   }, [slides.length]);

//   const extractYear = (batch) => {
//     if (!batch) return 0;
//     const years = String(batch).match(/\d{4}/g);
//     return years ? Math.max(...years.map(Number)) : 0;
//   };

//   const sortAndFilterData = (data, term, course) => {
//     let results = data;

//     if (term.trim()) {
//       results = results.filter((item) =>
//         (item.Name || item.name)?.toLowerCase().includes(term.toLowerCase())
//       );
//     }

//     if (course) {
//       results = results.filter(
//         (item) =>
//           (item.Course || item.course)?.trim().toLowerCase() === course.toLowerCase()
//       );
//     }

//     return [...results].sort((a, b) => {
//       const yearDiff = extractYear(b.Batch || b.batch) - extractYear(a.Batch || a.batch);
//       if (yearDiff !== 0) return yearDiff;
//       return (b.Image || b.photo ? 1 : 0) - (a.Image || a.photo ? 1 : 0);
//     });
//   };

//   const handleReset = () => {
//     setSearchTerm('');
//     setSelectedCourse('');
//     setVisibleCount(25);
//     inputRef.current?.focus();
//   };

//   const loadMore = useCallback(() => {
//     setVisibleCount((prev) => prev + 25);
//   }, []);

//   useEffect(() => {
//     const observer = new IntersectionObserver(
//       ([entry]) => {
//         if (entry.isIntersecting && visibleCount < combinedData.length) {
//           loadMore();
//         }
//       },
//       { threshold: 1 }
//     );

//     if (loaderRef.current) observer.observe(loaderRef.current);
//     return () => {
//       if (loaderRef.current) observer.unobserve(loaderRef.current);
//     };
//   }, [loadMore, visibleCount, combinedData.length]);

//   return (
//     <div className="w-full mt-20">
//       {/* Image Slider */}
//       <div className="relative hidden md:block max-h-full h-screen">
//         {slides.map((slide, index) => (
//           <div
//             key={slide.id}
//             className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
//               index === currentIndex ? 'opacity-100' : 'opacity-0'
//             }`}
//           >
//             <img
//               src={slide.image}
//               alt={`Slide ${index + 1}`}
//               className="w-full h-full object-contain"
//             />
//           </div>
//         ))}
//         <div className="absolute inset-0 flex justify-between items-center">
//           <button
//             className="text-white bg-black bg-opacity-50 p-2 rounded-full ml-4"
//             onClick={() =>
//               setCurrentIndex((prev) => (prev === 0 ? slides.length - 1 : prev - 1))
//             }
//           >
//             &#10094;
//           </button>
//           <button
//             className="text-white bg-black bg-opacity-50 p-2 rounded-full mr-4"
//             onClick={() => setCurrentIndex((prev) => (prev + 1) % slides.length)}
//           >
//             &#10095;
//           </button>
//         </div>
//       </div>

//       {/* Heading */}
//       <div className="w-full py-6 text-center">
//         <h2 className="text-3xl font-semibold">All Alumni (Local + MongoDB)</h2>
//       </div>

//       {/* Search & Filter */}
//       <div className="max-w-[85%] mx-auto">
//         <form
//           onSubmit={(e) => {
//             e.preventDefault();
//             inputRef.current?.blur();
//           }}
//           className="flex flex-col md:flex-row justify-center items-center gap-4"
//         >
//           <input
//             ref={inputRef}
//             type="text"
//             placeholder="Search Alumni by Name..."
//             value={searchTerm}
//             onChange={(e) => setSearchTerm(e.target.value)}
//             className="w-full md:w-[50%] px-4 py-2 border border-gray-300 rounded-lg shadow-md"
//           />
//           <select
//             value={selectedCourse}
//             onChange={(e) => setSelectedCourse(e.target.value)}
//             className="w-full md:w-auto px-4 py-2 border border-gray-300 rounded-lg shadow-md"
//           >
//             <option value="">All Courses</option>
//             <option value="MCA">MCA</option>
//             <option value="PhD">PhD</option>
//             <option value="B.Tech">B.Tech</option>
//             <option value="M.Tech">M.Tech</option>
//           </select>
//           <button
//             type="button"
//             onClick={handleReset}
//             className="px-4 py-2 bg-blue text-white rounded-lg shadow-md hover:bg-darkBlue"
//           >
//             Reset
//           </button>
//         </form>
//       </div>

//       {/* Alumni Cards */}
//       <div className="max-w-[90%] md:max-w-[85%] mx-auto my-10 md:my-24">
//         {combinedData.length > 0 ? (
//           <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8">
//             {combinedData.slice(0, visibleCount).map((item, index) => (
//               <div
//                 key={index}
//                 className="bg-white shadow-lg rounded-lg overflow-hidden transition-transform transform hover:scale-105"
//               >
//                 <div className="h-64 md:h-72 lg:h-96">
//                   <img
//                     src={item.Image || item.photo || '/images/user.jpg'}
//                     alt={item.Name || item.name}
//                     className="w-full h-full object-cover"
//                   />
//                 </div>
//                 <div className="p-4 text-sm md:text-base">
//                   <h3 className="text-lg md:text-xl font-bold">{item.Name || item.name}</h3>
//                   {(item.Course || item.course) && <p><strong>Course:</strong> {item.Course || item.course}</p>}
//                   {(item.Batch || item.batch) && <p><strong>Batch:</strong> {item.Batch || item.batch}</p>}
//                   {(item.Class || item.class) && <p><strong>Class:</strong> {item.Class || item.class}</p>}
//                   {item.profession && <p><strong>Profession:</strong> {item.profession}</p>}
//                   {item.organization && <p><strong>Organization:</strong> {item.organization}</p>}
//                   {(item.Skill || item.skill) && <p><strong>Skills:</strong> {item.Skill || item.skill}</p>}
//                   {(item.LinkedIn || item.linkedin) && (
//                     <p>
//                       <strong>LinkedIn:</strong>{' '}
//                       <a
//                         href={item.LinkedIn || item.linkedin}
//                         target="_blank"
//                         rel="noopener noreferrer"
//                         className="text-blue-600 underline"
//                       >
//                         Profile
//                       </a>
//                     </p>
//                   )}
//                   {item.website && (
//                     <p>
//                       <strong>Website:</strong>{' '}
//                       <a
//                         href={item.website}
//                         target="_blank"
//                         rel="noopener noreferrer"
//                         className="text-blue-600 underline"
//                       >
//                         Visit
//                       </a>
//                     </p>
//                   )}
//                 </div>
//               </div>
//             ))}
//           </div>
//         ) : (
//           <p className="text-center text-gray-500 mt-10">
//             {searchTerm
//               ? `No alumni found matching "${searchTerm}".`
//               : 'No alumni data available.'}
//           </p>
//         )}
//       </div>

//       {visibleCount < combinedData.length && (
//         <div ref={loaderRef} className="text-center my-8">
//           <p className="text-gray-500">Loading more alumni...</p>
//         </div>
//       )}
//     </div>
//   );
// }


// import React, { useState, useEffect, useRef, useCallback } from 'react';
// import localData from '../data/aluminiData.json';
// import axios from 'axios';
// import { Link } from 'react-router-dom';

// export default function Alumni() {
//   const [searchTerm, setSearchTerm] = useState('');
//   const [selectedCourse, setSelectedCourse] = useState('');
//   const [selectedProfession, setSelectedProfession] = useState('');
//   const [professions, setProfessions] = useState([]);
//   const [visibleCount, setVisibleCount] = useState(25);
//   const [combinedData, setCombinedData] = useState([]);
//   const [currentIndex, setCurrentIndex] = useState(0);
//   const inputRef = useRef(null);
//   const loaderRef = useRef(null);

//   const slides = [
//     { id: 1, image: 'images/slider1.jpg' },
//     { id: 2, image: 'images/slider2.jpg' },
//     { id: 3, image: 'images/slider3.jpg' },
//     { id: 4, image: 'images/slider4.jpg' },
//     { id: 5, image: 'images/slider5.jpg' },
//   ];

//   // Fetch data and unique professions
//   useEffect(() => {
//     axios
//       .get('http://localhost:5000/api/alumni/approved')
//       .then((res) => {
//         const mongoData = res.data;
//         const merged = [...localData, ...mongoData];
//         setCombinedData(sortAndFilterData(merged, searchTerm, selectedCourse, selectedProfession));
        
//         // Extract unique professions
//         const uniqueProfessions = [...new Set(
//           merged
//             .map(item => item.profession?.trim().toLowerCase())
//             .filter(prof => prof)
//         )].sort();
//         setProfessions(uniqueProfessions);
//       })
//       .catch((err) => {
//         console.error('Failed to fetch alumni:', err);
//         setCombinedData(sortAndFilterData(localData, searchTerm, selectedCourse, selectedProfession));
        
//         // Extract unique professions from localData
//         const uniqueProfessions = [...new Set(
//           localData
//             .map(item => item.profession?.trim().toLowerCase())
//             .filter(prof => prof)
//         )].sort();
//         setProfessions(uniqueProfessions);
//       });
//   }, []);

//   // Update filtered data when filters change
//   useEffect(() => {
//     const merged = [...localData, ...combinedData.filter(d => !localData.includes(d))];
//     setCombinedData(sortAndFilterData(merged, searchTerm, selectedCourse, selectedProfession));
//     setVisibleCount(25);
//   }, [searchTerm, selectedCourse, selectedProfession]);

//   useEffect(() => {
//     const interval = setInterval(() => {
//       setCurrentIndex((prev) => (prev + 1) % slides.length);
//     }, 3000);
//     return () => clearInterval(interval);
//   }, [slides.length]);

//   const extractYear = (batch) => {
//     if (!batch) return 0;
//     const years = String(batch).match(/\d{4}/g);
//     return years ? Math.max(...years.map(Number)) : 0;
//   };

//   const sortAndFilterData = (data, term, course, profession) => {
//     let results = data;

//     if (term.trim()) {
//       results = results.filter((item) =>
//         (item.Name || item.name)?.toLowerCase().includes(term.toLowerCase())
//       );
//     }

//     if (course) {
//       results = results.filter(
//         (item) =>
//           (item.Course || item.course)?.trim().toLowerCase() === course.toLowerCase()
//       );
//     }

//     if (profession) {
//       results = results.filter(
//         (item) =>
//           (item.profession)?.trim().toLowerCase() === profession.toLowerCase()
//       );
//     }

//     return [...results].sort((a, b) => {
//       const yearDiff = extractYear(b.Batch || b.batch) - extractYear(a.Batch || a.batch);
//       if (yearDiff !== 0) return yearDiff;
//       return (b.Image || b.photo ? 1 : 0) - (a.Image || a.photo ? 1 : 0);
//     });
//   };

//   const handleReset = () => {
//     setSearchTerm('');
//     setSelectedCourse('');
//     setSelectedProfession('');
//     setVisibleCount(25);
//     inputRef.current?.focus();
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     inputRef.current?.blur();
//   };

//   const loadMore = useCallback(() => {
//     setVisibleCount((prev) => prev + 25);
//   }, []);

//   useEffect(() => {
//     const observer = new IntersectionObserver(
//       ([entry]) => {
//         if (entry.isIntersecting && visibleCount < combinedData.length) {
//           loadMore();
//         }
//       },
//       { threshold: 1 }
//     );

//     if (loaderRef.current) observer.observe(loaderRef.current);
//     return () => {
//       if (loaderRef.current) observer.unobserve(loaderRef.current);
//     };
//   }, [loadMore, visibleCount, combinedData.length]);

//   return (
//     <div className="w-full mt-20">
//       {/* Image Slider */}
//       <div className="relative hidden md:block max-h-full h-screen">
//         {slides.map((slide, index) => (
//           <div
//             key={slide.id}
//             className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
//               index === currentIndex ? 'opacity-100' : 'opacity-0'
//             }`}
//           >
//             <img
//               src={slide.image}
//               alt={`Slide ${index + 1}`}
//               className="w-full h-full object-contain"
//             />
//           </div>
//         ))}
//         <div className="absolute inset-0 flex justify-between items-center">
//           <button
//             className="text-white bg-black bg-opacity-50 p-2 rounded-full ml-4"
//             onClick={() =>
//               setCurrentIndex((prev) => (prev === 0 ? slides.length - 1 : prev - 1))
//             }
//           >
//             ❮
//           </button>
//           <button
//             className="text-white bg-black bg-opacity-50 p-2 rounded-full mr-4"
//             onClick={() => setCurrentIndex((prev) => (prev + 1) % slides.length)}
//           >
//             ❯
//           </button>
//         </div>
//       </div>

//       {/* Heading */}
//       <div className="w-full py-6 text-center">
//         <h2 className="text-3xl font-semibold">All Alumni (Local + MongoDB)</h2>
//       </div>

//       {/* Search & Filter */}
//       <div className="max-w-[85%] mx-auto">
//         <form
//           onSubmit={handleSubmit}
//           className="flex flex-col md:flex-row justify-center items-center gap-4"
//         >
//           <input
//             ref={inputRef}
//             type="text"
//             placeholder="Search Alumni by Name..."
//             value={searchTerm}
//             onChange={(e) => setSearchTerm(e.target.value)}
//             className="w-full md:w-1/4 px-4 py-2 border border-gray-300 rounded-lg shadow-md"
//           />
//           <select
//             value={selectedCourse}
//             onChange={(e) => setSelectedCourse(e.target.value)}
//             className="w-full md:w-1/4 px-4 py-2 border border-gray-300 rounded-lg shadow-md"
//           >
//             <option value="">All Courses</option>
//             <option value="MCA">MCA</option>
//             <option value="PhD">PhD</option>
//             <option value="B.Tech">B.Tech</option>
//             <option value="M.Tech">M.Tech</option>
//           </select>
//           <select
//             value={selectedProfession}
//             onChange={(e) => setSelectedProfession(e.target.value)}
//             className="w-full md:w-1/4 px-4 py-2 border border-gray-300 rounded-lg shadow-md"
//           >
//             <option value="">All Professions</option>
//             {professions.map((prof, index) => (
//               <option key={index} value={prof}>
//                 {prof.charAt(0).toUpperCase() + prof.slice(1)}
//               </option>
//             ))}
//           </select>
//           <div className="flex gap-4 w-full md:w-auto">
//             <button
//               type="submit"
//               className="w-full md:w-auto px-4 py-2 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700"
//             >
//               Search
//             </button>
//             <button
//               type="button"
//               onClick={handleReset}
//               className="w-full md:w-auto px-4 py-2 bg-gray-600 text-white rounded-lg shadow-md hover:bg-gray-700"
//             >
//               Reset
//             </button>
//           </div>
//         </form>
//       </div>

//       {/* Alumni Cards */}
//       <div className="max-w-[90%] md:max-w-[85%] mx-auto my-10 md:my-24">
//         {combinedData.length > 0 ? (
//           <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8">
//             {combinedData.slice(0, visibleCount).map((item, index) => (
//               <div
//                 key={index}
//                 className="bg-white shadow-lg rounded-lg overflow-hidden transition-transform transform hover:scale-105"
//               >
//                 <div className="h-64 md:h-72 lg:h-96">
//                   <img
//                     src={item.Image || item.photo || '/images/user.jpg'}
//                     alt={item.Name || item.name}
//                     className="w-full h-full object-cover"
//                   />
//                 </div>
//                 <div className="p-4 text-sm md:text-base">
//                   <h3 className="text-lg md:text-xl font-bold">{item.Name || item.name}</h3>
//                   {(item.Course || item.course) && <p><strong>Course:</strong> {item.Course || item.course}</p>}
//                   {(item.Batch || item.batch) && <p><strong>Batch:</strong> {item.Batch || item.batch}</p>}
//                   {(item.Class || item.class) && <p><strong>Class:</strong> {item.Class || item.class}</p>}
//                   {item.profession && <p><strong>Profession:</strong> {item.profession}</p>}
//                   {item.organization && <p><strong>Organization:</strong> {item.organization}</p>}
//                   {(item.Skill || item.skill) && <p><strong>Skills:</strong> {item.Skill || item.skill}</p>}
//                   {(item.LinkedIn || item.linkedin) && (
//                     <p>
//                       <strong>LinkedIn:</strong>{' '}
//                       <a
//                         href={item.LinkedIn || item.linkedin}
//                         target="_blank"
//                         rel="noopener noreferrer"
//                         className="text-blue-600 underline"
//                       >
//                         Profile
//                       </a>
//                     </p>
//                   )}
//                   {item.website && (
//                     <p>
//                       <strong>Website:</strong>{' '}
//                       <a
//                         href={item.website}
//                         target="_blank"
//                         rel="noopener noreferrer"
//                         className="text-blue-600 underline"
//                       >
//                         Visit
//                       </a>
//                     </p>
//                   )}
//                 </div>
//               </div>
//             ))}
//           </div>
//         ) : (
//           <p className="text-center text-gray-500 mt-10">
//             {searchTerm || selectedCourse || selectedProfession
//               ? `No alumni found matching your criteria.`
//               : 'No alumni data available.'}
//           </p>
//         )}
//       </div>

//       {visibleCount < combinedData.length && (
//         <div ref={loaderRef} className="text-center my-8">
//           <p className="text-gray-500">Loading more alumni...</p>
//         </div>
//       )}
//     </div>
//   );
// }

// import React, { useState, useEffect, useRef, useCallback } from 'react';
// import localData from '../data/aluminiData.json';
// import axios from 'axios';
// import { Link } from 'react-router-dom';

// export default function Alumni() {
//   const [searchTerm, setSearchTerm] = useState('');
//   const [selectedCourse, setSelectedCourse] = useState('');
//   const [selectedProfession, setSelectedProfession] = useState('');
//   const [professions, setProfessions] = useState([]);
//   const [visibleCount, setVisibleCount] = useState(25);
//   const [combinedData, setCombinedData] = useState([]);
//   const [currentIndex, setCurrentIndex] = useState(0);
//   const inputRef = useRef(null);
//   const loaderRef = useRef(null);

//   const slides = [
//     { id: 1, image: 'images/slider1.jpg' },
//     { id: 2, image: 'images/slider2.jpg' },
//     { id: 3, image: 'images/slider3.jpg' },
//     { id: 4, image: 'images/slider4.jpg' },
//     { id: 5, image: 'images/slider5.jpg' },
//   ];

//   // Fetch data and unique professions
//   useEffect(() => {
//     axios
//       .get('http://localhost:5000/api/alumni/approved')
//       .then((res) => {
//         const mongoData = res.data;
//         const merged = [...localData, ...mongoData];
//         setCombinedData(sortAndFilterData(merged, searchTerm, selectedCourse, selectedProfession));
        
//         // Extract unique professions
//         const uniqueProfessions = [...new Set(
//           merged
//             .map(item => item.profession?.trim().toLowerCase())
//             .filter(prof => prof)
//         )].sort();
//         setProfessions(uniqueProfessions);
//       })
//       .catch((err) => {
//         console.error('Failed to fetch alumni:', err);
//         setCombinedData(sortAndFilterData(localData, searchTerm, selectedCourse, selectedProfession));
        
//         // Extract unique professions from localData
//         const uniqueProfessions = [...new Set(
//           localData
//             .map(item => item.profession?.trim().toLowerCase())
//             .filter(prof => prof)
//         )].sort();
//         setProfessions(uniqueProfessions);
//       });
//   }, []);

//   // Update filtered data when filters change
//   useEffect(() => {
//     const merged = [...localData, ...combinedData.filter(d => !localData.includes(d))];
//     setCombinedData(sortAndFilterData(merged, searchTerm, selectedCourse, selectedProfession));
//     setVisibleCount(25);
//   }, [searchTerm, selectedCourse, selectedProfession]);

//   useEffect(() => {
//     const interval = setInterval(() => {
//       setCurrentIndex((prev) => (prev + 1) % slides.length);
//     }, 3000);
//     return () => clearInterval(interval);
//   }, [slides.length]);

//   const extractYear = (batch) => {
//     if (!batch) return 0;
//     const years = String(batch).match(/\d{4}/g);
//     return years ? Math.max(...years.map(Number)) : 0;
//   };

//   const sortAndFilterData = (data, term, course, profession) => {
//     let results = data;

//     // Apply filters
//     if (term.trim()) {
//       results = results.filter((item) =>
//         (item.Name || item.name)?.toLowerCase().includes(term.toLowerCase())
//       );
//     }

//     if (course) {
//       results = results.filter(
//         (item) =>
//           (item.Course || item.course)?.trim().toLowerCase() === course.toLowerCase()
//       );
//     }

//     if (profession) {
//       results = results.filter(
//         (item) =>
//           (item.profession)?.trim().toLowerCase() === profession.toLowerCase()
//       );
//     }

//     // Sort by batch year (descending) and prioritize localData before mongoData within the same year
//     return [...results].sort((a, b) => {
//       const yearA = extractYear(a.Batch || a.batch);
//       const yearB = extractYear(b.Batch || b.batch);
      
//       // Sort by year in descending order (2024 > 2023 > 2022)
//       if (yearB !== yearA) return yearB - yearA;

//       // Within the same year, localData comes first, mongoData (new data) comes last
//       const isALocal = localData.includes(a);
//       const isBLocal = localData.includes(b);
//       if (isALocal && !isBLocal) return -1;
//       if (!isALocal && isBLocal) return 1;

//       // Within same source, sort by presence of image
//       return (b.Image || b.photo ? 1 : 0) - (a.Image || a.photo ? 1 : 0);
//     });
//   };

//   const handleReset = () => {
//     setSearchTerm('');
//     setSelectedCourse('');
//     setSelectedProfession('');
//     setVisibleCount(25);
//     inputRef.current?.focus();
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     inputRef.current?.blur();
//   };

//   const loadMore = useCallback(() => {
//     setVisibleCount((prev) => prev + 25);
//   }, []);

//   useEffect(() => {
//     const observer = new IntersectionObserver(
//       ([entry]) => {
//         if (entry.isIntersecting && visibleCount < combinedData.length) {
//           loadMore();
//         }
//       },
//       { threshold: 1 }
//     );

//     if (loaderRef.current) observer.observe(loaderRef.current);
//     return () => {
//       if (loaderRef.current) observer.unobserve(loaderRef.current);
//     };
//   }, [loadMore, visibleCount, combinedData.length]);

//   return (
//     <div className="w-full mt-20">
//       {/* Image Slider */}
//       <div className="relative hidden md:block max-h-full h-screen">
//         {slides.map((slide, index) => (
//           <div
//             key={slide.id}
//             className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
//               index === currentIndex ? 'opacity-100' : 'opacity-0'
//             }`}
//           >
//             <img
//               src={slide.image}
//               alt={`Slide ${index + 1}`}
//               className="w-full h-full object-contain"
//             />
//           </div>
//         ))}
//         <div className="absolute inset-0 flex justify-between items-center">
//           <button
//             className="text-white bg-black bg-opacity-50 p-2 rounded-full ml-4"
//             onClick={() =>
//               setCurrentIndex((prev) => (prev === 0 ? slides.length - 1 : prev - 1))
//             }
//           >
//             ❮
//           </button>
//           <button
//             className="text-white bg-black bg-opacity-50 p-2 rounded-full mr-4"
//             onClick={() => setCurrentIndex((prev) => (prev + 1) % slides.length)}
//           >
//             ❯
//           </button>
//         </div>
//       </div>

//       {/* Heading */}
//       <div className="w-full py-6 text-center">
//         <h2 className="text-3xl font-semibold">All Alumni (Local + MongoDB)</h2>
//       </div>

//       {/* Search & Filter */}
//       <div className="max-w-[85%] mx-auto">
//         <form
//           onSubmit={handleSubmit}
//           className="flex flex-col md:flex-row justify-center items-center gap-4"
//         >
//           <input
//             ref={inputRef}
//             type="text"
//             placeholder="Search Alumni by Name..."
//             value={searchTerm}
//             onChange={(e) => setSearchTerm(e.target.value)}
//             className="w-full md:w-1/4 px-4 py-2 border border-gray-300 rounded-lg shadow-md"
//           />
//           <select
//             value={selectedCourse}
//             onChange={(e) => setSelectedCourse(e.target.value)}
//             className="w-full md:w-1/4 px-4 py-2 border border-gray-300 rounded-lg shadow-md"
//           >
//             <option value="">All Courses</option>
//             <option value="MCA">MCA</option>
//             <option value="PhD">PhD</option>
//             <option value="B.Tech">B.Tech</option>
//             <option value="M.Tech">M.Tech</option>
//           </select>
//           <select
//             value={selectedProfession}
//             onChange={(e) => setSelectedProfession(e.target.value)}
//             className="w-full md:w-1/4 px-4 py-2 border border-gray-300 rounded-lg shadow-md"
//           >
//             <option value="">All Profession</option>
//             {professions.map((prof, index) => (
//               <option key={index} value={prof}>
//                 {prof.charAt(0).toUpperCase() + prof.slice(1)}
//               </option>
//             ))}
//           </select>
//           <div className="flex gap-4 w-full md:w-auto">
//             <button
//               type="submit"
//               className="w-full md:w-auto px-4 py-2 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700"
//             >
//               Search
//             </button>
//             <button
//               type="button"
//               onClick={handleReset}
//               className="w-full md:w-auto px-4 py-2 bg-gray-600 text-white rounded-lg shadow-md hover:bg-gray-700"
//             >
//               Reset
//             </button>
//           </div>
//         </form>
//       </div>

//       {/* Alumni Cards */}
//       <div className="max-w-[90%] md:max-w-[85%] mx-auto my-10 md:my-24">
//         {combinedData.length > 0 ? (
//           <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8">
//             {combinedData.slice(0, visibleCount).map((item, index) => (
//               <div
//                 key={index}
//                 className="bg-white shadow-lg rounded-lg overflow-hidden transition-transform transform hover:scale-105"
//               >
//                 <div className="h-64 md:h-72 lg:h-96">
//                   <img
//                     src={item.Image || item.photo || '/images/user.jpg'}
//                     alt={item.Name || item.name}
//                     className="w-full h-full object-cover"
//                   />
//                 </div>
//                 <div className="p-4 text-sm md:text-base">
//                   <h3 className="text-lg md:text-xl font-bold">{item.Name || item.name}</h3>
//                   {(item.Course || item.course) && <p><strong>Course:</strong> {item.Course || item.course}</p>}
//                   {(item.Batch || item.batch) && <p><strong>Batch:</strong> {item.Batch || item.batch}</p>}
//                   {(item.Class || item.class) && <p><strong>Class:</strong> {item.Class || item.class}</p>}
//                   {item.profession && <p><strong>Profession:</strong> {item.profession}</p>}
//                   {item.organization && <p><strong>Organization:</strong> {item.organization}</p>}
//                   {(item.Skill || item.skill) && <p><strong>Skills:</strong> {item.Skill || item.skill}</p>}
//                   {(item.LinkedIn || item.linkedin) && (
//                     <p>
//                       <strong>LinkedIn:</strong>{' '}
//                       <a
//                         href={item.LinkedIn || item.linkedin}
//                         target="_blank"
//                         rel="noopener noreferrer"
//                         className="text-blue-600 underline"
//                       >
//                         Profile
//                       </a>
//                     </p>
//                   )}
//                   {item.website && (
//                     <p>
//                       <strong>Website:</strong>{' '}
//                       <a
//                         href={item.website}
//                         target="_blank"
//                         rel="noopener noreferrer"
//                         className="text-blue-600 underline"
//                       >
//                         Visit
//                       </a>
//                     </p>
//                   )}
//                 </div>
//               </div>
//             ))}
//           </div>
//         ) : (
//           <p className="text-center text-gray-500 mt-10">
//             {searchTerm || selectedCourse || selectedProfession
//               ? `No alumni found matching your criteria.`
//               : 'No alumni data available.'}
//           </p>
//         )}
//       </div>

//       {visibleCount < combinedData.length && (
//         <div ref={loaderRef} className="text-center my-8">
//           <p className="text-gray-500">Loading more alumni...</p>
//         </div>
//       )}
//     </div>
//   );
// }



// import React, { useState, useEffect, useRef, useCallback } from 'react';
// import localData from '../data/aluminiData.json';
// import axios from 'axios';
// import { Link } from 'react-router-dom';

// export default function Alumni() {
//   const [searchTerm, setSearchTerm] = useState('');
//   const [selectedCourse, setSelectedCourse] = useState('');
//   const [selectedProfession, setSelectedProfession] = useState('');
//   const [professions, setProfessions] = useState([]);
//   const [visibleCount, setVisibleCount] = useState(25);
//   const [combinedData, setCombinedData] = useState([]);
//   const [currentIndex, setCurrentIndex] = useState(0);
//   const inputRef = useRef(null);
//   const loaderRef = useRef(null);

//   const slides = [
//     { id: 1, image: 'images/slider1.jpg' },
//     { id: 2, image: 'images/slider2.jpg' },
//     { id: 3, image: 'images/slider3.jpg' },
//     { id: 4, image: 'images/slider4.jpg' },
//     { id: 5, image: 'images/slider5.jpg' },
//   ];

//   // Normalize profession field
//   const getProfession = (item) => {
//     return (
//       item.profession ||
//       item.Profession ||
//       item.job ||
//       item.Job ||
//       ''
//     )?.trim().toLowerCase();
//   };

//   // Fetch data and unique professions
//   useEffect(() => {
//     axios
//       .get('http://localhost:5000/api/alumni/approved')
//       .then((res) => {
//         const mongoData = res.data;
//         const merged = [...localData, ...mongoData];
//         setCombinedData(sortAndFilterData(merged, searchTerm, selectedCourse, selectedProfession));
        
//         // Extract unique professions from both sources
//         const uniqueProfessions = [...new Set(
//           merged
//             .map(item => getProfession(item))
//             .filter(prof => prof) // Remove empty or falsy professions
//         )].sort();
//         setProfessions(uniqueProfessions);
//       })
//       .catch((err) => {
//         console.error('Failed to fetch alumni:', err);
//         setCombinedData(sortAndFilterData(localData, searchTerm, selectedCourse, selectedProfession));
        
//         // Extract unique professions from localData
//         const uniqueProfessions = [...new Set(
//           localData
//             .map(item => getProfession(item))
//             .filter(prof => prof)
//         )].sort();
//         setProfessions(uniqueProfessions);
//       });
//   }, []);

//   // Update filtered data when filters change
//   useEffect(() => {
//     const merged = [...localData, ...combinedData.filter(d => !localData.includes(d))];
//     setCombinedData(sortAndFilterData(merged, searchTerm, selectedCourse, selectedProfession));
//     setVisibleCount(25);
//   }, [searchTerm, selectedCourse, selectedProfession]);

//   useEffect(() => {
//     const interval = setInterval(() => {
//       setCurrentIndex((prev) => (prev + 1) % slides.length);
//     }, 3000);
//     return () => clearInterval(interval);
//   }, [slides.length]);

//   const extractYear = (batch) => {
//     if (!batch) return 0;
//     const years = String(batch).match(/\d{4}/g);
//     return years ? Math.max(...years.map(Number)) : 0;
//   };

//   const sortAndFilterData = (data, term, course, profession) => {
//     let results = data;

//     // Apply filters
//     if (term.trim()) {
//       results = results.filter((item) =>
//         (item.Name || item.name)?.toLowerCase().includes(term.toLowerCase())
//       );
//     }

//     if (course) {
//       results = results.filter(
//         (item) =>
//           (item.Course || item.course)?.trim().toLowerCase() === course.toLowerCase()
//       );
//     }

//     if (profession) {
//       results = results.filter(
//         (item) =>
//           getProfession(item) === profession.toLowerCase()
//       );
//     }

//     // Sort by batch year (descending) and prioritize localData before mongoData within the same year
//     return [...results].sort((a, b) => {
//       const yearA = extractYear(a.Batch || a.batch);
//       const yearB = extractYear(b.Batch || b.batch);
      
//       // Sort by year in descending order (2024 > 2023 > 2022)
//       if (yearB !== yearA) return yearB - yearA;

//       // Within the same year, localData comes first, mongoData (new data) comes last
//       const isALocal = localData.includes(a);
//       const isBLocal = localData.includes(b);
//       if (isALocal && !isBLocal) return -1;
//       if (!isALocal && isBLocal) return 1;

//       // Within same source, sort by presence of image
//       return (b.Image || b.photo ? 1 : 0) - (a.Image || a.photo ? 1 : 0);
//     });
//   };

//   const handleReset = () => {
//     setSearchTerm('');
//     setSelectedCourse('');
//     setSelectedProfession('');
//     setVisibleCount(25);
//     inputRef.current?.focus();
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     inputRef.current?.blur();
//   };

//   const loadMore = useCallback(() => {
//     setVisibleCount((prev) => prev + 25);
//   }, []);

//   useEffect(() => {
//     const observer = new IntersectionObserver(
//       ([entry]) => {
//         if (entry.isIntersecting && visibleCount < combinedData.length) {
//           loadMore();
//         }
//       },
//       { threshold: 1 }
//     );

//     if (loaderRef.current) observer.observe(loaderRef.current);
//     return () => {
//       if (loaderRef.current) observer.unobserve(loaderRef.current);
//     };
//   }, [loadMore, visibleCount, combinedData.length]);

//   return (
//     <div className="w-full mt-20">
//       {/* Image Slider */}
//       <div className="relative hidden md:block max-h-full h-screen">
//         {slides.map((slide, index) => (
//           <div
//             key={slide.id}
//             className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
//               index === currentIndex ? 'opacity-100' : 'opacity-0'
//             }`}
//           >
//             <img
//               src={slide.image}
//               alt={`Slide ${index + 1}`}
//               className="w-full h-full object-contain"
//             />
//           </div>
//         ))}
//         <div className="absolute inset-0 flex justify-between items-center">
//           <button
//             className="text-white bg-black bg-opacity-50 p-2 rounded-full ml-4"
//             onClick={() =>
//               setCurrentIndex((prev) => (prev === 0 ? slides.length - 1 : prev - 1))
//             }
//           >
//             ❮
//           </button>
//           <button
//             className="text-white bg-black bg-opacity-50 p-2 rounded-full mr-4"
//             onClick={() => setCurrentIndex((prev) => (prev + 1) % slides.length)}
//           >
//             ❯
//           </button>
//         </div>
//       </div>

//       {/* Heading */}
//       <div className="w-full py-6 text-center">
//         <h2 className="text-3xl font-semibold">All Alumni (Local + MongoDB)</h2>
//       </div>

//       {/* Search & Filter */}
//       <div className="max-w-[85%] mx-auto">
//         <form
//           onSubmit={handleSubmit}
//           className="flex flex-col md:flex-row justify-center items-center gap-4"
//         >
//           <input
//             ref={inputRef}
//             type="text"
//             placeholder="Search Alumni by Name..."
//             value={searchTerm}
//             onChange={(e) => setSearchTerm(e.target.value)}
//             className="w-full md:w-1/4 px-4 py-2 border border-gray-300 rounded-lg shadow-md"
//           />
//           <select
//             value={selectedCourse}
//             onChange={(e) => setSelectedCourse(e.target.value)}
//             className="w-full md:w-1/4 px-4 py-2 border border-gray-300 rounded-lg shadow-md"
//           >
//             <option value="">All Courses</option>
//             <option value="MCA">MCA</option>
//             <option value="PhD">PhD</option>
//             <option value="B.Tech">B.Tech</option>
//             <option value="M.Tech">M.Tech</option>
//           </select>
//           <select
//             value={selectedProfession}
//             onChange={(e) => setSelectedProfession(e.target.value)}
//             className="w-full md:w-1/4 px-4 py-2 border border-gray-300 rounded-lg shadow-md"
//           >
//             <option value="">All Professions</option>
//             {professions.map((prof, index) => (
//               <option key={index} value={prof}>
//                 {prof.charAt(0).toUpperCase() + prof.slice(1)}
//               </option>
//             ))}
//           </select>
//           <div className="flex gap-4 w-full md:w-auto">
//             <button
//               type="submit"
//               className="w-full md:w-auto px-4 py-2 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700"
//             >
//               Search
//             </button>
//             <button
//               type="button"
//               onClick={handleReset}
//               className="w-full md:w-auto px-4 py-2 bg-gray-600 text-white rounded-lg shadow-md hover:bg-gray-700"
//             >
//               Reset
//             </button>
//           </div>
//         </form>
//       </div>

//       {/* Alumni Cards */}
//       <div className="max-w-[90%] md:max-w-[85%] mx-auto my-10 md:my-24">
//         {combinedData.length > 0 ? (
//           <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8">
//             {combinedData.slice(0, visibleCount).map((item, index) => (
//               <div
//                 key={index}
//                 className="bg-white shadow-lg rounded-lg overflow-hidden transition-transform transform hover:scale-105"
//               >
//                 <div className="h-64 md:h-72 lg:h-96">
//                   <img
//                     src={item.Image || item.photo || '/images/user.jpg'}
//                     alt={item.Name || item.name}
//                     className="w-full h-full object-cover"
//                   />
//                 </div>
//                 <div className="p-4 text-sm md:text-base">
//                   <h3 className="text-lg md:text-xl font-bold">{item.Name || item.name}</h3>
//                   {(item.Course || item.course) && <p><strong>Course:</strong> {item.Course || item.course}</p>}
//                   {(item.Batch || item.batch) && <p><strong>Batch:</strong> {item.Batch || item.batch}</p>}
//                   {(item.Class || item.class) && <p><strong>Class:</strong> {item.Class || item.class}</p>}
//                   {getProfession(item) && <p><strong>Profession:</strong> {getProfession(item).charAt(0).toUpperCase() + getProfession(item).slice(1)}</p>}
//                   {item.organization && <p><strong>Organization:</strong> {item.organization}</p>}
//                   {(item.Skill || item.skill) && <p><strong>Skills:</strong> {item.Skill || item.skill}</p>}
//                   {(item.LinkedIn || item.linkedin) && (
//                     <p>
//                       <strong>LinkedIn:</strong>{' '}
//                       <a
//                         href={item.LinkedIn || item.linkedin}
//                         target="_blank"
//                         rel="noopener noreferrer"
//                         className="text-blue-600 underline"
//                       >
//                         Profile
//                       </a>
//                     </p>
//                   )}
//                   {item.website && (
//                     <p>
//                       <strong>Website:</strong>{' '}
//                       <a
//                         href={item.website}
//                         target="_blank"
//                         rel="noopener noreferrer"
//                         className="text-blue-600 underline"
//                       >
//                         Visit
//                       </a>
//                     </p>
//                   )}
//                 </div>
//               </div>
//             ))}
//           </div>
//         ) : (
//           <p className="text-center text-gray-500 mt-10">
//             {searchTerm || selectedCourse || selectedProfession
//               ? `No alumni found matching your criteria.`
//               : 'No alumni data available.'}
//           </p>
//         )}
//       </div>

//       {visibleCount < combinedData.length && (
//         <div ref={loaderRef} className="text-center my-8">
//           <p className="text-gray-500">Loading more alumni...</p>
//         </div>
//       )}
//     </div>
//   );
// }

// import React, { useState, useEffect, useRef, useCallback } from 'react';
// import localData from '../data/aluminiData.json';
// import axios from 'axios';
// import { Link } from 'react-router-dom';

// export default function Alumni() {
//   const [searchTerm, setSearchTerm] = useState('');
//   const [selectedCourse, setSelectedCourse] = useState('');
//   const [selectedProfession, setSelectedProfession] = useState('');
//   const [professions, setProfessions] = useState([]);
//   const [visibleCount, setVisibleCount] = useState(25);
//   const [combinedData, setCombinedData] = useState([]);
//   const [currentIndex, setCurrentIndex] = useState(0);
//   const [apiError, setApiError] = useState(null);
//   const inputRef = useRef(null);
//   const loaderRef = useRef(null);

//   const slides = [
//     { id: 1, image: 'images/slider1.jpg' },
//     { id: 2, image: 'images/slider2.jpg' },
//     { id: 3, image: 'images/slider3.jpg' },
//     { id: 4, image: 'images/slider4.jpg' },
//     { id: 5, image: 'images/slider5.jpg' },
//   ];

//   // Normalize profession field
//   const getProfession = (item) => {
//     return (
//       item.profession ||
//       item.Profession ||
//       item.job ||
//       item.Job ||
//       ''
//     )?.trim().toLowerCase();
//   };

//   // Fetch data and unique professions
//   useEffect(() => {
//     axios
//       .get('http://localhost:5000/api/alumni/approved')
//       .then((res) => {
//         const mongoData = Array.isArray(res.data) ? res.data : [];
//         const merged = [...localData, ...mongoData];
//         setCombinedData(sortAndFilterData(merged, searchTerm, selectedCourse, selectedProfession));
        
//         // Extract unique professions from both sources
//         const uniqueProfessions = [...new Set(
//           merged
//             .map(item => getProfession(item))
//             .filter(prof => prof)
//         )].sort();
//         setProfessions(uniqueProfessions);
//         setApiError(null);

//         // Debug: Log items without professions
//         const missingProfessions = merged.filter(item => !getProfession(item));
//         if (missingProfessions.length > 0) {
//           console.warn('Items without professions:', missingProfessions);
//         }
//         console.log('Fetched professions:', uniqueProfessions);
//       })
//       .catch((err) => {
//         console.error('Failed to fetch alumni:', err);
//         setCombinedData(sortAndFilterData(localData, searchTerm, selectedCourse, selectedProfession));
        
//         // Extract unique professions from localData
//         const uniqueProfessions = [...new Set(
//           localData
//             .map(item => getProfession(item))
//             .filter(prof => prof)
//         )].sort();
//         setProfessions(uniqueProfessions);
//         setApiError('Failed to load MongoDB data. Showing local data only.');

//         // Debug: Log items without professions
//         const missingProfessions = localData.filter(item => !getProfession(item));
//         if (missingProfessions.length > 0) {
//           console.warn('Local items without professions:', missingProfessions);
//         }
//         console.log('Fetched professions (local only):', uniqueProfessions);
//       });
//   }, []);

//   // Update filtered data when filters change
//   useEffect(() => {
//     const merged = [...localData, ...combinedData.filter(d => !localData.includes(d))];
//     setCombinedData(sortAndFilterData(merged, searchTerm, selectedCourse, selectedProfession));
//     setVisibleCount(25);
//   }, [searchTerm, selectedCourse, selectedProfession]);

//   useEffect(() => {
//     const interval = setInterval(() => {
//       setCurrentIndex((prev) => (prev + 1) % slides.length);
//     }, 3000);
//     return () => clearInterval(interval);
//   }, [slides.length]);

//   const extractYear = (batch) => {
//     if (!batch) return 0;
//     const years = String(batch).match(/\d{4}/g);
//     return years ? Math.max(...years.map(Number)) : 0;
//   };

//   const sortAndFilterData = (data, term, course, profession) => {
//     let results = data;

//     // Apply filters
//     if (term.trim()) {
//       results = results.filter((item) =>
//         (item.Name || item.name)?.toLowerCase().includes(term.toLowerCase())
//       );
//     }

//     if (course) {
//       results = results.filter(
//         (item) =>
//           (item.Course || item.course)?.trim().toLowerCase() === course.toLowerCase()
//       );
//     }

//     if (profession) {
//       results = results.filter(
//         (item) =>
//           getProfession(item) === profession.toLowerCase()
//       );
//     }

//     // Sort by batch year (descending) and prioritize localData before mongoData within the same year
//     return [...results].sort((a, b) => {
//       const yearA = extractYear(a.Batch || a.batch);
//       const yearB = extractYear(b.Batch || b.batch);
      
//       // Sort by year in descending order (2024 > 2023 > 2022)
//       if (yearB !== yearA) return yearB - yearA;

//       // Within the same year, localData comes first, mongoData (new data) comes last
//       const isALocal = localData.includes(a);
//       const isBLocal = localData.includes(b);
//       if (isALocal && !isBLocal) return -1;
//       if (!isALocal && isBLocal) return 1;

//       // Within same source, sort by presence of image
//       return (b.Image || b.photo ? 1 : 0) - (a.Image || a.photo ? 1 : 0);
//     });
//   };

//   const handleReset = () => {
//     setSearchTerm('');
//     setSelectedCourse('');
//     setSelectedProfession('');
//     setVisibleCount(25);
//     inputRef.current?.focus();
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     inputRef.current?.blur();
//   };

//   const loadMore = useCallback(() => {
//     setVisibleCount((prev) => prev + 25);
//   }, []);

//   useEffect(() => {
//     const observer = new IntersectionObserver(
//       ([entry]) => {
//         if (entry.isIntersecting && visibleCount < combinedData.length) {
//           loadMore();
//         }
//       },
//       { threshold: 1 }
//     );

//     if (loaderRef.current) observer.observe(loaderRef.current);
//     return () => {
//       if (loaderRef.current) observer.unobserve(loaderRef.current);
//     };
//   }, [loadMore, visibleCount, combinedData.length]);

//   return (
//     <div className="w-full mt-20">
//       {/* Image Slider */}
//       <div className="relative hidden md:block max-h-full h-screen">
//         {slides.map((slide, index) => (
//           <div
//             key={slide.id}
//             className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
//               index === currentIndex ? 'opacity-100' : 'opacity-0'
//             }`}
//           >
//             <img
//               src={slide.image}
//               alt={`Slide ${index + 1}`}
//               className="w-full h-full object-contain"
//             />
//           </div>
//         ))}
//         <div className="absolute inset-0 flex justify-between items-center">
//           <button
//             className="text-white bg-black bg-opacity-50 p-2 rounded-full ml-4"
//             onClick={() =>
//               setCurrentIndex((prev) => (prev === 0 ? slides.length - 1 : prev - 1))
//             }
//           >
//             ❮
//           </button>
//           <button
//             className="text-white bg-black bg-opacity-50 p-2 rounded-full mr-4"
//             onClick={() => setCurrentIndex((prev) => (prev + 1) % slides.length)}
//           >
//             ❯
//           </button>
//         </div>
//       </div>

//       {/* Heading */}
//       <div className="w-full py-6 text-center">
//         <h2 className="text-3xl font-semibold">All Alumni (Local + MongoDB)</h2>
//       </div>

//       {/* API Error Message */}
//       {apiError && (
//         <p className="text-center text-red-500 mt-4">{apiError}</p>
//       )}

//       {/* Search & Filter */}
//       <div className="max-w-[85%] mx-auto">
//         <form
//           onSubmit={handleSubmit}
//           className="flex flex-col md:flex-row justify-center items-center gap-4"
//         >
//           <input
//             ref={inputRef}
//             type="text"
//             placeholder="Search Alumni by Name..."
//             value={searchTerm}
//             onChange={(e) => setSearchTerm(e.target.value)}
//             className="w-full md:w-1/4 px-4 py-2 border border-gray-300 rounded-lg shadow-md"
//           />
//           <select
//             value={selectedCourse}
//             onChange={(e) => setSelectedCourse(e.target.value)}
//             className="w-full md:w-1/4 px-4 py-2 border border-gray-300 rounded-lg shadow-md"
//           >
//             <option value="">All Courses</option>
//             <option value="MCA">MCA</option>
//             <option value="PhD">PhD</option>
//             <option value="B.Tech">B.Tech</option>
//             <option value="M.Tech">M.Tech</option>
//           </select>
//           <select
//             value={selectedProfession}
//             onChange={(e) => setSelectedProfession(e.target.value)}
//             className="w-full md:w-1/4 px-4 py-2 border border-gray-300 rounded-lg shadow-md"
//           >
//             <option value="">All Professions</option>
//             {professions.map((prof, index) => (
//               <option key={index} value={prof}>
//                 {prof.charAt(0).toUpperCase() + prof.slice(1)}
//               </option>
//             ))}
//           </select>
//           <div className="flex gap-4 w-full md:w-auto">
//             <button
//               type="submit"
//               className="w-full md:w-auto px-4 py-2 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700"
//             >
//               Search
//             </button>
//             <button
//               type="button"
//               onClick={handleReset}
//               className="w-full md:w-auto px-4 py-2 bg-gray-600 text-white rounded-lg shadow-md hover:bg-gray-700"
//             >
//               Reset
//             </button>
//           </div>
//         </form>
//       </div>

//       {/* Alumni Cards */}
//       <div className="max-w-[90%] md:max-w-[85%] mx-auto my-10 md:my-24">
//         {combinedData.length > 0 ? (
//           <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8">
//             {combinedData.slice(0, visibleCount).map((item, index) => (
//               <div
//                 key={index}
//                 className="bg-white shadow-lg rounded-lg overflow-hidden transition-transform transform hover:scale-105"
//               >
//                 <div className="h-64 md:h-72 lg:h-96">
//                   <img
//                     src={item.Image || item.photo || '/images/user.jpg'}
//                     alt={item.Name || item.name}
//                     className="w-full h-full object-cover"
//                   />
//                 </div>
//                 <div className="p-4 text-sm md:text-base">
//                   <h3 className="text-lg md:text-xl font-bold">{item.Name || item.name}</h3>
//                   {(item.Course || item.course) && <p><strong>Course:</strong> {item.Course || item.course}</p>}
//                   {(item.Batch || item.batch) && <p><strong>Batch:</strong> {item.Batch || item.batch}</p>}
//                   {(item.Class || item.class) && <p><strong>Class:</strong> {item.Class || item.class}</p>}
//                   {getProfession(item) && <p><strong>Profession:</strong> {getProfession(item).charAt(0).toUpperCase() + getProfession(item).slice(1)}</p>}
//                   {item.organization && <p><strong>Organization:</strong> {item.organization}</p>}
//                   {(item.Skill || item.skill) && <p><strong>Skills:</strong> {item.Skill || item.skill}</p>}
//                   {(item.LinkedIn || item.linkedin) && (
//                     <p>
//                       <strong>LinkedIn:</strong>{' '}
//                       <a
//                         href={item.LinkedIn || item.linkedin}
//                         target="_blank"
//                         rel="noopener noreferrer"
//                         className="text-blue-600 underline"
//                       >
//                         Profile
//                       </a>
//                     </p>
//                   )}
//                   {item.website && (
//                     <p>
//                       <strong>Website:</strong>{' '}
//                       <a
//                         href={item.website}
//                         target="_blank"
//                         rel="noopener noreferrer"
//                         className="text-blue-600 underline"
//                       >
//                         Visit
//                       </a>
//                     </p>
//                   )}
//                 </div>
//               </div>
//             ))}
//           </div>
//         ) : (
//           <p className="text-center text-gray-500 mt-10">
//             {searchTerm || selectedCourse || selectedProfession
//               ? `No alumni found matching your criteria.`
//               : 'No alumni data available.'}
//           </p>
//         )}
//       </div>

//       {visibleCount < combinedData.length && (
//         <div ref={loaderRef} className="text-center my-8">
//           <p className="text-gray-500">Loading more alumni...</p>
//         </div>
//       )}
//     </div>
//   );
// }


// 


import React, { useState, useEffect, useRef, useCallback } from 'react';
import localData from '../data/aluminiData.json';
import axios from 'axios';
import { Link } from 'react-router-dom';

export default function Alumni() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCourse, setSelectedCourse] = useState('');
  const [selectedProfession, setSelectedProfession] = useState('');
  const [professions, setProfessions] = useState([]);
  const [visibleCount, setVisibleCount] = useState(25);
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

  // Extract unique professions from data
  const updateProfessions = (data) => {
    const uniqueProfessions = [...new Set(
      data
        .map(item => getProfession(item))
        .filter(prof => prof)
    )].sort();
    setProfessions(uniqueProfessions);
    console.log('Fetched professions:', uniqueProfessions); // Moved logging here
  };

  // Fetch data and initial professions
  useEffect(() => {
    axios
      .get('http://localhost:5000/api/alumni/approved')
      .then((res) => {
        const mongoData = Array.isArray(res.data) ? res.data : [];
        const merged = [...localData, ...mongoData];
        setCombinedData(sortAndFilterData(merged, searchTerm, selectedCourse, selectedProfession));
        updateProfessions(merged);
        setApiError(null);

        // Debug: Log items without professions
        const missingProfessions = merged.filter(item => !getProfession(item));
        if (missingProfessions.length > 0) {
          console.warn('Items without professions:', missingProfessions);
        }
      })
      .catch((err) => {
        console.error('Failed to fetch alumni:', err);
        setCombinedData(sortAndFilterData(localData, searchTerm, selectedCourse, selectedProfession));
        updateProfessions(localData);
        setApiError('Failed to load MongoDB data. Showing local data only.');

        // Debug: Log items without professions
        const missingProfessions = localData.filter(item => !getProfession(item));
        if (missingProfessions.length > 0) {
          console.warn('Local items without professions:', missingProfessions);
        }
      });
  }, []);

  // Update filtered data and professions when filters or data change
  useEffect(() => {
    const merged = [...localData, ...combinedData.filter(d => !localData.includes(d))];
    setCombinedData(sortAndFilterData(merged, searchTerm, selectedCourse, selectedProfession));
    updateProfessions(merged);
  }, [searchTerm, selectedCourse, selectedProfession]);

  // Update professions when combinedData changes
  useEffect(() => {
    updateProfessions(combinedData);
  }, [combinedData]);

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

  const sortAndFilterData = (data, term, course, profession) => {
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

    // Sort by batch year (descending) and prioritize localData before mongoData within the same year
    return [...results].sort((a, b) => {
      const yearA = extractYear(a.Batch || a.batch);
      const yearB = extractYear(b.Batch || b.batch);
      
      // Sort by year in descending order (2024 > 2023 > 2022)
      if (yearB !== yearA) return yearB - yearA;

      // Within the same year, localData comes first, mongoData (new data) comes last
      const isALocal = localData.includes(a);
      const isBLocal = localData.includes(b);
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

    if (loaderRef.current) observer.observe(loaderRef.current);
    return () => {
      if (loaderRef.current) observer.unobserve(loaderRef.current);
    };
  }, [loadMore, visibleCount, combinedData.length]);

  return (
    <div className="w-full mt-20">
      {/* Image Slider */}
      <div className="relative hidden md:block max-h-full h-screen">
        {slides.map((slide, index) => (
          <div
            key={slide.id}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
              index === currentIndex ? 'opacity-100' : 'opacity-0'
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
            className="w-full md:w-1/4 px-4 py-2 border border-gray-300 rounded-lg shadow-md"
          />
          <select
            value={selectedCourse}
            onChange={(e) => setSelectedCourse(e.target.value)}
            className="w-full md:w-1/4 px-4 py-2 border border-gray-300 rounded-lg shadow-md"
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
            className="w-full md:w-1/4 px-4 py-2 border border-gray-300 rounded-lg shadow-md"
          >
            <option value="">All Professions</option>
            {professions.map((prof, index) => (
              <option key={index} value={prof}>
                {prof.charAt(0).toUpperCase() + prof.slice(1)}
              </option>
            ))}
          </select>
          <div className="flex gap-4 w-full md:w-auto">
            <button
              type="submit"
              className="w-full md:w-auto px-4 py-2 bg-blue-600 text-white rounded-lg bg-blue shadow-md bg-blue hover:bg-lightBlue  "
            >
              Search
            </button>
            <button
              type="button"
              onClick={handleReset}
              className="w-full md:w-auto px-4 py-2 bg-blue text-white rounded-lg shadow-md hover:bg-lightBlue "
            >
              Reset
            </button>
          </div>
        </form>
      </div>

      {/* Alumni Cards */}
      <div className="max-w-[90%] md:max-w-[85%] mx-auto my-10 md:my-24">
        {combinedData.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8">
            {combinedData.slice(0, visibleCount).map((item, index) => (
              <div
                key={index}
                className="bg-white shadow-lg rounded-lg overflow-hidden transition-transform transform hover:scale-105"
              >
                <div className="h-64 md:h-72 lg:h-96">
                  <img
                    src={item.Image || item.photo || '/images/user.jpg'}
                    alt={item.Name || item.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-4 text-sm md:text-base">
                  <h3 className="text-lg md:text-xl font-bold">{item.Name || item.name}</h3>
                  {(item.Course || item.course) && <p><strong>Course:</strong> {item.Course || item.course}</p>}
                  {(item.Batch || item.batch) && <p><strong>Batch:</strong> {item.Batch || item.batch}</p>}
                  {(item.Class || item.class) && <p><strong>Class:</strong> {item.Class || item.class}</p>}
                  {getProfession(item) && <p><strong>Profession:</strong> {getProfession(item).charAt(0).toUpperCase() + getProfession(item).slice(1)}</p>}
                  {item.organization && <p><strong>Organization:</strong> {item.organization}</p>}
                  {(item.Skill || item.skill) && <p><strong>Skills:</strong> {item.Skill || item.skill}</p>}
                  {(item.LinkedIn || item.linkedin) && (
                    <p>
                      <strong>LinkedIn:</strong>{' '}
                      <a
                        href={item.LinkedIn || item.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue underline"
                      >
                        Profile
                      </a>
                    </p>
                  )}
                  {item.website && (
                    <p>
                      <strong>Website:</strong>{' '}
                      <a
                        href={item.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 underline"
                      >
                        Visit
                      </a>
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-500 mt-10">
            {searchTerm || selectedCourse || selectedProfession
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