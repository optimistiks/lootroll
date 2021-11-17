import { useEffect } from "react";
import { useQueryClient } from "react-query";
import { onSnapshot } from "firebase/firestore";
import { getDocRef } from "./utils";
import { UseDocumentOptions, UseDocumentPath } from "./types";

export function useDocumentOnSnapshot<T>(path: UseDocumentPath, options: UseDocumentOptions<T> = {}) {
  const queryClient = useQueryClient();
  // set up a firestore listener that will update the query results with incoming data
  useEffect(() => {
    if (!options?.listen || !path) {
      return;
    }
    const unsub = onSnapshot(getDocRef<T>(path, options), (doc) => {
      queryClient.setQueryData([path], doc.data());
    });
    return () => {
      unsub();
    };
  }, [path, options, queryClient]);
}
