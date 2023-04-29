import "@/styles/globals.css";
import { UserContextProvider } from "@/services/userContext";
<<<<<<< Updated upstream
import Navbar from "@/components/Navbar";

export default function App({ Component, pageProps }) {

  return (
    <UserContextProvider>
      <main className="h-screen">
        <Navbar />
        <Component {...pageProps} />
      </main>
    </UserContextProvider>
=======
import { ThirdwebProvider, ChainId } from "@thirdweb-dev/react";

export default function App({ Component, pageProps }) {
  const activeChainId = ChainId.Goerli;

  return (
    <ThirdwebProvider desiredChainId={activeChainId}>
      <UserContextProvider>
        <Header />

        <main className="h-screen">
          <Component {...pageProps} />
        </main>
      </UserContextProvider>
    </ThirdwebProvider>
>>>>>>> Stashed changes
  );
}
