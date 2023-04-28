import "@/styles/globals.css";
import { UserContextProvider } from "@/services/userContext";
import Navbar from "@/components/Navbar";

export default function App({ Component, pageProps }) {

  return (
    <UserContextProvider>
      <main className="h-screen">
        <Navbar />
        <Component {...pageProps} />
      </main>
    </UserContextProvider>
  );
}
