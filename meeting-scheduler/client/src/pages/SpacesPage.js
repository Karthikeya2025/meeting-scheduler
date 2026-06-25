import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, LogIn, Users, Copy, Check, X, ArrowRight } from 'lucide-react';
import PageWrapper from '../components/PageWrapper';
import api from '../api';
import { useAuth } from '../AuthContext';

const styles = {
  pageTitle: { fontSize: '1.6rem', fontWeight: '800', color: '#1a202c', marginBottom: '6px' },
  pageSubtitle: { color: '#718096', fontSize: '0.92rem', marginBottom: '28px' },
  actionsRow: { display: 'flex', gap: '14px', marginBottom: '32px', flexWrap: 'wrap' },
  actionCard: {
    background: 'white', borderRadius: '16px', padding: '22px',
    boxShadow: '0 2px 12px rgba(0,0,0,0.06)', flex: 1, minWidth: '220px',
    cursor: 'pointer', border: '1.5px solid transparent',
  },
  actionIcon: {
    width: '44px', height: '44px', borderRadius: '12px',
    display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '12px',
  },
  actionTitle: { fontWeight: '700', fontSize: '0.98rem', color: '#1a202c', marginBottom: '4px' },
  actionDesc: { fontSize: '0.82rem', color: '#718096' },
  sectionTitle: { fontWeight: '700', fontSize: '1.05rem', color: '#1a202c', marginBottom: '16px' },
  spacesGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '16px' },
  spaceCard: {
    background: 'white', borderRadius: '16px', padding: '20px',
    boxShadow: '0 2px 12px rgba(0,0,0,0.06)', cursor: 'pointer',
  },
  spaceName: { fontWeight: '700', fontSize: '1rem', color: '#1a202c', marginBottom: '8px' },
  spaceMeta: { display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem', color: '#718096', marginBottom: '10px' },
  codeRow: {
    display: 'flex', alignItems: 'center', gap: '8px',
    background: '#f0f4f8', borderRadius: '10px', padding: '8px 12px',
    fontSize: '0.82rem', fontWeight: '700', color: '#4f6ef7', letterSpacing: '0.05em',
  },
  emptyState: { textAlign: 'center', color: '#94a3b8', padding: '50px 20px', fontSize: '0.95rem' },
  modal: {
    position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)',
    display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000,
  },
  modalCard: {
    background: 'white', borderRadius: '18px', padding: '28px',
    width: '400px', boxShadow: '0 20px 60px rgba(0,0,0,0.15)',
  },
  modalTitle: { fontWeight: '700', fontSize: '1.1rem', color: '#1a202c', marginBottom: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  input: {
    width: '100%', padding: '12px 16px', borderRadius: '10px',
    border: '1.5px solid #e2e8f0', fontSize: '0.92rem', marginBottom: '16px',
    outline: 'none', fontFamily: 'Inter, sans-serif',
  },
  saveBtn: {
    width: '100%', background: '#4f6ef7', color: 'white', border: 'none',
    padding: '13px', borderRadius: '10px', fontWeight: '700', fontSize: '0.95rem',
    cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
  },
  errorText: { color: '#ef4444', fontSize: '0.82rem', marginBottom: '12px' },
};

export default function SpacesPage() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [spaces, setSpaces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showJoinModal, setShowJoinModal] = useState(false);
  const [spaceName, setSpaceName] = useState('');
  const [joinCode, setJoinCode] = useState('');
  const [error, setError] = useState('');
  const [copiedCode, setCopiedCode] = useState(null);

  useEffect(() => {
    fetchSpaces();
  }, []);

  async function fetchSpaces() {
    if (!user) return;
    setLoading(true);
    try {
      const res = await api.get(`/spaces/user/${user._id}`);
      setSpaces(res.data.spaces);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  async function handleCreateSpace() {
    if (!spaceName.trim()) {
      setError('Please enter a space name');
      return;
    }
    try {
      await api.post('/spaces/create', { name: spaceName, userId: user._id });
      setSpaceName('');
      setError('');
      setShowCreateModal(false);
      fetchSpaces();
    } catch (err) {
      setError('Could not create space. Try again.');
    }
  }

  async function handleJoinSpace() {
    if (!joinCode.trim()) {
      setError('Please enter a join code');
      return;
    }
    try {
      await api.post('/spaces/join', { code: joinCode, userId: user._id });
      setJoinCode('');
      setError('');
      setShowJoinModal(false);
      fetchSpaces();
    } catch (err) {
      setError(err.response?.data?.message || 'Could not join space.');
    }
  }

  function copyCode(code, e) {
    e.stopPropagation();
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 1500);
  }

  return (
    <PageWrapper>
      <div style={styles.pageTitle}>My Meeting Spaces</div>
      <div style={styles.pageSubtitle}>Create a space for your team, or join one with a code</div>

      {/* Action cards */}
      <div style={styles.actionsRow}>
        <motion.div
          style={styles.actionCard}
          whileHover={{ y: -4, boxShadow: '0 8px 24px rgba(0,0,0,0.1)' }}
          onClick={() => setShowCreateModal(true)}
        >
          <div style={{ ...styles.actionIcon, background: '#e0e7ff' }}>
            <Plus size={22} color="#4f6ef7" />
          </div>
          <div style={styles.actionTitle}>Create a Meeting Space</div>
          <div style={styles.actionDesc}>Start a new space for your team and invite others with a code</div>
        </motion.div>

        <motion.div
          style={styles.actionCard}
          whileHover={{ y: -4, boxShadow: '0 8px 24px rgba(0,0,0,0.1)' }}
          onClick={() => setShowJoinModal(true)}
        >
          <div style={{ ...styles.actionIcon, background: '#d1fae5' }}>
            <LogIn size={22} color="#10b981" />
          </div>
          <div style={styles.actionTitle}>Join a Meeting Space</div>
          <div style={styles.actionDesc}>Already have a code? Join your team's existing space</div>
        </motion.div>
      </div>

      {/* Spaces list */}
      <div style={styles.sectionTitle}>Your Spaces</div>

      {loading ? (
        <div style={styles.emptyState}>Loading your spaces...</div>
      ) : spaces.length === 0 ? (
        <div style={styles.emptyState}>
          <Users size={40} color="#cbd5e0" style={{ marginBottom: '12px' }} />
          <div>You haven't joined any spaces yet. Create or join one above!</div>
        </div>
      ) : (
        <div style={styles.spacesGrid}>
          {spaces.map((space, i) => (
            <motion.div
              key={space._id}
              style={styles.spaceCard}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06 }}
              whileHover={{ y: -4, boxShadow: '0 8px 24px rgba(0,0,0,0.1)' }}
              onClick={() => navigate(`/spaces/${space._id}`)}
            >
              <div style={styles.spaceName}>{space.name}</div>
              <div style={styles.spaceMeta}>
                <Users size={14} /> {space.members.length} member{space.members.length !== 1 ? 's' : ''}
              </div>
              <div style={styles.codeRow}>
                {space.code}
                <button
                  onClick={(e) => copyCode(space.code, e)}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', marginLeft: 'auto', color: '#4f6ef7' }}
                >
                  {copiedCode === space.code ? <Check size={15} /> : <Copy size={15} />}
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Create Modal */}
      <AnimatePresence>
        {showCreateModal && (
          <motion.div style={styles.modal} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={() => setShowCreateModal(false)}>
            <motion.div style={styles.modalCard} initial={{ scale: 0.85, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.85, opacity: 0 }} onClick={(e) => e.stopPropagation()}>
              <div style={styles.modalTitle}>
                Create a Space
                <button onClick={() => setShowCreateModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#718096' }}>
                  <X size={20} />
                </button>
              </div>
              <input
                style={styles.input}
                placeholder="e.g. Engineering Team"
                value={spaceName}
                onChange={(e) => setSpaceName(e.target.value)}
                autoFocus
              />
              {error && <div style={styles.errorText}>{error}</div>}
              <button style={styles.saveBtn} onClick={handleCreateSpace}>
                Create Space <ArrowRight size={16} />
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Join Modal */}
      <AnimatePresence>
        {showJoinModal && (
          <motion.div style={styles.modal} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={() => setShowJoinModal(false)}>
            <motion.div style={styles.modalCard} initial={{ scale: 0.85, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.85, opacity: 0 }} onClick={(e) => e.stopPropagation()}>
              <div style={styles.modalTitle}>
                Join a Space
                <button onClick={() => setShowJoinModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#718096' }}>
                  <X size={20} />
                </button>
              </div>
              <input
                style={styles.input}
                placeholder="Enter join code e.g. A1B2C3"
                value={joinCode}
                onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
                autoFocus
              />
              {error && <div style={styles.errorText}>{error}</div>}
              <button style={styles.saveBtn} onClick={handleJoinSpace}>
                Join Space <ArrowRight size={16} />
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </PageWrapper>
  );
}
