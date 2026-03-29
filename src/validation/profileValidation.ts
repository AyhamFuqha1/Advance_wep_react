import type  { PasswordState } from "../interfaces/profile";

export const validatePassword = (pw: PasswordState): string => {
  if (!pw.current) return "Please enter your current password.";
  if (pw.next.length < 6) return "New password must be at least 6 characters.";
  if (pw.next !== pw.confirm) return "Passwords don't match.";
  return "";
};

export const validateDeleteConfirm = (input: string): boolean => {
  return input.trim().toLowerCase() === "delete";
};
