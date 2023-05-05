import "@/styles/globals.css";
import { UserContextProvider } from "@/services/userContext";
import Navbar from "@/components/Navbar";
import { auth, firestore } from "@/services/firebase";
import { useUserStore } from "@/store/user";
import { doc, getDoc } from "firebase/firestore";
import { useEffect } from "react";

export default function App({ Component, pageProps }) {
  const { setUser, userStore } = useUserStore();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((res) => {
      if (!res.email) return;

      const email = res.email;
      const docRef = doc(firestore, "Users", email);

      getDoc(docRef)
        .then((res) => {
          setUser({ email, ...res.data() });
        })
        .catch((err) => console.error(err));
    });

    return () => unsubscribe();
  }, []);

  return (
    <UserContextProvider>
      <main className="h-screen">
        <Navbar />
        <Component {...pageProps} />
      </main>
    </UserContextProvider>
  );
}
