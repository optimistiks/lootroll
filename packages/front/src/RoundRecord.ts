import { FirestoreRecord } from "./FirestoreRecord";

export interface RoundFields {
  roundKey: string;
  roomKey: string;
  rolls: { [playerKey: string]: { roll: number } };
}

export class RoundRecord extends FirestoreRecord implements RoundFields {
  roundKey: string;
  roomKey: string;
  rolls: { [playerKey: string]: { roll: number } };
  constructor({ roundKey, roomKey, rolls }: RoundFields) {
    super(roundKey);
    this.roundKey = roundKey;
    this.roomKey = roomKey;
    this.rolls = rolls;
  }
}
