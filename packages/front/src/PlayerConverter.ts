import { FirestoreDataConverter, QueryDocumentSnapshot, WithFieldValue } from "firebase/firestore";
import { PlayerRecord } from "./PlayerRecord";

export class PlayerConverter implements FirestoreDataConverter<PlayerRecord> {
  fromFirestore(snapshot: QueryDocumentSnapshot<{ roomKey: string }>) {
    const data = snapshot.data();
    return new PlayerRecord({ playerKey: snapshot.id, roomKey: data.roomKey });
  }
  toFirestore(player: WithFieldValue<PlayerRecord>) {
    return { playerKey: player.playerKey, roomKey: player.roomKey };
  }
}
