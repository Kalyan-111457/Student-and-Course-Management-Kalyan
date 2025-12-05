import React from "react";
import '@testing-library/jest-dom';
import { render, screen, waitFor } from "@testing-library/react";
import AllEnrolledStudents from "../AllEnrolledStudents";
import { BrowserRouter } from "react-router-dom";

// Mock NavBar component
jest.mock("../NavBar", () => () => "MockNavBar");

// Mock localStorage
beforeEach(() => {
  Storage.prototype.getItem = jest.fn((key) => {
    if (key === "token") return "fake-token";
    return null;
  });
});

// Reset fetch mocks before each test
beforeEach(() => {
  global.fetch = jest.fn();
});

afterEach(() => {
  jest.clearAllMocks();
});

describe("AllEnrolledStudents Component", () => {

  const mockData = [
    {
      studentId: 1,
      studentName: "John Doe",
      studentEmail: "john@example.com",
      enrolledCourses: [
        { courseId: 1, courseName: "React", capacity: 50, enrolledCount: 40, availableSeats: 10 },
        { courseId: 2, courseName: "Node", capacity: 20, enrolledCount: 10, availableSeats: 10 }
      ]
    }
  ];

  test("displays loading initially", async () => {
    global.fetch.mockImplementationOnce(() =>
      Promise.resolve({ ok: true, json: () => Promise.resolve(mockData) })
    );

    render(
      <BrowserRouter>
        <AllEnrolledStudents />
      </BrowserRouter>
    );

    expect(screen.getByText(/Loading.../i)).toBeInTheDocument();
    await waitFor(() => expect(screen.getByText(/John Doe/i)).toBeInTheDocument());
  });

  test("renders student and course data correctly", async () => {
    global.fetch.mockImplementationOnce(() =>
      Promise.resolve({ ok: true, json: () => Promise.resolve(mockData) })
    );

    render(
      <BrowserRouter>
        <AllEnrolledStudents />
      </BrowserRouter>
    );

    await waitFor(() => expect(screen.getByText(/John Doe/i)).toBeInTheDocument());

    expect(screen.getByText(/John Doe/i)).toBeInTheDocument();
    expect(screen.getByText(/john@example.com/i)).toBeInTheDocument();
    expect(screen.getByText(/React/i)).toBeInTheDocument();
    expect(screen.getByText(/Node/i)).toBeInTheDocument();
  });

  test("shows error message if fetch fails", async () => {
    global.fetch.mockImplementationOnce(() =>
      Promise.resolve({ ok: false, json: () => Promise.resolve({}) })
    );

    render(
      <BrowserRouter>
        <AllEnrolledStudents />
      </BrowserRouter>
    );

    await waitFor(() =>
      expect(screen.getByText(/error fetching enrolled student data/i)).toBeInTheDocument()
    );
  });

  test("displays 'No students found' if data is empty", async () => {
    global.fetch.mockImplementationOnce(() =>
      Promise.resolve({ ok: true, json: () => Promise.resolve([]) })
    );

    render(
      <BrowserRouter>
        <AllEnrolledStudents />
      </BrowserRouter>
    );

    await waitFor(() =>
      expect(screen.getByText(/No students found/i)).toBeInTheDocument()
    );
  });

  test("search input is present", async () => {
    global.fetch.mockImplementationOnce(() =>
      Promise.resolve({ ok: true, json: () => Promise.resolve(mockData) })
    );

    render(
      <BrowserRouter>
        <AllEnrolledStudents />
      </BrowserRouter>
    );

    await waitFor(() => expect(screen.getByText(/John Doe/i)).toBeInTheDocument());

    const input = screen.getByPlaceholderText(/Search Students/i);
    expect(input).toBeInTheDocument();
  });
});
