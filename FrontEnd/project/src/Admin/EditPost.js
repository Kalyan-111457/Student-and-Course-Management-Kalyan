import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import './Css/EditingPost.css';
import NavBar from "./NavBar";
import { FaArrowLeft } from "react-icons/fa";

const EditPost = () => {
  const { id } = useParams();
  const [courseName, setCourseName] = useState("");
  const [courseDescription, setCourseDescription] = useState("");
  const [capacity, setCapacity] = useState("");
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const response = await fetch(
          `http://localhost:5049/api/Course/GetCourseById/${id}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        if (!response.ok) throw new Error("Failed to fetch course data");

        const data = await response.json();

        setCourseName(data.course.courseName);
        setCourseDescription(data.course.courseDescription);
        setCapacity(data.course.capacity);
      } catch (error) {
        alert(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCourse();
  }, [id, token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const updatedCourse = { courseId: id, courseName, courseDescription, capacity: Number(capacity) };

    try {
      const response = await fetch(
        `http://localhost:5049/api/Course/UpdateCourseById/${id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
          body: JSON.stringify(updatedCourse),
        }
      );

      if (!response.ok) {
        const json = await response.json();
        if (json.message) return alert(json.message);
        if (json.errors) return alert(Object.values(json.errors).flat().join("\n"));
        return alert("Something went wrong!");
      }

      alert("Course updated successfully!");
      navigate(`/ViewSingleCourse/${id}`);
    } catch (error) {
      alert(error.message);
    }
  };

  if (loading) return <p>Loading Course Details...</p>;

  return (
    <>
      <NavBar />
      <div className="m92">
        <button
          onClick={() => navigate(`/ViewSingleCourse/${id}`)}
          className="m98"
          aria-label="back-button"
        >
          <FaArrowLeft size={20} />
        </button>

        <div className="m1">
          <h2 className="m2">Edit Course</h2>

          <form onSubmit={handleSubmit} className="m3">
            <label>Course Name:</label>
            <input
              type="text"
              value={courseName}
              onChange={(e) => setCourseName(e.target.value)}
              required
              aria-label="course-name-input"
            />

            <label>Course Description:</label>
            <textarea
              value={courseDescription}
              onChange={(e) => setCourseDescription(e.target.value)}
              rows="4"
              required
              aria-label="course-description-input"
            />

            <label>Capacity:</label>
            <input
              type="number"
              value={capacity}
              onChange={(e) => setCapacity(e.target.value)}
              required
              aria-label="course-capacity-input"
            />

            <button type="submit" className="m7" aria-label="update-course-button">
              Update Course
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default EditPost;
