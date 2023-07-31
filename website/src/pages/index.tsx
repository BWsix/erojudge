import { MyHead, Header } from "~/components/Misc";
import { Problems } from "~/components/Problems";
import { Submissions } from "~/components/Submissions";

export default function HomePage() {
  return (
    <>
      <MyHead override title="EroJudge" />
      <main>
        <Header />
        <hr />
        <Problems />
        <hr />
        <Submissions />
      </main>
    </>
  );
}
