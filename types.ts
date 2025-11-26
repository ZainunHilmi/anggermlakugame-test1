
export interface Vector3 {
  x: number;
  y: number;
  z: number;
}

export interface Point2D {
  x: number;
  y: number;
}

export interface Node {
  id: string;
  gridPos: Vector3;
  neighbors: string[];
  color?: string; // Optional custom color for the block
  zIndexOffset?: number; // Manual override for sorting illusions
}

export interface LevelData {
  id: number;
  name: string;
  nodes: Node[];
  startNodeId: string;
  endNodeId: string;
}

export interface GameState {
  currentLevelIndex: number;
  currentNodeId: string;
  isMoving: boolean;
  history: string[];
}
