import {
  FirestoreDataConverter,
  WithFieldValue,
  QueryDocumentSnapshot,
  collection,
  getFirestore,
  doc,
  setDoc
} from "firebase/firestore";
import { useContext, useEffect, useState } from "react";
import debug from "debug";
import { FirebaseContext } from "./initFirebase";

interface RoomFields {
  roomKey: string;
}

class Room {
  log = debug("lootroll:Room");
  roomKey?: string;
  constructor(data: Partial<RoomFields>) {
    this.roomKey = data.roomKey;
    this.log("constructor() %o", { room: this, data });
  }
  save() {
    const ref = this.doc();
    this.roomKey = ref.id;
    this.log("save() %o", { room: this });
    return setDoc(ref, this)
      .then(() => {
        this.log("success save() %o", { room: this });
      })
      .catch((err) => {
        this.log("failure save() %o", { room: this });
        throw err;
      });
  }
  doc() {
    if (this.roomKey) {
      return doc(this.collection(), this.roomKey);
    } else {
      return doc(this.collection());
    }
  }
  collection() {
    return collection(this.db(), "room").withConverter(new RoomConverter());
  }
  db() {
    return getFirestore();
  }
}

class RoomConverter implements FirestoreDataConverter<Room> {
  log = debug("lootroll:RoomConverter");
  fromFirestore(snapshot: QueryDocumentSnapshot<RoomFields>): Room {
    this.log("fromFirestore(), %o", { snapshot });
    return new Room({ roomKey: snapshot.id });
  }
  toFirestore(room: WithFieldValue<Room>) {
    this.log("toFirestore(), %o", { room });
    return { roomKey: room.roomKey };
  }
}

const log = debug("lootroll:useRoom");
export function useRoom() {
  const app = useContext(FirebaseContext);
  const [roomId, setRoomId] = useState<string | null>(null);
  useEffect(() => {
    if (!app) {
      log("missing firebase app");
      return;
    }
    const room = new Room({});
    room
      .save()
      .then(() => {
        if (room.roomKey) {
          log("success save() %o", { room });
          setRoomId(room.roomKey);
        } else {
          log("failure save() %o", { room });
        }
      })
      .catch((err) => {
        log("failure save() %o", err);
      });
  }, [app]);
  return { roomId };
}
