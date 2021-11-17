import { useCallback } from "react";
import { useQueryClient } from "../../node_modules/react-query";
import {
  getDoc,
  setDoc as setFirestoreDoc,
  SetOptions,
  PartialWithFieldValue,
  updateDoc as updateFirestoreDoc,
  UpdateData,
  deleteDoc as deleteFirestoreDoc
} from "firebase/firestore";
import { getDocRef } from "./utils";
import { UseDocumentOptions, UseDocumentPath } from "./types";

export function useDocumentCallbacks<T>(path: UseDocumentPath, options: UseDocumentOptions<T> = {}) {
  const queryClient = useQueryClient();
  const setDoc = useCallback(
    async (data: PartialWithFieldValue<T>, setOpts: SetOptions = {}) => {
      if (!path) {
        throw new Error("could not set, path is null");
      }
      const docRef = getDocRef<T>(path, options);
      await setFirestoreDoc(docRef, data, setOpts);
      const docSnap = await getDoc(docRef);
      queryClient.setQueryData([path], docSnap.data());
    },
    [path, options, queryClient]
  );
  const updateDoc = useCallback(
    async (data: UpdateData<T>) => {
      if (!path) {
        throw new Error("could not update, path is null");
      }
      const docRef = getDocRef<T>(path, options);
      await updateFirestoreDoc(docRef, data);
      const docSnap = await getDoc(docRef);
      queryClient.setQueryData([path], docSnap.data());
    },
    [path, options, queryClient]
  );
  const deleteDoc = useCallback(async () => {
    if (!path) {
      throw new Error("could not update, path is null");
    }
    const docRef = getDocRef<T>(path, options);
    await deleteFirestoreDoc(docRef);
    const docSnap = await getDoc(docRef);
    queryClient.setQueryData([path], docSnap.data());
  }, [path, options, queryClient]);
  return { setDoc, updateDoc, deleteDoc };
}
