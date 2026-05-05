import { NavLink } from 'react-router-dom';
import { Home, Compass, Library, User } from 'lucide-react';
import './BottomNav.css';

const BottomNav = () => {
  return (
    <nav className="bottom-nav glass">
      <NavLink to="/" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
        <Home size={24} />
        <span>Ana Sayfa</span>
      </NavLink>
      <NavLink to="/explore" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
        <Compass size={24} />
        <span>Keşfet</span>
      </NavLink>
      <NavLink to="/library" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
        <Library size={24} />
        <span>Kütüphane</span>
      </NavLink>
      <NavLink to="/profile" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
        <User size={24} />
        <span>Profil</span>
      </NavLink>
    </nav>
  );
};

export default BottomNav;
