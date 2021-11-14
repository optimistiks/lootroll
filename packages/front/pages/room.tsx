import type { NextPage } from "../node_modules/next";
import Head from "next/head";
import { useRouter } from "next/router";
import ErrorPage from "next/error";
import { RoomPage } from "../src/RoomPage";
import { useEffect, useState } from "react";

const Room: NextPage = () => {
  const { isReady, query, replace } = useRouter();

  // show error if id query parameter is not present
  const [isError, setIsError] = useState(false);
  useEffect(() => {
    if (isReady && typeof query.id !== "string") {
      setIsError(true);
    }
  }, [isReady, query, replace]);

  return (
    <div>
      <Head>
        <title>lootroll</title>
        <meta name="description" content="roll on your precious loot" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      {typeof query.id === "string" ? <RoomPage roomKey={query.id} /> : null}
      {isError ? <ErrorPage statusCode={404} /> : null}
    </div>
  );
};

export default Room;
