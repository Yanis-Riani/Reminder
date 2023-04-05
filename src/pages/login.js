import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useSession, getProviders, signIn } from 'next-auth/react';
import styles from '../styles/index.module.css';

export default function LoginPage({ providers }) {
  const router = useRouter();
  const { data: session } = useSession();

  if (session) {
    router.push('/');
    return null;
  }

  return (
    <div className={styles.container}>
      <nav className={styles.nav}>
        <Link href="/">
          Accueil
        </Link>
        <Link href="/groups">
          Liste des groupes
        </Link>
      </nav>
      <div>
        {Object.values(providers).map((provider) => (
          <div key={provider.name}>
            <button onClick={() => signIn(provider.id)} className={styles.button}>Sign in with {provider.name}</button>
          </div>
        ))}
      </div>
    </div>
  );
}

export async function getServerSideProps(context) {
  const providers = await getProviders();

  return {
    props: { providers },
  };
}
