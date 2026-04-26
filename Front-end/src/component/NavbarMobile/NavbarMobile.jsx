import { NavLink } from "react-router-dom";
import "./NavbarMobile.css";
const NavbarMobile = () => {
  return (
    <div className="navMobileLayout bg-light">
      <NavLink to="/home" className="linkUnitStyle active">Home</NavLink>
      <NavLink href="/contact" className="linkUnitStyle">Contact</NavLink>
      <NavLink href="/about" className="linkUnitStyle">About</NavLink>
    </div>
  );
};

export default NavbarMobile;
