import React from "react";
import '@testing-library/jest-dom'; // ✅ needed for matchers
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import EditeStudent from "../EditeStudent";
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

describe("EditeStudent Component", () => {
  const studentData = {
    studentId: 1,
    fullName: "John Doe",
    email: "john@example.com",
    password: "123456",
    phone: "1234567890",
    address: "123 Street",
    role: "Student",
  };

  const setup = () =>
    render(
      <MemoryRouter
        initialEntries={[
          { pathname: "/edit-student/1", state: { student: studentData } },
        ]}
      >
        <Routes>
          <Route path="/edit-student/:id" element={<EditeStudent />} />
        </Routes>
      </MemoryRouter>
    );

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("renders all input fields and button", () => {
    setup();

    expect(screen.getByLabelText("full-name-input")).toBeInTheDocument();
    expect(screen.getByLabelText("email-input")).toBeInTheDocument();
    expect(screen.getByLabelText("password-input")).toBeInTheDocument();
    expect(screen.getByLabelText("phone-input")).toBeInTheDocument();
    expect(screen.getByLabelText("address-input")).toBeInTheDocument();
    expect(screen.getByLabelText("role-select")).toBeInTheDocument();
    expect(screen.getByLabelText("update-student-button")).toBeInTheDocument();
  });

  test("pre-fills input fields with student data", () => {
    setup();

    expect(screen.getByLabelText("full-name-input")).toHaveValue(studentData.fullName);
    expect(screen.getByLabelText("email-input")).toHaveValue(studentData.email);
    expect(screen.getByLabelText("password-input")).toHaveValue(studentData.password);
    expect(screen.getByLabelText("phone-input")).toHaveValue(studentData.phone);
    expect(screen.getByLabelText("address-input")).toHaveValue(studentData.address);
  });

  test("updates input fields when user types", () => {
    setup();

    fireEvent.change(screen.getByLabelText("full-name-input"), {
      target: { value: "Jane Doe" },
    });
    fireEvent.change(screen.getByLabelText("email-input"), {
      target: { value: "jane@example.com" },
    });

    expect(screen.getByLabelText("full-name-input")).toHaveValue("Jane Doe");
    expect(screen.getByLabelText("email-input")).toHaveValue("jane@example.com");
  });

  test("submits form and shows success alert", async () => {
    setup();

    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({}),
      })
    );

    const mockAlert = jest.spyOn(window, "alert").mockImplementation();

    fireEvent.click(screen.getByLabelText("update-student-button"));

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        `http://localhost:5049/api/Admin/Update/${studentData.studentId}`,
        expect.objectContaining({
          method: "PUT",
          headers: expect.objectContaining({
            "Content-Type": "application/json",
            Authorization: expect.any(String),
          }),
          body: JSON.stringify(studentData),
        })
      );
      expect(mockAlert).toHaveBeenCalledWith("Student updated successfully!");
      expect(mockNavigate).toHaveBeenCalledWith("/AllStudents");
    });
  });

  test("shows error alert if API fails", async () => {
    setup();

    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: false,
        json: () => Promise.resolve({ message: "Failed to update student" }),
      })
    );

    const mockAlert = jest.spyOn(window, "alert").mockImplementation();

    fireEvent.click(screen.getByLabelText("update-student-button"));

    await waitFor(() => {
      expect(mockAlert).toHaveBeenCalledWith("Failed to update student");
    });
  });
});
