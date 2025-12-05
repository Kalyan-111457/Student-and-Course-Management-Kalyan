import "@testing-library/jest-dom";
import { render, screen, waitFor, fireEvent, act } from "@testing-library/react";
import StudentDetails from "../StudentDetails";
import { BrowserRouter } from "react-router-dom";

// Mock Navbar component
jest.mock("../NavBar", () => () => <div>MockNavBar</div>);

// Mock useNavigate
const mockNavigate = jest.fn();
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockNavigate,
}));

// Suppress act warnings in console
beforeAll(() => {
  jest.spyOn(console, "error").mockImplementation(() => {});
});

afterAll(() => {
  console.error.mockRestore();
});

describe("StudentDetails Component", () => {
  beforeEach(() => {
    // Mock localStorage
    Storage.prototype.getItem = jest.fn((key) => {
      if (key === "email") return "test@example.com";
      if (key === "token") return "mockToken";
      return null;
    });

    // Mock fetch API response
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () =>
          Promise.resolve({
            studentId: 1,
            fullName: "John Doe",
            email: "test@example.com",
            password: "secret",
            phone: "1234567890",
            address: "Hyderabad",
          }),
      })
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test("renders Navbar and Back button", async () => {
    await act(async () => {
      render(
        <BrowserRouter>
          <StudentDetails />
        </BrowserRouter>
      );
    });

    expect(screen.getByText("MockNavBar")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Back To Home" })).toBeInTheDocument();
  });

  test("fetches and displays student details", async () => {
    await act(async () => {
      render(
        <BrowserRouter>
          <StudentDetails />
        </BrowserRouter>
      );
    });

    await waitFor(() => {
      expect(screen.getByText("John Doe")).toBeInTheDocument();
    });

    expect(screen.getByText("1")).toBeInTheDocument();
    expect(screen.getByText("test@example.com")).toBeInTheDocument();
    expect(screen.getByText("secret")).toBeInTheDocument();
    expect(screen.getByText("1234567890")).toBeInTheDocument();
    expect(screen.getByText("Hyderabad")).toBeInTheDocument();
  });

  test("Back to Home button triggers navigation", async () => {
    await act(async () => {
      render(
        <BrowserRouter>
          <StudentDetails />
        </BrowserRouter>
      );
    });

    const backButton = screen.getByRole("button", { name: "Back To Home" });
    fireEvent.click(backButton);

    expect(mockNavigate).toHaveBeenCalledWith("/student/course/:id");
  });
});
