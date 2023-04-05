import '@/styles/globals.css'
import { SessionProvider, getSession } from "next-auth/react"

export default function App({ Component, pageProps: { session, ...pageProps }}) {

  return (
    <SessionProvider session={session}>
        <Component {...pageProps} />
    </SessionProvider>
  );
}

App.getInitialProps = async ({ Component, ctx }) => {
  const session = await getSession(ctx);

  const pageProps = Component.getInitialProps ? await Component.getInitialProps(ctx) : {};

  return { session, pageProps };
};


