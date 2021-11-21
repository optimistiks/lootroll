import { useQuery } from "react-query";
import { getDocs } from "firebase/firestore";
import { getCollectionRef, getQueryKeyFromPath } from "../utils";
import { UseCollectionOptions, UseCollectionPath, UseCollectionQuery } from "../types";
import { buildQuery } from "./buildQuery";

export function useCollectionReactQuery<T>(
  path: UseCollectionPath,
  query: UseCollectionQuery = {},
  options: UseCollectionOptions<T> = {}
) {
  const { listen, converter, ...useQueryOptions } = options;
  return useQuery<T[] | undefined>(
    [...getQueryKeyFromPath(path)],
    async () => {
      if (!path) {
        return Promise.reject("missing path");
      }
      const collectionRef = getCollectionRef<T>(path, options);
      const q = buildQuery(collectionRef, query);
      const snaps = await getDocs(q);
      const items: T[] = [];
      snaps.forEach((snap) => {
        items.push(snap.data());
      });
      return items;
    },
    {
      enabled: path !== null,
      ...useQueryOptions
    }
  );
}
