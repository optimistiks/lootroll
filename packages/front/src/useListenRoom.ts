import { useEffect, useRef } from "react";
import { useQuery, useQueryClient } from "react-query";
import { RoomService } from "./RoomService";

export function useListenRoom(roomKey: string) {
  const queryClient = useQueryClient();
  const roomServiceRef = useRef<RoomService>(new RoomService());
  const roomService = roomServiceRef.current;
  const { data: room, isLoading: isRoomLoading } = useQuery([roomService.collectionKey, { recordKey: roomKey }], () =>
    roomService.fetch(roomKey)
  );
  useEffect(() => {
    const unsub = roomService.listenDoc(roomKey, (room) => {
      queryClient.setQueryData([roomService.collectionKey, { recordKey: roomKey }], room);
    });
    return () => {
      unsub();
    };
  }, [queryClient, roomService, roomKey]);
  return { room, isRoomLoading };
}
