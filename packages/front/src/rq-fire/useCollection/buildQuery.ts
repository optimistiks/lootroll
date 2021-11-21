import {
  query,
  where,
  orderBy,
  limit,
  startAt,
  startAfter,
  endAt,
  endBefore,
  CollectionReference,
  QueryConstraint
} from "firebase/firestore";
import { isMultiWhere, isSingleWhere, UseCollectionQuery } from "../types";

export function buildQuery<T>(collectionRef: CollectionReference<T>, queryConfig: UseCollectionQuery) {
  const constraints: QueryConstraint[] = [];
  if (queryConfig.where) {
    if (isMultiWhere(queryConfig.where)) {
      queryConfig.where.forEach((w) => {
        constraints.push(where(...w));
      });
    } else if (isSingleWhere(queryConfig.where)) {
      constraints.push(where(...queryConfig.where));
    }
  }
  if (queryConfig.orderBy) {
    constraints.push(orderBy(queryConfig.orderBy[0], queryConfig.orderBy[1]));
  }
  if (queryConfig.limit) {
    constraints.push(limit(queryConfig.limit));
  }
  if (queryConfig.startAt) {
    constraints.push(startAt(queryConfig.startAt));
  }
  if (!queryConfig.startAt && queryConfig.startAfter) {
    constraints.push(startAfter(queryConfig.startAfter));
  }
  if (queryConfig.endAt) {
    constraints.push(endAt(queryConfig.endAt));
  }
  if (!queryConfig.endAt && queryConfig.endBefore) {
    constraints.push(endBefore(queryConfig.endBefore));
  }
  return query(collectionRef, ...constraints);
}
