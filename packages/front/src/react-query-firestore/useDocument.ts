import { DocumentData } from "firebase/firestore";
import { UseDocumentOptions } from "./types";
import { useDocumentCallbacks } from "./useDocumentCallbacks";
import { useDocumentOnSnapshot } from "./useDocumentOnSnapshot";
import { useDocumentReactQuery } from "./useDocumentReactQuery";

export function useDocument<T = DocumentData>(path: string | null, options: UseDocumentOptions<T> = {}) {
  const result = useDocumentReactQuery<T>(path, options);
  useDocumentOnSnapshot<T>(path, options);
  const callbacks = useDocumentCallbacks<T>(path, options);
  return { ...result, ...callbacks };
}
