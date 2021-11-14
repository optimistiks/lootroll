import { useDocument } from "./useDocument";
import { RoomConverter } from "./RoomConverter";

export function useListenRoom(roomKey: string) {
  const { data: room, isLoading: isRoomLoading } = useDocument(`room/${roomKey}`, {
    listen: true,
    converter: new RoomConverter()
  });
  return { room, isRoomLoading };
}
