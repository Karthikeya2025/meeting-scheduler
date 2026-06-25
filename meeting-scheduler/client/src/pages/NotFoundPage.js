import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Home, ArrowLeft } from 'lucide-react';

const styles = {
  page: {
    minHeight: '100vh', display: 'flex', flexDirection: 'column',
    alignItems: 'center', justifyContent: 'center', background: '#f0f4f8',
    textAlign: 'center', padding: '40px',
  },
  bigNumber: { fontSize: '9rem', fontWeight: '800', color: '#e2e8f0', lineHeight: 1, marginBottom: '8px', userSelect: 'none' },
  title: { fontSize: '1.8rem', fontWeight: '700', color: '#1a202c', marginBottom: '12px' },
  subtext: { color: '#718096', fontSize: '1rem', maxWidth: '380px', lineHeight: 1.6, marginBottom: '36px' },
  btnsRow: { display: 'flex', gap: '14px', justifyContent: 'center' },
  primaryBtn: {
    display: 'inline-flex', alignItems: 'center', gap: '8px',
    background: '#4f6ef7', color: 'white', border: 'none',
    padding: '12px 24px', borderRadius: '12px', fontSize: '0.92rem', fontWeight: '600', cursor: 'pointer',
  },
  secondaryBtn: {
    display: 'inline-flex', alignItems: 'center', gap: '8px',
    background: 'white', color: '#4a5568', border: '1.5px solid #e2e8f0',
    padding: '12px 24px', borderRadius: '12px', fontSize: '0.92rem', fontWeight: '600', cursor: 'pointer',
  },
};

export default function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <div style={styles.page}>
      <motion.div style={styles.bigNumber} initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 200, damping: 15 }}>
        404
      </motion.div>

      <motion.div style={{ fontSize: '4rem', marginBottom: '20px' }}
        animate={{ y: [0, -14, 0] }} transition={{ repeat: Infinity, duration: 2.5, ease: 'easeInOut' }}>
        🔍
      </motion.div>

      <motion.div style={styles.title} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}>
        Page Not Found
      </motion.div>

      <motion.p style={styles.subtext} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}>
        Looks like this page doesn't exist or was moved. Let's get you back to safety!
      </motion.p>

      <motion.div style={styles.btnsRow} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.45 }}>
        <motion.button style={styles.primaryBtn} onClick={() => navigate('/spaces')}
          whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }}>
          <Home size={17} /> Go to My Spaces
        </motion.button>
        <motion.button style={styles.secondaryBtn} onClick={() => navigate(-1)}
          whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }}>
          <ArrowLeft size={17} /> Go Back
        </motion.button>
      </motion.div>
    </div>
  );
}
