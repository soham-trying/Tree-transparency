import { useUserContext } from "@/services/userContext";
import { useRouter } from "next/router";
import { useEffect } from "react";

export default function GuardedPage({ children }) {
  const { user } = useUserContext();
  const router = useRouter();

  useEffect(() => {
    !user && router.push("/");
  }, []);

  return <>{children}</>;
}
