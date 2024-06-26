import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { supabase } from '/supabaseClient.js'; // Adjust the path if necessary
import styles from '../styles/j-details.module.css'; // Create and adjust the styles as necessary

export default function JourneyDetails() {
  const router = useRouter();
  const { id } = router.query;

  const [journeyDetails, setJourneyDetails] = useState(null);
  const [steps, setSteps] = useState([]);
  const [usersPerStep, setUsersPerStep] = useState({});

  useEffect(() => {
    if (id) {
      fetchJourneyDetails(id);
    }
  }, [id]);

  const fetchJourneyDetails = async (id) => {
    try {
      let { data: journey, error: journeyError } = await supabase
        .from('journeys')
        .select(`
          *,
          journey_steps(*),
          journey_users(*)
        `)
        .eq('journey_id', id).neq('journey_users.done','true').single();

      if (journeyError) {
        console.error('Error fetching journey:', journeyError.message);
        throw new Error(journeyError.message);
      }

      const stepData = journey.journey_steps;
      const userData = journey.journey_users;

      const userCountPerStep = stepData.reduce((acc, step) => {
        acc[step.step_number] = userData.filter(user => user.on_step === step.step_number).length;
        return acc;
      }, {});

      setJourneyDetails(journey);
      setSteps(stepData);
      setUsersPerStep(userCountPerStep);
    } catch (error) {
      console.error('Error:', error.message);
      alert('Error fetching journey details: ' + error.message);
    }
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Journey Details</h1>
      {journeyDetails && (
        <div className={styles.journeyDetails}>
          <h4 className={styles.description}>Name<br></br> {journeyDetails.name}</h4>
          <p className={styles.description}>Description<br></br> {journeyDetails.description}</p>
          <h3 className={styles.subtitle}>Steps</h3>
          {steps.map((step, index) => (
            <div key={index} className={styles.step}>
              <h3 className={styles.stepTitle}>Step {index + 1}</h3>
              <p className={styles.stepUsers}><strong>Users on this step:</strong> {usersPerStep[step.step_number] || 0}</p> <div className={styles.deets}> 
              <p className={styles.stepDetail}><strong>Trigger Type</strong> {step.trigger_type}</p>
              <p className={styles.stepDetail}><strong>Trigger Value:</strong> {step.trigger_value}</p>
              <p className={styles.stepDetail}><strong>Action Type:</strong> {step.action_type}</p>
              <p className={styles.stepDetail}><strong>Delay Interval:</strong> {step.delay_interval} days</p>
              <p className={styles.stepDetail}><strong>Notification Title:</strong> {step.notification_title}</p>
              <p className={styles.stepDetail}><strong>Notification Content:</strong> {step.notification_content}</p>
</div>

            </div>
          ))}
        </div>
      )}
    </div>
  );
}