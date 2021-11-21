import { DocumentData } from "firebase/firestore";
import { UseDocumentOptions, UseDocumentPath } from "../types";
import { useDocumentCallbacks } from "./useDocumentCallbacks";
import { useDocumentOnSnapshot } from "./useDocumentOnSnapshot";
import { useDocumentReactQuery } from "./useDocumentReactQuery";

export function useDocument<T = DocumentData>(path: UseDocumentPath, options: UseDocumentOptions<T> = {}) {
  const result = useDocumentReactQuery<T>(path, options);
  useDocumentOnSnapshot<T>(path, options);
  const callbacks = useDocumentCallbacks<T>(path, options);
  return { ...result, ...callbacks };
}
