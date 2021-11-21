import { DocumentData } from "firebase/firestore";
import { UseCollectionOptions, UseCollectionPath } from "../types";
import { useCollectionReactQuery } from "./useCollectionReactQuery";
import { useCollectionOnSnapshot } from "./useCollectionOnSnapshot";
import { useCollectionCallbacks } from "./useCollectionCallbacks";
import { useMemo } from "react";

export function useCollection<T = DocumentData>(path: UseCollectionPath, opts: UseCollectionOptions<T> = {}) {
  const { options, query } = useMemo(() => {
    const { listen, converter, ...query } = opts;
    return { options: { listen, converter }, query };
  }, [opts]);
  const result = useCollectionReactQuery<T>(path, query, options);
  useCollectionOnSnapshot(path, query, options);
  const callbacks = useCollectionCallbacks<T>(path, options);
  return { ...result, ...callbacks };
}
