import { useCallback } from "react";
import {
  getDoc,
  setDoc as setFirestoreDoc,
  SetOptions,
  PartialWithFieldValue,
  updateDoc as updateFirestoreDoc,
  UpdateData,
  deleteDoc as deleteFirestoreDoc
} from "firebase/firestore";
import { getDocRef, getDocumentKeyFromDocumentPath } from "../utils";
import { UseDocumentOptions, UseDocumentPath } from "../types";
import { useQueryClient } from "react-query";

export function useDocumentCallbacks<T>(path: UseDocumentPath, options: UseDocumentOptions<T> = {}) {
  const queryClient = useQueryClient();
  const setQueryData = useCallback(
    (data?: T) => {
      if (!path) {
        return;
      }
      const key = getDocumentKeyFromDocumentPath(path);
      if (!key) {
        return;
      }
      return queryClient.setQueryData(key, data);
    },
    [queryClient, path]
  );
  const setDoc = useCallback(
    async (data: PartialWithFieldValue<T>, setOpts: SetOptions = {}) => {
      if (!path) {
        throw new Error("could not set, path is null");
      }
      const docRef = getDocRef<T>(path, options);
      await setFirestoreDoc(docRef, data, setOpts);
      const docSnap = await getDoc(docRef);
      setQueryData(docSnap.data());
    },
    [path, options, setQueryData]
  );
  const updateDoc = useCallback(
    async (data: UpdateData<T>) => {
      if (!path) {
        throw new Error("could not update, path is null");
      }
      const docRef = getDocRef<T>(path, options);
      await updateFirestoreDoc(docRef, data);
      const docSnap = await getDoc(docRef);
      setQueryData(docSnap.data());
    },
    [path, options, setQueryData]
  );
  const deleteDoc = useCallback(async () => {
    if (!path) {
      throw new Error("could not update, path is null");
    }
    const docRef = getDocRef<T>(path, options);
    await deleteFirestoreDoc(docRef);
    const docSnap = await getDoc(docRef);
    setQueryData(docSnap.data());
  }, [path, options, setQueryData]);
  return { setDoc, updateDoc, deleteDoc };
}
