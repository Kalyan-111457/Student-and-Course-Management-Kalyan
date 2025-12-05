import React from "react";
import '@testing-library/jest-dom';
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import EditPost from "../EditPost";
import { MemoryRouter, Route, Routes } from "react-router-dom";

// Mock NavBar
jest.mock("../NavBar", () => () => <div>NavBar</div>);

// Mock useNavigate
const mockNavigate = jest.fn();
jest.mock("react-router-dom", () => {
  const original = jest.requireActual("react-router-dom");
  return {
    ...original,
    useNavigate: () => mockNavigate,
  };
});

describe("EditPost Component", () => {
  const courseData = {
    course: {
      courseId: 1,
      courseName: "React 101",
      courseDescription: "Learn React basics",
      capacity: 30
    }
  };

  beforeEach(() => {
    jest.clearAllMocks();
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve(courseData),
      })
    );
  });

  const setup = () =>
    render(
      <MemoryRouter initialEntries={["/edit-course/1"]}>
        <Routes>
          <Route path="/edit-course/:id" element={<EditPost />} />
        </Routes>
      </MemoryRouter>
    );

  test("renders input fields and button", async () => {
    setup();

    // Wait for fetch useEffect
    await waitFor(() => expect(screen.getByLabelText("course-name-input")).toBeInTheDocument());

    expect(screen.getByLabelText("course-description-input")).toBeInTheDocument();
    expect(screen.getByLabelText("course-capacity-input")).toBeInTheDocument();
    expect(screen.getByLabelText("update-course-button")).toBeInTheDocument();
  });

  test("pre-fills input fields with fetched course data", async () => {
    setup();

    await waitFor(() => expect(screen.getByLabelText("course-name-input")).toHaveValue(courseData.course.courseName));

    expect(screen.getByLabelText("course-description-input")).toHaveValue(courseData.course.courseDescription);
    expect(screen.getByLabelText("course-capacity-input")).toHaveValue(courseData.course.capacity);
  });

  test("updates input fields when user types", async () => {
    setup();
    await waitFor(() => screen.getByLabelText("course-name-input"));

    fireEvent.change(screen.getByLabelText("course-name-input"), { target: { value: "React 102" } });
    fireEvent.change(screen.getByLabelText("course-description-input"), { target: { value: "Advanced React" } });
    fireEvent.change(screen.getByLabelText("course-capacity-input"), { target: { value: 50 } });

    expect(screen.getByLabelText("course-name-input")).toHaveValue("React 102");
    expect(screen.getByLabelText("course-description-input")).toHaveValue("Advanced React");
    expect(screen.getByLabelText("course-capacity-input")).toHaveValue(50);
  });

  test("submits form and shows success alert", async () => {
    setup();
    await waitFor(() => screen.getByLabelText("update-course-button"));

    const mockAlert = jest.spyOn(window, "alert").mockImplementation();
    global.fetch = jest.fn(() =>
      Promise.resolve({ ok: true, json: () => Promise.resolve({}) })
    );

    fireEvent.click(screen.getByLabelText("update-course-button"));

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        `http://localhost:5049/api/Course/UpdateCourseById/1`,
        expect.objectContaining({
          method: "PUT",
          headers: expect.objectContaining({
            "Content-Type": "application/json",
            Authorization: expect.any(String)
          }),
          body: JSON.stringify({
            courseId: "1",
            courseName: "React 101",
            courseDescription: "Learn React basics",
            capacity: 30
          })
        })
      );

      expect(mockAlert).toHaveBeenCalledWith("Course updated successfully!");
      expect(mockNavigate).toHaveBeenCalledWith("/ViewSingleCourse/1");
    });
  });

  test("shows error alert if API fails", async () => {
    setup();
    await waitFor(() => screen.getByLabelText("update-course-button"));

    const mockAlert = jest.spyOn(window, "alert").mockImplementation();
    global.fetch = jest.fn(() =>
      Promise.resolve({ ok: false, json: () => Promise.resolve({ message: "Failed to update course" }) })
    );

    fireEvent.click(screen.getByLabelText("update-course-button"));

    await waitFor(() => {
      expect(mockAlert).toHaveBeenCalledWith("Failed to update course");
    });
  });
});
