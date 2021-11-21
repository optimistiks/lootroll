import { useCallback } from "react";
import { getDoc, addDoc as addFirestoreDoc, WithFieldValue } from "firebase/firestore";
import { getCollectionRef, getQueryKeyFromPath } from "../utils";
import { UseCollectionOptions, UseCollectionPath } from "../types";
import { useQueryClient } from "react-query";
import { PATH_SEPARATOR } from "../constants";

export function useCollectionCallbacks<T>(path: UseCollectionPath, options: UseCollectionOptions<T> = {}) {
  const queryClient = useQueryClient();
  const addDoc = useCallback(
    async (data: WithFieldValue<T>) => {
      if (!path) {
        return;
      }
      const docRef = await addFirestoreDoc(getCollectionRef<T>(path, options), data);
      const docPath = `${path}${PATH_SEPARATOR}${docRef.id}`;
      const docSnap = await getDoc(docRef);
      queryClient.setQueryData(getQueryKeyFromPath(docPath), docSnap.data());
      queryClient.invalidateQueries(path);
    },
    [queryClient, path, options]
  );
  return { addDoc };
}
