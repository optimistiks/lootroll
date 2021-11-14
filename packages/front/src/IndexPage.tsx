import { Container, Heading, Button } from "@chakra-ui/react";
import { useCreateRoom } from "./useCreateRoom";
import { User } from "./User";
import { useUser } from "./useUser";

export function IndexPage() {
  const { isUserLoading } = useUser();
  const { handleCreateRoom, isLoading } = useCreateRoom();
  return (
    <Container maxW="container.xl">
      <Heading>lootroll</Heading>
      <User />
      <Button
        onClick={handleCreateRoom}
        isLoading={isLoading}
        loadingText="Creating a room..."
        isDisabled={isUserLoading}
      >
        Create a room
      </Button>
    </Container>
  );
}
