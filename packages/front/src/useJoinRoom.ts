import { useMutation } from "react-query";
import { useCallback, useRef } from "react";
import { PlayerService } from "./PlayerService";
import { PlayerRecord } from "./PlayerRecord";
import { useUser } from "./useUser";

export function useJoinRoom(roomKey: string) {
  const { getUserKey } = useUser();
  const { current: playerService } = useRef<PlayerService>(new PlayerService(roomKey));
  const mutation = useMutation<PlayerRecord, unknown, void>(async () => {
    const userKey = await getUserKey();
    const player = new PlayerRecord({ playerKey: userKey, roomKey });
    return playerService.save(player);
  });
  const handleJoinRoom = useCallback(async () => {
    mutation.mutate();
  }, [mutation]);
  return { handleJoinRoom, isLoading: mutation.isLoading };
}
