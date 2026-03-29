import React from "react";

export interface PasswordState {
  current: string;
  next: string;
  confirm: string;
}

export interface FieldProps {
  label: string;
  children: React.ReactNode;
}