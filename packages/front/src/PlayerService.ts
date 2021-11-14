import { FirestoreService } from "./FirestoreService";
import { PlayerRecord } from "./PlayerRecord";
import { PlayerConverter } from "./PlayerConverter";

export class PlayerService extends FirestoreService<PlayerRecord> {
  constructor(roomKey: string) {
    super(`room/${roomKey}/player`, new PlayerConverter());
  }
}
