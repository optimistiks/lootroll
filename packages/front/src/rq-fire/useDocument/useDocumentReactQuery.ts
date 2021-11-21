import { useQuery } from "react-query";
import { getDoc } from "firebase/firestore";
import { getDocRef, getQueryKeyFromPath } from "../utils";
import { UseDocumentOptions } from "../types";

export function useDocumentReactQuery<T>(path: string | null, options: UseDocumentOptions<T> = {}) {
  const { listen, converter, ...useQueryOptions } = options;
  return useQuery<T | undefined>(
    getQueryKeyFromPath(path),
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
