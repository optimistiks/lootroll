import { FirestoreDataConverter, QueryDocumentSnapshot, WithFieldValue } from "firebase/firestore";
import { RoundFields, RoundRecord } from "./RoundRecord";

export class RoundConverter implements FirestoreDataConverter<RoundRecord> {
  fromFirestore(snapshot: QueryDocumentSnapshot<RoundFields>) {
    const data = snapshot.data();
    return new RoundRecord({ roundKey: snapshot.id, roomKey: data.roomKey, rolls: data.rolls });
  }
  toFirestore(round: WithFieldValue<RoundRecord>): WithFieldValue<RoundFields> {
    return { roundKey: round.roundKey, roomKey: round.roomKey, rolls: round.rolls };
  }
}
