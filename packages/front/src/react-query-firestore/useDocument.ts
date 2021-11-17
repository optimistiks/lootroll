import { DocumentData } from "firebase/firestore";
import { UseDocumentOptions, UseDocumentQueryKey } from "./types";
import { useDocumentCallbacks } from "./useDocumentCallbacks";
import { useDocumentOnSnapshot } from "./useDocumentOnSnapshot";
import { useDocumentReactQuery } from "./useDocumentReactQuery";
import { useMemo } from "react";

export function useDocument<T = DocumentData>(key: UseDocumentQueryKey, options: UseDocumentOptions<T> = {}) {
  const path = useMemo(() => {
    if (Array.isArray(key) && !options.hasOwnProperty("path")) {
      throw new Error("path must either be specified as key, or as options.path");
    }
    return Array.isArray(key) ? options.path : key;
  }, [key, options]);
  const result = useDocumentReactQuery<T>(key, path, options);
  useDocumentOnSnapshot<T>(path, options);
  const callbacks = useDocumentCallbacks<T>(path, options);
  return { ...result, ...callbacks };
}
