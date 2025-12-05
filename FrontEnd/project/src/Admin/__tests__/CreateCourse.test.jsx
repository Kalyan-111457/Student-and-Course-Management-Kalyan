// src/Admin/__tests__/CreateCourse.test.jsx
import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import '@testing-library/jest-dom'; // ✅ important for matchers
import { BrowserRouter } from "react-router-dom";
import CreateCourse from "../CreateCourse";

// Mock NavBar
jest.mock("../NavBar.js", () => () => <div data-testid="navbar">NavBar</div>);

describe("CreateCourse Component", () => {
  const setup = () => render(
    <BrowserRouter>
      <CreateCourse />
    </BrowserRouter>
  );

  beforeEach(() => {
    // Mock localStorage
    Storage.prototype.getItem = jest.fn((key) => {
      if (key === "token") return "fake-token";
      return null;
    });
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  test("renders the form inputs and buttons", () => {
    setup();

    expect(screen.getByRole("button", { name: /back-button/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /create-course-button/i })).toBeInTheDocument();

    expect(screen.getByLabelText("course-name-input")).toBeInTheDocument();
    expect(screen.getByLabelText("course-description-input")).toBeInTheDocument();
    expect(screen.getByLabelText("course-capacity-input")).toBeInTheDocument();
  });

  test("updates input fields when user types", () => {
    setup();

    const nameInput = screen.getByLabelText("course-name-input");
    const descInput = screen.getByLabelText("course-description-input");
    const capacityInput = screen.getByLabelText("course-capacity-input");

    fireEvent.change(nameInput, { target: { value: "React 101" } });
    fireEvent.change(descInput, { target: { value: "Learn React basics" } });
    fireEvent.change(capacityInput, { target: { value: 30 } });

    expect(nameInput).toHaveValue("React 101");
    expect(descInput).toHaveValue("Learn React basics");
    expect(capacityInput).toHaveValue(30);
  });

  test("submits the form and shows alert on success", async () => {
    setup();

    // Mock fetch
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ course: { courseId: 123 } }),
      })
    );

    const mockAlert = jest.spyOn(window, "alert").mockImplementation(() => {});

    fireEvent.change(screen.getByLabelText("course-name-input"), { target: { value: "React 101" } });
    fireEvent.change(screen.getByLabelText("course-description-input"), { target: { value: "Learn React basics" } });
    fireEvent.change(screen.getByLabelText("course-capacity-input"), { target: { value: 30 } });

    fireEvent.click(screen.getByRole("button", { name: /create-course-button/i }));

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        "http://localhost:5049/api/Course/CreateCourse",
        expect.objectContaining({
          method: "POST",
          headers: expect.objectContaining({
            "Content-Type": "application/json",
            Authorization: "Bearer fake-token",
          }),
          body: JSON.stringify({
            courseName: "React 101",
            courseDescription: "Learn React basics",
            capacity: 30,
          }),
        })
      );

      expect(mockAlert).toHaveBeenCalledWith("Course created successfully! ID = 123");
    });
  });

  test("shows error alert when API fails", async () => {
    setup();

    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: false,
        json: () => Promise.resolve({ message: "Failed to create course" }),
      })
    );

    const mockAlert = jest.spyOn(window, "alert").mockImplementation(() => {});

    fireEvent.change(screen.getByLabelText("course-name-input"), { target: { value: "React 101" } });
    fireEvent.change(screen.getByLabelText("course-description-input"), { target: { value: "Learn React basics" } });
    fireEvent.change(screen.getByLabelText("course-capacity-input"), { target: { value: 30 } });

    fireEvent.click(screen.getByRole("button", { name: /create-course-button/i }));

    await waitFor(() => {
      expect(mockAlert).toHaveBeenCalledWith("Failed to create course");
    });
  });
});
