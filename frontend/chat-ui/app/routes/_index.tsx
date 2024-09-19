import type { MetaFunction } from "@remix-run/node";
import Chat from "~/components/Chat";

export const meta: MetaFunction = () => {
  return [
    {
      title: "ECHO - Chat Interface",
      description: "A fully-featured chat interface built with Remix and Shadcn.",
    }
  ];
};

export default function Index() {
  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <Chat />
    </div>
  );
}
