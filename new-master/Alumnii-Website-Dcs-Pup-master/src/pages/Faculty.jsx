import React, { useState, useEffect } from "react";
import { FaSearch, FaUndo } from "react-icons/fa";
import facultyData from "../data/facultyData.json";
import axios from 'axios';

const FacultyTeachers = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [allFaculty, setAllFaculty] = useState([]); // Store original unfiltered data
  const [filteredFaculty, setFilteredFaculty] = useState([]); // Store filtered data
  const [expandedBio, setExpandedBio] = useState({});
  const [selectedDesignation, setSelectedDesignation] = useState("All");
  const [error, setError] = useState(null);
  const [visibleSections, setVisibleSections] = useState({
    professors: true,
    phdScholars: true,
    technicalStaff: true,
  });

  const fetchFaculty = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/faculty');
      const mongoData = response.data.map((item, index) => ({
        ...item,
        id: item._id || `mongo_${index}`,
        name: item.name,
        title: item.title,
        department: item.department,
        email: item.email,
        phone: item.phone,
        expertise: item.expertise,
        bio: item.bio,
        image: item.image,
        Designation: item.Designation,
      }));
      const localDataWithId = facultyData.map((item, index) => ({
        ...item,
        id: `local_${index}`,
      }));
      const mergedData = [...localDataWithId, ...mongoData];
      setAllFaculty(mergedData); // Store original data
      setFilteredFaculty(mergedData); // Initialize filtered data
      setError(null);
    } catch (err) {
      console.error('Failed to fetch faculty:', err);
      setError('Failed to load faculty from database. Showing local data only.');
      const localDataWithId = facultyData.map((item, index) => ({
        ...item,
        id: `local_${index}`,
      }));
      setAllFaculty(localDataWithId);
      setFilteredFaculty(localDataWithId);
    }
  };

  useEffect(() => {
    fetchFaculty();
  }, []);

  const designations = [
    "All",
    "Professor",
    "Assistant Professor",
    "Retired Professor",
    "PhD Scholar",
    "Senior Assistant",
    "Junior Stenographer",
    "Technical Assistance",
    "Junior Technical Assistance",
    "Lab Attendant",
    "Clerk",
    "Peon",
    "System Administrator",
    "Programmer",
  ];

  useEffect(() => {
    let results = [...allFaculty]; // Start with the original data

    // Apply search filter
    if (searchTerm.trim() !== "") {
      results = results.filter(
        (teacher) =>
          teacher.name &&
          teacher.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply designation filter
    if (selectedDesignation !== "All") {
      results = results.filter(
        (teacher) => teacher.Designation === selectedDesignation
      );

      // Show only the relevant section based on selected designation
      const professorDesignations = ["Professor", "Assistant Professor", "Retired Professor"];
      const technicalStaffDesignations = [
        "Senior Assistant",
        "Junior Stenographer",
        "Technical Assistance",
        "Junior Technical Assistance",
        "Lab Attendant",
        "Clerk",
        "Peon",
        "System Administrator",
        "Programmer",
      ];

      if (professorDesignations.includes(selectedDesignation)) {
        setVisibleSections({
          professors: true,
          phdScholars: false,
          technicalStaff: false,
        });
      } else if (selectedDesignation === "PhD Scholar") {
        setVisibleSections({
          professors: false,
          phdScholars: true,
          technicalStaff: false,
        });
      } else if (technicalStaffDesignations.includes(selectedDesignation)) {
        setVisibleSections({
          professors: false,
          phdScholars: false,
          technicalStaff: true,
        });
      }
    } else {
      setVisibleSections({
        professors: true,
        phdScholars: true,
        technicalStaff: true,
      });
    }

    setFilteredFaculty(results);
  }, [searchTerm, selectedDesignation, allFaculty]);

  const toggleBio = (id) => {
    setExpandedBio((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  // Reset filters and restore all data
  const handleReset = () => {
    setSearchTerm("");
    setSelectedDesignation("All");
    setVisibleSections({
      professors: true,
      phdScholars: true,
      technicalStaff: true,
    });
    setFilteredFaculty(allFaculty); // Restore original unfiltered data
  };

  // Separate faculty into categories
  const professors = filteredFaculty.filter(teacher =>
    teacher.Designation &&
    (teacher.Designation.toLowerCase() === "professor" ||
     teacher.Designation.toLowerCase() === "assistant professor" ||
     teacher.Designation.toLowerCase() === "retired professor")
  );

  const phdScholars = filteredFaculty.filter(teacher =>
    teacher.Designation &&
    teacher.Designation.toLowerCase() === "phd scholar"
  );

  const technicalStaff = filteredFaculty.filter(teacher =>
    teacher.Designation &&
    (teacher.Designation.toLowerCase() === "senior assistant" ||
     teacher.Designation.toLowerCase() === "junior stenographer" ||
     teacher.Designation.toLowerCase() === "technical assistance" ||
     teacher.Designation.toLowerCase() === "junior technical assistance" ||
     teacher.Designation.toLowerCase() === "lab attendant" ||
     teacher.Designation.toLowerCase() === "clerk" ||
     teacher.Designation.toLowerCase() === "peon" ||
     teacher.Designation.toLowerCase() === "system administrator" ||
     teacher.Designation.toLowerCase() === "programmer")
  );

  // Faculty card component
  const FacultyCard = ({ teacher }) => (
    <div
      key={teacher.id}
      className="border border-[#D1D5DB] rounded-lg overflow-hidden shadow-lg transition-transform hover:shadow-xl hover:scale-105"
    >
      <div className="p-6 flex flex-col sm:flex-row gap-4">
        <img
          src={teacher.image || "/default-profile.png"}
          alt={teacher.name || "Profile"}
          className="w-40 h-40 object-cover mx-auto sm:mx-0 rounded-lg rounded-xl"
        />
        <div className="flex-1">
          <h2 className="text-xl font-semibold">
            {teacher.name || "No Name"}
          </h2>
          <p className="text-[#4868EC]">{teacher.title || ""}</p>
          <p className="text-[#4B5563] text-sm">
            <b>Department:</b> {teacher.department || "N/A"}
          </p>
          <p className="text-[#4B5563] text-sm">
            <b>Designation:</b> {teacher.Designation || "N/A"}
          </p>

          {teacher.expertise && teacher.expertise.length > 0 && (
            <div className="mt-2">
              <h3 className="text-sm font-medium">Areas of Expertise:</h3>
              <div className="flex flex-wrap gap-1 mt-1">
                {teacher.expertise.map((area, index) => (
                  <span
                    key={index}
                    className="bg-[#DBEAFE] text-[#1E40AF] text-xs px-2 py-1 rounded"
                  >
                    {area}
                  </span>
                ))}
              </div>
            </div>
          )}

          <div className="mt-3 text-sm">
            <p className="text-[#4B5563] text-justify">
              {teacher.bio
                ? expandedBio[teacher.id]
                  ? teacher.bio
                  : `${teacher.bio.substring(0, 80)}...`
                : "No bio available"}
            </p>
            {teacher.bio && teacher.bio.length > 80 && (
              <button
                className="text-[#4868EC] hover:underline text-sm mt-1"
                onClick={() => toggleBio(teacher.id)}
              >
                {expandedBio[teacher.id] ? "Read Less" : "Read More"}
              </button>
            )}
          </div>

          <div className="mt-4 pt-4 border-t">
            <p className="text-sm">
              <span className="font-medium">Email:</span>{" "}
              {teacher.email || "N/A"}
            </p>
            <p className="text-sm">
              <span className="font-medium">Phone:</span>{" "}
              {teacher.phone || "N/A"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="container mx-auto px-4 py-8 font-sans">
      <h1 className="text-3xl font-bold mb-8 text-center">Our Faculty</h1>

      {error && (
        <div className="text-center text-red-500 my-4">
          {error}
        </div>
      )}

      {/* Search and Filter Section */}
      <div className="w-full">
        <div className="max-w-[85%] mx-auto">
          <form
            onSubmit={(e) => e.preventDefault()}
            className="flex flex-col md:flex-row justify-center items-center gap-4"
          >
            <div className="relative w-full md:w-[50%]">
              <input
                type="text"
                placeholder="Search by name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <FaSearch
                className="absolute left-3 top-2.5 text-gray-400"
                size={20}
              />
            </div>
            <select
              value={selectedDesignation}
              onChange={(e) => setSelectedDesignation(e.target.value)}
              className="w-full md:w-auto px-4 py-2 border border-gray-300 rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {designations.map((designation, index) => (
                <option key={index} value={designation}>
                  {designation}
                </option>
              ))}
            </select>
            <button
              type="button"
              onClick={handleReset}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg shadow-md bg-blue hover:bg-lightBlue flex items-center gap-2"
            >
              <FaUndo /> Reset
            </button>
          </form>
        </div>
      </div>

      {visibleSections.professors && (
        <div className="mb-12">
          <h2 className="text-2xl font-semibold mb-6 text-center">Professors</h2>
          {professors.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <p>No Professors found matching your search criteria.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:px-20">
              {professors.map((teacher) => (
                <FacultyCard key={teacher.id} teacher={teacher} />
              ))}
            </div>
          )}
        </div>
      )}

      {visibleSections.phdScholars && (
        <div className="mb-12">
          <h2 className="text-2xl font-semibold mb-6 text-center">PhD Scholars</h2>
          {phdScholars.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <p>No PhD Scholars found matching your search criteria.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:px-20">
              {phdScholars.map((teacher) => (
                <FacultyCard key={teacher.id} teacher={teacher} />
              ))}
            </div>
          )}
        </div>
      )}

      {visibleSections.technicalStaff && (
        <div className="mb-12">
          <h2 className="text-2xl font-semibold mb-6 text-center">Technical Staff</h2>
          {technicalStaff.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <p>No Technical Staff found matching your search criteria.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:px-20">
              {technicalStaff.map((teacher) => (
                <FacultyCard key={teacher.id} teacher={teacher} />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default FacultyTeachers;