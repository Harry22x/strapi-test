import React from "react";
import { render, screen } from "@testing-library/react";
import Reviews from "../src/components/Reviews"; // Adjust path if needed

describe("Reviews Component", () => {
  test("renders the reviews section title correctly", () => {
    render(<Reviews />);

    expect(screen.getByText(/what our clients are/i)).toBeInTheDocument();
    expect(screen.getByText(/saying about us\?/i)).toBeInTheDocument();
  });

  test("renders review cards with correct user details", () => {
    render(<Reviews />);

    // Check reviewer names
    expect(screen.getByText("Stacy Aleyo")).toBeInTheDocument();
    expect(screen.getByText("Manu Maina")).toBeInTheDocument();
    expect(screen.getByText("Harry Porter")).toBeInTheDocument();

    // Check locations
    expect(screen.getByText("Nairobi")).toBeInTheDocument();
    expect(screen.getByText("Nakuru")).toBeInTheDocument();
  });

  test("renders review text for each reviewer", () => {
    render(<Reviews />);

    expect(
      screen.getByText(/The energy was absolutely electric/i)
    ).toBeInTheDocument();

    expect(
      screen.getByText(/Every detail was well planned/i)
    ).toBeInTheDocument();

    expect(
      screen.getByText(/The lineup was insane/i)
    ).toBeInTheDocument();
  });

  test("renders star rating images", () => {
    render(<Reviews />);
    
    const starIcons = screen.getAllByAltText(/Star/i);
    expect(starIcons.length).toBeGreaterThan(0); // Ensures stars are displayed
  });
});
