import Link from "next/link";
import { type RouterOutputs } from "~/utils/api";

export function Problems(problems: {
  data: RouterOutputs["problem"]["getAll"] | undefined;
}) {
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
