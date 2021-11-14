import { useMutation } from "react-query";
import { useCallback, useRef } from "react";
import { RoundService } from "./RoundService";
import { RoundRecord } from "./RoundRecord";
import { RoomService } from "./RoomService";

export function useCreateRound(roomKey: string) {
  const roundServiceRef = useRef<RoundService>(new RoundService(roomKey));
  const roundService = roundServiceRef.current;
  const mutation = useMutation<RoundRecord, unknown, RoundRecord>(async (round) => {
    const roomService = new RoomService();
    const batch = roomService.batch();
    batch.update(roomService.doc(round.roomKey), { activeRoundKey: round.roundKey });
    batch.set(roundService.doc(round.roundKey), round);
    await batch.commit();
    return round;
  });
  const handleCreateRound = useCallback(async () => {
    mutation.mutate(new RoundRecord({ roundKey: roundService.getNewKey(), roomKey, rolls: {} }));
  }, [mutation, roundService, roomKey]);
  return { handleCreateRound, isLoading: mutation.isLoading };
}
