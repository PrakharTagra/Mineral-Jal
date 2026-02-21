import { useState } from "react";
import AppRoutes from "./routes/AppRoutes";

function App() {
  const [loggedIn, setLoggedIn] = useState(false);
  return <AppRoutes />;
}

export default App;