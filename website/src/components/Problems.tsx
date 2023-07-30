import Link from "next/link";
import { api } from "~/utils/api";

export function Problems() {
  const problems = api.problem.getAll.useQuery();
  return (
    <>
      <h4>Problems:</h4>
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
