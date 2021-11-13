import { Container, Heading, Text } from "@chakra-ui/react";
import { useRoom } from "./useRoom";
export function IndexPage() {
  const { roomId } = useRoom();
  return (
    <Container maxW="container.lg">
      <Heading>lootroll</Heading>
      <Text>room id: {roomId}</Text>
    </Container>
  );
}
