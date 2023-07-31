import Link from "next/link";
import { RouterOutputs, api } from "~/utils/api";

export function Submissions(props: {
  data?: RouterOutputs["submission"]["getAll"];
}) {
  const submissions = api.submission.getAll.useQuery(undefined, {
    placeholderData: props.data,
    enabled: !props.data,
  });

  if (!submissions.data) return <>loading</>;
  return (
    <>
      <h3>Submissions</h3>
      <ul>
        {submissions.data.map((submission) => (
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
      <textarea readOnly value={submit.data.code} style={{ width: "700px" }} />
      <hr />
      <h3>送出結果</h3>
      <p>{submit.data.status}</p>
      {submit.data.message !== "" && (
        <>
          <textarea
            readOnly
            value={submit.data.message}
            style={{ width: "700px" }}
          />
          <br />
        </>
      )}
    </>
  );
}
