import { Container, Heading, Text, Box, Button } from "@chakra-ui/react";
import { useViewRoom } from "./useViewRoom";
import { useCreateRound } from "./useCreateRound";
import { User } from "./User";
import { useUser } from "./useUser";
import { useJoinRoom } from "./useJoinRoom";
import { useRoll } from "./useRoll";

interface RoomPageProps {
  roomKey: string;
}

export function RoomPage(props: RoomPageProps) {
  const { user, isUserLoading } = useUser();
  const { room, isRoomLoading, players, isPlayersLoading, round, isRoundLoading } = useViewRoom(props.roomKey);
  const { handleCreateRound, isLoading: isRoundCreating } = useCreateRound(props.roomKey);
  const { handleJoinRoom, isLoading: isRoomJoining } = useJoinRoom(props.roomKey);
  const { handleRoll, isLoading: isRolling } = useRoll(round);
  return (
    <Container maxW="container.xl">
      <Heading size="lg">lootroll</Heading>
      <Heading size="md">User</Heading>
      <User />
      <Heading size="md">Room</Heading>
      {isRoomLoading ? <Text>Loading room...</Text> : null}
      {!isRoomLoading && !room ? <Text>Room not found</Text> : null}
      {!isRoomLoading && room ? (
        <Text>
          Room {room.roomKey} active round {room.activeRoundKey} owner {room.ownerKey}
        </Text>
      ) : null}
      {!user || (players && !players.find((player) => player.playerKey === user.uid)) ? (
        <Button
          onClick={handleJoinRoom}
          isLoading={isRoomJoining}
          loadingText="Joining room..."
          isDisabled={isUserLoading}
        >
          Join room
        </Button>
      ) : null}
      <Heading size="md">Players</Heading>
      {isPlayersLoading ? <Text>Loading players...</Text> : null}
      {!isPlayersLoading && !players ? <Text>Players not found</Text> : null}
      {!isPlayersLoading && players && players.length > 0 ? (
        <Box>
          {players.map((player) => {
            return (
              <Text key={player.playerKey}>
                Player {player.playerKey} in room {player.roomKey}
              </Text>
            );
          })}
        </Box>
      ) : null}
      {!isPlayersLoading && players && players.length === 0 ? <Text>no players</Text> : null}
      <Heading size="md">Round</Heading>
      {user && room && user.uid === room.ownerKey ? (
        <Button onClick={handleCreateRound} isLoading={isRoundCreating} loadingText="Creating round...">
          Create round
        </Button>
      ) : null}
      {user &&
      room &&
      round &&
      players &&
      players.find((player) => player.playerKey === user.uid) &&
      round.rolls[user.uid] == null ? (
        <Button onClick={handleRoll} isLoading={isRolling} loadingText="Rolling...">
          Roll
        </Button>
      ) : null}
      {isRoomLoading || isRoundLoading ? <Text>Loading round...</Text> : null}
      {!isRoomLoading && !isRoundLoading && !round ? <Text>Round not found</Text> : null}
      {!isRoundLoading && round && players && players.length > 0 ? (
        <Box>
          <Text>Round {round.roundKey}</Text>
          {players.map((player) => {
            return (
              <Text key={player.playerKey}>
                player {player.playerKey}{" "}
                {round.rolls[player.playerKey] ? `rolled ${round.rolls[player.playerKey].roll}` : `has not rolled yet`}
              </Text>
            );
          })}
        </Box>
      ) : null}
    </Container>
  );
}
