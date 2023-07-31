import { useSession } from "next-auth/react";
import { useRouter } from "next/router";

export default function NewProblemPage() {
  const session = useSession();
  const router = useRouter();

  if (session.status === "loading" || !router.isReady) return <>loading</>;
  if (session.data?.user.role !== "Admin") router.replace("/");
  return <>Unimplemented</>;
}
