import React from "react";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import EventCard from "../src/components/EventCard"; // Adjust path if needed

describe("EventCard Component", () => {
  const mockEvent = {
    id: 1,
    name: "Sample Event",
    date: "2024-03-10",
    time: "7:00 PM",
    image: "https://example.com/sample.jpg",
  };

  test("renders event details correctly", () => {
    render(
      <MemoryRouter>
        <EventCard {...mockEvent} />
      </MemoryRouter>
    );

    // Check event name
    expect(screen.getByText(mockEvent.name)).toBeInTheDocument();

    // Check event time
    expect(screen.getByText(/Sun Mar 10 2024\s*-\s*7:00 PM/i)).toBeInTheDocument();


    // Check formatted date
    expect(screen.getByText("Sun Mar 10 2024 - 7:00 PM")).toBeInTheDocument();

    // Check event image
    const img = screen.getByAltText(mockEvent.name);
    expect(img).toBeInTheDocument();
    expect(img.src).toBe(mockEvent.image);
  });

  test("contains correct link to event details", () => {
    render(
      <MemoryRouter>
        <EventCard {...mockEvent} />
      </MemoryRouter>
    );

    const link = screen.getByRole("link");
    expect(link).toHaveAttribute("href", `/events/${mockEvent.id}`);
  });
});
