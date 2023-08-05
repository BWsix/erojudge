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
        <h3>送出程式碼</h3>
        <Editor
          code={code}
          setCode={(val) => setCode(val)}
          language={language}
        />
        <input
          type="file"
          onChange={(e) =>
            e.target.files
              ?.item(0)
              ?.text()
              .then((content) => setCode(content))
          }
        />
        <select onChange={(e) => setLanguage(e.target.value)}>
          <option value="cpp">c++ (17)</option>
          <option value="c">c (11)</option>
          <option value="py">python (3.9)</option>
          <option value="bf">
            brainfuck (treats end of input as `\0`, overflow wraps around)
          </option>
        </select>
        {session.status === "unauthenticated" && (
          <button onClick={() => signIn()}>signIn to submit code</button>
        )}
        {session.status === "authenticated" && (
          <button
            onClick={() =>
              submit
                .mutateAsync({ id, code, language })
                .then(({ id }) => router.push(`/submissions/${id}`))
            }
          >
            送出
          </button>
        )}
      </main>
    </>
  );
}
