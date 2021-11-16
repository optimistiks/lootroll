import { useQuery } from "../../node_modules/react-query";
import { getDoc } from "firebase/firestore";
import { getDocRef } from "./utils";
import { UseDocumentOptions } from "./types";

export function useDocumentReactQuery<T>(path: string | null, options: UseDocumentOptions<T> = {}) {
  const { listen, converter, ...useQueryOptions } = options;
  // set up a normal react-query query, make sure that passing null as path disables the query
  return useQuery<T | undefined>(
    [path],
    () => {
      if (!path) {
        return Promise.reject("missing path");
      }
      return getDoc<T>(getDocRef<T>(path, options)).then((doc) => doc.data());
    },
    {
      enabled: path !== null,
      ...useQueryOptions
    }
  );
}
