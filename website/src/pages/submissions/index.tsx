import { Header, MyHead } from "~/components/Misc";
import { Submissions } from "~/components/Submissions";
import { api } from "~/utils/api";

export default function SubmissionsPage() {
  const submissions = api.submission.getAll.useQuery();

  return (
    <>
      <MyHead title="Submissions" />
      <main>
        <Header />
        <hr />
        <Submissions data={submissions.data} />
      </main>
    </>
  );
}
