import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { supabase } from '/supabaseClient.js';
import styles from '/styles/Welcome.module.css';
import Link from 'next/link';
import HashLoader from "react-spinners/HashLoader";
import Bento from ".//bentoflex";

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

  const timages = [
    {
      src: "/images/j_button.svg",
      alt: "Journeys Image",
      width: 345,
      height: 255,
      link: "/journeys"
    },
    {
      src: "/images/b_button.svg",
      alt: "broadcast Image",
      width: 345,
      height: 255,
      link: "/broadcasts"
    },
  ];

  const limages = [
    {
      src: "/images/analyze_button.svg",
        alt: "Analyze Image",
        width: 345,
        height: 255,
        link: "https://gan-lhych.ondigitalocean.app"
    }
  ]
  return (
    <div className={styles.container}>
      {user ? (
        <>
          <h1 className={styles.h1}>Hey {user.user_metadata.first_name}, </h1>
          <h2 className={styles.h2}>What would you like to do today?</h2>
          <div className={styles.actions}>
          <div>
            <h2 className={styles.h2}>Create</h2>
            <Bento images={timages} />
            <br></br>
          </div>
          <div className={styles.section}>
            <h2 className={styles.h2}>Send Campaign</h2>
            <Link href="/database"><button className={styles.button}>Database</button></Link>
            <Link href="excel">
            <button className={styles.button}>Excel Sheet</button>
              </Link>
          </div>
          <div className={styles.section}>
            <h2 className={styles.h2}>Schedule Campaign</h2>
            <Link href="/sdatabase"><button className={styles.button}>Database</button></Link>
            <Link href="sexcel">
            <button className={styles.button}>Excel Sheet</button>
              </Link>
          </div>
          <div>
            <h2 className={styles.h2}>More</h2>
            <Bento images={limages}/>
          </div>
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