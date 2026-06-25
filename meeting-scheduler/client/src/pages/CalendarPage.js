import React, { useState, useEffect } from 'react';
import Calendar from 'react-calendar';
import { motion, AnimatePresence } from 'framer-motion';
import { CalendarDays, Clock, Users as UsersIcon, User } from 'lucide-react';
import PageWrapper from '../components/PageWrapper';
import api from '../api';
import { useAuth } from '../AuthContext';

const styles = {
  pageTitle: { fontSize: '1.6rem', fontWeight: '800', color: '#1a202c', marginBottom: '6px' },
  pageSubtitle: { color: '#718096', fontSize: '0.92rem', marginBottom: '28px' },
  layout: { display: 'grid', gridTemplateColumns: '380px 1fr', gap: '24px' },
  calCard: { background: 'white', borderRadius: '16px', padding: '24px', boxShadow: '0 2px 12px rgba(0,0,0,0.06)' },
  rightCard: { background: 'white', borderRadius: '16px', padding: '24px', boxShadow: '0 2px 12px rgba(0,0,0,0.06)' },
  sectionTitle: { fontWeight: '700', fontSize: '1rem', color: '#1a202c', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' },
  meetingCard: { borderRadius: '14px', padding: '16px 18px', boxShadow: '0 2px 12px rgba(0,0,0,0.06)', borderLeft: '4px solid #4f6ef7', marginBottom: '12px', background: 'white' },
  meetingTitle: { fontWeight: '700', fontSize: '0.92rem', color: '#1a202c', marginBottom: '8px' },
  meetingMeta: { display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem', color: '#718096', marginBottom: '4px' },
  spaceTag: {
    display: 'inline-block', fontSize: '0.7rem', fontWeight: '700',
    background: '#e0e7ff', color: '#4f6ef7', padding: '2px 10px', borderRadius: '12px', marginBottom: '8px',
  },
  noMeetings: { color: '#94a3b8', fontSize: '0.9rem', padding: '30px 0', textAlign: 'center' },
};

function toKey(date) {
  return date.toISOString().split('T')[0];
}

export default function CalendarPage() {
  const { user } = useAuth();
  const [meetings, setMeetings] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());

  useEffect(() => {
    fetchMeetings();
    // Re-fetch meetings every 60s so newly scheduled meetings from teammates show up too
    const interval = setInterval(fetchMeetings, 60000);
    return () => clearInterval(interval);
  }, []);

  async function fetchMeetings() {
    if (!user) return;
    try {
      const res = await api.get(`/meetings/user/${user._id}`);
      setMeetings(res.data.meetings);
    } catch (err) {
      console.error(err);
    }
  }

  function hasMeeting(date) {
    const key = toKey(date);
    return meetings.some((m) => toKey(new Date(m.dateTime)) === key);
  }

  const dayMeetings = meetings.filter((m) => toKey(new Date(m.dateTime)) === toKey(selectedDate));

  return (
    <PageWrapper>
      <div style={styles.pageTitle}>My Calendar</div>
      <div style={styles.pageSubtitle}>All meetings across every space you've joined</div>

      <div style={styles.layout}>
        <motion.div style={styles.calCard} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
          <Calendar
            onChange={setSelectedDate}
            value={selectedDate}
            tileContent={({ date, view }) =>
              view === 'month' && hasMeeting(date) ? (
                <div style={{ display: 'flex', justifyContent: 'center', marginTop: '2px' }}>
                  <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#4f6ef7' }} />
                </div>
              ) : null
            }
          />
        </motion.div>

        <motion.div style={styles.rightCard} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
          <div style={styles.sectionTitle}>
            <CalendarDays size={18} color="#4f6ef7" />
            {selectedDate.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
          </div>

          <AnimatePresence>
            {dayMeetings.length === 0 ? (
              <div style={styles.noMeetings}>No meetings scheduled for this day.</div>
            ) : (
              dayMeetings.map((m, i) => (
                <motion.div
                  key={m._id}
                  style={styles.meetingCard}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.07 }}
                >
                  <div style={styles.spaceTag}>{m.space?.name}</div>
                  <div style={styles.meetingTitle}>{m.title}</div>
                  <div style={styles.meetingMeta}>
                    <Clock size={13} /> {new Date(m.dateTime).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })} · {m.duration} min
                  </div>
                  <div style={styles.meetingMeta}>
                    <User size={13} /> Scheduled by {m.scheduledBy?.name}
                  </div>
                </motion.div>
              ))
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </PageWrapper>
  );
}
