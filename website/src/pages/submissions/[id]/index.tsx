import { useRouter } from "next/router";
import { Header, MyHead } from "~/components/Misc";
import { SubmitResult } from "~/components/Submissions";
import { api } from "~/utils/api";

export default function ProblemPage() {
  const router = useRouter();
  const id = router.query.id as string;
  const submission = api.submission.get.useQuery(
    { id },
    { enabled: router.isReady }
  );

  if (!router.isReady) return <>loading</>;
  if (submission.isLoading) return <>loading</>;
  if (!submission.data?.found) return <>not found</>;
  return (
    <>
      <MyHead title="submisson detail" />
      <main>
        <Header />
        <hr />
        {!submission.data.submission && <p>This is a private submission</p>}
        {submission.data.submission && (
          <SubmitResult data={submission.data.submission} />
        )}
      </main>
    </>
  );
}
