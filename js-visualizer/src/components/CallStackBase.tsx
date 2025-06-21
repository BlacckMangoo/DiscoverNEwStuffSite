import { Handle, Position } from '@xyflow/react';

interface CallStackBaseProps {
  data: {
    isConnectable?: boolean;
  };
}

function CallStackBase({ data }: CallStackBaseProps) {
  const { isConnectable = true } = data;
  return (
    <div className="relative">      {/* Top Handle - for receiving connections from CallStackNode with isBottom=true */}
      <Handle
        type="target"
        position={Position.Top}
        isConnectable={isConnectable}
        className="!w-2 !h-2 !bg-blue-500 border border-zinc-950 !rounded-full hover:!bg-blue-400 transition-colors !-top-1"
      />
      
      {/* Base Box */}
      <div className="bg-zinc-950/90 backdrop-blur-xl border border-zinc-800/60 rounded-xl shadow-2xl p-6 min-w-[180px]">
        <div className="text-center">
          <h2 className="font-medium text-zinc-100 text-base tracking-tight">
            CALL STACK
          </h2>
          <div className="mt-2 text-xs text-zinc-500">
            Base
          </div>
        </div>
      </div>
    </div>
  );
}

export default CallStackBase;
