import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { supabase } from '/supabaseClient.js'; // Adjust the path if necessary
import styles from '../styles/j-create.module.css';

export default function CreateCampaign() {
  const router = useRouter();
  const { id } = router.query;

  const [campaignName, setCampaignName] = useState('');
  const [campaignDescription, setCampaignDescription] = useState('');
  const [steps, setSteps] = useState([]);

  const branches = [
    "Abbas El Akkad", "Ahram Mall", "Alex Library", "Cairo Festival City Mall",
    "Downtown Kattameya", "El Nasr St.- Maadi", "Family Mall", "HQ - Cilantro Employees Only",
    "Hyper One", "Kalpit Thakkar", "Koleya Harbia", "Maadi Street 9", "Merghany", "Messaha",
    "Mohandiseen", "Mokkatam", "Mossadak", "Nile City Towers", "October Plaza", "Rofayda Hospital",
    "Sahel - Amwaj", "Sahel - Bianchi", "Sahel - El Abd", "Sahel - Gaia", "Sahel - Ghazala Bay",
    "Sahel - Hacienda Bay", "Sahel - Zahran Badr", "Tahrir", "Taqa Gas Station -New Giza",
    "Taqa West Somid", "Test", "The Yard Mall - Rehab", "Total Gas Station - 90 St", "Vandit Patel", "Yara"
  ];

  useEffect(() => {
    if (id) {
      fetchJourneyDetails(id);
    }
  }, [id]);

  const fetchJourneyDetails = async (id) => {
    try {
      let { data: journey, error: journeyError } = await supabase
        .from('journeys')
        .select('*')
        .eq('journey_id', id)
        .single();

      if (journeyError) {
        console.error('Error fetching journey:', journeyError.message);
        throw new Error(journeyError.message);
      }

      let { data: journeySteps, error: journeyStepsError } = await supabase
        .from('journey_steps')
        .select('*')
        .eq('journey_id', id)
        .order('step_number', { ascending: true });

      if (journeyStepsError) {
        console.error('Error fetching journey steps:', journeyStepsError.message);
        throw new Error(journeyStepsError.message);
      }

      setCampaignName(journey.name);
      setCampaignDescription(journey.description);
      setSteps(journeySteps.map(step => ({
        journeyStepId: step.journey_step_id, // Save the step ID for updating purposes
        triggerType: step.trigger_type,
        triggerValue: step.trigger_value,
        actionType: step.action_type,
        actionValue: step.action_value,
        delayInterval: step.delay_interval,
        title: step.notification_title,
        content: step.notification_content,
        isExpanded: true
      })));
    } catch (error) {
      console.error('Error:', error.message);
      alert('Error fetching journey details: ' + error.message);
    }
  };

  const addStep = () => {
    const newStep = {
      journeyStepId: null, // New step does not have an ID yet
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
      let journeyId;
      if (id) {
        // Update existing journey
        const { error: journeyUpdateError } = await supabase
          .from('journeys')
          .update({
            name: campaignName,
            description: campaignDescription,
            num_steps: steps.length
          })
          .eq('journey_id', id);

        if (journeyUpdateError) {
          console.error('Error updating journey:', journeyUpdateError.message);
          throw new Error(journeyUpdateError.message);
        }

        journeyId = id;
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

        journeyId = journeysData[0].journey_id;
      }

      // Update or insert `journey_steps`
      for (const [index, step] of steps.entries()) {
        if (step.journeyStepId) {
          // Update existing step
          const { error: stepUpdateError } = await supabase
            .from('journey_steps')
            .update({
              step_number: index + 1,
              trigger_type: step.triggerType,
              trigger_value: step.triggerValue,
              action_type: step.actionType,
              delay_interval: step.delayInterval,
              notification_title: step.title,
              notification_content: step.content,
              sms_content: step.actionType === 'send_sms' ? step.content : null
            })
            .eq('journey_step_id', step.journeyStepId);

          if (stepUpdateError) {
            console.error('Error updating step:', stepUpdateError.message);
            throw new Error(stepUpdateError.message);
          }
        } else {
          // Insert new step
          const { error: stepInsertError } = await supabase
            .from('journey_steps')
            .insert({
              journey_id: journeyId,
              step_number: index + 1,
              trigger_type: step.triggerType,
              trigger_value: step.triggerValue,
              action_type: step.actionType,
              delay_interval: step.delayInterval,
              notification_title: step.title,
              notification_content: step.content,
              sms_content: step.actionType === 'send_sms' ? step.content : null
            });

          if (stepInsertError) {
            console.error('Error inserting new step:', stepInsertError.message);
            throw new Error(stepInsertError.message);
          }
        }
      }

      router.push('/journeysuccess');
    } catch (error) {
      console.error('Error:', error.message, error.stack);
      alert('Error creating or updating journey: ' + error.message);
    }
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>{id ? 'Edit Journey' : 'Create Journey'}</h1>
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
        <button className={styles.sbutton} onClick={addStep}>Add Step</button>
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
        <button className={styles.button} onClick={handleSubmit}>{id ? 'Update Journey' : 'Create Journey'}</button>
      </div>
    </div>
  );
}