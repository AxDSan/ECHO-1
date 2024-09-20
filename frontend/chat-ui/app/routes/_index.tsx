import type { MetaFunction } from "@remix-run/node";
import Chat from "~/components/Chat";
import ConsoleText from "~/components/ConsoleText";

export const meta: MetaFunction = () => {
  return [
    {
      title: "ECHO - Chat Interface",
      description: "A chat interface built with Remix.",
    }
  ];
};

export default function Index() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full mb-8">
        <ConsoleText 
          words={['ECHO.', 'Self-Harmonized CoT']} 
          id="animated-title" 
          colors={['tomato', 'rebeccapurple', 'lightblue']}
        />
      </div>
      <Chat />
    </div>
  );
}
