import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useState } from "react";
import { Header, MyHead } from "~/components/Misc";
import { Editor, ProblemDescription } from "~/components/ProblemPage";
import { api } from "~/utils/api";

export default function ProblemPage() {
  const router = useRouter();
  const session = useSession();

  const id = parseInt(router.query.id as string);
  const problem = api.problem.getDescription.useQuery(
    { id },
    { enabled: router.isReady && !isNaN(id) }
  );
  const submit = api.problem.submit.useMutation();
  const [code, setCode] = useState("");
  const [language, setLanguage] = useState("cpp");

  if (!router.isReady) return <>loading</>;
  if (isNaN(id)) return <>invaid id</>;
  if (problem.isLoading) return <>loading</>;
  if (!problem.data) return <>not found</>;
  return (
    <>
      <MyHead override title={problem.data.title} />
      <main>
        <Header />
        <hr />
        <ProblemDescription data={problem.data} />
        <hr />
        {!session.data && <button onClick={() => signIn()}>signIn</button>}
        {session.data && (
          <Editor
            code={code}
            setCode={setCode}
            setLanguage={setLanguage}
            onClick={() =>
              submit
                .mutateAsync({ id, code, language })
                .then(({ id }) => router.push(`/submissions/${id}`))
            }
          />
        )}
      </main>
    </>
  );
}
