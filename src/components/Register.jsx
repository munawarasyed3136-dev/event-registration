
import React, { useState } from "react";

function Register({ goToDashboard }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  function handleRegister(e) {
    e.preventDefault();

    let attendees = JSON.parse(localStorage.getItem("attendees")) || [];

    let alreadyRegistered = attendees.some(
      (person) =>
        person.email.toLowerCase() === email.trim().toLowerCase() &&
        person.status !== "Cancelled"
    );

    if (alreadyRegistered) {
      alert("This email is already registered!");
      return;
    }

    let confirmedCount = attendees.filter(
      (person) => person.status === "Confirmed"
    ).length;

    let status = "Waiting";

    if (confirmedCount < 20) {
      status = "Confirmed";
    }

    let newAttendee = {
      id: Date.now(),
      name: name.trim(),
      email: email.trim(),
      status: status
    };

    attendees.push(newAttendee);

    localStorage.setItem("attendees", JSON.stringify(attendees));

    alert("Registration successful! Status: " + status);

    setName("");
    setEmail("");

    goToDashboard();
  }

  return (
    <div style={{ padding: "30px", maxWidth: "500px", margin: "auto" }}>
      <h2>Event Registration</h2>

      <form onSubmit={handleRegister}>
        <label>Name</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter your name"
          required
          style={inputStyle}
        />

        <label>Email</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email"
          required
          style={inputStyle}
        />

        <button type="submit" style={buttonStyle}>
          Submit Registration
        </button>
      </form>

      <button
        onClick={goToDashboard}
        style={{ ...buttonStyle, backgroundColor: "#666" }}
      >
        Back to Dashboard
      </button>
    </div>
  );
}

const inputStyle = {
  display: "block",
  width: "100%",
  padding: "10px",
  marginTop: "8px",
  marginBottom: "18px",
  boxSizing: "border-box"
};

const buttonStyle = {
  padding: "10px 16px",
  marginRight: "10px",
  marginBottom: "10px",
  border: "none",
  borderRadius: "5px",
  backgroundColor: "#2563eb",
  color: "white",
  cursor: "pointer"
};

export default Register;
