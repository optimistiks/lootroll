import { FirestoreDataConverter, QueryDocumentSnapshot, WithFieldValue } from "firebase/firestore";
import { RoomFields, RoomRecord } from "./RoomRecord";

export class RoomConverter implements FirestoreDataConverter<RoomRecord> {
  fromFirestore(snapshot: QueryDocumentSnapshot<RoomFields>) {
    const data = snapshot.data();
    return new RoomRecord({ roomKey: snapshot.id, activeRoundKey: data.activeRoundKey, ownerKey: data.ownerKey });
  }
  toFirestore(room: WithFieldValue<RoomRecord>): WithFieldValue<RoomFields> {
    return { roomKey: room.roomKey, activeRoundKey: room.activeRoundKey, ownerKey: room.ownerKey };
  }
}
