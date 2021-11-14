import { useRouter } from "next/router";
import { useMutation } from "react-query";
import { RoomRecord } from "./RoomRecord";
import { RoomService } from "./RoomService";
import { useCallback, useRef } from "react";
import { PlayerService } from "./PlayerService";
import { PlayerRecord } from "./PlayerRecord";
import { RoundService } from "./RoundService";
import { RoundRecord } from "./RoundRecord";
import { useUser } from "./useUser";

export function useCreateRoom() {
  const router = useRouter();
  const { getUserKey } = useUser();
  const { current: roomService } = useRef<RoomService>(new RoomService());
  const mutation = useMutation<RoomRecord, unknown, string>(
    async (roomKey) => {
      const userKey = await getUserKey();
      // create first player of the room (the owner)
      const playerService = new PlayerService(roomKey);
      const player = new PlayerRecord({ playerKey: userKey, roomKey });
      // create first round of the room
      const roundService = new RoundService(roomKey);
      const round = new RoundRecord({ roundKey: roundService.getNewKey(), roomKey, rolls: {} });
      // create the room
      const room = new RoomRecord({ roomKey, activeRoundKey: round.roundKey, ownerKey: userKey });
      // save everything in batch (room, player, round)
      const batch = roomService.batch();
      batch.set(playerService.doc(player.playerKey), player);
      batch.set(roomService.doc(room.roomKey), room);
      batch.set(roundService.doc(round.roundKey), round);
      await batch.commit();
      return room;
    },
    {
      onSuccess: (room) => {
        return router.replace(`/room?id=${room.roomKey}`);
      }
    }
  );
  const handleCreateRoom = useCallback(async () => {
    mutation.mutate(roomService.getNewKey());
  }, [mutation, roomService]);
  return { handleCreateRoom, isLoading: mutation.isLoading };
}
