import { useRouter } from "next/router";
import { Header, MyHead } from "~/components/Misc";
import { api } from "~/utils/api";
import { ProblemDescription } from "~/components/ProblemPage";
import { SubmitResult } from "~/components/Submissions";

export default function ProblemPage() {
  const router = useRouter();
  const id = router.query.id as string;
  const submisson = api.submission.get.useQuery(
    { id },
    { enabled: router.isReady }
  );

  if (!router.isReady) return <>loading</>;
  if (submisson.isLoading) return <>loading</>;
  if (!submisson.data) return <>not found</>;
  return (
    <>
      <MyHead title="submisson detail" />
      <main>
        <Header />
        <hr />
        <ProblemDescription data={submisson.data.problem} />
        <hr />
        <SubmitResult data={submisson.data} />
      </main>
    </>
  );
}
