import { useRouter } from "next/router";
import Image from "next/image";
import { Header, MyHead } from "~/components/Misc";
import { api } from "~/utils/api";
import { Submissions } from "~/components/Submissions";

export default function ProblemPage() {
  const router = useRouter();
  const id = router.query.id as string;
  const user = api.user.get.useQuery({ id }, { enabled: router.isReady });

  if (!router.isReady) return <>loading</>;
  if (user.isLoading) return <>loading</>;
  if (!user.data) return <>not found</>;
  return (
    <>
      <MyHead title={user.data.name as string} />
      <main>
        <Header />
        <hr />
        <h3>{user.data.name}</h3>
        <Image
          src={user.data.image as string}
          alt="avatar"
          width={100}
          height={100}
        />
        <hr />
        <Submissions data={user.data.submission} />
      </main>
    </>
  );
}
