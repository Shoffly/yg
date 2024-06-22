import { useState } from 'react';
import { useRouter } from 'next/router';
import styles from '/styles/NotificationForm.module.css'; // Import CSS module for styling

const NotificationForm = ({ users }) => {
  const [campaignName, setCampaignName] = useState("");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

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
      content: content
    };

    try {
      console.log(formData);
      const response = await fetch('https://ns-server-ky5ws.ondigitalocean.app/send-notification', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        router.push('/success');
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
      <button type="submit" className={styles.button} disabled={loading}>
        {loading ? 'Loading...' : 'Send Notification'}
      </button>
    </form>
  );
};

export default NotificationForm;