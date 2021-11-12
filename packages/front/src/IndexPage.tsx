import dynamic from "next/dynamic";

const PeerComponent = dynamic(() => import("./PeerComponent"), { ssr: false });

export function IndexPage() {
  return <PeerComponent />;
}
