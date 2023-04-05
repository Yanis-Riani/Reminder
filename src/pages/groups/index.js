import Head from 'next/head';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import axios from 'axios';
import styles from '../../styles/index.module.css';

export default function Groups() {
  const { data: session } = useSession();
  const [groups, setGroups] = useState([]);

  useEffect(() => {
    async function fetchData() {
      try {
        const email = session.user.email;
        const res = await axios.get(`/api/user/id?email=${email}`);
        setGroups(res.data.user.groups);
      } catch (err) {
        console.error(err);
      }
    }

    if (session) {
      fetchData();
    }
  }, [session]);

  return (
    <div className={styles.container}>
      <Head>
        <title>Mes groupes - Remindr</title>
        <meta name="description" content="Liste des groupes auxquels j'appartiens" />
      </Head>

      <nav className={styles.nav}>
        <Link href="/">
          Accueil
        </Link>
        <Link href="/groups">
          Liste des groupes
        </Link>
      </nav>

      <main className={styles.main}>
        <h1 className={styles.title}>Mes groupes</h1>
  
        {session && (
          <>
            <div className={styles.container}>
              <Link href="/groups/create">
                <button className={styles.button}>Créer un groupe</button>
              </Link>
    
              {groups.length > 0 && (
                <div className={styles.group}>
                  <h3>Vos Groupes</h3>
                  {groups.map((group) => (
                    <Link key={group.id} href={`/groups/${group.id}`} className={styles.linkcard}>
                      <div>
                        <h3>{group.name}</h3>
                        <p>{group.reminders.length} rappel</p>
                      </div>
                    </Link>
                  ))}
                </div>
              )} 
    
              {groups.length === 0 && (
                <p>Vous n'appartenez à aucun groupe.</p>
              )}
            </div>
          </>
        )}
  
        {!session && (
          <>
            <h2>Connectez-vous pour accéder à votre liste de groupes.</h2>
            <Link href="/login">Se connecter</Link>
          </>
        )}
      </main>
  
      <footer className={styles.footer}>
        Fait par Yanis Riani
      </footer>
    </div>
  );
}
