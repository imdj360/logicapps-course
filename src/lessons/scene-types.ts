export type NodeKind =
  | 'trigger' | 'action' | 'connector-builtin' | 'connector-managed' | 'scope' | 'condition'
  | 'servicebus' | 'storage' | 'appinsights' | 'keyvault' | 'llm-agent' | 'mcp-server' | 'human'
  | 'user' | 'hosting-plan';

export interface SceneNode { id: string; kind: NodeKind; label: string; x: number; y: number; sublabel?: string }
export interface SceneEdge { id: string; from: string; to: string; style?: 'solid' | 'dashed' }
export interface Token { id: string; edge: string; tone: 'ok' | 'fail' | 'info' }
export type ChipTone = 'ok' | 'warn' | 'fail' | 'neutral';
export interface Chip { label: string; value: string; tone?: ChipTone }

export interface StepState {
  visible: string[];
  highlight?: string[];
  failed?: string[];
  tokens?: Token[];
  chips: Chip[];
}

export interface Scene {
  viewBox: [number, number];
  nodes: SceneNode[];
  edges: SceneEdge[];
  steps: Record<string, StepState>;
  legend: { tone: Token['tone'] | 'failed'; label: string }[];
}
