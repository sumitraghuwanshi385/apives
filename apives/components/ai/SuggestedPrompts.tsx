const prompts = [
  "How to use this API?",
  "Give example request",
  "What parameters are required?",
  "Best use case of this API?",
];

const SuggestedPrompts = ({ onClick }: any) => {
  return (
    <div className="flex flex-wrap gap-2 mt-4">
      {prompts.map((p, i) => (
        <button
          key={i}
          onClick={() => onClick(p)}
          className="text-xs px-3 py-1.5 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 transition"
        >
          {p}
        </button>
      ))}
    </div>
  );
};

export default SuggestedPrompts;