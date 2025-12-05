import "@testing-library/jest-dom";
import { render, screen, waitFor, fireEvent, act } from "@testing-library/react";
import StudentHome from "../CourseDetails";
import { BrowserRouter } from "react-router-dom";

// Mock Navbar
jest.mock("../NavBar", () => () => <div>MockNavBar</div>);

// Mock window.location.reload
Object.defineProperty(window, "location", {
  value: { reload: jest.fn() },
});

// Mock localStorage & alerts
beforeEach(() => {
  Storage.prototype.getItem = jest.fn((key) => {
    if (key === "token") return "mockToken";
    if (key === "studentId") return "123";
    return null;
  });

  jest.spyOn(window, "alert").mockImplementation(() => {});

  global.fetch = jest.fn(() =>
    Promise.resolve({
      ok: true,
      json: () =>
        Promise.resolve([
          {
            courseId: 1,
            courseName: "React Course",
            courseDescription: "Learn React basics",
            availableSeats: 5,
          },
          {
            courseId: 2,
            courseName: "Node.js Mastery",
            courseDescription: "Backend with Node",
            availableSeats: 10,
          },
        ]),
    })
  );
});

afterEach(() => {
  jest.clearAllMocks();
});

describe("StudentHome Component", () => {
  test("renders navbar and heading", async () => {
    await act(async () => {
      render(
        <BrowserRouter>
          <StudentHome />
        </BrowserRouter>
      );
    });

    expect(screen.getByText("MockNavBar")).toBeInTheDocument();
    expect(screen.getByText("Student Dashboard")).toBeInTheDocument();
  });

  test("fetches and displays courses", async () => {
    render(
      <BrowserRouter>
        <StudentHome />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByText("React Course")).toBeInTheDocument();
      expect(screen.getByText("Node.js Mastery")).toBeInTheDocument();
    });
  });

  test("search functionality filters courses", async () => {
    render(
      <BrowserRouter>
        <StudentHome />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByText("React Course")).toBeInTheDocument();
    });

    const searchInput = screen.getByPlaceholderText("Search course...");
    fireEvent.change(searchInput, { target: { value: "react" } });

    expect(screen.getByText("React Course")).toBeInTheDocument();
    expect(screen.queryByText("Node.js Mastery")).not.toBeInTheDocument();
  });

  test("enroll button triggers API call", async () => {
    render(
      <BrowserRouter>
        <StudentHome />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByText("React Course")).toBeInTheDocument();
    });

    global.fetch.mockImplementationOnce(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ message: "Enrolled successfully!" }),
      })
    );

    const enrollBtn = screen.getAllByText("Enroll")[0];

    await act(async () => {
      fireEvent.click(enrollBtn);
    });

    await waitFor(() => {
      expect(window.alert).toHaveBeenCalledWith("Enrolled successfully!");
      expect(window.location.reload).toHaveBeenCalled();
    });
  });
});
