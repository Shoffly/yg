import { useState } from 'react';
import { useRouter } from 'next/router';
import styles from '/styles/NotificationForm.module.css'; // Import CSS module for styling
import { Mixpanel } from '/mixpanel';
const SmsForm = ({ users }) => {
  const [campaignName, setCampaignName] = useState("");
  const [content, setContent] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const formData = {
      users: users.map(user => ({
        user_number: user.user_number,
        first_name: user.first_name,
        fav_item: user.fav_item
      })),
      
      smscontent: content
    };

    try {
      console.log(formData);
      const response = await fetch('https://ns-server-ky5ws.ondigitalocean.app/send-sms', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        router.push('/smssuccess');
        console.log("SMS sent successfully!");
      } else {
        const errorText = await response.text();
        console.error("Failed to send sms:", errorText);
        setErrorMessage(`Failed to send sms: ${response.statusText}`);
      }
    } catch (error) {
      console.error("Error sending sms:", error);
      setErrorMessage(`Error sending sms: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };
const monitorClick = () => {
    Mixpanel.track('Button Clicked', { buttonName: 'Send sms campaign' });
  };
  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <h2 className={styles.title}>Send SMS</h2>
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
        <label htmlFor="content" className={styles.label}>Content first_name to customize :)</label>
        <textarea
          id="content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className={styles.input}
          required
        />
      </div>
      <button type="submit" 
        onClick= {monitorClick}
        className={styles.button} disabled={loading}>
        {loading ? 'Loading...' : 'Send SMS'}
      </button>
    </form>
  );
};

export default SmsForm;