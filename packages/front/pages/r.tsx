import type { NextPage } from "../node_modules/next";
import Head from "next/head";
import { useRouter } from "next/router";
import { RoomPage } from "../src/RoomPage";
import { useEffect } from "react";

const Room: NextPage = () => {
  const { isReady, query, replace } = useRouter();
  useEffect(() => {
    if (isReady && (!query.id || typeof query.id !== "string")) {
      replace("/404");
    }
  }, [isReady, query, replace]);
  return (
    <div>
      <Head>
        <title>lootroll</title>
        <meta name="description" content="roll on your precious loot" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      {typeof query.id === "string" && query.id ? <RoomPage roomKey={query.id} /> : null}
    </div>
  );
};

export default Room;
