import Head from 'next/head';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import axios from 'axios';
import styles from '../../styles/index.module.css';
import Select from 'react-select';
import Modal from 'react-modal';

Modal.setAppElement('#__next');

const customStyles = {
  control: (provided) => ({
    ...provided,
    width: '100%',
  }),
  option: (provided, state) => ({
    ...provided,
    color: state.isSelected ? 'white' : 'black',
    backgroundColor: state.isSelected ? 'black' : 'white',
  }),
};

export default function Group() {
  const { data: session } = useSession();
  const [group, setGroup] = useState({});
  const [members, setMembers] = useState([]);
  const [newName, setNewName] = useState('');
  const [userIds, setUserIds] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [reminderId, setReminderId] = useState(null);
  const [modalIsOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const { id } = router.query;

  async function fetchData() {
    try {
      const res = await axios.get(`/api/group/${id}`);
      setGroup(res.data);
      setMembers(res.data.users);
      setUserIds(res.data.users.map((user) => user.id));
    } catch (err) {
      console.error(err);
    }
  }

  async function fetchUsers() {
    try {
      const res = await axios.get('/api/user/all');
      setAllUsers(res.data);
    } catch (err) {
      console.error(err);
    }
  }

  useEffect(() => {
    if (session) {
      fetchData();
      fetchUsers();
    }
  }, [session, id]);

  async function handleNameChange(e) {
    e.preventDefault();

    try {
      const res = await axios.put(`/api/group/${id}`, { name: newName });
      setGroup(res.data);
    } catch (err) {
      console.error(err);
    }
  }


  async function handleUserIdsChange(e) {
    e.preventDefault();

    try {
      const res = await axios.put(`/api/group/${id}`, { userIds });

      setGroup(res.data);
      fetchData();
    } catch (err) {
      console.error(err);
    }
  }

  async function handleNewReminderSubmit(e) {
    e.preventDefault();

    try {
        await axios.post(`/api/reminder`, {
          title,
          description,
          dueDate: new Date(dueDate).toISOString(),
          groupId: id,
        });
        fetchData();
      } catch (err) {
      console.error(err);
    }
  }

  function handleChange(selectedOptions) {
    setUserIds(selectedOptions.map((option) => option.value));
  }

  async function handleDeleteReminder(reminderId) {
    try {
      await axios.delete(`/api/reminder/${reminderId}`);
      setGroup(group => {
        const updatedReminders = group.reminders.filter(reminder => reminder.id !== reminderId);
        return { ...group, reminders: updatedReminders };
      });
    } catch (err) {
      console.error(err);
    }
  }

  async function handleDeleteGroup() {
    try {
      await axios.delete(`/api/group/${id}`);
      router.push('/groups');
    } catch (err) {
      console.error(err);
    }
  }

  async function handleUpdateReminderSubmit(e, reminderId) {
    e.preventDefault();
    closeModal();

    try {
      //Crée un objet qui contient les champs modifiés
      const updatedReminder = {};
      if (title !== '') {
        updatedReminder.title = title;
      }
      if (description !== '') {
        updatedReminder.description = description;
      }
      if (dueDate !== '') {
        updatedReminder.dueDate = new Date(dueDate).toISOString();
      }
      const res = await axios.put(`/api/reminder/${reminderId}`, updatedReminder);

      setTitle('');
      setDescription('');
      setDueDate('');
      fetchData();
    } catch (err) {
      console.error(err);
    }
  }
  
  function openModal(reminderId) {
    setIsOpen(true);
    setReminderId(reminderId);
  }

  function closeModal() {
    setIsOpen(false);
  }

    // Vérifier si l'utilisateur appartient au groupe
    const userIsMember = members.some(member => member.email === session?.user?.email);

    // Si l'utilisateur n'appartient pas au groupe, afficher un message d'erreur
    if (!userIsMember) {
      return (
        <div className={styles.container}>
          <Head>
            <title>Erreur - Remindr</title>
          </Head>
  
          <main className={styles.main}>
            <h1 className={styles.title}>
              Vous n'avez pas accès à cette page.
            </h1>
  
            <p>
              Vous devez être membre du groupe pour accéder à cette page.
            </p>
  
            <Link href="/groups">
              Retourner à la liste des groupes
            </Link>
          </main>
  
          <footer className={styles.footer}>
            Fait par Yanis Riani ce gros beau gosse
          </footer>
        </div>
      )
    }

  return (
    <div className={styles.container}>
      <Head>
        <title>{group.name}</title>
        <meta name="description" content={`Rappels pour le groupe ${group.name}`} />
      </Head>

      <nav className={styles.nav}>
        <Link href="/">
          Accueil
        </Link>
        <Link href="/groups">
          Liste des groupes
        </Link>
      </nav>

      <main className={styles.container}>
        <h1 className={styles.title}>
          {group.name}
        </h1>

        {session && (
          <>
            {reminderId && (
              <Modal
              isOpen={modalIsOpen}
              onRequestClose={closeModal}
              className={styles.modal}
              >
                <form onSubmit={(e) => handleUpdateReminderSubmit(e, reminderId)} className={styles.card}>
                  <h2>Modifier {group.reminders.find((reminder) => reminder.id === reminderId).title}</h2>

                  <label htmlFor="reminderTitle">Titre</label>
                  <input
                    type="text"
                    id="reminderTitle"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className={styles.input}
                  />

                  <label htmlFor="reminderDescription">Description</label>
                  <input
                    type="text"
                    id="reminderDescription"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className={styles.input}
                  />

                  <label htmlFor="reminderDueDate">Date de fin</label>
                  <input
                    type="datetime-local"
                    id="reminderDueDate"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    className={styles.input}
                  />

                  <button type="submit" className={styles.button}>Enregistrer</button>
                  <button onClick={() => setReminderId(null)} className={styles.button}>Annuler</button>
                </form>
              </Modal>
          )}  
            {members.length > 0 && (
              <ul className={styles.ul}>
                <div className={styles.card}>
                  <h1 className={styles.h1} >Membres</h1>
                  {members.map((member) => (
                    <li key={member.id}>{member.name}</li>
                  ))}
                </div>
              </ul>
            )}
            <ul className={styles.ul}>
              {group.reminders?.length > 0 ? (
                group.reminders.map((reminder) => (
                  <div className={styles.card}>
                    <li key={reminder.id}>
                        <h3>{reminder.title}</h3>
                        <p>{new Date(reminder.dueDate).toLocaleDateString()}</p>
                        <p>{reminder.description}</p>
                        <button onClick={() => openModal(reminder.id)} className={styles.button}>Modifier</button>
                        <button onClick={() => handleDeleteReminder(reminder.id)} className={styles.button}>Supprimer</button>
                    </li>
                  </div>
                ))
              ) : (
                <div className={styles.card}>
                  <p>Aucun rappel pour ce groupe</p>
                </div>
              )}
            </ul>
            <form onSubmit={handleNewReminderSubmit}>
              <div className={styles.card}>
                <h2>Ajouter un rappel</h2>

                <label htmlFor="reminderTitle">Titre</label>
                <input
                  type="text"
                  id="reminderTitle"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className={styles.input}
                />

                <label htmlFor="reminderDescription">Description</label>
                <input type="text" id="reminderDescription" value={description} onChange={(e) => setDescription(e.target.value)} className={styles.input}/>

                <label htmlFor="reminderDueDate">Date de fin</label>
                <input
                  type="datetime-local"
                  id="reminderDueDate"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  className={styles.input}
                />

                <button type="submit" className={styles.button}>Enregistrer</button>
              </div>
            </form>

            <form onSubmit={handleNameChange}>
              <div className={styles.card}>
                <label htmlFor="newName">Modifier le nom du groupe</label>
                <input
                  type="text"
                  id="newName"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className={styles.input}
                />

                <button type="submit" className={styles.button}>Valider</button>
              </div>
            </form>

            <form onSubmit={handleUserIdsChange}>
              <div className={styles.card}>
                <label htmlFor="members"><h2>Modifier les membres</h2></label>
                <Select
                  id="members"
                  options={allUsers.map((user) => ({ value: user.id, label: user.name }))}
                  isMulti
                  value={allUsers.filter((user) => userIds.includes(user.id)).map((user) => ({ value: user.id, label: user.name }))}
                  onChange={handleChange}
                  styles={customStyles}
                />

                <button type="submit" className={styles.button}>Valider</button>
              </div>
            </form>
            <button onClick={handleDeleteGroup} className={styles.deleteButton}>Supprimer le groupe</button>
          </>
        )}

        {!session && (
          <>
            <div className={styles.container}>
              <div className={styles.card}>
                <h2>Connectez-vous pour accéder à votre interface de gestion de rappels.</h2>
                <Link href="/login">Se connecter</Link>
              </div>
            </div>
          </>
        )}
        <footer className={styles.footer}>
          Fait par Yanis Riani
        </footer>
      </main>
    </div>
  );
}