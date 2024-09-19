import { useState, useEffect, useRef } from "react";

interface Message {
  role: "user" | "assistant";
  content: string;
}

const Chat: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [progressMessages, setProgressMessages] = useState<string[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage: Message = { role: "user", content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);
    setProgressMessages([]);

    try {
      console.log("Sending request to /api/chat");
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: [...messages, userMessage],
          args: {
            model: "qwen/qwen-2.5-72b-instruct",
            dataset: "commonsensqa",
            demo_path: "demos/commonsensqa_gpt-3.5-turbo-0301_8",
            cot_trigger: "Let's think step by step:",
            direct_answer_trigger_for_fewshot: "Therefore, the answer is",
            max_length_cot: 4096,
            temperature: 0.7,
            api_time_interval: 0.1,
            method: "auto_cot",
            random_seed: 42,
            max_gpt_token: 4096
          },
        }),
      });

      console.log("Response received:", response);

      const reader = response.body?.getReader();
      if (!reader) throw new Error("Failed to get response reader");

      while (true) {
        const { done, value } = await reader.read();
        if (done) {
          console.log("Stream complete");
          break;
        }

        const chunk = new TextDecoder().decode(value);
        console.log("Received chunk:", chunk);

        try {
          const data = JSON.parse(chunk);
          console.log("Parsed data:", data);

          if (data.progress) {
            setProgressMessages((prev) => [...prev, data.progress]);
          } else if (data.full_response) {
            const assistantMessage: Message = { 
              role: "assistant", 
              content: data.cleaned_response ? `${data.full_response}` : data.full_response
            };
            setMessages((prev) => [...prev, assistantMessage]);
          }
        } catch (error) {
          console.error("Error parsing chunk:", error);
        }
      }
    } catch (error) {
      console.error("Error sending message:", error);
      const errorMessage: Message = {
        role: "assistant",
        content: "Sorry, there was an error processing your request.",
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setLoading(false);
      setProgressMessages([]);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      sendMessage();
    }
  };

  const ProgressMarquee: React.FC<{ messages: string[] }> = ({ messages }) => {
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
      if (currentIndex < messages.length - 1) {
        const timer = setTimeout(() => {
          setCurrentIndex(currentIndex + 1);
        }, 3000); // Adjust this value to control how long each message is displayed
        return () => clearTimeout(timer);
      }
    }, [currentIndex, messages]);

    return (
      <div className="h-20 overflow-hidden bg-gradient-to-b from-gray-100 to-transparent rounded-lg p-2 mb-4">
        {currentIndex < messages.length && (
          <div key={currentIndex} className="animate-scroll-up text-sm text-gray-700 mb-2">
            <span className="gradient-text">{messages[currentIndex]}</span>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="w-[800px] h-[600px] flex flex-col bg-white shadow-lg rounded-lg overflow-hidden">
      <div className="flex-1 overflow-y-auto p-4">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`flex ${
              msg.role === "user" ? "justify-end" : "justify-start"
            } mb-4`}
          >
            <div
              className={`max-w-[70%] px-4 py-2 rounded-lg ${
                msg.role === "user"
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200 text-gray-900"
              }`}
            >
              <pre className="whitespace-pre-wrap text-sm">{msg.content}</pre>
            </div>
          </div>
        ))}
        {loading && (
          <>
            <ProgressMarquee messages={progressMessages} />
            <div className="flex justify-start mb-4">
              <div className="max-w-[70%] px-4 py-2 rounded-lg bg-gray-200 text-gray-900">
                <span className="loading-spinner"></span> AI is thinking...
              </div>
            </div>
          </>
        )}
        <div ref={messagesEndRef} />
      </div>
      <div className="flex items-center p-4 border-t">
        <input
          type="text"
          className="flex-1 px-4 py-2 border rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Type your message..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={handleKeyPress}
          disabled={loading}
        />
        <button
          className="px-6 py-2 bg-blue-500 text-white rounded-r-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          onClick={sendMessage}
          disabled={loading}
        >
          {loading ? "Sending..." : "Send"}
        </button>
      </div>
    </div>
  );
};

export default Chat;