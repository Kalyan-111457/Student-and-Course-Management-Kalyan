import React from "react";
import '@testing-library/jest-dom';
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import StudentCreation from "../StudentCreation";
import { MemoryRouter } from "react-router-dom";

// Mock NavBar
jest.mock("../NavBar", () => () => <div>NavBar</div>);

describe("StudentCreation Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({}),
      })
    );
  });

  const setup = () => render(
    <MemoryRouter>
      <StudentCreation />
    </MemoryRouter>
  );

  test("renders all input fields and button", () => {
    setup();
    expect(screen.getByLabelText("full-name-input")).toBeInTheDocument();
    expect(screen.getByLabelText("email-input")).toBeInTheDocument();
    expect(screen.getByLabelText("password-input")).toBeInTheDocument();
    expect(screen.getByLabelText("phone-input")).toBeInTheDocument();
    expect(screen.getByLabelText("address-input")).toBeInTheDocument();
    expect(screen.getByLabelText("role-select")).toBeInTheDocument();
    expect(screen.getByLabelText("register-student-button")).toBeInTheDocument();
  });

  test("updates input fields when user types", () => {
    setup();
    fireEvent.change(screen.getByLabelText("full-name-input"), { target: { value: "John Doe" } });
    fireEvent.change(screen.getByLabelText("email-input"), { target: { value: "john@example.com" } });
    fireEvent.change(screen.getByLabelText("password-input"), { target: { value: "123456" } });
    fireEvent.change(screen.getByLabelText("phone-input"), { target: { value: "9876543210" } });
    fireEvent.change(screen.getByLabelText("address-input"), { target: { value: "123 Street" } });

    expect(screen.getByLabelText("full-name-input")).toHaveValue("John Doe");
    expect(screen.getByLabelText("email-input")).toHaveValue("john@example.com");
    expect(screen.getByLabelText("password-input")).toHaveValue("123456");
    expect(screen.getByLabelText("phone-input")).toHaveValue("9876543210");
    expect(screen.getByLabelText("address-input")).toHaveValue("123 Street");
  });

  test("submits form and shows success alert", async () => {
    setup();
    fireEvent.change(screen.getByLabelText("full-name-input"), { target: { value: "John Doe" } });
    fireEvent.change(screen.getByLabelText("email-input"), { target: { value: "john@example.com" } });

    const mockAlert = jest.spyOn(window, "alert").mockImplementation();

    fireEvent.click(screen.getByLabelText("register-student-button"));

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        "http://localhost:5049/api/Admin/StudentRegister",
        expect.objectContaining({
          method: "POST",
          headers: expect.objectContaining({ "Content-Type": "application/json" }),
          body: JSON.stringify({
            fullName: "John Doe",
            email: "john@example.com",
            password: "",
            phone: "",
            address: "",
            role: "Student"
          }),
        })
      );
      expect(mockAlert).toHaveBeenCalledWith("Student Registered Successfully!");
    });
  });

  test("shows error alert if API fails", async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({ ok: false, json: () => Promise.resolve({ message: "Failed to register student" }) })
    );
    setup();

    const mockAlert = jest.spyOn(window, "alert").mockImplementation();

    fireEvent.click(screen.getByLabelText("register-student-button"));

    await waitFor(() => {
      expect(mockAlert).toHaveBeenCalledWith("Failed to register student");
    });
  });
});
