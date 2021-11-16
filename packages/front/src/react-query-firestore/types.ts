import { UseQueryOptions } from "../../node_modules/react-query";
import { FirestoreDataConverter } from "firebase/firestore";

export interface UseDocumentOptions<T> extends UseQueryOptions<T | undefined> {
  listen?: boolean;
  converter?: FirestoreDataConverter<T>;
}
