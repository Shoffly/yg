import { useState } from 'react';
import { useRouter } from 'next/router';
import { supabase } from '../supabaseClient'; // Your Supabase client setup file
import styles from '../styles/NotificationForm.module.css'; // Import your CSS module

const UpdateForm = () => {
  const router = useRouter();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [query, setQuery] = useState('');
  const [interval, setInterval] = useState(0); // Default interval value
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false); // State to track form submission

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true); // Set submitting state to true

    // Assuming you have a table named 'your_table_name' in Supabase
    const { data, error } = await supabase.from('broadcasts').upsert([
      {
        name,
        query,
        interval,
        title,
        content,
        description,
      },
    ]);

    setIsSubmitting(false); // Set submitting state back to false after submission attempt

    if (error) {
      console.error('Error updating data:', error.message);
    } else {
      console.log('Data updated successfully:', data);
      // Optionally, you can reset the form state after successful submission
      setName('');
      setQuery('');
      setInterval(0);
      setTitle('');
      setContent('');
      setDescription('');

      // Redirect to /journeysuccess after successful submission
      router.push('/broadcastsuccess');
    }
  };

  return (
    <div className={styles.container}>
       <h1 className={styles.title}>Create broadcast - v1</h1>

    <form className={styles.form} onSubmit={handleSubmit}>
      <div className={styles.field}>
        <label className={styles.label}>
          Journey Name:
          <input
            className={styles.input}
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </label>
      </div>
      <div className={styles.field}>
        <label className={styles.label}>
          Description:
          <input
            className={styles.input}
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
        </label>
      </div>
      <div className={styles.field}>
        <label className={styles.label}>
          SQL (Query):
          <textarea
            className={styles.input}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            required
          />
          make sure your query has a user_id and first_name columns.
        </label>
      </div>
      <div className={styles.field}>
        <label className={styles.label}>
          Interval: (in hours)
          <input
            className={styles.input}
            type="number"
            value={interval}
            onChange={(e) => setInterval(Number(e.target.value))}
            required
          />
        </label>
      </div>
      <div className={styles.field}>
        <label className={styles.label}>
          Title:
          <input
            className={styles.input}
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </label>
      </div>
      <div className={styles.field}>
        <label className={styles.label}>
          Content:
          <textarea
            className={styles.input}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
          />
        </label>
      </div>
      <button className={styles.button} type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Loading...' : 'Create'}
      </button>
    </form>
      </div>
  );
};

export default UpdateForm;
