import {
  FirestoreDataConverter,
  WithFieldValue,
  QueryDocumentSnapshot,
  collection,
  getFirestore,
  doc,
  setDoc,
  getDoc
} from "firebase/firestore";
import { useContext, useEffect, useRef, useState } from "react";
import debug from "debug";
import { FirebaseContext } from "./initFirebase";

export enum LootrollErrorName {
  notFound = "notFound"
}

class LootrollError implements Error {
  name: LootrollErrorName;
  message: string;
  constructor(name: LootrollErrorName, message: string) {
    this.name = name;
    this.message = message;
  }
}

interface RoomFields {
  roomKey: string;
}

class Room {
  roomKey: string;
  static log = debug("lootroll:Room");
  constructor(data: RoomFields) {
    Room.log("constructor() %o", { room: this, data });
    this.roomKey = data.roomKey;
  }
  save() {
    Room.log("save() %o", { room: this });
    const ref = Room.doc(this.roomKey);
    this.roomKey = ref.id;
    return setDoc(ref, this)
      .then(() => {
        Room.log("save() success %o", { room: this });
        return this;
      })
      .catch((err) => {
        Room.log("save() failure %o", { room: this, err });
        throw err;
      });
  }
  static async fetch(roomKey: string) {
    Room.log("fetch() %o", { roomKey });
    const snap = await getDoc(Room.doc(roomKey));
    const room = snap.data();
    if (!room) {
      const err = new LootrollError(LootrollErrorName.notFound, "room not found");
      Room.log("fetch() failure %o", { err });
      throw err;
    }
    Room.log("fetch() success %o", { snap });
    return room;
  }
  static getNewId() {
    return Room.doc().id;
  }
  static doc(roomKey?: string) {
    if (roomKey) {
      return doc(this.collection(), roomKey).withConverter(new RoomConverter());
    } else {
      return doc(this.collection()).withConverter(new RoomConverter());
    }
  }
  static collection() {
    return collection(Room.db(), "room").withConverter(new RoomConverter());
  }
  static db() {
    return getFirestore();
  }
}

class RoomConverter implements FirestoreDataConverter<Room> {
  log = debug("lootroll:RoomConverter");
  fromFirestore(snapshot: QueryDocumentSnapshot<RoomFields>): Room {
    this.log("fromFirestore() %o", { snapshot });
    return new Room({ roomKey: snapshot.id });
  }
  toFirestore(room: WithFieldValue<Room>) {
    this.log("toFirestore() %o", { room });
    return { roomKey: room.roomKey };
  }
}

export function useRoom(initialRoomKey?: string) {
  const logRef = useRef<debug.Debugger>(debug("lootroll:useRoom"));
  const log = logRef.current;
  const app = useContext(FirebaseContext);
  const [room, setRoom] = useState<Room | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<LootrollError | null>(null);
  useEffect(() => {
    if (!app) {
      log("missing firebase app");
      return;
    }
    if (initialRoomKey) {
      // fetch room
      Room.fetch(initialRoomKey)
        .then((room) => {
          log("fetch() success %o", { room });
          setRoom(room);
        })
        .catch((err) => {
          log("fetch() failure %o", { err });
          if (err instanceof LootrollError) {
            setError(err);
          }
        })
        .finally(() => {
          setIsLoading(false);
        });
    } else {
      // create new room
      const room = new Room({ roomKey: Room.getNewId() });
      room
        .save()
        .then((room) => {
          log("save() success %o", { room });
          setRoom(room);
        })
        .catch((err) => {
          log("save() failure %o", { err });
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  }, [app, initialRoomKey, log]);
  return { room, error, isLoading };
}
