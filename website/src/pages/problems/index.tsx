import { MyHead, Header } from "~/components/Misc";
import { Problems } from "~/components/Problems";
import { api } from "~/utils/api";

export default function ProblemsPage() {
  const problems = api.problem.getAll.useQuery();
  return (
    <>
      <MyHead title="Problems" />
      <main>
        <Header />
        <hr />
        <Problems data={problems.data} />
      </main>
    </>
  );
}
