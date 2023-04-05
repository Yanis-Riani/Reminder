import Head from 'next/head';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import axios from 'axios';
import styles from '../../styles/index.module.css';
import Select from 'react-select';

export default function CreateGroup() {
  const { data: session } = useSession();
  const [groupName, setGroupName] = useState('');
  const [userIds, setUserIds] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const router = useRouter();

  useEffect(() => {
    async function fetchUsers() {
      try {
        const res = await axios.get('/api/user/all');
        setAllUsers(res.data);
      } catch (err) {
        console.error(err);
      }
    }

    if (session) {
      fetchUsers();
    }
  }, [session]);

  async function handleCreateGroup(e) {
    e.preventDefault();

    try {
      const res = await axios.post('/api/group', { name: groupName, userIds });
      const newGroup = res.data;
      console.log('Created new group:', newGroup);
      // Rediriger l'utilisateur vers la page du nouveau groupe créé 
      router.push(`/groups/${res.data.id}`);
    } catch (err) {
      console.error(err);
    }
  }

  function handleChange(selectedOptions) {
    setUserIds(selectedOptions.map((option) => option.value));
  }

  return (
    <div className={styles.container}>
      <Head>
        <title>Créer un groupe - Remindr</title>
        <meta name="description" content="Créer un nouveau groupe Remindr" />
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
        <h1 className={styles.title}>Créer un groupe</h1>

        {session && (
          <form onSubmit={handleCreateGroup}>
            <label htmlFor="groupName">Nom du groupe</label>
            <input
              type="text"
              id="groupName"
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
              className={styles.input}
            />

            <label htmlFor="members">Membres</label>
            <Select
              id="members"
              options={allUsers.map((user) => ({ value: user.id, label: user.name }))}
              isMulti
              value={allUsers.filter((user) => userIds.includes(user.id)).map((user) => ({ value: user.id, label: user.name }))}
              onChange={handleChange}
            />

            <button type="submit" className={styles.button}>Créer le groupe</button>
          </form>
        )}

        {!session && (
          <>
            <h2>Connectez-vous pour accéder à votre interface de gestion de rappels.</h2>
            <Link href="/login">Se connecter</Link>
          </>
        )}
      </main>
    </div>
  );
}
