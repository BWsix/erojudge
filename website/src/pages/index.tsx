import { Header, MyHead } from "~/components/Misc";

export default function HomePage() {
  return (
    <>
      <MyHead override title="EroJudge" />
      <main>
        <Header />
        <hr />
        <h2
          style={{
            lineHeight: "60vh",
            textAlign: "center",
          }}
        >
          Welcome to erojudge :)
        </h2>
      </main>
    </>
  );
}
