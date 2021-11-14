import { Container, Heading, Text } from "@chakra-ui/react";
import ErrorPage from "next/error";
import { useRoom } from "./useRoom";

interface RoomPageProps {
  roomKey?: string;
}

export function RoomPage(props: RoomPageProps) {
  const { isLoading, error, room } = useRoom(props.roomKey);

  if (!isLoading && !error && !room) {
    return <ErrorPage statusCode={404} />;
  }

  return (
    <Container maxW="container.xl">
      <Heading>lootroll</Heading>
      {room ? <Text>room id {room.roomKey}</Text> : null}
      {isLoading ? <Text>Loading room...</Text> : null}
      {error ? <Text>Room error</Text> : null}
    </Container>
  );
}
