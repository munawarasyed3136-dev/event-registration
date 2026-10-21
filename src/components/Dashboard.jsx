import React, { useState, useEffect } from "react";
function Dashboard({ goToRegister }) {
  const [attendees, setAttendees] = useState([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  useEffect(() => {
    let savedAttendees =
      JSON.parse(localStorage.getItem("attendees")) || [];

    setAttendees(savedAttendees);
  }, []);

  
  function cancelRegistration(id) {
    let updatedAttendees = attendees.map((person) => {
      if (person.id === id) {
        return { ...person, status: "Cancelled" };
      }
      return person;
    });

    let confirmedCount = updatedAttendees.filter(
      (person) => person.status === "Confirmed"
    ).length;

    if (confirmedCount < 20) {
      let nextPerson = updatedAttendees.find(
        (person) => person.status === "Waiting"
      );

      if (nextPerson) {
        updatedAttendees = updatedAttendees.map((person) => {
          if (person.id === nextPerson.id) {
            return { ...person, status: "Confirmed" };
          }
          return person;
        });
      }
    }

    setAttendees(updatedAttendees);
    localStorage.setItem("attendees", JSON.stringify(updatedAttendees));
  }

  function exportCSV() {
    let confirmed = attendees.filter(
      (person) => person.status === "Confirmed"
    );

    let csv = "Name,Email,Status\n";

    confirmed.forEach((person) => {
      csv += `"${person.name}","${person.email}","${person.status}"\n`;
    });

    let file = new Blob([csv], { type: "text/csv" });
    let url = URL.createObjectURL(file);

    let link = document.createElement("a");
    link.href = url;
    link.download = "confirmed-attendees.csv";
    link.click();

    URL.revokeObjectURL(url);
  }

  function filterAttendees(person) {
    let matchesSearch =
      person.name.toLowerCase().includes(search.toLowerCase()) ||
      person.email.toLowerCase().includes(search.toLowerCase());

    let matchesFilter =
      filter === "All" || person.status === filter;

    return matchesSearch && matchesFilter;
  }

  let confirmed = attendees.filter(
    (person) => person.status === "Confirmed" && filterAttendees(person)
  );

  let waiting = attendees.filter(
    (person) => person.status === "Waiting" && filterAttendees(person)
  );

  let cancelled = attendees.filter(
    (person) => person.status === "Cancelled" && filterAttendees(person)
  );

  let confirmedCount = attendees.filter(
    (person) => person.status === "Confirmed"
  ).length;

  function showList(list) {
    if (list.length === 0) {
      return <p>No attendees found.</p>;
    }

    return list.map((person) => (
      <div key={person.id} style={personStyle}>
        <div>
          <strong>{person.name}</strong>
          <p style={{ margin: "5px 0" }}>{person.email}</p>
        </div>

        <button
          onClick={() => cancelRegistration(person.id)}
          style={cancelStyle}
        >
          Cancel
        </button>
      </div>
    ));
  }

  return (
    <div style={pageStyle}>
      <h1>Event Registration</h1>
      <br/>
      <h1>Dashboard</h1>
      <p>Total Seats: 20</p>
      <br />
      <p>Confirmed Seats: {confirmedCount} / 20</p>
      <br/>
      <p>Available Seats: {Math.max(0, 20 - confirmedCount)}</p>
      <br />
      <button onClick={exportCSV} style={exportStyle}>
        Export Confirmed List as CSV
      </button>

      <div style={{ margin: "20px 0" }}>
        <input
          type="text"
          placeholder="Search by name or email"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={searchStyle}
        />

        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          style={searchStyle}
        >
          <option value="All">Show All</option>
          <option value="Confirmed">Confirmed</option>
          <option value="Waiting">Waiting List</option>
          <option value="Cancelled">Cancelled</option>
        </select>
      </div>

      <div style={containerStyle}>
        <h2>Confirmed List ({confirmed.length})</h2>
        {showList(confirmed)}
      </div>

      <div style={containerStyle}>
        <h2>Waiting List ({waiting.length})</h2>
        {showList(waiting)}
      </div>

      {filter === "All" || filter === "Cancelled" ? (
        <div style={containerStyle}>
          <h2>Cancelled List ({cancelled.length})</h2>
          {showList(cancelled)}
        </div>
      ) : null}

      <button onClick={goToRegister} style={registerStyle}>
        Register
      </button>
    </div>
  );
}

const pageStyle = {
  padding: "25px",
  maxWidth: "900px",
  margin: "auto",
  fontFamily: "Arial, sans-serif"
};

const containerStyle = {
  border: "1px solid white",
  borderRadius: "8px",
  padding: "15px",
  marginBottom: "20px",
  backgroundColor: "white"
};

const personStyle = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  gap: "10px",
  padding: "10px",
  marginBottom: "10px",
  backgroundColor: "white",
  border: "1px solid white",
  borderRadius: "5px"
};

const searchStyle = {
  padding: "10px",
  marginRight: "10px",
  marginBottom: "10px",
  maxWidth: "100%",
  boxSizing: "border-box"
};

const exportStyle = {
  padding: "10px 15px",
  backgroundColor: "green",
  color: "white",
  border: "none",
  borderRadius: "5px",
  cursor: "pointer"
};

const registerStyle = {
  display: "block",
  margin: "25px auto",
  padding: "12px 25px",
  backgroundColor: "blue",
  color: "white",
  border: "none",
  borderRadius: "5px",
  cursor: "pointer"
};

const cancelStyle = {
  padding: "7px 10px",
  backgroundColor: "red",
  color: "white",
  border: "none",
  borderRadius: "5px",
  cursor: "pointer"
};

export default Dashboard;