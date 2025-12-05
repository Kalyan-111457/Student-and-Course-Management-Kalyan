import React, { useState } from "react";
import './Css/CreateCourse1.css';
import NavBar from "./NavBar.js"; // Add .js extension
import { useNavigate } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";

const CreateCourse = () => {
  const [courseName, setCourseName] = useState("");
  const [courseDescription, setCourseDescription] = useState("");
  const [capacity, setCapacity] = useState("");
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!courseName || !courseDescription || !capacity) {
      return window.alert("Please fill in all fields.");
    }

    const data = { 
      courseName, 
      courseDescription, 
      capacity: Number(capacity) 
    };

    try {
      const response = await fetch(
        "http://localhost:5049/api/Course/CreateCourse",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(data),
        }
      );

      const json = await response.json();

      if (!response.ok) {
        if (json.message) return window.alert(json.message);
        if (json.errors) return window.alert(Object.values(json.errors).flat().join("\n"));
        return window.alert("Something went wrong!");
      }

      window.alert("Course created successfully! ID = " + json.course.courseId);

      // Reset form
      setCourseName("");
      setCourseDescription("");
      setCapacity("");

      // Navigate to SideBar
      navigate("/SideBar");
    } catch (err) {
      window.alert(err.message);
    }
  };

  return (
    <>
      <NavBar />
      <div className="v93">
        <button
          onClick={() => navigate("/SideBar")}
          className="v92"
          aria-label="back-button"
        >
          <FaArrowLeft size={20} />
        </button>

        <div className="v1">
          <h2 className="v2">Create Course</h2>

          <form onSubmit={handleSubmit} className="v3">
            <label htmlFor="courseName">Course Name</label>
            <input
              id="courseName"
              type="text"
              placeholder="Enter The Course Name"
              value={courseName}
              onChange={(e) => setCourseName(e.target.value)}
              aria-label="course-name-input"
            />

            <label htmlFor="courseDescription">Course Description</label>
            <textarea
              id="courseDescription"
              placeholder="Enter The Course Description"
              value={courseDescription}
              onChange={(e) => setCourseDescription(e.target.value)}
              aria-label="course-description-input"
            />

            <label htmlFor="capacity">Capacity</label>
            <input
              id="capacity"
              type="number"
              placeholder="Enter The Capacity"
              value={capacity}
              onChange={(e) => setCapacity(e.target.value)}
              aria-label="course-capacity-input"
            />

            <button
              className="v4"
              type="submit"
              aria-label="create-course-button"
            >
              Create Course
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default CreateCourse;
