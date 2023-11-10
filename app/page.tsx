import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "./api/auth/[...nextauth]/route";

export default async function Home() {
  const data = await getServerSession(authOptions);
  return (
    <div>
      {data ? (
        <>
          <p>Session user</p>
          <pre>{JSON.stringify(data.user, null, 2)}</pre>
        </>
      ) : (
        <Link href="/login">Login</Link>
      )}
    </div>
  );
}
