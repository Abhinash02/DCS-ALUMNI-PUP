"use client";
import React, { useState, useEffect } from "react";
import Slider from "react-slick";
import axios from "axios";
import eventData from "../data/EventData.json";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const Events = () => {
  const [events, setEvents] = useState([]);
  const [expanded, setExpanded] = useState({});
  const [animate, setAnimate] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    position: "right",
    bgColor: "bg-white",
    textColor: "#374151",
    images: [],
  });
  const [isAdmin, setIsAdmin] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    console.log("Triggering animations");
    setAnimate(true);
    fetchEvents();
    setIsAdmin(localStorage.getItem("isAdmin") === "true");
  }, []);

  const fetchEvents = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get("http://localhost:5000/api/events", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const mongoEvents = response.data.map((event) => ({
        ...event,
        source: "mongodb",
      }));
      const jsonEvents = eventData.map((event, index) => ({
        ...event,
        _id: `json-${index}`,
        source: "json",
      }));
      setEvents([...mongoEvents, ...jsonEvents]);
    } catch (error) {
      console.error("Error fetching events:", error);
      setError(
        error.response?.status === 401
          ? "Unauthorized: Please log in"
          : "Failed to fetch events"
      );
      const jsonEvents = eventData.map((event, index) => ({
        ...event,
        _id: `json-${index}`,
        source: "json",
      }));
      setEvents(jsonEvents);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 5) {
      setError("Maximum 5 images allowed");
      return;
    }
    for (const file of files) {
      if (!["image/jpeg", "image/png"].includes(file.type)) {
        setError("Only JPEG or PNG images allowed");
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        setError("Each image must be under 5MB");
        return;
      }
    }
    setFormData({ ...formData, images: files });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isAdmin) {
      setError("Unauthorized");
      return;
    }
    const data = new FormData();
    data.append("title", formData.title);
    data.append("description", formData.description);
    data.append("position", formData.position);
    data.append("bgColor", formData.bgColor);
    data.append("textColor", formData.textColor);
    formData.images.forEach((image) => data.append("images", image));

    try {
      const token = localStorage.getItem("token");
      const response = await axios.post("http://localhost:5000/api/events", data, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });
      setEvents([{ ...response.data, source: "mongodb" }, ...events]);
      setFormData({
        title: "",
        description: "",
        position: "right",
        bgColor: "bg-white",
        textColor: "#374151",
        images: [],
      });
      setError("");
      e.target.reset();
    } catch (error) {
      setError(error.response?.data?.error || "Error adding event");
      console.error("Error adding event:", error);
    }
  };

  const handleDelete = async (id) => {
    if (!isAdmin) {
      setError("Unauthorized");
      return;
    }
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`http://localhost:5000/api/events/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        data: { publicIds: events.find((e) => e._id === id)?.images?.map((img) => img.publicId) || [] },
      });
      setEvents(events.filter((event) => event._id !== id));
      setError("");
    } catch (error) {
      setError(error.response?.data?.error || "Error deleting event");
      console.error("Error deleting event:", error);
    }
  };

  const toggleReadMore = (index) => {
    setExpanded((prevState) => ({
      ...prevState,
      [index]: !prevState[index],
    }));
  };

  const isTruncated = (text) => {
    const maxLines = 3;
    const lineHeight = 1.5;
    const maxHeight = maxLines * lineHeight * 16;
    const div = document.createElement("div");
    div.style.position = "absolute";
    div.style.visibility = "hidden";
    div.style.width = "200px";
    div.style.lineHeight = `${lineHeight}em`;
    div.style.fontSize = "16px";
    div.innerText = text;
    document.body.appendChild(div);
    const truncated = div.offsetHeight > maxHeight;
    document.body.removeChild(div);
    return truncated;
  };

  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    autoplay: true,
    autoplaySpeed: 3000,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: true,
    customPaging: () => (
      <div className="w-3 h-3 bg-darkBlue rounded-full hover:bg-lightBlueAlt transition-colors duration-200" />
    ),
    appendDots: (dots) => (
      <div>
        <ul className="flex justify-center space-x-2">{dots}</ul>
      </div>
    ),
    prevArrow: (
      <div className="slick-prev bg-darkBlue text-white rounded-full w-8 h-8 flex items-center justify-center hover:bg-darkBlueAlt transition-colors duration-200">
        ←
      </div>
    ),
    nextArrow: (
      <div className="slick-next bg-darkBlue text-white rounded-full w-8 h-8 flex items-center justify-center hover:bg-darkBlueAlt transition-colors duration-200">
        →
      </div>
    ),
  };

  return (
    <div className="max-w-full mx-auto mt-20 w-full h-full bg-gray-50 py-12 animate-fadeInTop">
      <div className="text-center mb-12 animate-fadeInTop">
        <div className="flex items-center justify-center space-x-3">
          <img
            src="/images/logo.png"
            alt="Punjabi University"
            className="w-10 h-10 object-contain"
          />
          <h1 className="text-3xl xs:text-4xl font-mons font-bold text-darkBlue">
            Events Timeline
          </h1>
        </div>
        <h3 className="text-xl xs:text-2xl font-poppins font-semibold text-grayAlt mt-2">
          Department of Computer Science, Punjabi University
        </h3>
      </div>

      {isAdmin && (
        <div className="max-w-2xl mx-auto mb-12 p-6 bg-white rounded-xl shadow-md">
          <h2 className="text-2xl font-poppins font-semibold text-darkBlue mb-4">
            Add New Event
          </h2>
          {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-poppins text-gray-700">Title</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                required
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-lightBlue"
              />
            </div>
            <div>
              <label className="block text-sm font-poppins text-gray-700">Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                required
                rows="4"
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-lightBlue"
              />
            </div>
            <div>
              <label className="block text-sm font-poppins text-gray-700">Position</label>
              <select
                name="position"
                value={formData.position}
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-lightBlue"
              >
                <option value="right">Right</option>
                <option value="left">Left</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-poppins text-gray-700">Background Color</label>
              <input
                type="text"
                name="bgColor"
                value={formData.bgColor}
                onChange={handleInputChange}
                placeholder="e.g., bg-white"
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-lightBlue"
              />
            </div>
            <div>
              <label className="block text-sm font-poppins text-gray-700">Text Color</label>
              <input
                type="text"
                name="textColor"
                value={formData.title}
                onChange={handleInputChange}
                placeholder="e.g., #374151"
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-lightBlue"
              />
            </div>
            <div>
              <label className="block text-sm font-poppins text-gray-700">Images (up to 5)</label>
              <input
                type="file"
                name="images"
                multiple
                accept="image/jpeg,image/png"
                onChange={handleFileChange}
                className="w-full p-2 border border-gray-300 rounded-md"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-darkBlue text-white py-2 rounded-md hover:bg-darkBlueAlt transition-colors duration-200"
            >
              Add Event
            </button>
          </form>
        </div>
      )}

      <div className="sm:hidden justify-center p-6 xs:p-10 flex flex-col mx-auto max-w-2xl">
        {events.length === 0 ? (
          <p className="text-gray-600 text-center">No events available.</p>
        ) : (
          events.map((item, index) => (
            <div
              key={item._id}
              className={`flex flex-col gap-4 mb-8 bg-white rounded-xl shadow-md hover:shadow-lg hover:scale-105 hover:bg-hoverBlue transition-all duration-300 animate-slideIn z-20`}
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="flex flex-col justify-between leading-normal p-6">
                <div className="flex justify-between items-center">
                  <h3
                    className="mb-3 mt-4 font-semibold text-lg xs:text-xl font-poppins"
                    style={{ color: item.textColor }}
                  >
                    {item.title}
                  </h3>
                  {isAdmin && item.source === "mongodb" && (
                    <button
                      onClick={() => handleDelete(item._id)}
                      className="text-red-500 hover:text-red-700 text-sm font-poppins"
                    >
                      Delete
                    </button>
                  )}
                </div>
                <p
                  className="leading-relaxed tracking-wide text-justify text-sm xs:text-base font-poppins text-gray-700"
                  style={{ color: item.textColor }}
                >
                  {expanded[index] || !isTruncated(item.description)
                    ? item.description
                    : `${item.description.slice(0, 225)}`}
                  {item.description.length > 250 && isTruncated(item.description) && (
                    <span
                      onClick={() => toggleReadMore(index)}
                      className="text-darkBlue font-semibold cursor-pointer ml-2 hover:text-lightBlueAlt hover:underline transition-colors duration-200"
                    >
                      {expanded[index] ? "Read Less" : "...Read More"}
                    </span>
                  )}
                </p>
              </div>
              {item.images?.length > 0 && (
                <div className="px-6 pb-6 bg-gray-100">
                  {item.images.length === 1 ? (
                    <img
                      src={item.source === "mongodb" ? item.images[0].url : item.images[0]}
                      alt={`Event ${index + 1} image`}
                      className="w-full max-h-[250px] object-contain rounded-md hover:scale-105 hover:border-2 hover:border-lightBlue transition-all duration-300"
                      onError={(e) => (e.target.src = "/images/default-event.png")}
                    />
                  ) : (
                    <Slider {...sliderSettings}>
                      {item.images.map((image, imgIndex) => (
                        <img
                          key={imgIndex}
                          src={item.source === "mongodb" ? image.url : image}
                          alt={`Event ${index + 1} image ${imgIndex + 1}`}
                          className="w-full max-h-[250px] object-contain rounded-md hover:scale-105 hover:border-2 hover:border-lightBlue transition-all duration-300"
                          onError={(e) => (e.target.src = "/images/default-event.png")}
                        />
                      ))}
                    </Slider>
                  )}
                </div>
              )}
            </div>
          ))
        )}
      </div>

      <div className="hidden sm:block relative wrap overflow-hidden p-10 pb-32 h-full">
        <div
          className="border-2 absolute border-opacity-20 border-darkBlue h-full left-1/2 transform -translate-x-1/2 z-10"
        ></div>
        {events.length === 0 ? (
          <p className="text-gray-600 text-center">No events available.</p>
        ) : (
          events.map((item, index) => (
            <div
              key={item._id}
              className={`mb-12 flex justify-between items-center w-full ${
                item.position === "right"
                  ? "right-timeline"
                  : "left-timeline flex-row-reverse"
              } animate-slideIn z-20`}
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="order-1 w-5/12"></div>
              <div className="z-20 flex items-center order-1 bg-darkBlue shadow-xl w-8 h-8 rounded-full hover:bg-darkBlueAlt hover:scale-110 transition-all duration-300"></div>
              <div
                className={`order-1 ${item.bgColor} flex flex-col gap-4 rounded-xl shadow-md hover:shadow-lg hover:scale-105 hover:bg-hoverBlue transition-all duration-300 w-5/12 px-6 py-4 z-20`}
              >
                <div>
                  <div className="flex justify-between items-center">
                    <h3
                      className="mb-3 font-semibold text-lg xs:text-xl font-poppins"
                      style={{ color: item.textColor }}
                    >
                      {item.title}
                    </h3>
                    {isAdmin && item.source === "mongodb" && (
                      <button
                        onClick={() => handleDelete(item._id)}
                        className="text-red-500 hover:text-red-700 text-sm font-poppins"
                      >
                        Delete
                      </button>
                    )}
                  </div>
                  <p
                    className="leading-relaxed tracking-wide text-justify text-sm xs:text-base font-poppins text-gray-700"
                    style={{ color: item.textColor }}
                  >
                    {expanded[index] || !isTruncated(item.description)
                      ? item.description
                      : `${item.description.slice(0, 225)}`}
                    {item.description.length > 250 && isTruncated(item.description) && (
                      <span
                        onClick={() => toggleReadMore(index)}
                        className="text-darkBlue font-semibold cursor-pointer ml-2 hover:text-lightBlueAlt hover:underline transition-colors duration-200"
                      >
                        {expanded[index] ? "Read Less" : "...Read More"}
                      </span>
                    )}
                  </p>
                </div>
                {item.images?.length > 0 && (
                  <div className="bg-gray-100">
                    {item.images.length === 1 ? (
                      <img
                        src={item.source === "mongodb" ? item.images[0].url : item.images[0]}
                        alt={`Event ${index + 1} image`}
                        className="w-full max-h-[300px] object-contain rounded-md hover:scale-105 hover:border-2 hover:border-lightBlue transition-all duration-300"
                        onError={(e) => (e.target.src = "/images/default-event.png")}
                      />
                    ) : (
                      <Slider {...sliderSettings}>
                        {item.images.map((image, imgIndex) => (
                          <img
                            key={imgIndex}
                            src={item.source === "mongodb" ? image.url : image}
                            alt={`Event ${index + 1} image ${imgIndex + 1}`}
                            className="w-full max-h-[300px] object-contain rounded-md hover:scale-105 hover:border-2 hover:border-lightBlue transition-all duration-300"
                            onError={(e) => (e.target.src = "/images/default-event.png")}
                          />
                        ))}
                      </Slider>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Events;