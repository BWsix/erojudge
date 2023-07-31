import { Header, MyHead } from "~/components/Misc";
import { Submissions } from "~/components/Submissions";

export default function SubmissionsPage() {
  return (
    <>
      <MyHead title="Submissions" />
      <main>
        <Header />
        <hr />
        <Submissions />
      </main>
    </>
  );
}
