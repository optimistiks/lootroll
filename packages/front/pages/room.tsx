import type { NextPage } from "../node_modules/next";
import Head from "next/head";
import { useRouter } from "next/router";
import { RoomPage } from "../src/RoomPage";

const Room: NextPage = () => {
  const { query } = useRouter();
  return (
    <div>
      <Head>
        <title>lootroll - roll on your precious loot</title>
        <meta name="description" content="lootroll - roll on your precious loot" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      {typeof query.id === "string" ? <RoomPage roomKey={query.id} /> : null}
    </div>
  );
};

export default Room;
