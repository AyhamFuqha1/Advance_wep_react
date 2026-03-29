import React from "react";
import { type FieldProps } from "../interfaces/profile";

function Field({ label, children }: FieldProps) {
  return (
    <div className="field">
      <label>{label}</label>
      {children}
    </div>
  );
}

export default Field;
