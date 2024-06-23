import styles from '/styles/Welcome.module.css';
import Link from 'next/link';

export default function Notifications() {
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Notifications</h1>
<div className={styles.section}>
  <h2 className={styles.h2}>Send Campaign</h2>
  <Link href="/database"><button className={styles.button}>Database</button></Link>
  <Link href="/excel">
  <button className={styles.button}>Excel Sheet</button>
    </Link>
</div>
    <div className={styles.section}>
      <h2 className={styles.h2}>Schedule Campaign</h2>
      <Link href="/sdatabase"><button className={styles.button}>Database</button></Link>
      <Link href="/sexcel">
      <button className={styles.button}>Excel Sheet</button>
        </Link>
    </div> 
    </div>
    );
    }