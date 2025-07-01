import { Handle, Position } from '@xyflow/react';

interface BaseNodeProps {
  data: {
    isConnectable?: boolean;
    title?: string;
    hasTopHandle?: boolean;
    hasBottomHandle?: boolean;
    hasLeftHandle?: boolean;
    hasRightHandle?: boolean;
  };
}

function BaseNode({ data }: BaseNodeProps) {
  const { 
    isConnectable = true, 
    title,
    hasTopHandle = true,
    hasBottomHandle = false,
    hasLeftHandle = false,
    hasRightHandle = false,
  } = data;
  
  return (
    <div className="relative">
      {/* Top Handle */}
      {hasTopHandle && (
        <Handle
          type="target"
          position={Position.Top}
          isConnectable={isConnectable}
          className="!w-2 !h-2 !bg-blue-500 border border-zinc-950 !rounded-full hover:!bg-blue-400 transition-colors !-top-1"
        />
      )}
      
      {/* Bottom Handle */}
      {hasBottomHandle && (
        <Handle
          type="source"
          position={Position.Bottom}
          isConnectable={isConnectable}
          className="!w-2 !h-2 !bg-green-500 border border-zinc-950 !rounded-full hover:!bg-green-400 transition-colors !-bottom-1"
        />
      )}
      
      {/* Left Handle */}
      {hasLeftHandle && (
        <Handle
          type="source"
          position={Position.Left}
          isConnectable={isConnectable}
          className="!w-2 !h-2 !bg-yellow-500 border border-zinc-950 !rounded-full hover:!bg-yellow-400 transition-colors !-left-1"
        />
      )}
      
      {/* Right Handle */}
      {hasRightHandle && (
        <Handle
          type="source"
          position={Position.Right}
          isConnectable={isConnectable}
          className="!w-2 !h-2 !bg-purple-500 border border-zinc-950 !rounded-full hover:!bg-purple-400 transition-colors !-right-1"
        />
      )}
      
      {/* Base Box */}
      <div className="bg-zinc-950/90 backdrop-blur-xl border border-zinc-800/60 rounded-xl shadow-2xl p-6 min-w-[180px]">
        <div className="text-center">
          <h2 className="font-medium text-zinc-100 text-base tracking-tight">
            {title}
          </h2>
        </div>
      </div>
    </div>
  );
}

export default BaseNode;
