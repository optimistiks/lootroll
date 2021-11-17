import { UseQueryOptions } from "../../node_modules/react-query";
import { FirestoreDataConverter } from "firebase/firestore";

export type UseDocumentQueryKey = string | [] | null;
export type UseDocumentPath = string | null | undefined;

export interface UseDocumentOptions<T> extends UseQueryOptions<T | undefined>, Object {
  listen?: boolean;
  converter?: FirestoreDataConverter<T>;
  path?: UseDocumentPath;
}
