import { create } from "zustand";
import * as acorn from 'acorn';

/**
 * AST Store - Global State Management
 * 
 * This store handles:
 * - Abstract Syntax Tree (AST) generation and storage from source code
 * - Call stack operation logs (push/pop sequences for function calls)
 * - AST parsing using Acorn parser with ECMAScript compatibility
 * - Code analysis and execution simulation for visualizer
 */

// Parse code to AST using Acorn
function ParseCodeToAST(code: string) {
    try {
        const ast = acorn.parse(code, { 
            ecmaVersion: 'latest', 
            locations: true, 
            ranges: true 
        });
        return ast;
    } catch (error) {
        console.error('Error parsing code to AST:', error);
        return null;
    }
}

type CallStackOperation = {
  type: 'push' | 'pop';
  functionName: string;
};

function buildCallStackOperationLog(ast: any): CallStackOperation[] {
  const operations: CallStackOperation[] = [];
  const functionMap = new Map<string, any>();

  // Phase 1: Store all declared functions by name
  if (ast?.type === 'Program') {
    ast.body.forEach((statement: any) => {
      if (statement.type === 'FunctionDeclaration' && statement.id?.name) {
        functionMap.set(statement.id.name, statement);
      }
    });
  }

  // Phase 2: Simulate execution starting only from non-declaration top-level code
  function simulateExecution(node: any) {
    if (!node || typeof node !== 'object') return;

    switch (node.type) {
      case 'CallExpression': {
        let functionName = 'anonymous';

        if (node.callee?.type === 'Identifier') {
          functionName = node.callee.name;
        } else if (node.callee?.type === 'MemberExpression') {
          const obj = node.callee.object;
          const prop = node.callee.property;
          if (obj?.name && prop?.name) {
            functionName = `${obj.name}.${prop.name}`;
          } else if (prop?.name) {
            functionName = prop.name;
          }
        }

        operations.push({ type: 'push', functionName });

        // If the function is user-defined, simulate its body
        if (node.callee?.type === 'Identifier') {
          const fnNode = functionMap.get(node.callee.name);
          if (fnNode?.body) {
            simulateExecution(fnNode.body);
          }
        }

        // Always simulate arguments in case they contain nested calls
        node.arguments?.forEach((arg: any) => simulateExecution(arg));

        operations.push({ type: 'pop', functionName });
        break;
      }

      case 'BlockStatement': {
        node.body.forEach(simulateExecution);
        break;
      }

      case 'ExpressionStatement': {
        simulateExecution(node.expression);
        break;
      }

      case 'ReturnStatement': {
        if (node.argument) simulateExecution(node.argument);
        break;
      }

      case 'IfStatement': {
        simulateExecution(node.test);
        simulateExecution(node.consequent);
        if (node.alternate) simulateExecution(node.alternate);
        break;
      }

      case 'VariableDeclaration': {
        node.declarations.forEach((decl: any) => {
          if (decl.init) simulateExecution(decl.init);
        });
        break;
      }

      // Avoid traversing function declarations unless they're called
      case 'FunctionDeclaration':
        // Do nothing
        break;

      default: {
        // Generic traversal fallback
        for (const key in node) {
          if (
            key !== 'type' &&
            key !== 'start' &&
            key !== 'end' &&
            key !== 'loc'
          ) {
            const value = node[key];
            if (Array.isArray(value)) {
              value.forEach(simulateExecution);
            } else if (value && typeof value === 'object') {
              simulateExecution(value);
            }
          }
        }
      }
    }
  }

  // Only simulate execution of top-level expressions (e.g., a();), not declarations
  ast.body?.forEach((statement: any) => {
    if (statement.type !== 'FunctionDeclaration') {
      simulateExecution(statement);
    }
  });

  return operations;
}
// Store interface
interface AbstractSyntaxTreeState {
    generatedAst: object | null;
    CallStackOperationLog: CallStackOperation[];
    GenerateAndStoreAst: (code: string) => CallStackOperation[];
    logAst: () => void;
    clearAst: () => void;
}

// AST Store
export const useASTStore = create<AbstractSyntaxTreeState>()((set, get) => ({
    generatedAst: null,
    CallStackOperationLog: [],

    GenerateAndStoreAst(code: string): CallStackOperation[] {
        const ast = ParseCodeToAST(code);
        if (ast) {
            const callStackOps = buildCallStackOperationLog(ast);
            
            set({ 
                generatedAst: ast,
                CallStackOperationLog: callStackOps 
            });
            
            console.log('✅ AST generated and stored');
            console.log('📋 Call Stack Operations:', callStackOps);
            
            return callStackOps;
        } else {
            console.error('❌ Failed to generate AST');
            return [];
        }
    },

    logAst: () => {
        const state = get();
        console.log('📋 Current AST:', state.generatedAst);
        console.log('📋 Operations:', state.CallStackOperationLog);
    },

    clearAst: () => set({ generatedAst: null, CallStackOperationLog: []})
}));