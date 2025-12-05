import "@testing-library/jest-dom";
import React from "react";
import { render, screen, waitFor, fireEvent, act } from "@testing-library/react";
import ViewSingleCourse from "../ViewSingleCourse";
import { BrowserRouter } from "react-router-dom";

// Mock NavBar
jest.mock("../NavBar", () => () => <div>MockNavBar</div>);

// Mock react-router-dom hooks
const mockNavigate = jest.fn();
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useParams: () => ({ id: "1" }),
  useNavigate: () => mockNavigate,
}));

// Silence console errors from act warnings
beforeAll(() => {
  jest.spyOn(console, "error").mockImplementation(() => {});
});

// Mock localStorage & alerts
beforeEach(() => {
  Storage.prototype.getItem = jest.fn((key) => (key === "token" ? "mockToken" : null));
  jest.spyOn(window, "alert").mockImplementation(() => {});
  jest.spyOn(window, "confirm").mockImplementation(() => true);

  global.fetch = jest.fn((url) => {
    if (url.includes("EnrolledStudentsByCourseId")) {
      return Promise.resolve({
        ok: true,
        json: () =>
          Promise.resolve({
            students: [
              { studentId: "S1", fullName: "John Doe", email: "john@example.com", phone: "123", enrolledOn: "2025-12-01" },
              { studentId: "S2", fullName: "Jane Smith", email: "jane@example.com", phone: "456", enrolledOn: "2025-12-02" },
            ],
          }),
      });
    }
    return Promise.resolve({ ok: true, json: () => Promise.resolve({}) });
  });
});

afterAll(() => {
  console.error.mockRestore();
});

const mockCourses = [
  { courseId: 1, courseName: "React Course", courseDescription: "Learn React", capacity: 30, enrolledCount: 2, availableSeats: 28 },
];

describe("ViewSingleCourse Component", () => {

  test("renders course details and enrolled students", async () => {
    await act(async () => {
      render(
        <BrowserRouter>
          <ViewSingleCourse courses={mockCourses} />
        </BrowserRouter>
      );
    });

    expect(screen.getByText(/Course Name:/)).toHaveTextContent("Course Name: React Course");

    await waitFor(() => {
      expect(screen.getByText("John Doe")).toBeInTheDocument();
      expect(screen.getByText("Jane Smith")).toBeInTheDocument();
    });
  });

  test("delete button works and navigates", async () => {
    await act(async () => {
      render(
        <BrowserRouter>
          <ViewSingleCourse courses={mockCourses} />
        </BrowserRouter>
      );
    });

    await act(async () => {
      fireEvent.click(screen.getByText("Delete"));
    });

    expect(window.confirm).toHaveBeenCalled();
    expect(window.alert).toHaveBeenCalledWith("Course deleted successfully!");
    expect(mockNavigate).toHaveBeenCalledWith("/SideBar");
  });

  test("shows 'No course found' when course missing", async () => {
    await act(async () => {
      render(
        <BrowserRouter>
          <ViewSingleCourse courses={[]} />
        </BrowserRouter>
      );
    });

    expect(screen.getByText("No course found.")).toBeInTheDocument();
  });

  test("shows 'No students enrolled yet.' when list empty", async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({ ok: true, json: () => Promise.resolve({ students: [] }) })
    );

    await act(async () => {
      render(
        <BrowserRouter>
          <ViewSingleCourse courses={mockCourses} />
        </BrowserRouter>
      );
    });

    await waitFor(() => {
      expect(screen.getByText("No students enrolled yet.")).toBeInTheDocument();
    });
  });

});
