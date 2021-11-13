import type { NextPage } from "next";
import Head from "next/head";
import { IndexPage } from "../src/IndexPage";

const Home: NextPage = () => {
  return (
    <div>
      <Head>
        <title>lootroll</title>
        <meta name="description" content="roll on your precious loot" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <IndexPage />
    </div>
  );
};

export default Home;
