import Link from "next/link";
import { type RouterOutputs } from "~/utils/api";
import { Editor } from "./ProblemPage";
import CodeMirror from "@uiw/react-codemirror";

export function Submissions(submissions: {
  data: RouterOutputs["submission"]["getAll"] | undefined;
}) {
  return (
    <>
      <h3>Submissions</h3>
      <ul>
        {submissions.data?.map((submission) => (
          <li key={submission.id}>
            <Link href={`/users/${submission.user.id}`}>
              <span>{submission.user.name}</span>
            </Link>
            <span> | </span>
            <Link href={`/problems/${submission.problem.id}`}>
              {submission.problem.title}
            </Link>
            <span> | </span>
            <Link href={`/submissions/${submission.id}`}>
              <span>
                {submission.status} ({submission.language})
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </>
  );
}

export function SubmitResult(submit: {
  data: RouterOutputs["problem"]["submit"];
}) {
  if (!submit.data) return <>loading</>;
  return (
    <>
      <h3>Code submitted</h3>
      <Editor
        code={submit.data.code}
        setCode={() => {}}
        language={submit.data.language}
        readOnly
      />
      <hr />
      <h3>送出結果</h3>
      <p>{submit.data.status}</p>
      <CodeMirror value={submit.data.message} editable={false} />
    </>
  );
}
