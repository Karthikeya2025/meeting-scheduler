import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { LayoutGrid, CalendarDays, LogOut, Video } from 'lucide-react';
import { useAuth } from '../AuthContext';

const navItems = [
  { to: '/spaces', icon: <LayoutGrid size={20} />, label: 'My Spaces' },
  { to: '/calendar', icon: <CalendarDays size={20} />, label: 'My Calendar' },
];

const styles = {
  sidebar: {
    width: '220px',
    minHeight: '100vh',
    background: '#1e2a4a',
    display: 'flex',
    flexDirection: 'column',
    padding: '24px 16px',
    gap: '8px',
    position: 'sticky',
    top: 0,
    height: '100vh',
  },
  logo: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    color: 'white',
    fontWeight: '800',
    fontSize: '1.2rem',
    marginBottom: '32px',
    padding: '0 8px',
  },
  navLink: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '10px 14px',
    borderRadius: '10px',
    color: '#94a3b8',
    textDecoration: 'none',
    fontSize: '0.9rem',
    fontWeight: '500',
  },
  activeLink: {
    background: '#4f6ef7',
    color: 'white',
  },
  logoutBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '10px 14px',
    borderRadius: '10px',
    color: '#94a3b8',
    background: 'transparent',
    border: 'none',
    cursor: 'pointer',
    fontSize: '0.9rem',
    fontWeight: '500',
    width: '100%',
    marginTop: 'auto',
  },
  userCard: {
    background: '#2d3f6b',
    borderRadius: '12px',
    padding: '12px',
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    marginBottom: '24px',
  },
  avatar: {
    width: '36px',
    height: '36px',
    borderRadius: '50%',
    background: '#4f6ef7',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: 'white',
    fontWeight: '700',
    fontSize: '0.9rem',
    flexShrink: 0,
  },
  userName: {
    color: 'white',
    fontWeight: '600',
    fontSize: '0.85rem',
  },
  userRole: {
    color: '#94a3b8',
    fontSize: '0.72rem',
  },
};

export default function Sidebar() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  function handleLogout() {
    logout();
    navigate('/');
  }

  const initials = user?.name
    ? user.name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)
    : '?';

  return (
    <motion.div
      style={styles.sidebar}
      initial={{ x: -220 }}
      animate={{ x: 0 }}
      transition={{ type: 'spring', stiffness: 260, damping: 25 }}
    >
      <div style={styles.logo}>
        <Video size={22} color="#4f6ef7" />
        MeetSpace
      </div>

      <div style={styles.userCard}>
        <div style={styles.avatar}>{initials}</div>
        <div>
          <div style={styles.userName}>{user?.name || 'Guest'}</div>
          <div style={styles.userRole}>Logged in</div>
        </div>
      </div>

      {navItems.map((item) => (
        <NavLink
          key={item.to}
          to={item.to}
          style={({ isActive }) => ({
            ...styles.navLink,
            ...(isActive ? styles.activeLink : {}),
          })}
        >
          {item.icon}
          {item.label}
        </NavLink>
      ))}

      <button style={styles.logoutBtn} onClick={handleLogout}>
        <LogOut size={20} />
        Logout
      </button>
    </motion.div>
  );
}
