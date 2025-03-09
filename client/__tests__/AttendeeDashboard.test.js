import React from "react";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import AttendeeDashboard from "../src/Pages/AttendeeDashboard";

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useOutletContext: jest.fn(),
}));

describe("AttendeeDashboard Component", () => {
  test("renders loading spinner when no user is logged in", () => {
    const { useOutletContext } = require("react-router-dom");
    useOutletContext.mockReturnValue([jest.fn(), null]);

    const { container } = render(
      <MemoryRouter>
        <AttendeeDashboard />
      </MemoryRouter>
    );

    expect(container.querySelector(".spinner")).toBeInTheDocument();
  });

  test("renders attendee dashboard when user is logged in", () => {
    const mockUser = {
      username: "JohnDoe",
      role: "Attendee",
      user_tickets: [],
    };

    const { useOutletContext } = require("react-router-dom");
    useOutletContext.mockReturnValue([jest.fn(), mockUser]);

    render(
      <MemoryRouter>
        <AttendeeDashboard />
      </MemoryRouter>
    );

    expect(screen.getByText(/Your Attending Events:/i)).toBeInTheDocument();
  });

  test("displays 'no events' message when user has no tickets", () => {
    const mockUser = {
      username: "JohnDoe",
      role: "Attendee",
      user_tickets: [],
    };

    const { useOutletContext } = require("react-router-dom");
    useOutletContext.mockReturnValue([jest.fn(), mockUser]);

    render(
      <MemoryRouter>
        <AttendeeDashboard />
      </MemoryRouter>
    );

    expect(
      screen.getByText("This is where your attending events would show but you are currently not attending any")
    ).toBeInTheDocument();
  });
});
