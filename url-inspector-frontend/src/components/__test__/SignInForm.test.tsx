import { describe, it, expect } from 'vitest';
import '@testing-library/jest-dom';
import { render, screen, fireEvent } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import SignInForm from "../SignInForm";

describe("SignInForm", () => {
  it("renders email and password fields", () => {
    render(
      <BrowserRouter>
        <SignInForm />
      </BrowserRouter>
    );
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
  });

  it("submit button is disabled when fields are empty", () => {
    render(
      <BrowserRouter>
        <SignInForm />
      </BrowserRouter>
    );
    const button = screen.getByRole("button", { name: /sign in/i });
    expect(button).toBeDisabled();
  });

  it("submit button is enabled when fields are filled", () => {
    render(
      <BrowserRouter>
        <SignInForm />
      </BrowserRouter>
    );
    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: "test@example.com" } });
    fireEvent.change(screen.getByLabelText(/password/i), { target: { value: "password123" } });
    const button = screen.getByRole("button", { name: /sign in/i });
    expect(button).not.toBeDisabled();
  });
});