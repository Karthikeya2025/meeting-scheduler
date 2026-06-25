import React, { useState, useEffect } from 'react';
import api from '../api';
import { useAuth } from '../AuthContext';
import useMeetingNotifications from '../hooks/useMeetingNotifications';
import MeetingAlertBanner from './MeetingAlertBanner';

// This component does ONE job: keep checking for upcoming meetings
// and show the alert banner, no matter which page the user is on.
// It's rendered once at the top level (in App.js) instead of inside
// CalendarPage, so it stays active across the whole app.
export default function GlobalNotificationWatcher() {
  const { user } = useAuth();
  const [meetings, setMeetings] = useState([]);

  useEffect(() => {
    if (!user) return; // don't fetch anything if nobody is logged in yet

    fetchMeetings();
    // Re-fetch every 60s so newly scheduled meetings (by anyone in the space) show up
    const interval = setInterval(fetchMeetings, 60000);
    return () => clearInterval(interval);
  }, [user]);

  async function fetchMeetings() {
    if (!user) return;
    try {
      const res = await api.get(`/meetings/user/${user._id}`);
      setMeetings(res.data.meetings);
    } catch (err) {
      console.error('Could not fetch meetings for notifications:', err);
    }
  }

  // The actual "is anything starting in 5 minutes" logic lives in this hook
  const { activeAlert, dismissAlert } = useMeetingNotifications(meetings);

  // Don't render anything if nobody is logged in
  if (!user) return null;

  return <MeetingAlertBanner meeting={activeAlert} onDismiss={dismissAlert} />;
}
