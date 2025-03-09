import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Navbar from "../src/components/Navbar";

global.fetch = jest.fn(() =>
  Promise.resolve({
    ok: true,
  })
);

describe("Navbar Component", () => {
  const mockSetUser = jest.fn();

  beforeEach(() => {
    fetch.mockClear();
  });

  test("renders navbar correctly for guests", () => {
    render(
      <MemoryRouter>
        <Navbar setUser={mockSetUser} user={null} />
      </MemoryRouter>
    );

    expect(screen.getByText("Tickets")).toBeInTheDocument();
    expect(screen.getByText("Contact")).toBeInTheDocument();
    expect(screen.getByText("Sign Up")).toBeInTheDocument();
    expect(screen.getByText("Login")).toBeInTheDocument();
  });

  test("renders navbar correctly for an attendee", () => {
    render(
      <MemoryRouter>
        <Navbar setUser={mockSetUser} user={{ role: "Attendee" }} />
      </MemoryRouter>
    );

    expect(screen.getByText("Account")).toBeInTheDocument();
    expect(screen.getByText("Log out")).toBeInTheDocument();
  });

  test("renders navbar correctly for an organizer", () => {
    render(
      <MemoryRouter>
        <Navbar setUser={mockSetUser} user={{ role: "Organizer" }} />
      </MemoryRouter>
    );

    expect(screen.getByText("Account")).toBeInTheDocument();
    expect(screen.getByText("Log out")).toBeInTheDocument();
  });

  test("calls setUser(null) on logout", async () => {
    render(
      <MemoryRouter>
        <Navbar setUser={mockSetUser} user={{ role: "Attendee" }} />
      </MemoryRouter>
    );

    fireEvent.click(screen.getByText("Log out"));

    expect(fetch).toHaveBeenCalledWith("/logout", { method: "DELETE" });

    // Wait for state update
    await new Promise((resolve) => setTimeout(resolve, 0));

    expect(mockSetUser).toHaveBeenCalledWith(null);
  });
});
