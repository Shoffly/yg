import { useState, useRef, useEffect } from 'react';
import styles from '../styles/j-create.module.css';

export default function CreateCampaign() {
  const [campaignName, setCampaignName] = useState('');
  const [steps, setSteps] = useState([]);

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

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Create Journey</h1>
      <div className={styles.form}>
        <div className={styles.field}>
          <label className={styles.label}>Journey Name</label>
          <input
            type="text"
            className={styles.input}
            placeholder="Journey Name"
            value={campaignName}
            onChange={(e) => setCampaignName(e.target.value)}
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
                onChange={(e) => handleStepChange(index, 'triggerType', e.target.value)}
              >
                <option value="">Select Trigger</option>
                <option value="no_orders">No Orders</option>
              </select>
              <input
                type="text"
                className={styles.input}
                placeholder="Trigger Value"
                onChange={(e) => handleStepChange(index, 'triggerValue', e.target.value)}
              />
              <select
                className={styles.select}
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
                    onChange={(e) => handleStepChange(index, 'title', e.target.value)}
                  />
                  <textarea
                    className={styles.input}
                    placeholder="Notification Content"
                    onChange={(e) => handleStepChange(index, 'content', e.target.value)}
                  />
                </div>
              )}
              <label className={styles.label}>How much time do you want between steps?</label>
              <input
                type="number"
                className={styles.input}
                placeholder="Delay Interval (days)"
                onChange={(e) => handleStepChange(index, 'delayInterval', parseInt(e.target.value))}
              />
              <button className={styles.dbutton} onClick={() => removeStep(index)}>Remove Step</button>
            </div>
          </div>
        ))}
        <button className={styles.button} >Create</button>
      </div>
    </div>
  );
}
