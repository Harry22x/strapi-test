import React from "react";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import SideBar from "../src/components/SideBar";


describe("SideBar Component", () => {
  test("renders correctly for an Organizer", () => {
    render(
      <MemoryRouter>
        <SideBar user={{ role: "Organizer" }} />
      </MemoryRouter>
    );

    expect(screen.getByText("Dashboard")).toBeInTheDocument();
    expect(screen.getByText("Home")).toBeInTheDocument();
    expect(screen.getByText("Profile")).toBeInTheDocument();
    expect(screen.getByText("Attending Events")).toBeInTheDocument(); // Organizer only
  });

  test("renders correctly for an Attendee", () => {
    render(
      <MemoryRouter>
        <SideBar user={{ role: "Attendee" }} />
      </MemoryRouter>
    );

    expect(screen.getByText("Dashboard")).toBeInTheDocument();
    expect(screen.getByText("Home")).toBeInTheDocument();
    expect(screen.getByText("Profile")).toBeInTheDocument();
    expect(screen.queryByText("Attending Events")).not.toBeInTheDocument(); // Attendee shouldn't see this
  });

  test("renders correctly for a guest (no user)", () => {
    render(
      <MemoryRouter>
        <SideBar user={null} />
      </MemoryRouter>
    );

    expect(screen.getByText("Dashboard")).toBeInTheDocument();
    expect(screen.getByText("Profile")).toBeInTheDocument();
    expect(screen.queryByText("Home")).not.toBeInTheDocument();
    expect(screen.queryByText("Attending Events")).not.toBeInTheDocument();
  });

  test("renders bottom navigation items", () => {
    render(
      <MemoryRouter>
        <SideBar user={{ role: "Organizer" }} />
      </MemoryRouter>
    );

    expect(screen.getByText("Settings")).toBeInTheDocument();
    expect(screen.getByText("Support")).toBeInTheDocument();
    expect(screen.getByText("Privacy")).toBeInTheDocument();
  });
});
