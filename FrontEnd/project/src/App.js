import React, { useState, useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";

// Admin Components
import SideBar from "./Admin/SideBar";
import CreateCourse from "./Admin/CreateCourse";
import AllEnrolledStudents from "./Admin/AllEnrolledStudents";
import ViewSingleCourse from "./Admin/ViewSingleCourse";
import EditPost from "./Admin/EditPost";
import AllStudents from "./Admin/AllStudents";
import StudentCreation from "./Admin/StudentCreation";
import EditeStudent from "./Admin/EditeStudent";

// Student Components
import Login from "./Student/Login";
import CourseDetails from "./Student/CourseDetails";
import EnrolledCourses from "./Student/EnrolledCourses";
import StudentDetails from "./Student/StudentDetails";

// Protected Route
import ProtectedRoute from "./Student/ProtectedRoute";

function App() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  // 🟡 Fetch All Courses
  useEffect(() => {
    const fetchingData = async () => {
      try {
        const response = await fetch("http://localhost:5049/api/Course/GetAllCourses", {
          method: "GET",
          headers: {
            accept: "text/plain",
          },
        });

        if (!response.ok) {
          throw new Error("Error fetching courses");
        }

        const data = await response.json();
        setCourses(data);

      } catch (err) {
        alert(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchingData();
  }, []);



  return (
    <Routes>

      {/* ---------------- Login ---------------- */}
      <Route path="/login" element={<Login />} />


      {/* ---------------- Admin Secure Routes ---------------- */}
      <Route path="/SideBar" element={
        <ProtectedRoute allowedRoles={["Admin"]}>
          <SideBar />
        </ProtectedRoute>
      } />

      

      <Route path="/ViewSingleCourse/:id" element={
        <ProtectedRoute allowedRoles={["Admin"]}>
          <ViewSingleCourse courses={courses} />
        </ProtectedRoute>
      } />

      <Route path="/EditPost/:id" element={
        <ProtectedRoute allowedRoles={["Admin"]}>
          <EditPost />
        </ProtectedRoute>
      } />

      <Route path="/CreateCourse" element={
        <ProtectedRoute allowedRoles={["Admin"]}>
          <CreateCourse />
        </ProtectedRoute>
      } />

      <Route path="/AllEnrolledStudents" element={
        <ProtectedRoute allowedRoles={["Admin"]}>
          <AllEnrolledStudents />
        </ProtectedRoute>
      } />

      <Route path="/AllStudents" element={
        <ProtectedRoute allowedRoles={["Admin"]}>
          <AllStudents />
        </ProtectedRoute>
      } />

      <Route path="/StudentCreation" element={
        <ProtectedRoute allowedRoles={["Admin"]}>
          <StudentCreation />
        </ProtectedRoute>
      } />

      <Route path="/EditeStudent/:id" element={
        <ProtectedRoute allowedRoles={["Admin"]}>
          <EditeStudent />
        </ProtectedRoute>
      } />


      {/* ---------------- Student Secure Routes ---------------- */}
      <Route path="/student/course/:id" element={
        <ProtectedRoute allowedRoles={["Student"]}>
          <CourseDetails />
        </ProtectedRoute>
      } />

      <Route path="/student/enrolled" element={
        <ProtectedRoute allowedRoles={["Student"]}>
          <EnrolledCourses />
        </ProtectedRoute>
      } />

      <Route path="/StudentDetails" element={
        <ProtectedRoute allowedRoles={["Student"]}>
          <StudentDetails />
        </ProtectedRoute>
      } />


      {/* ---------------- Default Route ---------------- */}
      <Route path="*" element={<Navigate to="/login" />} />

    </Routes>
  );
}

export default App;
