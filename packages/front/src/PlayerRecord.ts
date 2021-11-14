import { FirestoreRecord } from "./FirestoreRecord";

export class PlayerRecord extends FirestoreRecord {
  playerKey: string;
  roomKey: string;
  constructor(data: { playerKey: string; roomKey: string }) {
    super(data.playerKey);
    this.playerKey = data.playerKey;
    this.roomKey = data.roomKey;
  }
}
