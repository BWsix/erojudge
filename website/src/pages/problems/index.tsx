import Head from "next/head";
import { Header } from "~/components/Header";
import { Problems } from "~/components/Problems";

export default function ProblemsHome() {
  return (
    <>
      <Head>
        <title>EroJudge - Problems</title>
        <meta
          name="description"
          content="EroJudge - An industry-leading online coding platform"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <Header />
        <hr />
        <Problems />
      </main>
    </>
  );
}
