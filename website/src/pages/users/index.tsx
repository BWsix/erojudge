import { Header, MyHead } from "~/components/Misc";
import { Users } from "~/components/Users";

export default function UsersPage() {
  return (
    <>
      <MyHead title="Users" />
      <main>
        <Header />
        <hr />
        <Users />
      </main>
    </>
  );
}
