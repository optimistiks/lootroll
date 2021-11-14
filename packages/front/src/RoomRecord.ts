import { FirestoreRecord } from "./FirestoreRecord";

export interface RoomFields {
  roomKey: string;
  activeRoundKey: string;
  ownerKey: string;
}

export class RoomRecord extends FirestoreRecord implements RoomFields {
  roomKey: string;
  activeRoundKey: string;
  ownerKey: string;
  constructor({ roomKey, ownerKey, activeRoundKey }: RoomFields) {
    super(roomKey);
    this.roomKey = roomKey;
    this.activeRoundKey = activeRoundKey;
    this.ownerKey = ownerKey;
  }
}
