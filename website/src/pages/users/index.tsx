import { Header, MyHead } from "~/components/Misc";
import { Users } from "~/components/Users";
import { api } from "~/utils/api";

export default function UsersPage() {
  const users = api.user.getAll.useQuery();

  return (
    <>
      <MyHead title="Users" />
      <main>
        <Header />
        <hr />
        <Users data={users.data} />
      </main>
    </>
  );
}
