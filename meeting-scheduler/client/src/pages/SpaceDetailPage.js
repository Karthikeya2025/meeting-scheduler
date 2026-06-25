import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Plus, Clock, Calendar as CalendarIcon, User, Trash2, Copy, Check, X } from 'lucide-react';
import PageWrapper from '../components/PageWrapper';
import api from '../api';
import { useAuth } from '../AuthContext';

const styles = {
  backBtn: {
    display: 'flex', alignItems: 'center', gap: '6px',
    background: 'none', border: 'none', color: '#718096',
    fontSize: '0.88rem', fontWeight: '600', cursor: 'pointer', marginBottom: '20px', padding: 0,
  },
  headerRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px', flexWrap: 'wrap', gap: '12px' },
  pageTitle: { fontSize: '1.6rem', fontWeight: '800', color: '#1a202c' },
  codeBox: {
    display: 'flex', alignItems: 'center', gap: '8px',
    background: 'white', borderRadius: '10px', padding: '8px 14px',
    fontSize: '0.85rem', fontWeight: '700', color: '#4f6ef7', letterSpacing: '0.05em',
    boxShadow: '0 2px 10px rgba(0,0,0,0.06)',
  },
  membersRow: { display: 'flex', gap: '8px', marginBottom: '28px', flexWrap: 'wrap' },
  memberChip: {
    display: 'flex', alignItems: 'center', gap: '6px',
    background: 'white', borderRadius: '20px', padding: '6px 14px',
    fontSize: '0.8rem', color: '#4a5568', fontWeight: '600',
    boxShadow: '0 1px 6px rgba(0,0,0,0.06)',
  },
  scheduleBtn: {
    display: 'flex', alignItems: 'center', gap: '8px',
    background: '#4f6ef7', color: 'white', border: 'none',
    padding: '12px 22px', borderRadius: '12px', fontSize: '0.9rem',
    fontWeight: '700', cursor: 'pointer', marginBottom: '24px',
  },
  meetingCard: {
    background: 'white', borderRadius: '14px', padding: '18px 20px',
    boxShadow: '0 2px 12px rgba(0,0,0,0.06)', marginBottom: '12px',
    display: 'flex', alignItems: 'center', gap: '16px', borderLeft: '4px solid #4f6ef7',
  },
  meetingDate: {
    display: 'flex', flexDirection: 'column', alignItems: 'center',
    background: '#e0e7ff', borderRadius: '10px', padding: '8px 14px', minWidth: '56px',
  },
  dateNum: { fontSize: '1.1rem', fontWeight: '800', color: '#4f6ef7' },
  dateMonth: { fontSize: '0.68rem', fontWeight: '700', color: '#4f6ef7', textTransform: 'uppercase' },
  meetingTitle: { fontWeight: '700', fontSize: '0.95rem', color: '#1a202c', marginBottom: '4px' },
  meetingMeta: { display: 'flex', alignItems: 'center', gap: '14px', fontSize: '0.8rem', color: '#718096' },
  metaItem: { display: 'flex', alignItems: 'center', gap: '4px' },
  emptyState: { textAlign: 'center', color: '#94a3b8', padding: '40px 20px', fontSize: '0.95rem' },
  modal: {
    position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)',
    display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000,
  },
  modalCard: {
    background: 'white', borderRadius: '18px', padding: '28px',
    width: '420px', boxShadow: '0 20px 60px rgba(0,0,0,0.15)',
  },
  modalTitle: { fontWeight: '700', fontSize: '1.1rem', color: '#1a202c', marginBottom: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  label: { fontSize: '0.8rem', fontWeight: '600', color: '#4a5568', marginBottom: '4px', display: 'block' },
  input: {
    width: '100%', padding: '11px 14px', borderRadius: '10px',
    border: '1.5px solid #e2e8f0', fontSize: '0.9rem', marginBottom: '14px',
    outline: 'none', fontFamily: 'Inter, sans-serif',
  },
  row2: { display: 'flex', gap: '12px' },
  saveBtn: {
    width: '100%', background: '#4f6ef7', color: 'white', border: 'none',
    padding: '13px', borderRadius: '10px', fontWeight: '700', fontSize: '0.95rem',
    cursor: 'pointer', marginTop: '6px',
  },
  errorText: { color: '#ef4444', fontSize: '0.82rem', marginBottom: '10px' },
};

export default function SpaceDetailPage() {
  const { spaceId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [space, setSpace] = useState(null);
  const [meetings, setMeetings] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState('');

  const [form, setForm] = useState({ title: '', description: '', date: '', time: '', duration: 30 });

  useEffect(() => {
    fetchSpace();
    fetchMeetings();
  }, [spaceId]);

  async function fetchSpace() {
    try {
      const res = await api.get(`/spaces/${spaceId}`);
      setSpace(res.data.space);
    } catch (err) {
      console.error(err);
    }
  }

  async function fetchMeetings() {
    try {
      const res = await api.get(`/meetings/space/${spaceId}`);
      setMeetings(res.data.meetings);
    } catch (err) {
      console.error(err);
    }
  }

  async function handleSchedule() {
    if (!form.title.trim() || !form.date || !form.time) {
      setError('Please fill in title, date, and time');
      return;
    }
    const dateTime = new Date(`${form.date}T${form.time}`);

    try {
      await api.post('/meetings/create', {
        title: form.title,
        description: form.description,
        spaceId,
        scheduledBy: user._id,
        dateTime: dateTime.toISOString(),
        duration: Number(form.duration),
      });
      setForm({ title: '', description: '', date: '', time: '', duration: 30 });
      setError('');
      setShowModal(false);
      fetchMeetings();
    } catch (err) {
      setError('Could not schedule meeting. Try again.');
    }
  }

  async function handleDelete(meetingId) {
    try {
      await api.delete(`/meetings/${meetingId}`);
      fetchMeetings();
    } catch (err) {
      console.error(err);
    }
  }

  function copyCode() {
    navigator.clipboard.writeText(space.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  if (!space) {
    return (
      <PageWrapper>
        <div style={styles.emptyState}>Loading space...</div>
      </PageWrapper>
    );
  }

  return (
    <PageWrapper>
      <button style={styles.backBtn} onClick={() => navigate('/spaces')}>
        <ArrowLeft size={16} /> Back to Spaces
      </button>

      <div style={styles.headerRow}>
        <div style={styles.pageTitle}>{space.name}</div>
        <div style={styles.codeBox} onClick={copyCode} title="Click to copy join code" role="button">
          {space.code}
          {copied ? <Check size={15} /> : <Copy size={15} />}
        </div>
      </div>

      <div style={styles.membersRow}>
        {space.members.map((m) => (
          <div key={m._id} style={styles.memberChip}>
            <User size={13} /> {m.name}
          </div>
        ))}
      </div>

      <motion.button style={styles.scheduleBtn} onClick={() => setShowModal(true)}
        whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
        <Plus size={17} /> Schedule a Meeting
      </motion.button>

      <AnimatePresence>
        {meetings.length === 0 ? (
          <div style={styles.emptyState}>
            <CalendarIcon size={36} color="#cbd5e0" style={{ marginBottom: '10px' }} />
            <div>No meetings scheduled yet. Click "Schedule a Meeting" above.</div>
          </div>
        ) : (
          meetings.map((meeting, i) => {
            const d = new Date(meeting.dateTime);
            return (
              <motion.div
                key={meeting._id}
                style={styles.meetingCard}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -30 }}
                transition={{ delay: i * 0.06 }}
              >
                <div style={styles.meetingDate}>
                  <div style={styles.dateNum}>{d.getDate()}</div>
                  <div style={styles.dateMonth}>{d.toLocaleString('en-US', { month: 'short' })}</div>
                </div>
                <div style={{ flex: 1 }}>
                  <div style={styles.meetingTitle}>{meeting.title}</div>
                  <div style={styles.meetingMeta}>
                    <span style={styles.metaItem}>
                      <Clock size={13} /> {d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })} · {meeting.duration} min
                    </span>
                    <span style={styles.metaItem}>
                      <User size={13} /> {meeting.scheduledBy?.name}
                    </span>
                  </div>
                </div>
                <button onClick={() => handleDelete(meeting._id)}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#f87171' }}>
                  <Trash2 size={17} />
                </button>
              </motion.div>
            );
          })
        )}
      </AnimatePresence>

      {/* Schedule Meeting Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div style={styles.modal} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={() => setShowModal(false)}>
            <motion.div style={styles.modalCard} initial={{ scale: 0.85, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.85, opacity: 0 }} onClick={(e) => e.stopPropagation()}>
              <div style={styles.modalTitle}>
                Schedule a Meeting
                <button onClick={() => setShowModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#718096' }}>
                  <X size={20} />
                </button>
              </div>

              <label style={styles.label}>Meeting Title *</label>
              <input style={styles.input} placeholder="e.g. Sprint Planning" value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })} />

              <label style={styles.label}>Description</label>
              <input style={styles.input} placeholder="Optional notes" value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })} />

              <div style={styles.row2}>
                <div style={{ flex: 1 }}>
                  <label style={styles.label}>Date *</label>
                  <input style={styles.input} type="date" value={form.date}
                    onChange={(e) => setForm({ ...form, date: e.target.value })} />
                </div>
                <div style={{ flex: 1 }}>
                  <label style={styles.label}>Time *</label>
                  <input style={styles.input} type="time" value={form.time}
                    onChange={(e) => setForm({ ...form, time: e.target.value })} />
                </div>
              </div>

              <label style={styles.label}>Duration (minutes)</label>
              <input style={styles.input} type="number" min="5" step="5" value={form.duration}
                onChange={(e) => setForm({ ...form, duration: e.target.value })} />

              {error && <div style={styles.errorText}>{error}</div>}

              <button style={styles.saveBtn} onClick={handleSchedule}>Schedule Meeting</button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </PageWrapper>
  );
}
