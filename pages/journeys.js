// pages/journeys.js
import { useState, useEffect } from 'react';
import { supabase } from '/supabaseClient.js'; // Adjusted import path
import Link from 'next/link';
import styles from '../styles/journeys.module.css'; // Import CSS module

export default function JourneysPage() {
  const [journeys, setJourneys] = useState([]);

  useEffect(() => {
    fetchJourneys();
  }, []);

  const fetchJourneys = async () => {
    try {
      // Fetch data from Supabase
      const { data, error } = await supabase.from('journeys').select('journey_id, name, description, run_times');
      if (error) throw error;
      setJourneys(data);
    } catch (error) {
      console.error('Error fetching journeys:', error.message);
    }
  };

  const handleDelete = async (id) => {
    try {
      // Delete journey record from Supabase
      const { error } = await supabase.from('journeys').delete().eq('id', id);
      if (error) throw error;
      // Update state to remove the deleted journey from the UI
      setJourneys(journeys.filter((journey) => journey.id !== id));
    } catch (error) {
      console.error('Error deleting journey:', error.message);
    }
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Journeys</h1>
      <p>Journeys allow you to create step by step campaigns to personalize communication with users.</p>
      <div>
        <Link href="/j-create"><button className={styles.button}>Create</button></Link>
      </div>
      <div>
        <h2 className={styles.h2}>Currently used</h2>
        {journeys.map((journey) => (
          <div className={styles.section} key={journey.id}>
            <h2 className={styles.name}>{journey.name}</h2>
            <p className={styles.description}>{journey.description}</p>
            <p className={styles.runTimes}>Ran {journey.run_times} times</p>
            <div className={styles.buttonGroup}>
              <Link href={`/j-update?id=${journey.journey_id}`} passHref>
                <button className={styles.editbutton}>Edit</button>
              </Link>
              <button className={styles.dbutton} onClick={() => handleDelete(journey.id)}>Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
