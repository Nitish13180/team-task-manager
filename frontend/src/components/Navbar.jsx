import { Link, useNavigate } from 'react-router-dom';
import './Navbar.css';

export default function Navbar() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="nav-brand">📋 TaskManager</div>
      <div className="nav-links">
        <Link to="/">Dashboard</Link>
        <Link to="/projects">Projects</Link>
        <Link to="/tasks">Tasks</Link>
      </div>
      <div className="nav-user">
        <span className={`role-badge ${user.role}`}>{user.role}</span>
        <span className="user-name">{user.name}</span>
        <button onClick={logout}>Logout</button>
      </div>
    </nav>
  );
}
