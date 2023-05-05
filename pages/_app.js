import "@/styles/globals.css";
import { UserContextProvider } from "@/services/userContext";
import Navbar from "@/components/Navbar";
import { auth, firestore } from "@/services/firebase";
import { useUserStore } from "@/store/user";
import { doc, getDoc } from "firebase/firestore";
import { useEffect } from "react";
import { ThemeProvider } from "next-themes";

export default function App({ Component, pageProps }) {
  const { setUser } = useUserStore();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (!user.email) return;

      const email = user.email;
      const photoURL = user?.photoURL ? user.photoURL : undefined;
      const docRef = doc(firestore, "Users", email);

      getDoc(docRef)
        .then((res) => {
          setUser({ email, photoURL, ...res.data() });
        })
        .catch((err) => console.error(err));
    });

    return () => unsubscribe();
  }, []);

  return (
    <ThemeProvider>
      <UserContextProvider>
        <main className="h-screen">
          <Navbar />
          <Component {...pageProps} />
        </main>
      </UserContextProvider>
    </ThemeProvider>
  );
}
