import { Header, MyHead } from "~/components/Misc";
import { Problems } from "~/components/Problems";
import { Submissions } from "~/components/Submissions";
import { api } from "~/utils/api";

export default function HomePage() {
  const problems = api.problem.getAll.useQuery();
  const submissions = api.submission.getAll.useQuery();

  return (
    <>
      <MyHead override title="EroJudge" />
      <main>
        <Header />
        <hr />
        <Problems data={problems.data} />
        <hr />
        <Submissions data={submissions.data} />
      </main>
    </>
  );
}
