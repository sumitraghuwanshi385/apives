interface Props {
  role: "user" | "assistant";
  content: string;
}

const ChatBubble = ({ role, content }: Props) => {
  return (
    <div className={`flex ${role === "user" ? "justify-end" : "justify-start"}`}>
      <div
        className={`max-w-[80%] px-4 py-2.5 rounded-2xl text-sm shadow-md
        ${
          role === "user"
            ? "bg-gradient-to-r from-red-500 to-blue-500 text-white"
            : "bg-white/10 border border-white/10 text-white"
        }`}
      >
        {content}
      </div>
    </div>
  );
};

export default ChatBubble;