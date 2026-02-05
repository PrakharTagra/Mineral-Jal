import { useState } from "react";
import Login from "../Login/login";
import Dashboard from "./pages/dashboard/Dashboard";   // ← this file you sent

function App() {
  const [loggedIn, setLoggedIn] = useState(false);

  return loggedIn
    ? <Dashboard />
    : <Login onLogin={() => setLoggedIn(true)} />;
}

export default App;