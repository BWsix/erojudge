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
      <p>
        An industry-leading online coding platform
        <br />
        (definitly <b>not</b> a shitily thrown together knockoff of some online
        judge out there)
      </p>

      <Link href="/">Home</Link>

      <span> | </span>
      <Link href="/problems">Problems</Link>

      <span> | </span>
      <Link href="/users">Users</Link>

      <span> | </span>
      <Link href="/submissions">Submissions</Link>

      {session.status === "authenticated" &&
        session.data.user.role === "Admin" && (
          <>
            <span> | </span>
            <Link href="/problems/new">New Problem</Link>
          </>
        )}

      <span> | </span>
      {session.status === "unauthenticated" && <span>Guest</span>}
      {session.status === "authenticated" && (
        <Link href={`/users/${session.data.user.id}`}>
          {session.data.user.name}
        </Link>
      )}

      <span> | </span>
      {session.status === "unauthenticated" && (
        <button onClick={() => signIn()}>Sign In</button>
      )}
      {session.status === "authenticated" && (
        <button onClick={() => signOut()}>Sign Out</button>
      )}
    </>
  );
}
