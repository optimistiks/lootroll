import { useListenRoom } from "./useListenRoom";
import { useListenRound } from "./useListenRound";
import { useListenPlayers } from "./useListenPlayers";

export function useViewRoom(roomKey: string) {
  const { room, isRoomLoading } = useListenRoom(roomKey);
  const { round, isRoundLoading } = useListenRound(roomKey, room?.activeRoundKey);
  const { players, isPlayersLoading } = useListenPlayers(roomKey);
  return { room, isRoomLoading, players, isPlayersLoading, round, isRoundLoading };
}
