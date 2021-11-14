import { FirestoreService } from "./FirestoreService";
import { RoundRecord } from "./RoundRecord";
import { RoundConverter } from "./RoundConverter";

export class RoundService extends FirestoreService<RoundRecord> {
  constructor(roomKey: string) {
    super(`room/${roomKey}/round`, new RoundConverter());
  }
}
