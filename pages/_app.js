import "@/styles/globals.css";
import { UserContextProvider } from "@/services/userContext";
import Drawer from "@/components/Drawer";

export default function App({ Component, pageProps }) {
  return (
    <UserContextProvider>
      <Drawer>
        <main className="h-screen">
          <Component {...pageProps} />
        </main>
      </Drawer>
    </UserContextProvider>
  );
}
