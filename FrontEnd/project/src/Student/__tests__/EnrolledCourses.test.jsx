import { render, screen, waitFor } from "@testing-library/react";
import EnrolledCourses from "../EnrolledCourses";
import { BrowserRouter } from "react-router-dom";
import "@testing-library/jest-dom";

// Mock console.log to remove output noise
beforeAll(() => {
  jest.spyOn(console, "log").mockImplementation(() => {});
});

afterAll(() => {
  console.log.mockRestore();
});

// Mock NavBar
jest.mock("../NavBar", () => () => <div>MockNavBar</div>);

// Mock localStorage
beforeEach(() => {
  Storage.prototype.getItem = jest.fn((key) => {
    if (key === "token") return "fake-token";
    if (key === "studentId") return "123";
    return null;
  });
});

// Mock fetch
beforeEach(() => {
  global.fetch = jest.fn(() =>
    Promise.resolve({
      json: () =>
        Promise.resolve({
          enrolledCourses: [
            {
              courseId: 1,
              courseName: "React Course",
              courseDescription: "Learn React"
            },
            {
              courseId: 2,
              courseName: "Node.js Mastery",
              courseDescription: "Backend with Node"
            }
          ]
        })
    })
  );
});

afterEach(() => {
  jest.clearAllMocks();
});

test("renders enrolled courses from API", async () => {
  render(
    <BrowserRouter>
      <EnrolledCourses />
    </BrowserRouter>
  );

  await waitFor(() => {
    expect(screen.getByText("React Course")).toBeInTheDocument();
    expect(screen.getByText("Node.js Mastery")).toBeInTheDocument();
  });
});
