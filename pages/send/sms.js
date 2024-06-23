import styles from '/styles/Welcome.module.css';
import Link from 'next/link';

export default function Sms() {
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>SMS</h1>
<div className={styles.section}>
  <h2 className={styles.h2}>Send Campaign</h2>
  <Link href="/smsdatabase"><button className={styles.button}>Database</button></Link>
  <Link href="/sms-excel">
  <button className={styles.button}>Excel Sheet</button>
    </Link>
</div>
    </div>
    );
    }