import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { supabase } from '/supabaseClient.js';
import styles from '/styles/Welcome.module.css';
import Link from 'next/link';
import HashLoader from "react-spinners/HashLoader";

export default function Welcome() {
  const [user, setUser] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push('/sign/in'); // Redirect to login if not authenticated
      } else {
        setUser(user);
      }
    };
    checkUser();
  }, [router]);

  let [color, setColor] = useState("#4caf50");
  return (
    <div className={styles.container}>
      {user ? (
        <>
          <h1 className={styles.h1}>Hey {user.user_metadata.first_name}, </h1>
          <h2 className={styles.h2}>What would you like to do today?</h2>
          <div className={styles.section}>
            <h2 className={styles.h2}>Send from</h2>
            <Link href="/database"><button className={styles.button}>Database</button></Link>
            <Link href="excel">
            <button className={styles.button}>Excel Sheet</button>
              </Link>
          </div>
          <div className={styles.section}>
            <h2 className={styles.h2}>Analyze</h2>
            <Link href="https://gan-lhych.ondigitalocean.app">
            <button className={styles.button}>Pick a Campaign</button></Link>
          </div>
        </>
      ) : (
        <div className={styles.loading}><HashLoader
        color={color}
        size={150}
        aria-label="Loading"
        
      /></div>
      )}
    </div>
  );
}