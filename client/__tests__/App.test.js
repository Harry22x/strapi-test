import React from "react";
import { render, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import App from "../src/App";

// Mock fetch API
global.fetch = jest.fn();

describe("App Component", () => {
  beforeEach(() => {
    jest.clearAllMocks(); // Reset mocks before each test
    localStorage.setItem("jwt", "test-token"); // Mock valid token
  });

  test("handles failed session check", async () => {
    // Mock failed fetch response
    fetch.mockResolvedValueOnce({
      ok: false,
      json: async () => ({ error: "Invalid token" }),
    });

    render(
      <MemoryRouter>
        <App />
      </MemoryRouter>
    );

    // Wait for fetch to be called
    await waitFor(() => expect(fetch).toHaveBeenCalledTimes(1));
  });
});
