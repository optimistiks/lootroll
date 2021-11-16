import { doc, getFirestore, collection, CollectionReference } from "firebase/firestore";
import { UseDocumentOptions } from "./types";

export function getDocRef<T>(path: string, options: UseDocumentOptions<T> = {}) {
  const split = path.split("/");
  const docKey = split.pop();
  if (options.converter) {
    return doc<T>(getCollectionRef<T>(path, options), docKey).withConverter(options.converter);
  }
  return doc<T>(getCollectionRef<T>(path), docKey);
}

export function getCollectionRef<T>(path: string, options: UseDocumentOptions<T> = {}) {
  const split = path.split("/");
  split.pop();
  const collectionKey = split.join("/");
  if (options.converter) {
    return collection(getFirestore(), collectionKey).withConverter(options.converter);
  }
  // collection() method does not have a generic to pass T to
  return collection(getFirestore(), collectionKey) as CollectionReference<T>;
}
