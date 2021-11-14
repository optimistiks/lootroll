import { FirestoreService } from "./FirestoreService";
import { RoomConverter } from "./RoomConverter";
import { RoomRecord } from "./RoomRecord";

export class RoomService extends FirestoreService<RoomRecord> {
  constructor() {
    super("room", new RoomConverter());
  }
}
