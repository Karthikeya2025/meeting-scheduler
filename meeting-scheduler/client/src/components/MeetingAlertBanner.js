import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, X } from 'lucide-react';

const styles = {
  banner: {
    position: 'fixed',
    top: '20px',
    right: '20px',
    background: 'linear-gradient(135deg, #4f6ef7, #6b8fff)',
    color: 'white',
    borderRadius: '16px',
    padding: '18px 22px',
    boxShadow: '0 12px 32px rgba(79,110,247,0.4)',
    zIndex: 2000,
    display: 'flex',
    alignItems: 'flex-start',
    gap: '14px',
    minWidth: '300px',
    maxWidth: '360px',
  },
  iconWrap: {
    width: '36px',
    height: '36px',
    borderRadius: '50%',
    background: 'rgba(255,255,255,0.2)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  title: {
    fontWeight: '700',
    fontSize: '0.92rem',
    marginBottom: '4px',
  },
  text: {
    fontSize: '0.82rem',
    opacity: 0.9,
    lineHeight: 1.4,
  },
  closeBtn: {
    background: 'none',
    border: 'none',
    color: 'white',
    cursor: 'pointer',
    opacity: 0.8,
    flexShrink: 0,
  },
};

export default function MeetingAlertBanner({ meeting, onDismiss }) {
  return (
    <AnimatePresence>
      {meeting && (
        <motion.div
          style={styles.banner}
          initial={{ opacity: 0, x: 80, scale: 0.9 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          exit={{ opacity: 0, x: 80, scale: 0.9 }}
          transition={{ type: 'spring', stiffness: 260, damping: 22 }}
        >
          <motion.div
            style={styles.iconWrap}
            animate={{ scale: [1, 1.15, 1] }}
            transition={{ repeat: Infinity, duration: 1.2 }}
          >
            <Bell size={18} />
          </motion.div>
          <div style={{ flex: 1 }}>
            <div style={styles.title}>Meeting starting soon!</div>
            <div style={styles.text}>
              "{meeting.title}" starts at{' '}
              {new Date(meeting.dateTime).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
            </div>
          </div>
          <button style={styles.closeBtn} onClick={onDismiss}>
            <X size={16} />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
