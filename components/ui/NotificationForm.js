import { useState } from 'react';
import styles from '/styles/NotificationForm.module.css'; // Import CSS module for styling

const NotificationForm = ({ userIds }) => {
  const [campaignName, setCampaignName] = useState("");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = {
      user_ids: userIds,
      campaign: campaignName,
      title: title,
      content: content
    };

    try {
      const response = await fetch('https://ns-server-ky5ws.ondigitalocean.app/send-notification', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        console.log("Notification sent successfully!");
      } else {
        const errorText = await response.text();
        console.error("Failed to send notification:", errorText);
        setErrorMessage(`Failed to send notification: ${response.statusText}`);
      }
    } catch (error) {
      console.error("Error sending notification:", error);
      setErrorMessage(`Error sending notification: ${error.message}`);
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
        <label htmlFor="title" className={styles.label}>Title</label>
        <input
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className={styles.input}
          required
        />
      </div>
      <div className={styles.field}>
        <label htmlFor="content" className={styles.label}>Content</label>
        <textarea
          id="content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className={styles.input}
          required
        />
      </div>
      <button type="submit" className={styles.button}>Send Notification</button>
    </form>
  );
};

export default NotificationForm;