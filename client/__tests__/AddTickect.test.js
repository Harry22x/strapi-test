import React from "react";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import AddTicket from "../src/Pages/AddTicket";

describe("AddTicket Component", () => {
  test("renders correctly", () => {
    render(
      <MemoryRouter>
        <AddTicket />
      </MemoryRouter>
    );

    expect(screen.getByText("Create Your Own Event")).toBeInTheDocument();
    expect(screen.getByText(/organize a music concert/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /create event/i })).toBeInTheDocument();
  });

  test("button links to /create-event", () => {
    render(
      <MemoryRouter>
        <AddTicket />
      </MemoryRouter>
    );

    const link = screen.getByRole("link", { name: /create event/i });
    expect(link).toHaveAttribute("href", "/create-event");
  });

  test("renders the event creation image", () => {
    render(
      <MemoryRouter>
        <AddTicket />
      </MemoryRouter>
    );

    const image = screen.getByRole("img", { name: /illustration of event creation process/i });
    expect(image).toBeInTheDocument();
  });
});
