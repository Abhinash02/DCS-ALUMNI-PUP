import { Link } from "react-router-dom";
import { useEffect, useState } from "react";

function TeamCard({ img, name, title, designation, institution, linkedIn, index }) {
  return (
    <div
      className="rounded-lg bg-[#FAFAFA] shadow-md hover:scale-105 hover:shadow-lg hover:bg-hoverBlue transition-all duration-300 animate-slideIn"
      style={{ animationDelay: `${index * 0.1}s` }}
    >
      <div className="p-6 text-center">
        <img
          src={img}
          alt={name}
          className="size-40 mx-auto mb-6 rounded-full object-cover border-2 border-lightBlue"
          onError={(e) => (e.target.src = "/images/default-profile.png")} // Fallback for broken images
        />
        <h5 className="text-lg font-medium text-darkBlue font-poppins">{name}</h5>
        <p className="text-base font-semibold text-gray font-poppins">{title}</p>
        {designation && (
          <p className="text-base font-semibold text-gray font-poppins">{designation}</p>
        )}
        <p className="mb-3 text-base font-semibold text-gray font-poppins">{institution}</p>
        {linkedIn && (
          <span
            className="italic underline font-semibold text-sm text-darkBlue hover:text-lightBlueAlt transition-colors duration-200 font-poppins"
          >
            <Link to={linkedIn} target="_blank" rel="noopener noreferrer">
              Reach Us
            </Link>
          </span>
        )}
      </div>
    </div>
  );
}

const members = [
  {
    img: "/images/vishalSir.jpg",
    name: "Dr. Vishal Goyal",
    title: "Professor",
    institution: "Department of Computer Science, Punjabi University, Patiala",
    linkedIn: "https://www.linkedin.com/in/vishal-goyal-0012516/",
  },
  {
    img: "/images/vipinKumar.jpg",
    name: "Mr. Vipin kumar",
    title: "Technical Assistant",
    institution: "Department of Computer Science, Punjabi University, Patiala",
  },
  {
    img: "/images/kanika.jpg",
    name: "Kanika Bhatia",
    title: "Student",
    designation: "Developer",
    institution: "MCA, Department of Computer Science, Punjabi University, Patiala",
    linkedIn: "https://www.linkedin.com/in/kanika-bhatia08/",
  },
  {
    img: "/images/abhinash_team.jpeg",
    name: "Abhinash",
    title: "Student",
    designation: "Team Lead, Developer",
    institution: "MCA, Department of Computer Science, Punjabi University, Patiala",
    linkedIn:
      "https://www.linkedin.com/in/abhinash99/?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app",
  },
  {
    img: "/images/harman.jpg",
    name: "Harmandeep Singh",
    title: "Student",
    designation: "Team Lead, Developer",
    institution: "MCA, Department of Computer Science, Punjabi University, Patiala",
    linkedIn:
      "https://www.linkedin.com/in/harmandeep-singh-saggu-8562a12b4/?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=ios_app",
  },
  {
    img: "/images/purvak.jpg",
    name: "Purvak Jindal",
    title: "Student",
    designation: "Developer",
    institution: "MCA, Department of Computer Science, Punjabi University, Patiala",
    linkedIn:
      "https://www.linkedin.com/in/purvak-jindal-6741682a1?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app",
  },
];

export function Team() {
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    console.log("Triggering animations");
    setAnimate(true);
  }, []);

  return (
    <section className="max-w-[95%] md:max-w-[85%] w-full flex mx-auto lg:pb-28 animate-fadeInTop">
      <div className="mx-auto">
        <div
          className={`mb-16 text-center lg:mb-28 xs:scale-105 hover:scale-105 hover:bg-lightBlue/10 transition-all duration-300 ${
            animate ? "animate-fadeInTop!important" : ""
          }`}
        >
          <h1 className="my-2 text-2xl font-mons font-bold text-darkBlue lg:text-4xl hover:text-darkBlueAlt transition-colors duration-300">
            The Driving Force <br />
            Our Dedicated Team of Experts (Session 2024-26)
          </h1>
          <p
            className={`w-full hover:text-grayAlt transition-colors duration-300 ${
              animate ? "animate-slideIn!important" : ""
            }`}
          >
            From visionary leaders to creative thinkers and technical experts, every
            member of our team is dedicated to delivering innovative solutions and
            exceptional service that drives our success.
          </p>
        </div>
        <div className="w-[90%] mx-auto grid grid-cols-1 gap-6 md:grid-cols-2 justify-center lg:grid-cols-3">
          {members.map((props, index) => (
            <TeamCard key={index} {...props} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}

export default Team;