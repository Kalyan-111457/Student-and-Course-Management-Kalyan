import '@testing-library/jest-dom';
import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import AllStudents from "../AllStudents";
import { BrowserRouter } from "react-router-dom";

// Mock NavBar (no JSX)
jest.mock("../NavBar", () => () => "MockNavBar");

// Mock localStorage and window methods
beforeEach(() => {
  Storage.prototype.getItem = jest.fn(() => "mock-token");
  window.confirm = jest.fn(() => true);
  window.alert = jest.fn();
});

// Mock fetch for GET and DELETE requests
const mockStudents = [
  {
    studentId: 1,
    fullName: "John Doe",
    email: "john@example.com",
    password: "12345",
    phone: "1234567890",
    address: "123 Street",
    role: "Student",
    datetime: "2025-12-03",
  },
  {
    studentId: 2,
    fullName: "Jane Smith",
    email: "jane@example.com",
    password: "67890",
    phone: "0987654321",
    address: "456 Avenue",
    role: "Student",
    datetime: "2025-12-03",
  },
];

beforeEach(() => {
  global.fetch = jest.fn((url, options) => {
    if (options && options.method === "DELETE") {
      return Promise.resolve({ ok: true });
    }
    return Promise.resolve({
      ok: true,
      json: () => Promise.resolve(mockStudents),
    });
  });
});

const renderComponent = () =>
  render(
    <BrowserRouter>
      <AllStudents />
    </BrowserRouter>
  );

describe("AllStudents Component", () => {
  test("renders loading and fetches students", async () => {
    renderComponent();
    expect(screen.getByText(/Loading/i)).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText("John Doe")).toBeInTheDocument();
      expect(screen.getByText("Jane Smith")).toBeInTheDocument();
      expect(screen.getByPlaceholderText(/Enter The Student Name/i)).toBeInTheDocument();
      expect(screen.getByText(/Total Students: 2/i)).toBeInTheDocument();
    });
  });

  test("filters students by search input", async () => {
    renderComponent();
    await waitFor(() => screen.getByText("John Doe"));

    const searchInput = screen.getByPlaceholderText(/Enter The Student Name/i);
    fireEvent.change(searchInput, { target: { value: "Jane" } });

    await waitFor(() => {
      expect(screen.queryByText("John Doe")).not.toBeInTheDocument();
      expect(screen.getByText("Jane Smith")).toBeInTheDocument();
    });
  });

  test("deletes a student and updates the list", async () => {
    renderComponent();
    await waitFor(() => screen.getByText("John Doe"));

    const deleteButtons = screen.getAllByRole("button", { name: /delete/i });
    fireEvent.click(deleteButtons[0]);

    await waitFor(() => {
      expect(window.confirm).toHaveBeenCalledWith("Are you sure you want to delete this student?");
      expect(window.alert).toHaveBeenCalledWith("Student deleted successfully!");
      expect(screen.queryByText("John Doe")).not.toBeInTheDocument();
    });
  });

  test("back button exists and clickable", async () => {
    renderComponent();
    const backButton = screen.getByLabelText("back-button");

    await waitFor(() => {
      expect(backButton).toBeInTheDocument();
    });

    fireEvent.click(backButton);
  });
});
