import { useEffect, useRef } from "react";
import { useQuery, useQueryClient } from "react-query";
import { PlayerService } from "./PlayerService";

export function useListenPlayers(roomKey: string) {
  const queryClient = useQueryClient();
  const { current: playerService } = useRef<PlayerService>(new PlayerService(roomKey));
  const { data: players, isLoading: isPlayersLoading } = useQuery([playerService.collectionKey], () => {
    return playerService.fetchAll();
  });
  useEffect(() => {
    const unsub = playerService.listen((players) => {
      queryClient.setQueryData([playerService.collectionKey], players);
    });
    return () => {
      unsub();
    };
  }, [queryClient, playerService]);
  return { players, isPlayersLoading };
}
