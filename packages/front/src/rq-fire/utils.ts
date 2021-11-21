import { doc, getFirestore, collection, CollectionReference, DocumentData } from "firebase/firestore";
import { UseCollectionOptions, UseCollectionQuery, UseDocumentOptions } from "./types";
import { PATH_SEPARATOR } from "./constants";

export function getQueryKeyFromPath(path: string | null) {
  return typeof path === "string" ? path.split(PATH_SEPARATOR) : [path];
}

export function getCollectionQueryKey(path: string | null, query: UseCollectionQuery = {}) {
  return [...getQueryKeyFromPath(path), query];
}

export function getDocumentKeyFromDocumentPath(path: string) {
  return path.split(PATH_SEPARATOR).pop();
}

export function getCollectionKeyFromDocumentPath(path: string) {
  const split = path.split(PATH_SEPARATOR);
  return split.slice(0, split.length - 1).join(PATH_SEPARATOR);
}

export function getDocRef<T = DocumentData>(path: string, options: UseDocumentOptions<T> = {}) {
  const docKey = getDocumentKeyFromDocumentPath(path);
  const collectionKey = getCollectionKeyFromDocumentPath(path);
  if (options.converter) {
    return doc(collection(getFirestore(), collectionKey), docKey).withConverter(options.converter);
  }
  return doc<T>(collection(getFirestore(), collectionKey) as CollectionReference<T>, docKey);
}

export function getCollectionRef<T = DocumentData>(path: string, options: UseCollectionOptions<T> = {}) {
  if (options.converter) {
    return collection(getFirestore(), path).withConverter(options.converter);
  }
  // collection() method does not have a generic to pass T to
  return collection(getFirestore(), path) as CollectionReference<T>;
}
