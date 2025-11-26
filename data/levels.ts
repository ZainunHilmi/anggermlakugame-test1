
import { LevelData } from '../types';

// Colors
const C_STD = '#FFFFFF'; // Standard White
const C_ACC = '#E0E0E0'; // Slight variation

// Helper to create nodes
// Logic for Illusion Overlap: (x+k, y+k, z+2k) overlaps (x,y,z)
const n = (id: string, x: number, y: number, z: number, neighbors: string[], zIndexOffset: number = 0, color: string = C_STD) => ({ id, gridPos: { x, y, z }, neighbors, color, zIndexOffset });

export const LEVELS: LevelData[] = [
  {
    id: 1,
    name: "Penrose Triangle",
    startNodeId: "base1",
    endNodeId: "top_corner",
    nodes: [
      // Base Bar (Left to Right visual)
      // In Grid: (0,0,0) -> (0,4,0)
      n("base1", 0, 0, 0, ["base2"]),
      n("base2", 0, 1, 0, ["base1", "base3"]),
      n("base3", 0, 2, 0, ["base2", "base4"]),
      n("base4", 0, 3, 0, ["base3", "base5"]),
      n("base5", 0, 4, 0, ["base4", "right1"]), 

      // Right Bar (Going Up/Back visually)
      // We need to go 'Up' in Z, and adjust X/Y to keep it straight? 
      // No, standard grid lines are 3 axes.
      // Let's go 'Up' the Z axis.
      n("right1", 0, 4, 1, ["base5", "right2"]),
      n("right2", 0, 4, 2, ["right1", "right3"]),
      n("right3", 0, 4, 3, ["right2", "right4"]),
      n("right4", 0, 4, 4, ["right3", "top_corner"]),

      // Top Corner
      n("top_corner", 0, 4, 5, ["right4", "left1"]),

      // Left Bar (Coming forward/down to meet base1)
      // We need to connect (0,4,5) back to (0,0,0).
      // Let's use illusion nodes.
      // Target is (0,0,0).
      // Overlap math: (0+2.5, 0+2.5, 0+5).
      // (2.5, 2.5, 5) overlaps (0,0,0).
      
      // Let's build the bridge from top_corner (0,4,5) to (2.5, 2.5, 5).
      // Grid path: (0,4,5) -> (1,3,5) -> (2,2,5)?
      n("left1", 0.5, 3.5, 5, ["top_corner", "left2"]),
      n("left2", 1.0, 3.0, 5, ["left1", "left3"]),
      n("left3", 1.5, 2.5, 5, ["left2", "left4"]),
      n("left4", 2.0, 2.0, 5, ["left3", "left5"]),
      n("left5", 2.5, 1.5, 5, ["left4", "illusion_connect"]), // (2.5, 1.5, 5)

      // The Illusion Connection
      // Real pos: (2.5, 2.5, 5). Overlaps (0,0,0).
      // We place a node here that visually sits on top of base1.
      n("illusion_connect", 2.5, 2.5, 5, ["left5", "base1"], 100), 
      // zIndexOffset 100 to force it on top of base1 if they z-fight
    ]
  },
  {
    id: 2,
    name: "The Waterfall",
    startNodeId: "low1",
    endNodeId: "high_peak",
    nodes: [
        // Lower zigzag
        n("low1", 0, 0, 0, ["low2"]),
        n("low2", 1, 0, 0, ["low1", "low3"]),
        n("low3", 2, 0, 0, ["low2", "turn1"]),
        
        // Turn Up
        n("turn1", 2, 1, 0, ["low3", "mid1"]),

        // Middle zigzag (higher Z)
        n("mid1", 2, 1, 2, ["turn1", "mid2"]),
        n("mid2", 1, 1, 2, ["mid1", "mid3"]),
        n("mid3", 0, 1, 2, ["mid2", "turn2"]),

        // Turn Up
        n("turn2", 0, 2, 2, ["mid3", "high1"]),

        // High zigzag
        n("high1", 0, 2, 4, ["turn2", "high2"]),
        n("high2", 1, 2, 4, ["high1", "high3"]),
        n("high3", 2, 2, 4, ["high2", "high_peak"]),
        
        // The Illusion: high_peak (3, 2, 4) needs to connect to low1 (0,0,0)?
        // Let's check (3,2,4). 
        // Overlap target (0,0,0) is (2,2,4).
        // high3 is at (2,2,4). 
        // So high3 is DIRECTLY above low1 (0,0,0) visually.
        // (2,2,4) overlaps (0,0,0).
        
        // Let's make high3 the connection point.
        // Add a connection from high3 to low1.
        // But we need to make it look like water falling? 
        // We'll just let the player hop down.
        
        n("high_peak", 3, 2, 4, ["high3"]), // Just an end point extension
        
        // Add the impossible link
        // We modify low1's neighbor list in a real app, but here we can define 'ghost' nodes.
        // Let's just add "low1" to "high3"'s neighbors.
        // high3 is defined above. Let's redefine it or just rely on the loop.
    ].map(node => {
        if (node.id === "high3") {
            return { ...node, neighbors: ["high2", "high_peak", "low1"] }; // Connect back to start
        }
        return node;
    })
  },
  {
    id: 3,
    name: "The Paradox",
    startNodeId: "start",
    endNodeId: "goal",
    nodes: [
      // Base Level
      n("start", 0, 0, 0, ["b1"]),
      n("b1", 1, 0, 0, ["start", "b2"]),
      n("b2", 2, 0, 0, ["b1", "c1"]),
      
      // Corner and Rise
      n("c1", 2, 1, 0, ["b2", "c2"]),
      n("c2", 2, 2, 0, ["c1", "up1"]),
      
      // Vertical Lift
      n("up1", 2, 2, 1, ["c2", "top1"]),
      
      // Top Level (Returns towards start)
      n("top1", 1, 2, 1, ["up1", "top2"]),
      n("top2", 0, 2, 1, ["top1", "top3"]),
      n("top3", 0, 1, 1, ["top2", "goal"]),
      
      // The Goal (Visually stacks above start)
      // Physical: (0,0,1). Visual Project: Above (0,0,0).
      // We set zIndexOffset to 100 to ensure it renders ON TOP of the start node
      // even though standard painter's algorithm might put it behind due to Y-sorting.
      n("goal", 0, 0, 1, ["top3"], 100, C_ACC), 
    ]
  },
  {
    id: 4,
    name: "Relativity",
    startNodeId: "center",
    endNodeId: "sky_hook",
    nodes: [
        // Central Hub
        n("center", 0, 0, 0, ["path_a1", "path_b1", "path_c1"]),
        
        // Path A: Goes 'down' and left
        n("path_a1", -1, 0, -1, ["center", "path_a2"]),
        n("path_a2", -2, 0, -2, ["path_a1", "path_a3"]),
        n("path_a3", -2, 1, -2, ["path_a2"]), // dead end

        // Path B: Goes 'up' and right
        n("path_b1", 1, 0, 1, ["center", "path_b2"]),
        n("path_b2", 2, 0, 2, ["path_b1", "path_b3"]),
        n("path_b3", 2, -1, 2, ["path_b2", "sky_hook"]), // visually far but connected

        // Path C: The loop
        n("path_c1", 0, 1, 1, ["center", "path_c2"]),
        n("path_c2", 0, 2, 2, ["path_c1", "path_c3"]),
        // Illusion: (0,2,2) connects to (2,0,2) (path_b2)
        // (0,2,2) -> X=-2, Y=-2+2-2 = -2.
        // (2,0,2) -> X=2, Y=2+0-2 = 0. 
        // Not overlapping.
        // Let's just manual connect.
        n("path_c3", 1, 2, 2, ["path_c2", "path_b2"]),

        // Sky Hook Goal
        // (2, -1, 2) -> X=3, Y=1-2=-1.
        // Let's put it high up
        n("sky_hook", 2, -2, 6, ["path_b3"], 100, "#E05242"),
    ]
  }
];
