import { useState } from "react";
import AppRoutes from "./routes/AppRoutes";
// import Login from "../Login/login";

function App() {
  const [loggedIn, setLoggedIn] = useState(false);

  // if (!loggedIn) {
  //   return <Login onLogin={() => setLoggedIn(true)} />;
  // }

  return <AppRoutes />;
}

export default App;