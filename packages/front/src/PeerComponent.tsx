import { FormEventHandler, useCallback, useEffect, useRef, useState } from "react";
import Peer from "peerjs";
import { Badge, Button, Container, Heading, Input, Stat, StatLabel, StatNumber, VStack, Text } from "@chakra-ui/react";

export default function PeerComponent() {
  const [peerId, setPeerId] = useState<string | null>(null);
  const [anotherPeerId, setAnotherPeerId] = useState<string>("");
  const [isConnectedToServer, setIsConnectedToServer] = useState(false);
  const [isConnectedToPeer, setIsConnectedToPeer] = useState(false);
  const [messages, setMessages] = useState<string[]>([]);
  const [messageText, setMessageText] = useState<string>("");
  const peerRef = useRef<Peer | null>(null);
  const connRef = useRef<Peer.DataConnection | null>(null);
  const updateIsConnected = useCallback(() => {
    if (connRef.current && connRef.current.open) {
      setIsConnectedToPeer(true);
    } else {
      setIsConnectedToPeer(false);
    }
    if (peerRef.current && !peerRef.current?.disconnected && !peerRef.current?.destroyed) {
      setIsConnectedToServer(true);
    } else {
      setIsConnectedToPeer(false);
    }
  }, []);
  useEffect(() => {
    peerRef.current = new Peer({
      host: "d79a-79-165-147-32.ngrok.io",
      path: "/peerjs/myapp",
      debug: 3
    });
    const peer = peerRef.current;
    peer.on("open", (id) => {
      console.log("open", `My peer ID is ${id}`);
      setPeerId(id);
      updateIsConnected();
    });
    peer.on("connection", (conn) => {
      console.log("connection", { conn });
      connRef.current = conn;
      conn.on("data", (data) => {
        console.log("peer conn data", { data });
        setMessages((prevMessages) => [...prevMessages, data]);
      });
      conn.on("open", () => {
        console.log("peer conn open");
        updateIsConnected();
      });
      conn.on("error", (error) => {
        console.error("peer con error", error);
      });
      updateIsConnected();
    });
    peer.on("close", () => {
      console.log("close");
      updateIsConnected();
    });
    peer.on("disconnected", () => {
      console.log("disconnected");
      updateIsConnected();
    });
    peer.on("error", (error) => {
      console.error("errored", error);
      updateIsConnected();
    });
    return () => {
      console.log("unmounted");
      peer.disconnect();
      updateIsConnected();
    };
  }, []);
  const handleConnectClick = useCallback(() => {
    const conn = peerRef.current?.connect(anotherPeerId, { serialization: "json" });
    console.log("connecting to peer", { anotherPeerId, conn });
    if (!conn) {
      return;
    }
    connRef.current = conn;
    conn.on("data", (data) => {
      console.log("conn data", { data });
      setMessages((prevMessages) => [...prevMessages, data]);
    });
    conn.on("open", () => {
      console.log("conn open");
      updateIsConnected();
    });
    conn.on("error", (error) => {
      console.error("con error", error);
    });
    updateIsConnected();
  }, [anotherPeerId]);
  const handleSendMessage: FormEventHandler<HTMLFormElement> = useCallback(
    (event) => {
      event.preventDefault();
      if (!connRef.current || !connRef.current.open) {
        return;
      }
      connRef.current.send(messageText);
      setMessages((prevMessages) => [...prevMessages, messageText]);
      setMessageText("");
    },
    [messageText, setMessageText]
  );
  return (
    <Container maxW="container.lg">
      <VStack spacing="3rem">
        <VStack>
          <Stat>
            <StatLabel>My ID</StatLabel>
            <StatNumber>{peerId}</StatNumber>
          </Stat>
          <Text>
            Server{" "}
            <Badge colorScheme={isConnectedToServer ? "green" : "red"}>
              {isConnectedToServer ? "Connected" : "Disconnected"}
            </Badge>
          </Text>
          <Text>
            Peer{" "}
            <Badge colorScheme={isConnectedToPeer ? "green" : "red"}>
              {isConnectedToPeer ? "Connected" : "Disconnected"}
            </Badge>
          </Text>
        </VStack>
        <VStack>
          <Input
            placeholder="Enter other user ID"
            value={anotherPeerId}
            onChange={(event) => setAnotherPeerId(event.target.value)}
          />
          <Button onClick={handleConnectClick} size="lg" disabled={!anotherPeerId}>
            Connect
          </Button>
        </VStack>
        <VStack>
          <Heading>Chat</Heading>
          <form onSubmit={handleSendMessage}>
            <Input
              placeholder="Your message"
              value={messageText}
              onChange={(event) => setMessageText(event.target.value)}
            />
          </form>
          {messages.map((message) => {
            return <Text key={message}>{message}</Text>;
          })}
        </VStack>
      </VStack>
    </Container>
  );
}
