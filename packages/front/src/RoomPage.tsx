import { Container, Heading, Text } from "@chakra-ui/react";
import ErrorPage from "next/error";
import { useRoom } from "./useRoom";

interface RoomPageProps {
  roomKey?: string;
}

export function RoomPage(props: RoomPageProps) {
  const { room, isLoading } = useRoom(props.roomKey);
  if (!isLoading && !room) {
    return <ErrorPage statusCode={404} />;
  }
  return (
    <Container maxW="container.xl">
      <Heading>lootroll</Heading>
      {isLoading ? <Text>Loading room...</Text> : null}
      {!isLoading && room ? <Text>room id: {room.roomKey}</Text> : null}
    </Container>
  );
}
