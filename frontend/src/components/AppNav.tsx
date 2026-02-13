import { NavLink } from 'react-router-dom';
import '../styles/AppNav.css';
import '../styles/App.css';

export default function AppNav() {
  return (
    <nav className="app-nav">
      <div className="app-nav__brand">
        <h1 className="app-nav__title">Per-Unit Pricing Stigg Example</h1>
      </div>
      <div className="app-nav__links">
        <NavLink to="/" end className={({ isActive }) => isActive ? 'app-nav__link app-nav__link--active' : 'app-nav__link'}>
          Templates
        </NavLink>
        <NavLink to="/analytics" className={({ isActive }) => isActive ? 'app-nav__link app-nav__link--active' : 'app-nav__link'}>
          Analytics
        </NavLink>
      </div>
    </nav>
  );
}
