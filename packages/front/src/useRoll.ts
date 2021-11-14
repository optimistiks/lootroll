import { useMutation } from "react-query";
import { useCallback } from "react";
import { RoundService } from "./RoundService";
import { RoundRecord } from "./RoundRecord";
import { getRandomNumber } from "./getRandomNumber";
import { useUser } from "./useUser";

export function useRoll(round?: RoundRecord) {
  const { userKey } = useUser();
  const mutation = useMutation<RoundRecord, unknown, void>(async () => {
    if (!userKey) {
      throw new Error("missing user");
    }
    if (!round) {
      throw new Error("missing round");
    }
    const roundService = new RoundService(round.roomKey);
    const roll = getRandomNumber(1, 100);
    round.rolls[userKey] = { roll };
    return roundService.save(round);
  });
  const handleRoll = useCallback(async () => {
    mutation.mutate();
  }, [mutation]);
  return { handleRoll, isLoading: mutation.isLoading };
}
