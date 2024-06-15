import Lottie from 'lottie-react';
import successAnimation from '../public/Animation - 1718481379890.json'; 
import styles from '../styles/SuccessPage.module.css'; // Create and import CSS style as needed

const SuccessPage = () => {
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>The Notification campaign has successfully started!</h1>
      <p className={styles.message}>You should receive an email once it's done.</p>
      <Lottie animationData={successAnimation} className={styles.lottie} />
    </div>
  );
};

export default SuccessPage;
