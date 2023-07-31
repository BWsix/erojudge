import Image from "next/image";
import Link from "next/link";
import { RouterOutputs, api } from "~/utils/api";

export function Users(props: { data?: RouterOutputs["user"]["getAll"] }) {
  const users = api.user.getAll.useQuery(undefined, {
    placeholderData: props.data,
    enabled: !props.data,
  });
  return (
    <>
      <h3>Users</h3>
      <ul>
        {users.data?.map((user) => (
          <li key={user.id}>
            <Link href={`/users/${user.id}`}>
              <Image
                src={user.image as string}
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
