import { useState } from 'react';
import { useRouter } from 'next/router';
import styles from '/styles/NotificationForm.module.css';

const NotificationSForm = ({ users }) => {
  const [campaignName, setCampaignName] = useState("");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [scheduledTime, setScheduledTime] = useState(formatDate(new Date())); // Default to now
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // Function to format date to YYYY-MM-DDTHH:MM format
  function formatDate(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${year}-${month}-${day}T${hours}:${minutes}`;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const formData = {
      users: users.map(user => ({
        user_id: user.user_id,
        first_name: user.first_name
      })),
      campaign: campaignName,
      title: title,
      content: content,
      scheduled_time: scheduledTime // Include scheduled time
    };

    try {
      console.log(formData);
      const response = await fetch('https://ns-server-ky5ws.ondigitalocean.app/schedule-notification', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        router.push('/schedulesuccess');
        console.log("Notification sent successfully!");
      } else {
        const errorText = await response.text();
        console.error("Failed to send notification:", errorText);
        setErrorMessage(`Failed to send notification: ${response.statusText}`);
      }
    } catch (error) {
      console.error("Error sending notification:", error);
      setErrorMessage(`Error sending notification: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleScheduledTimeChange = (e) => {
    // Convert datetime-local value to YYYY-MM-DD HH:MM:SS format
    const selectedDateTime = new Date(e.target.value);
    const formattedDateTime = `${selectedDateTime.getFullYear()}-${String(selectedDateTime.getMonth() + 1).padStart(2, '0')}-${String(selectedDateTime.getDate()).padStart(2, '0')} ${String(selectedDateTime.getHours()).padStart(2, '0')}:${String(selectedDateTime.getMinutes()).padStart(2, '0')}:${String(selectedDateTime.getSeconds()).padStart(2, '0')}`;
    setScheduledTime(formattedDateTime);
  };

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <h2 className={styles.title}>Send Notification</h2>
      {errorMessage && <div className={styles.error}>{errorMessage}</div>}
      <div className={styles.field}>
        <label htmlFor="campaignName" className={styles.label}>Campaign Name</label>
        <input
          id="campaignName"
          value={campaignName}
          onChange={(e) => setCampaignName(e.target.value)}
          className={styles.input}
          required
        />
      </div>
      <div className={styles.field}>
        <label htmlFor="title" className={styles.label}>Title first_name to customize :)</label>
        <input
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className={styles.input}
          required
        />
      </div>
      <div className={styles.field}>
        <label htmlFor="content" className={styles.label}>Content first_name to customize :)</label>
        <textarea
          id="content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className={styles.input}
          required
        />
      </div>
      <div className={styles.field}>
        <label htmlFor="scheduledTime" className={styles.label}>Scheduled Time (YYYY-MM-DD HH:MM:SS)</label>
        <input
          type="datetime-local"
          id="scheduledTime"
          value={scheduledTime}
          onChange={handleScheduledTimeChange}
          className={styles.input}
          required
        />
      </div>
      <button type="submit" className={styles.button} disabled={loading}>
        {loading ? 'Loading...' : 'Schedule'}
      </button>
    </form>
  );
};

export default NotificationSForm;