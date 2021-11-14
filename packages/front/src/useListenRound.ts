import { useEffect, useRef } from "react";
import { useQuery, useQueryClient } from "react-query";
import { RoundService } from "./RoundService";

export function useListenRound(roomKey: string, roundKey?: string | null) {
  const queryClient = useQueryClient();
  const roundServiceRef = useRef<RoundService>(new RoundService(roomKey));
  const roundService = roundServiceRef.current;
  const { data: round, isLoading: isRoundLoading } = useQuery(
    [roundService.collectionKey, { recordKey: roundKey }],
    () => (roundKey ? roundService.fetch(roundKey) : Promise.reject()),
    { enabled: !!roundKey }
  );
  useEffect(() => {
    if (!roundKey) {
      return;
    }
    const unsub = roundService.listenDoc(roundKey, (round) => {
      queryClient.setQueryData([roundService.collectionKey, { recordKey: roundKey }], round);
    });
    return () => {
      unsub();
    };
  }, [queryClient, roundService, roundKey]);
  return { round, isRoundLoading };
}
