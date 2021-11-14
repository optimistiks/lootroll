export class FirestoreRecord {
  private recordKey: string;
  constructor(recordKey: string) {
    this.recordKey = recordKey;
  }
  getRecordKey() {
    return this.recordKey;
  }
}
