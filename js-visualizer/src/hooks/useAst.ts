import { useASTStore } from '../Store/ASTStore';

export const useAst = () => {
  const store = useASTStore();
  
  return {
    CallStackOperationLog: store.CallStackOperationLog,
    GenerateAndStoreAst: store.GenerateAndStoreAst,
    logAst: store.logAst
  };
};
