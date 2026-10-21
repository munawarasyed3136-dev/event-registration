
import React, { useState } from "react";
import Dashboard from "./components/Dashboard";
import Register from "./components/Register";

function App() {
  const [page, setPage] = useState("dashboard");

  return (
    <div>
      {page === "dashboard" ? (
        <Dashboard goToRegister={() => setPage("register")} />
      ) : (
        <Register goToDashboard={() => setPage("dashboard")} />
      )}
    </div>
  );
}

export default App;