

import { Handle, Position } from '@xyflow/react';

export interface CallStackNodeProps {
  data: {
    functionName?: string;
    isTop?: boolean; 
    isBottom?: boolean;
    isConnectable?: boolean;
  };
}

function CallStackNode({ data }: CallStackNodeProps) {
  const {
    functionName = "Function",
    isConnectable = true,
    isTop = false,
    isBottom = false
  } = data;
  
  return (
    <div className="relative">      {/* Top Handle - only if isBottom is true or neither isTop nor isBottom */}
      {(isBottom || (!isTop && !isBottom)) && (
        <Handle
          type="target"
          position={Position.Top}
          isConnectable={isConnectable}
          className="!w-2 !h-2 !bg-blue-500 border border-zinc-950 !rounded-full hover:!bg-blue-400 transition-colors !-top-1"
        />
      )}
      
      {/* Main Node Box */}
      <div className={`border border-zinc-800/60 rounded-xl shadow-2xl p-5 min-w-[200px] backdrop-blur-xl ${
        isTop 
          ? 'bg-emerald-500/20 border-emerald-500/40' 
          : 'bg-zinc-950/80 border-zinc-800/60'
      }`}>
        {/* Header */}
        <div className="text-center">
          <h3 className="font-medium text-zinc-100 text-sm tracking-tight">
            {functionName}
          </h3>
          {isTop && (
            <div className="mt-1 text-xs text-emerald-400 font-medium">
              Entry Point
            </div>
          )}
        </div>
      </div>      {/* Bottom Handle - show if isTop, isBottom, or neither */}
      {(isTop || isBottom || (!isTop && !isBottom)) && (
        <Handle
          type="source"
          position={Position.Bottom}
          isConnectable={isConnectable}
          className="!w-2 !h-2 !bg-blue-500 border border-zinc-950 !rounded-full hover:!bg-blue-400 transition-colors !-bottom-1"
        />
      )}
    </div>
  );
}

export default CallStackNode;
