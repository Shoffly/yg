import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { supabase } from '../supabaseClient'; // Your Supabase client setup file
import styles from '../styles/NotificationForm.module.css'; // Import your CSS module

const CreateJourneyPage = () => {
  const router = useRouter();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [query, setQuery] = useState('');
  const [interval, setInterval] = useState(0);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    // Fetch journey data if ID is provided in query params
    const fetchJourney = async () => {
      const { id } = router.query; // Destructure id from router.query
      if (id) {
        try {
          const { data, error } = await supabase
            .from('broadcasts')
            .select('*')
            .eq('id', id)
            .single();
          if (error) throw error;
          setName(data.name || '');
          setDescription(data.description || '');
          setQuery(data.query || '');
          setInterval(data.interval || 0);
          setTitle(data.title || '');
          setContent(data.content || '');
        } catch (error) {
          console.error('Error fetching journey:', error.message);
        }
      }
    };

    fetchJourney();
  }, [router.query.id]); // Ensure useEffect dependency is properly set

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const { id } = router.query; // Destructure id from router.query

    try {
      const { data, error } = await supabase.from('broadcasts').upsert([
        {
          id: id || undefined, // Provide ID only if editing
          name,
          description,
          query,
          interval,
          title,
          content,
        },
      ]);

      if (error) throw error;

      console.log('Data updated successfully:', data);

      setIsSubmitting(false);

      // Redirect to /journeysuccess after successful submission
      router.push('/broadcastsuccess');
    } catch (error) {
      setIsSubmitting(false);
      console.error('Error updating data:', error.message);
    }
  };

  return (
    <div className={styles.container}>
    <h1 className={styles.title}>Update Broadcast - v1</h1>
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
        {isSubmitting ? 'Loading...' : 'Update'}
      </button>
    </form>
     </div>
    );
};

export default CreateJourneyPage;
