import { useState, useEffect, useRef } from 'react';

// This hook watches a list of meetings and fires a notification
// when any meeting is about to start within the next 5 minutes.
// It uses useEffect + setInterval to keep "polling" the clock,
// and useRef to remember which meetings we've already alerted for
// (so we don't show the same notification 100 times).
export default function useMeetingNotifications(meetings) {
  const [activeAlert, setActiveAlert] = useState(null);
  const alertedRef = useRef(new Set());

  useEffect(() => {
    // Check every 15 seconds whether any meeting is within 5 minutes of starting
    const interval = setInterval(() => {
      const now = new Date();

      for (const meeting of meetings) {
        const meetingTime = new Date(meeting.dateTime);
        const diffMs = meetingTime - now;
        const diffMinutes = diffMs / 1000 / 60;

        // Trigger window: meeting starts between now and 5 minutes from now,
        // and we haven't already alerted for this specific meeting.
        if (diffMinutes > 0 && diffMinutes <= 5 && !alertedRef.current.has(meeting._id)) {
          alertedRef.current.add(meeting._id);
          setActiveAlert(meeting);

          // Try a browser notification too, if permission was granted
          if (window.Notification && Notification.permission === 'granted') {
            new Notification(`Upcoming meeting: ${meeting.title}`, {
              body: `Starts in ${Math.ceil(diffMinutes)} minute(s)`,
            });
          }
        }
      }
    }, 15000); // check every 15 seconds

    return () => clearInterval(interval);
  }, [meetings]);

  function dismissAlert() {
    setActiveAlert(null);
  }

  return { activeAlert, dismissAlert };
}
