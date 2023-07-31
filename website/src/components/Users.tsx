import Image from "next/image";
import Link from "next/link";
import { type RouterOutputs } from "~/utils/api";

export function Users(users: {
  data: RouterOutputs["user"]["getAll"] | undefined;
}) {
  return (
    <>
      <h3>Users</h3>
      <ul>
        {users.data?.map((user) => (
          <li key={user.id}>
            <Link href={`/users/${user.id}`}>
              <Image
                src={user.image}
                alt="avatar"
                style={{ textAlign: "center" }}
                width={50}
                height={50}
              />
              {user.name}
            </Link>
          </li>
        ))}
      </ul>
    </>
  );
}
