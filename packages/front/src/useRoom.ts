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
import { useEffect, useRef, useState } from "react";
import debug from "debug";
import { useQuery, useMutation, useQueryClient } from "react-query";
import { useRouter } from "next/router";

interface RoomFields {
  roomKey: string;
}

class Room {
  roomKey: string;
  constructor(data: RoomFields) {
    this.roomKey = data.roomKey;
  }
  save() {
    const ref = Room.doc(this.roomKey);
    this.roomKey = ref.id;
    return setDoc(ref, this).then(() => this);
  }
  static async fetch(roomKey: string) {
    const snap = await getDoc(Room.doc(roomKey));
    return snap.data();
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
  fromFirestore(snapshot: QueryDocumentSnapshot<RoomFields>): Room {
    return new Room({ roomKey: snapshot.id });
  }
  toFirestore(room: WithFieldValue<Room>) {
    return { roomKey: room.roomKey };
  }
}

// the logic is as follows
// when I open index page
// there is no initial room key
// so it should go straight to creating a new room

// when I open room page
// there is an initial room key
// no creating new room should happen
// it should fetch the room by id

export function useRoom(initialRoomKey?: string) {
  const logRef = useRef<debug.Debugger>(debug("lootroll:useRoom"));
  const log = logRef.current;

  const queryClient = useQueryClient();
  const router = useRouter();

  const [roomKey] = useState(initialRoomKey || Room.getNewId());

  // fetch room by initial room key
  const { isLoading, error, data: room } = useQuery(["room", { roomKey }], () => Room.fetch(roomKey));

  // mutation to add a new room
  const mutation = useMutation<Room, unknown, Room>(
    (room) => {
      return room.save();
    },
    {
      onSuccess: (data) => {
        queryClient.setQueryData(["room", { roomKey: data.roomKey }], data);
        router.replace(`/room?id=${data.roomKey}`);
      }
    }
  );

  useEffect(() => {
    if (!initialRoomKey && mutation.isIdle) {
      log("useEffect() no initialRoomKey, creating new room... %o", { initialRoomKey, roomKey });
      mutation.mutate(new Room({ roomKey }));
    }
  }, [initialRoomKey, mutation, roomKey, log]);

  useEffect(() => {
    log("useEffect() data %o", { isLoading, error, room });
  }, [isLoading, error, room, log]);

  return { room, isLoading, error };
}
