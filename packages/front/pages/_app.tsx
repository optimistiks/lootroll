import "../styles/globals.css";
import type { AppProps } from "next/app";
import { ChakraProvider } from "@chakra-ui/react";
import { useFirebase, FirebaseContext } from "../src/initFirebase";

function MyApp({ Component, pageProps }: AppProps) {
  const { app } = useFirebase();
  return (
    <FirebaseContext.Provider value={app}>
      <ChakraProvider>
        <Component {...pageProps} />
      </ChakraProvider>
    </FirebaseContext.Provider>
  );
}

export default MyApp;
