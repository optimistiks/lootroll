import type { AppProps } from "next/app";
import { ChakraProvider } from "@chakra-ui/react";
import { QueryClient, QueryClientProvider } from "react-query";
import { useRef } from "react";
import { FirebaseContext, app } from "../src/initFirebase";

function MyApp({ Component, pageProps }: AppProps) {
  const queryClientRef = useRef<QueryClient>(new QueryClient());
  return (
    <FirebaseContext.Provider value={app}>
      <QueryClientProvider client={queryClientRef.current}>
        <ChakraProvider>
          <Component {...pageProps} />
        </ChakraProvider>
      </QueryClientProvider>
    </FirebaseContext.Provider>
  );
}

export default MyApp;
