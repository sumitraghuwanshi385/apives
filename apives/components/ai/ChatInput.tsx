interface Props {
  value: string;
  setValue: (v: string) => void;
  onSend: () => void;
}

const ChatInput = ({ value, setValue, onSend }: Props) => {
  return (
    <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-full px-3 py-2">

      <input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Ask about this API..."
        className="flex-1 bg-transparent outline-none text-sm"
        onKeyDown={(e) => e.key === "Enter" && onSend()}
      />

      <button
        onClick={onSend}
        className="w-10 h-10 rounded-full bg-gradient-to-r from-red-500 to-blue-500 flex items-center justify-center"
      >
        ↑
      </button>

    </div>
  );
};

export default ChatInput;