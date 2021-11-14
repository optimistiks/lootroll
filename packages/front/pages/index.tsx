import type { NextPage } from "next";
import Head from "next/head";
import { RoomPage } from "../src/RoomPage";

const Home: NextPage = () => {
  return (
    <div>
      <Head>
        <title>lootroll</title>
        <meta name="description" content="roll on your precious loot" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <RoomPage />
    </div>
  );
};

export default Home;
