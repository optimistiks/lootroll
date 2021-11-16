import { useEffect } from "react";
import { useQuery, useQueryClient, UseQueryOptions } from "react-query";
import {
  doc,
  getDoc,
  getFirestore,
  onSnapshot,
  FirestoreDataConverter,
  Unsubscribe,
  DocumentData,
  collection,
  CollectionReference
} from "firebase/firestore";

interface UseDocumentOptions extends UseQueryOptions<{ test: number } | undefined> {
  listen?: boolean;
}

export function useDocument(path: string | null, options: UseDocumentOptions = {}) {
  const { listen, ...useQueryOptions } = options;
  const queryClient = useQueryClient();
  // set up a normal react-query query, make sure that passing null as path disables the query
  const result = useQuery<{ test: number } | undefined>(
    [path],
    () => {
      if (!path) {
        return Promise.reject("missing path");
      }
      const split = path.split("/");
      const docKey = split.pop();
      const collectionKey = split.join("/");
      const collectionReference = collection(getFirestore(), collectionKey) as CollectionReference<{ test: number }>;
      return getDoc<{ test: number }>(doc<{ test: number }>(collectionReference, docKey)).then((doc) => doc.data());
    },
    {
      enabled: path !== null,
      ...useQueryOptions
    }
  );
  // set up a firestore listener that will update the query results with incoming data
  useEffect(() => {
    if (!options?.listen || !path) {
      return;
    }
    let unsub: Unsubscribe;
    unsub = onSnapshot(doc(getFirestore(), path), (doc) => {
      queryClient.setQueryData([path], doc.data());
    });
    return () => {
      unsub();
    };
  }, [path, options, queryClient]);
  return result;
}
