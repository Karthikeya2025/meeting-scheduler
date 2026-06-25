import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Users, ArrowRight, Loader } from 'lucide-react';
import api from '../api';
import { useAuth } from '../AuthContext';

const styles = {
  page: {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #1e2a4a 0%, #2d3f6b 50%, #1e2a4a 100%)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '20px',
    position: 'relative',
    overflow: 'hidden',
  },
  circle1: {
    position: 'absolute', width: '400px', height: '400px', borderRadius: '50%',
    background: 'rgba(79,110,247,0.08)', top: '-100px', right: '-100px', pointerEvents: 'none',
  },
  circle2: {
    position: 'absolute', width: '300px', height: '300px', borderRadius: '50%',
    background: 'rgba(79,110,247,0.06)', bottom: '-80px', left: '-80px', pointerEvents: 'none',
  },
  card: {
    background: 'white',
    borderRadius: '20px',
    padding: '40px',
    width: '100%',
    maxWidth: '380px',
    boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
    position: 'relative',
    zIndex: 1,
  },
  iconWrap: {
    width: '56px',
    height: '56px',
    borderRadius: '16px',
    background: '#e0e7ff',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: '20px',
  },
  title: {
    fontSize: '1.5rem',
    fontWeight: '800',
    color: '#1a202c',
    marginBottom: '6px',
  },
  subtitle: {
    color: '#718096',
    fontSize: '0.9rem',
    marginBottom: '28px',
    lineHeight: 1.5,
  },
  label: {
    fontSize: '0.82rem',
    fontWeight: '600',
    color: '#4a5568',
    marginBottom: '8px',
    display: 'block',
  },
  input: {
    width: '100%',
    padding: '14px 16px',
    borderRadius: '12px',
    border: '1.5px solid #e2e8f0',
    fontSize: '0.95rem',
    fontFamily: 'Inter, sans-serif',
    outline: 'none',
    marginBottom: '20px',
  },
  btn: {
    width: '100%',
    background: '#4f6ef7',
    color: 'white',
    border: 'none',
    padding: '14px',
    borderRadius: '12px',
    fontSize: '0.95rem',
    fontWeight: '700',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
  },
  error: {
    color: '#ef4444',
    fontSize: '0.82rem',
    marginBottom: '14px',
  },
  note: {
    fontSize: '0.78rem',
    color: '#94a3b8',
    textAlign: 'center',
    marginTop: '18px',
    lineHeight: 1.5,
  },
};

export default function LoginPage() {
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { login } = useAuth();

  async function handleLogin(e) {
    e.preventDefault();
    if (!name.trim()) {
      setError('Please enter your name to continue');
      return;
    }
    setError('');
    setLoading(true);

    try {
      const res = await api.post('/auth/login', { name });
      login(res.data.user);

      // Ask for browser notification permission right after login,
      // since we'll use it to alert about upcoming meetings.
      if (window.Notification && Notification.permission === 'default') {
        Notification.requestPermission();
      }

      navigate('/spaces');
    } catch (err) {
      console.error(err);
      setError('Something went wrong. Is the backend server running?');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={styles.page}>
      <div style={styles.circle1} />
      <div style={styles.circle2} />

      <motion.div
        style={styles.card}
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, type: 'spring', stiffness: 200 }}
      >
        <div style={styles.iconWrap}>
          <Users size={28} color="#4f6ef7" />
        </div>
        <div style={styles.title}>Welcome to MeetSpace</div>
        <div style={styles.subtitle}>
          Enter your name to log in and start scheduling meetings with your team.
        </div>

        <form onSubmit={handleLogin}>
          <label style={styles.label}>Your Name</label>
          <input
            style={styles.input}
            placeholder="e.g. Karthikeya"
            value={name}
            onChange={(e) => setName(e.target.value)}
            autoFocus
          />

          {error && <div style={styles.error}>{error}</div>}

          <motion.button
            type="submit"
            style={styles.btn}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            disabled={loading}
          >
            {loading ? (
              <Loader size={18} className="spin" />
            ) : (
              <>Continue <ArrowRight size={18} /></>
            )}
          </motion.button>
        </form>

        <div style={styles.note}>
          No password needed — just your name. This is a simple identity system for demo purposes.
        </div>
      </motion.div>
    </div>
  );
}
