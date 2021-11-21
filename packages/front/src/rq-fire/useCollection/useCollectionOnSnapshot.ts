import { useEffect } from "react";
import { useQueryClient } from "react-query";
import { onSnapshot } from "firebase/firestore";
import { getCollectionQueryKey, getCollectionRef } from "../utils";
import { UseCollectionOptions, UseCollectionPath, UseCollectionQuery } from "../types";
import { buildQuery } from "./buildQuery";

export function useCollectionOnSnapshot<T>(
  path: UseCollectionPath,
  query: UseCollectionQuery = {},
  options: UseCollectionOptions<T> = {}
) {
  const queryClient = useQueryClient();
  // set up a firestore listener that will update the query results with incoming data
  useEffect(() => {
    if (!options?.listen || !path) {
      return;
    }
    const collectionRef = getCollectionRef<T>(path, options);
    const q = buildQuery(collectionRef, query);
    const unsub = onSnapshot(q, (querySnapshot) => {
      const items = querySnapshot.docs.map((doc) => doc.data());
      queryClient.setQueryData(getCollectionQueryKey(path, query), items);
    });
    return () => {
      unsub();
    };
  }, [query, path, options, queryClient]);
}
