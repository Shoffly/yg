import Lottie from 'lottie-react';
import successAnimation from '../public/Animation - 1718481379890.json'; 
import styles from '../styles/SuccessPage.module.css'; // Create and import CSS style as needed
import { Mixpanel } from '/mixpanel';

const SuccessPage = () => {
  Mixpanel.track('Journey created successfully')
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Your Journey has been set successfully!</h1>
      <p className={styles.message}>You should receive an email once it sends.</p>
      <Lottie animationData={successAnimation} className={styles.lottie} />
    </div>
  );
};

export default SuccessPage;
