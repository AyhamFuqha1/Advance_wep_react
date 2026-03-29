import type { SignUpErrors } from "../interfaces/auth";  

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const validateSignUp = (
  fullName: string,
  email: string,
  password: string,
  confirmPassword: string,
  agreed: boolean
): SignUpErrors => {
  const e: SignUpErrors = {};
  if (!fullName.trim()) e.fullName = "Full name is required.";
  if (!email.trim()) e.email = "Email is required.";
  else if (!emailRegex.test(email)) e.email = "Please enter a valid email.";
  if (!password) e.password = "Password is required.";
  else if (password.length < 6) e.password = "Password must be at least 6 characters.";
  if (!confirmPassword) e.confirmPassword = "Please confirm your password.";
  else if (password !== confirmPassword) e.confirmPassword = "Passwords do not match.";
  if (!agreed) e.agreed = "You must agree to the Terms & Conditions.";
  return e;
};

export const validateLogin = (email: string, password: string): boolean => {
  return !!(email && password);
};
