import { signIn, signOut, useSession } from "next-auth/react";
import Head from "next/head";
import Link from "next/link";

export function MyHead(props: { title: string; override?: boolean }) {
  return (
    <Head>
      <title>
        {props.override ? props.title : `EroJudge - ${props.title}`}
      </title>
      <meta
        name="description"
        content="EroJudge - An industry-leading online coding platform"
      />
      <link rel="icon" href="/favicon.ico" />
    </Head>
  );
}

export function Header() {
  const session = useSession();

  return (
    <>
      <h1>EroJudge</h1>
      <p>An industry-leading online coding platform</p>
      <Link href="/">Home</Link>

      <span> | </span>

      <Link href="/problems">Problems</Link>

      <span> | </span>

      <Link href="/users">Users</Link>

      <span> | </span>

      <Link href="/submissions">Submissions</Link>

      <span> | </span>

      {!session.data && <span>Guest</span>}
      {session.data && (
        <Link href={`/users/${session.data.user.id}`}>
          {session.data.user.name}
        </Link>
      )}

      <span> | </span>

      {!session.data && <button onClick={() => signIn()}>Sign In</button>}
      {session.data && <button onClick={() => signOut()}>Sign Out</button>}
    </>
  );
}
