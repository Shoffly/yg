import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import styles from '../styles/j-create.module.css';
import { supabase } from '/supabaseClient.js'; // Adjust the path if necessary

export default function UpdateJourneyss() {
  const [campaignName, setCampaignName] = useState('');
  const [campaignDescription, setCampaignDescription] = useState('');
  const [steps, setSteps] = useState([]);
  const router = useRouter();
  const { journey_id } = router.query; // Get journey_id from the URL parameters

  useEffect(() => {
    if (journey_id) {
      fetchJourneyData(journey_id);
    }
  }, [journey_id]);

  const fetchJourneyData = async (journey_id) => {
    try {
      // Fetch journey data
      let { data: journey, error } = await supabase
        .from('journeys')
        .select('*')
        .eq('journey_id', journey_id)
        .single();

      if (error) {
        console.error('Error fetching journey data:', error.message);
        return;
      }

      setCampaignName(journey.name);
      setCampaignDescription(journey.description);

      // Fetch journey steps data
      let { data: stepsData, error: stepsError } = await supabase
        .from('journey_steps')
        .select('*')
        .eq('journey_id', journey_id)
        .order('step_number', { ascending: true });

      if (stepsError) {
        console.error('Error fetching journey steps:', stepsError.message);
        return;
      }

      // Map the fetched data to match the state structure
      const mappedSteps = stepsData.map(step => ({
        triggerType: step.trigger_type,
        triggerValue: step.trigger_value,
        actionType: step.action_type,
        actionValue: step.action_value,
        delayInterval: step.delay_interval,
        title: step.notification_title,
        content: step.notification_content,
        isExpanded: true
      }));

      setSteps(mappedSteps);
    } catch (error) {
      console.error('Error:', error.message, error.stack);
      alert('Error fetching journey data: ' + error.message);
    }
  };

  const branches = [
    "All Branches", "Abbas El Akkad", "Ahram Mall", "Alex Library", "Cairo Festival City Mall",
    "Downtown Kattameya", "El Nasr St.- Maadi", "Family Mall", "HQ - Cilantro Employees Only",
    "Hyper One", "Kalpit Thakkar", "Koleya Harbia", "Maadi Street 9", "Merghany", "Messaha",
    "Mohandiseen", "Mokkatam", "Mossadak", "Nile City Towers", "October Plaza", "Rofayda Hospital",
    "Sahel - Amwaj", "Sahel - Bianchi", "Sahel - El Abd", "Sahel - Gaia", "Sahel - Ghazala Bay",
    "Sahel - Hacienda Bay", "Sahel - Zahran Badr", "Tahrir", "Taqa Gas Station -New Giza",
    "Taqa West Somid", "Test", "The Yard Mall - Rehab", "Total Gas Station - 90 St", "Vandit Patel", "Yara"
  ];

  const addStep = () => {
    const newStep = {
      triggerType: '',
      triggerValue: '',
      actionType: '',
      actionValue: '',
      delayInterval: 0,
      title: '',
      content: '',
      isExpanded: true
    };
    setSteps([...steps, newStep]);
  };

  const handleStepChange = (index, field, value) => {
    const newSteps = [...steps];
    newSteps[index][field] = value;
    setSteps(newSteps);
  };

  const removeStep = (index) => {
    const newSteps = steps.filter((_, i) => i !== index);
    setSteps(newSteps);
  };

  const toggleStep = (index) => {
    const newSteps = [...steps];
    newSteps[index].isExpanded = !newSteps[index].isExpanded;
    setSteps(newSteps);
  };

  const handleSubmit = async () => {
    try {
      if (journey_id) {
        // Update existing journey
        const { error: updateError } = await supabase
          .from('journeys')
          .update({
            name: campaignName,
            description: campaignDescription,
            num_steps: steps.length
          })
          .eq('journey_id', journey_id);

        if (updateError) {
          console.error('Error updating journey:', updateError.message);
          throw new Error(updateError.message);
        }

        // Delete existing steps and reinsert
        const { error: deleteError } = await supabase
          .from('journey_steps')
          .delete()
          .eq('journey_id', journey_id);

        if (deleteError) {
          console.error('Error deleting journey steps:', deleteError.message);
          throw new Error(deleteError.message);
        }

        const journeyStepsData = steps.map((step, index) => ({
          journey_id: journey_id,
          step_number: index + 1,
          trigger_type: step.triggerType,
          trigger_value: step.triggerValue,
          action_type: step.actionType,
          delay_interval: step.delayInterval,
          notification_title: step.title,
          notification_content: step.content,
          sms_content: step.actionType === 'send_sms' ? step.content : null
        }));

        const { error: insertStepsError } = await supabase
          .from('journey_steps')
          .insert(journeyStepsData);

        if (insertStepsError) {
          console.error('Error inserting journey steps:', insertStepsError.message);
          throw new Error(insertStepsError.message);
        }

        router.push('/journeysuccess');
      } else {
        // Insert new journey
        const { data: journeysData, error: journeysError } = await supabase
          .from('journeys')
          .insert([
            { name: campaignName, created_at: new Date(), num_steps: steps.length, description: campaignDescription }
          ])
          .select();

        if (journeysError) {
          console.error('Error inserting into journeys:', journeysError.message);
          throw new Error(journeysError.message);
        }

        if (!journeysData || journeysData.length === 0 || !journeysData[0].journey_id) {
          console.error('Unexpected response format or missing journey_id:', journeysData);
          throw new Error('Failed to retrieve journey_id from the inserted journey.');
        }

        const journeyId = journeysData[0].journey_id;

        const journeyStepsData = steps.map((step, index) => ({
          journey_id: journeyId,
          step_number: index + 1,
          trigger_type: step.triggerType,
          trigger_value: step.triggerValue,
          action_type: step.actionType,
          delay_interval: step.delayInterval,
          notification_title: step.title,
          notification_content: step.content,
          sms_content: step.actionType === 'send_sms' ? step.content : null
        }));

        const { error: journeyStepsError } = await supabase
          .from('journey_steps')
          .insert(journeyStepsData);

        if (journeyStepsError) {
          console.error('Error inserting into journey_steps:', journeyStepsError.message, journeyStepsData);
          throw new Error(journeyStepsError.message);
        }

        router.push('/journeysuccess');
      }
    } catch (error) {
      console.error('Error:', error.message, error.stack);
      alert('Error creating journey: ' + error.message);
    }
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>{journey_id ? 'Edit Journey' : 'Create Journey'}</h1>
      <div className={styles.form}>
        <div className={styles.field}>
          <label className={styles.label}>Name</label>
          <input
            type="text"
            className={styles.input}
            placeholder="Journey Name"
            value={campaignName}
            onChange={(e) => setCampaignName(e.target.value)}
          />
        </div>
        <div className={styles.field}>
          <label className={styles.label}>Description</label>
          <input
            type="text"
            className={styles.input}
            placeholder="Journey Description"
            value={campaignDescription}
            onChange={(e) => setCampaignDescription(e.target.value)}
          />
        </div>
        <button className={styles.button} onClick={addStep}>Add Step</button>
        {steps.map((step, index) => (
          <div key={index} className={styles.section}>
            <h2 className={styles.stepHeader} onClick={() => toggleStep(index)}>
              Step {index + 1}
              <span className={styles.arrow}>
                {step.isExpanded ? '▼' : '►'}
              </span>
            </h2>
            <div
              className={`${styles.stepContent} ${step.isExpanded ? styles.expanded : styles.collapsed}`}
            >
              <select
                className={styles.select}
                value={step.triggerType}
                onChange={(e) => handleStepChange(index, 'triggerType', e.target.value)}
              >
                <option value="">Select Trigger</option>
                <option value="send_to_user_ids">Specific User IDs</option>
                <option value="max_orders"> Maximum # of orders placed</option>
                <option value="top_branch">Top Branch</option>
                <option value="days_since_last_order">Days Since Last Order</option>
                <option value="min_order_value">Minimum Order Value</option>
              </select>
              {step.triggerType === 'top_branch' ? (
                <select
                  className={styles.select}
                  value={step.triggerValue}
                  onChange={(e) => handleStepChange(index, 'triggerValue', e.target.value)}
                >
                  {branches.map((branch, idx) => (
                    <option key={idx} value={branch}>{branch}</option>
                  ))}
                </select>
              ) : (
                <input
                  type="text"
                  className={styles.input}
                  placeholder="Trigger Value"
                  value={step.triggerValue}
                  onChange={(e) => handleStepChange(index, 'triggerValue', e.target.value)}
                />
              )}
              <select
                className={styles.select}
                value={step.actionType}
                onChange={(e) => handleStepChange(index, 'actionType', e.target.value)}
              >
                <option value="">Select Action</option>
                <option value="send_notification">Send Notification</option>
                <option value="send_sms">Send SMS (N/A)</option>
              </select>
              {step.actionType === 'send_notification' && (
                <div>
                  <input
                    type="text"
                    className={styles.input}
                    placeholder="Notification Title"
                    value={step.title}
                    onChange={(e) => handleStepChange(index, 'title', e.target.value)}
                  />
                  <textarea
                    className={styles.input}
                    placeholder="Notification Content"
                    value={step.content}
                    onChange={(e) => handleStepChange(index, 'content', e.target.value)}
                  />
                </div>
              )}
              <label className={styles.label}>How much time do you want between steps?</label>
              <input
                type="number"
                className={styles.input}
                placeholder="Delay Interval (days)"
                value={step.delayInterval}
                onChange={(e) => handleStepChange(index, 'delayInterval', parseInt(e.target.value))}
              />
              <button className={styles.dbutton} onClick={() => removeStep(index)}>Remove Step</button>
            </div>
          </div>
        ))}
        <button className={styles.button} onClick={handleSubmit}>{journey_id ? 'Update' : 'Create'}</button>
      </div>
    </div>
  );
}
