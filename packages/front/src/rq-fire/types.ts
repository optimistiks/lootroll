import { UseQueryOptions } from "react-query";
import {
  FirestoreDataConverter,
  FieldPath,
  WhereFilterOp,
  OrderByDirection,
  DocumentSnapshot
} from "firebase/firestore";

export type UseDocumentPath = string | null;
export type UseCollectionPath = string | null;

export type Options<T> = {
  listen?: boolean;
  converter?: FirestoreDataConverter<T>;
};

export interface UseDocumentOptions<T> extends UseQueryOptions<T | undefined>, Object, Options<T> {}

export interface UseCollectionOptions<T> extends UseQueryOptions<T[] | undefined>, Options<T>, UseCollectionQuery {}

/* where */

type WhereField = string | FieldPath;
type WhereOp = WhereFilterOp;
type WhereValue = unknown;

export type SingleWhere = [WhereField, WhereOp, WhereValue];
export type MultiWhere = SingleWhere[];
export type WhereCondition = SingleWhere | MultiWhere;

export function isSingleWhere(where?: WhereCondition): where is SingleWhere {
  return !!where && !Array.isArray(where[0]);
}

export function isMultiWhere(where?: WhereCondition): where is MultiWhere {
  return !!where && Array.isArray(where[0]);
}

/* order by */

type OrderByField = string | FieldPath;
type OrderByCondition = [OrderByField] | [OrderByField, OrderByDirection];

/* limit */

type LimitCondition = number;

/* paginage */

type PaginateField = unknown | unknown[] | DocumentSnapshot;

export interface UseCollectionQuery {
  where?: WhereCondition;
  orderBy?: OrderByCondition;
  limit?: LimitCondition;
  startAt?: PaginateField;
  startAfter?: PaginateField;
  endAt?: PaginateField;
  endBefore?: PaginateField;
}
