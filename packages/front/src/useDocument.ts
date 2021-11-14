import { useEffect } from "react";
import { useQuery, useQueryClient } from "react-query";
import {
  doc,
  getDoc,
  getFirestore,
  onSnapshot,
  FirestoreDataConverter,
  DocumentData,
  Unsubscribe
} from "firebase/firestore";

interface UseDocumentOptions<DocumentType> {
  listen?: boolean;
  converter?: FirestoreDataConverter<DocumentType>;
}

export function useDocument<DocumentType = DocumentData>(
  path: string | null,
  options?: UseDocumentOptions<DocumentType>
) {
  const queryClient = useQueryClient();

  // set up a normal react-query query, make sure that passing null as path disables the query
  const result = useQuery<unknown, unknown, DocumentType>(
    [path],
    () => {
      if (!path) {
        return Promise.reject("missing path");
      }
      if (options?.converter) {
        return getDoc(doc(getFirestore(), path).withConverter(options.converter)).then((doc) => doc.data());
      }
      return getDoc(doc(getFirestore(), path)).then((doc) => doc.data());
    },
    {
      enabled: path !== null
    }
  );

  // set up a firestore listener that will update the query results with incoming data
  useEffect(() => {
    if (!options?.listen || !path) {
      return;
    }
    let unsub: Unsubscribe;
    if (options.converter) {
      unsub = onSnapshot(doc(getFirestore(), path).withConverter(options.converter), (doc) => {
        queryClient.setQueryData([path], doc.data());
      });
    } else {
      unsub = onSnapshot(doc(getFirestore(), path), (doc) => {
        queryClient.setQueryData([path], doc.data());
      });
    }
    return () => {
      unsub();
    };
  }, [path, options, queryClient]);

  return result;
}
