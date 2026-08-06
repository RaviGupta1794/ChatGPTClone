import React from "react";
import "./alert.css";

export default function Alert({ type, message }) {

  if (!message) return null;

  return (
    <div className={`alert ${type}`}>
      {message}
    </div>
  );
}