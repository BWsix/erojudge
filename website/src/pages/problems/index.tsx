import { MyHead, Header } from "~/components/Misc";
import { Problems } from "~/components/Problems";

export default function ProblemsPage() {
  return (
    <>
      <MyHead title="Problems" />
      <main>
        <Header />
        <hr />
        <Problems />
      </main>
    </>
  );
}
