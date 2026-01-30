import { NavLink } from "react-router-dom";
import "./BottomNav.css";

const BottomNav = () => {
  return (
    <nav className="bottom-nav">
      <NavLink to="/" end>
        🏠
        <span>Home</span>
      </NavLink>

      <NavLink to="/add-service">
        🛠️
        <span>Service</span>
      </NavLink>

      <NavLink to="/add-ro">
        ➕
        <span>New RO</span>
      </NavLink>

      <NavLink to="/amc">
        🔁
        <span>AMC</span>
      </NavLink>

      <NavLink to="/customers">
        👤
        <span>Customers</span>
      </NavLink>
    </nav>
  );
};

export default BottomNav;