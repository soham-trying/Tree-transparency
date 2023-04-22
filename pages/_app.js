import "@/styles/globals.css";
import Header from "@/components/Header";
import { UserContextProvider } from "@/services/userContext";

export default function App({ Component, pageProps }) {
  return (
    <UserContextProvider>
      <Header />

      <main className="h-screen">
        <Component {...pageProps} />
      </main>
    </UserContextProvider>
  );
}
