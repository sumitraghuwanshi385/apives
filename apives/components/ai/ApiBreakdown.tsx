const ApiBreakdown = ({ api }: any) => {
  if (!api) return null;

  return (
    <div className="space-y-3">

      <div className="bg-white/5 p-3 rounded-xl">
        <p className="text-xs opacity-60 mb-1">Description</p>
        <p className="text-sm">{api.description}</p>
      </div>

      {api.endpoints && (
        <div className="bg-white/5 p-3 rounded-xl">
          <p className="text-xs opacity-60 mb-1">Endpoints</p>
          <p className="text-sm">{api.endpoints}</p>
        </div>
      )}

      {api.params && (
        <div className="bg-white/5 p-3 rounded-xl">
          <p className="text-xs opacity-60 mb-1">Params</p>
          <p className="text-sm">{api.params}</p>
        </div>
      )}

      {api.example && (
        <div className="bg-black/40 p-3 rounded-xl font-mono text-xs overflow-x-auto">
          {api.example}
        </div>
      )}
    </div>
  );
};

export default ApiBreakdown;