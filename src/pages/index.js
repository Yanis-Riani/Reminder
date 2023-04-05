import Head from 'next/head';
import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import styles from '../styles/index.module.css';
import { useEffect, useState } from 'react';
import axios from 'axios';


export default function Home() {
  const { data: session } = useSession();
  const [groups, setGroups] = useState([]);
  const [reminders, setReminders] = useState([]);

  useEffect(() => {
    async function fetchData() {
      try {
        const email = session.user.email;
        const res = await axios.get(`/api/user/id?email=${email}`);
        setGroups(res.data.user.groups);
        setReminders(res.data.reminders);
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
        <title>Reminder - Rappels pour vos projets et devoirs</title>
        <meta name="description" content="Créez des rappels pour vos différents projets, devoirs et attendus à rendre sur des classes, des groupes et autres avec Remindr." />
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
        <h1 className={styles.title}>
          Bienvenue sur Reminder
        </h1>

        <p className={styles.description}>
          Créez des rappels pour vos différents projets, devoirs et attendus à rendre sur des classes, des groupes et autres.
        </p>

        <div className={styles.grid}>
          {session && (
            <>
              <div className={styles.card}>
                <img className={styles.userImage} src={session.user.image} alt={session.user.name} />
                <h3>Bonjour {session.user.name}</h3>
                <button onClick={signOut} className={styles.button}>Se déconnecter</button>
              </div>
              <div className={styles.group}>
                <h3>Vos Groupes</h3>
                {groups.map((group) => (
                  <Link key={group.id} href={`/groups/${group.id}`} className={styles.linkcard}>
                    <div className={styles.card}>
                      <h3>{group.name}</h3>
                      <p>{group.reminders.length} rappel</p>
                    </div>
                  </Link>
                ))}
              </div>
              {reminders.length > 0 && (
                <div className={styles.card}>
                  <h3>Rappels à venir</h3>
                  <ul className={styles.ul}>
                    {reminders.map((reminder) => (
                      <li key={reminder.id}>
                        <Link href={`/groups/${reminder.groupId}`} className={styles.reminderLink}>
                          <p>{reminder.title}</p>
                          <p>{new Date(reminder.dueDate).toLocaleDateString()}</p>
                        </Link>
                        <hr />
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </>
          )}

          {!session && (
            <div className={styles.card}>
              <Link href="/login" className={styles.card}>
                <button className={styles.button}>Se connecter</button>
                <p>Connectez-vous pour accéder à votre interface de gestion de rappels.</p>
              </Link>
            </div>
          )}
        </div>
      </main>
      <footer className={styles.footer}>
        Fait par Yanis Riani
      </footer>
    </div>
  );
}
