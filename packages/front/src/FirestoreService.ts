import {
  collection,
  doc,
  FirestoreDataConverter,
  getDoc,
  getFirestore,
  setDoc,
  writeBatch,
  query,
  getDocs,
  onSnapshot
} from "firebase/firestore";
import { FirestoreRecord } from "./FirestoreRecord";

export class FirestoreService<Record extends FirestoreRecord> {
  collectionKey: string;
  converter: FirestoreDataConverter<Record>;
  constructor(collectionKey: string, converter: FirestoreDataConverter<Record>) {
    this.collectionKey = collectionKey;
    this.converter = converter;
  }
  getNewKey() {
    return this.doc().id;
  }
  doc(docKey?: string) {
    if (docKey) {
      return doc(this.collection(), docKey).withConverter(this.converter);
    } else {
      return doc(this.collection()).withConverter(this.converter);
    }
  }
  collection() {
    return collection(this.db(), this.collectionKey).withConverter(this.converter);
  }
  db() {
    return getFirestore();
  }
  batch() {
    return writeBatch(this.db());
  }
  async update() {}
  async save(record: Record) {
    const ref = this.doc(record.getRecordKey());
    return setDoc(ref, record).then(() => record);
  }
  async fetch(recordKey: string) {
    const snap = await getDoc(this.doc(recordKey));
    return snap.data();
  }
  async fetchAll() {
    const q = query(this.collection());
    const snap = await getDocs(q);
    return snap.docs.map((doc) => doc.data());
  }
  listen(cb: (data: Record[]) => void) {
    const q = query(this.collection());
    return onSnapshot(q, (querySnapshot) => {
      const records: Record[] = [];
      querySnapshot.forEach((doc) => {
        records.push(doc.data());
      });
      cb(records);
    });
  }
  listenDoc(docKey: string, cb: (data: Record | undefined) => void) {
    const ref = this.doc(docKey);
    return onSnapshot(ref, (doc) => {
      cb(doc.data());
    });
  }
}
