import Link from "next/link";
import { RouterOutputs, api } from "~/utils/api";

export function Problems(props: { data?: RouterOutputs["problem"]["getAll"] }) {
  const problems = api.problem.getAll.useQuery(undefined, {
    placeholderData: props.data,
    enabled: !props.data,
  });

  return (
    <>
      <h3>Problems</h3>
      <ul>
        {problems.data?.map((problem) => (
          <li key={problem.id}>
            <Link href={`/problems/${problem.id}`}>{problem.title}</Link>
          </li>
        ))}
      </ul>
    </>
  );
}
