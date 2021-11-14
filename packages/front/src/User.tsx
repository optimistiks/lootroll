import { Text } from "@chakra-ui/react";
import { useUser } from "./useUser";

export function User() {
  const { user } = useUser();
  return <Text>user id {user ? user.uid : "none"}</Text>;
}
