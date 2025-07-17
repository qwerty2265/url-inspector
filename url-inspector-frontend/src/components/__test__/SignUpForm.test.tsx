import { describe, it, expect } from 'vitest';
import '@testing-library/jest-dom';
import { render, screen, fireEvent } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import SignUpForm from "../SignUpForm";

describe("SignUpForm", () => {
  it("renders all input fields", () => {
    render(
      <BrowserRouter>
        <SignUpForm />
      </BrowserRouter>
    );
    expect(screen.getByLabelText(/^name$/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/^surname$/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/^email$/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/^password$/i)).toBeInTheDocument();
  });

  it("submit button is disabled when fields are empty", () => {
    render(
      <BrowserRouter>
        <SignUpForm />
      </BrowserRouter>
    );
    const button = screen.getByRole("button", { name: /sign up/i });
    expect(button).toBeDisabled();
  });

  it("submit button is enabled when fields are filled", () => {
    render(
      <BrowserRouter>
        <SignUpForm />
      </BrowserRouter>
    );
    fireEvent.change(screen.getByLabelText(/^name$/i), { target: { value: "TestName" } });
    fireEvent.change(screen.getByLabelText(/^surname$/i), { target: { value: "TestSurname" } });
    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: "test@example.com" } });
    fireEvent.change(screen.getByLabelText(/password/i), { target: { value: "password123" } });
    const button = screen.getByRole("button", { name: /sign up/i });
    expect(button).not.toBeDisabled();
  });
});