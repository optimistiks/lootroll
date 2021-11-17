import { useQuery } from "react-query";
import { getDoc } from "firebase/firestore";
import { getDocRef } from "./utils";
import { UseDocumentOptions } from "./types";

export function useDocumentReactQuery<T>(
  key: string | [] | null,
  path: string | null | undefined,
  options: UseDocumentOptions<T> = {}
) {
  const { listen, converter, ...useQueryOptions } = options;
  // set up a normal react-query query, make sure that passing null as path disables the query
  return useQuery<T | undefined>(
    key == null ? [key] : key,
    () => {
      if (!path || !key) {
        return Promise.reject("missing either path, or key, or both");
      }
      return getDoc<T>(getDocRef<T>(path, options)).then((doc) => doc.data());
    },
    {
      enabled: path != null && key != null,
      ...useQueryOptions
    }
  );
}
