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
      // Fetch data from Supabase including related journey_steps and journey_users
      const { data, error } = await supabase
        .from('journeys')
        .select(
          `
          *,
          journey_steps(journey_step_id),
          journey_users(journey_user_id)
          `
        );
      if (error) throw error;
      setJourneys(data);
    } catch (error) {
      console.error('Error fetching journeys:', error.message);
    }
  };

  const handleDelete = async (journeyId) => {
    try {
      // Delete journey users first
      const { error: userError } = await supabase
        .from('journey_users')
        .delete()
        .eq('journey_id', journeyId);
      if (userError) throw userError;

      // Delete journey steps next
      const { error: stepError } = await supabase
        .from('journey_steps')
        .delete()
        .eq('journey_id', journeyId);
      if (stepError) throw stepError;

      // Finally, delete the journey itself
      const { error: journeyError } = await supabase
        .from('journeys')
        .delete()
        .eq('journey_id', journeyId);
      if (journeyError) throw journeyError;

      // Update state to remove the deleted journey from the UI
      setJourneys(journeys.filter((journey) => journey.journey_id !== journeyId));
    } catch (error) {
      console.error('Error deleting journey:', error.message);
    }
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Journeys</h1>
      <p>Journeys allow you to create step-by-step campaigns to personalize communication with users.</p>
      <div>
        <Link href="/j-create"><button className={styles.button}>Create</button></Link>
      </div>
      <div>
        <h2 className={styles.h2}>Currently used</h2>
        {journeys.map((journey) => (
          <div className={styles.section} key={journey.journey_id}>
            <h2 className={styles.name}>{journey.name}</h2>
            <p className={styles.description}>{journey.description}</p>
            <p className={styles.runTimes}>Has {journey.num_steps} steps</p>
            <div className={styles.buttonGroup}>
              <Link href={`/j-deets?id=${journey.journey_id}`} passHref>
                <button className={styles.editbutton}>Overview</button>
              </Link>
              <Link href={`/j-update?id=${journey.journey_id}`} passHref>
                <button className={styles.editbutton}>Edit</button>
              </Link>
              <button className={styles.dbutton} onClick={() => handleDelete(journey.journey_id)}>Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}