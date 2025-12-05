import "@testing-library/jest-dom";
import { render, screen, waitFor, fireEvent, within } from "@testing-library/react";
import SideBar from "../SideBar";
import { BrowserRouter } from "react-router-dom";

// Mock NavBar component
jest.mock("../NavBar", () => () => "MockNavBar");

// Mock localStorage and fetch
beforeEach(() => {
  Storage.prototype.getItem = jest.fn((key) => {
    if (key === "email") return "test@example.com";
    if (key === "token") return "fake-token";
    return null;
  });

  global.fetch = jest.fn(() =>
    Promise.resolve({
      ok: true,
      json: () =>
        Promise.resolve({
          totalCourses: 5,
          totalStudents: 100,
          totalEnrolledStudents: 70,
          totalNotEnrolledStudents: 30,
          totalEnrollments: 50,
          courses: [
            {
              courseId: 1,
              courseName: "React",
              capacity: 50,
              enrolledCount: 40,
              availableSeats: 10,
            },
            {
              courseId: 2,
              courseName: "Node",
              capacity: 20,
              enrolledCount: 10,
              availableSeats: 10,
            },
          ],
        }),
    })
  );
});

afterEach(() => {
  jest.clearAllMocks();
});

describe("SideBar Component Tests", () => {

  test("loads and displays overall stats", async () => {
    render(
      <BrowserRouter>
        <SideBar />
      </BrowserRouter>
    );

    await waitFor(() => screen.getByText("5")); // Wait for totalCourses

    const statsRow = screen.getByText("5").closest("tr");
    const statsCells = within(statsRow).getAllByRole("cell");

    expect(statsCells[0]).toHaveTextContent("5");   // Total Courses
    expect(statsCells[1]).toHaveTextContent("100"); // Total Students
    expect(statsCells[2]).toHaveTextContent("70");  // Enrolled Students
    expect(statsCells[3]).toHaveTextContent("30");  // Not Enrolled Students
    expect(statsCells[4]).toHaveTextContent("50");  // Total Enrollments
  });

  test("Displays per-course enrollment table correctly", async () => {
    render(
      <BrowserRouter>
        <SideBar />
      </BrowserRouter>
    );

    await waitFor(() => screen.getByText("React"));

    const courseTable = screen.getByText("Per-Course Enrollment").nextElementSibling;
    const courseRows = within(courseTable).getAllByRole("row").slice(1);

    const reactCells = within(courseRows[0]).getAllByRole("cell");
    expect(reactCells[1]).toHaveTextContent("React");
    expect(reactCells[2]).toHaveTextContent("50");
    expect(reactCells[3]).toHaveTextContent("40");
    expect(reactCells[4]).toHaveTextContent("10");

    const nodeCells = within(courseRows[1]).getAllByRole("cell");
    expect(nodeCells[1]).toHaveTextContent("Node");
    expect(nodeCells[2]).toHaveTextContent("20");
    expect(nodeCells[3]).toHaveTextContent("10");
    expect(nodeCells[4]).toHaveTextContent("10");
  });

  test("Search filtering works for courses", async () => {
    render(
      <BrowserRouter>
        <SideBar />
      </BrowserRouter>
    );

    await waitFor(() => screen.getByText("React"));

    const input = screen.getByPlaceholderText("Search Courses");
    fireEvent.change(input, { target: { value: "React" } });

    expect(screen.getByText("React")).toBeInTheDocument();
    expect(screen.queryByText("Node")).toBeNull();
  });

  test("Displays 'No course data available' if no courses match search", async () => {
    render(
      <BrowserRouter>
        <SideBar />
      </BrowserRouter>
    );

    await waitFor(() => screen.getByText("React"));

    const input = screen.getByPlaceholderText("Search Courses");
    fireEvent.change(input, { target: { value: "Angular" } });

    expect(screen.getByText("No course data available.")).toBeInTheDocument();
  });
});
