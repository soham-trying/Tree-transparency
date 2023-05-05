import { useUserContext } from "@/services/userContext";
import { useUserStore } from "@/store/user";
import { useRouter } from "next/router";
import { useEffect } from "react";

export default function GuardedPage({ children }) {
  const { userStore } = useUserStore();
  const router = useRouter();

  useEffect(() => {
    !userStore && router.push("/");
  }, []);

  return <>{children}</>;
}
