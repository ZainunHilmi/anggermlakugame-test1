
import React, { useMemo, useRef } from 'react';
import { motion } from 'framer-motion';
import { LevelData, Node, Point2D } from '../types';
import { projectToScreen } from '../utils/isometric';
import { COLORS, CUBE_SIZE, CUBE_HEIGHT } from '../constants';

interface GameViewProps {
  level: LevelData;
  currentNodeId: string;
  onNodeClick: (nodeId: string) => void;
  windowSize: { width: number; height: number };
}

// Helper: Color utility
const darken = (hex: string, amount: number) => {
  let usePound = false;
  if (hex[0] === "#") {
    hex = hex.slice(1);
    usePound = true;
  }
  const num = parseInt(hex, 16);
  let r = (num >> 16) + amount;
  let b = ((num >> 8) & 0x00FF) + amount;
  let g = (num & 0x0000FF) + amount;

  if (r > 255) r = 255; else if (r < 0) r = 0;
  if (b > 255) b = 255; else if (b < 0) b = 0;
  if (g > 255) g = 255; else if (g < 0) g = 0;

  return (usePound ? "#" : "") + (g | (b << 8) | (r << 16)).toString(16).padStart(6, '0');
};

// Helper Component: Isometric Cube
const IsoCube = ({ 
  x, 
  y, 
  size, 
  height, 
  baseColor,
  onClick, 
  style,
  className 
}: { 
  x: number; 
  y: number; 
  size: number; 
  height: number; 
  baseColor: string;
  onClick?: () => void;
  style?: React.CSSProperties;
  className?: string;
}) => {
  const top = { x: x, y: y - size * 0.5 }; 
  const right = { x: x + size, y: y };
  const bottom = { x: x, y: y + size * 0.5 };
  const left = { x: x - size, y: y };

  const rightBottom = { x: right.x, y: right.y + height };
  const centerBottom = { x: bottom.x, y: bottom.y + height };
  const leftBottom = { x: left.x, y: left.y + height };

  const colorTop = baseColor;
  const colorRight = darken(baseColor, -30);
  const colorLeft = darken(baseColor, -60);

  return (
    <g onClick={onClick} style={style} className={className}>
      <path d={`M${left.x},${left.y} L${bottom.x},${bottom.y} L${centerBottom.x},${centerBottom.y} L${leftBottom.x},${leftBottom.y} Z`} fill={colorLeft} />
      <path d={`M${bottom.x},${bottom.y} L${right.x},${right.y} L${rightBottom.x},${rightBottom.y} L${centerBottom.x},${centerBottom.y} Z`} fill={colorRight} />
      <path d={`M${left.x},${left.y} L${top.x},${top.y} L${right.x},${right.y} L${bottom.x},${bottom.y} Z`} fill={colorTop} />
    </g>
  );
};

export const GameView: React.FC<GameViewProps> = ({
  level,
  currentNodeId,
  onNodeClick,
  windowSize,
}) => {

  // 1. Auto-Fit Logic
  const { projectedNodes, scale } = useMemo(() => {
    const rawMap = new Map<string, Point2D>();
    let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;

    // First pass: Project relative to origin (0,0) to find bounds
    level.nodes.forEach((node) => {
      const p = projectToScreen(node.gridPos, 0, 0);
      rawMap.set(node.id, p);
      if (p.x < minX) minX = p.x;
      if (p.x > maxX) maxX = p.x;
      if (p.y < minY) minY = p.y;
      if (p.y > maxY) maxY = p.y;
    });

    // Dimensions of the level in raw iso space (plus visuals padding)
    const widthPadding = CUBE_SIZE * 4;
    const heightPadding = CUBE_HEIGHT * 3;
    const levelW = (maxX - minX) + widthPadding; 
    const levelH = (maxY - minY) + heightPadding; 

    // Available screen space (with UI padding)
    const screenPadding = 40;
    const availW = windowSize.width - screenPadding;
    const availH = windowSize.height - screenPadding;

    // Compute scale
    const scaleX = availW / levelW;
    const scaleY = availH / levelH;
    const finalScale = Math.min(scaleX, scaleY, 1.3);

    // Compute centering offset
    const levelCenterX = (minX + maxX) / 2;
    const levelCenterY = (minY + maxY) / 2;
    const screenCenterX = windowSize.width / 2;
    const screenCenterY = windowSize.height / 2;

    // Second pass: Generate final centered coordinates
    const finalMap = new Map<string, Point2D>();
    rawMap.forEach((pos, id) => {
        const x = (pos.x - levelCenterX) * finalScale + screenCenterX;
        const y = (pos.y - levelCenterY) * finalScale + screenCenterY;
        finalMap.set(id, { x, y });
    });

    return { projectedNodes: finalMap, scale: finalScale };
  }, [level, windowSize]);

  // 2. Swipe Logic
  const touchStartRef = useRef<{x: number, y: number} | null>(null);

  const handlePointerDown = (e: React.TouchEvent | React.MouseEvent) => {
      const clientX = 'touches' in e ? e.touches[0].clientX : (e as React.MouseEvent).clientX;
      const clientY = 'touches' in e ? e.touches[0].clientY : (e as React.MouseEvent).clientY;
      touchStartRef.current = { x: clientX, y: clientY };
  };

  const handlePointerUp = (e: React.TouchEvent | React.MouseEvent) => {
      if (!touchStartRef.current) return;

      const clientX = 'changedTouches' in e ? e.changedTouches[0].clientX : (e as React.MouseEvent).clientX;
      const clientY = 'changedTouches' in e ? e.changedTouches[0].clientY : (e as React.MouseEvent).clientY;

      const deltaX = clientX - touchStartRef.current.x;
      const deltaY = clientY - touchStartRef.current.y;
      
      touchStartRef.current = null; // Reset

      // Threshold for swipe vs tap (30px)
      if (Math.abs(deltaX) < 30 && Math.abs(deltaY) < 30) return;

      // Find current node position
      const startNodePos = projectedNodes.get(currentNodeId);
      if (!startNodePos) return;

      // Find valid neighbors
      const neighbors = level.nodes.find(n => n.id === currentNodeId)?.neighbors || [];
      
      let bestMatchId = null;
      let maxDot = -1;

      // Normalize swipe vector
      const swipeMag = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
      const swipeDir = { x: deltaX / swipeMag, y: deltaY / swipeMag };

      neighbors.forEach(neighborId => {
          const nPos = projectedNodes.get(neighborId);
          if (nPos) {
              const dx = nPos.x - startNodePos.x;
              const dy = nPos.y - startNodePos.y;
              const dist = Math.sqrt(dx*dx + dy*dy);
              
              // If neighbor is somehow on exact same pixel (unlikely), skip
              if (dist < 1) return; 

              const nDir = { x: dx / dist, y: dy / dist };
              
              // Dot product to check alignment
              const dot = swipeDir.x * nDir.x + swipeDir.y * nDir.y;
              
              // Check if direction aligns (0.5 is approx 60 degrees leniency)
              if (dot > maxDot && dot > 0.5) { 
                  maxDot = dot;
                  bestMatchId = neighborId;
              }
          }
      });

      if (bestMatchId) {
          onNodeClick(bestMatchId);
      }
  };

  // Visual sizing derived from scale
  const scaledCubeSize = CUBE_SIZE * scale;
  const scaledCubeHeight = CUBE_HEIGHT * scale;
  const scaledPathWidth = 14 * scale;

  const currentNode = level.nodes.find(n => n.id === currentNodeId);
  const currentNodePos = projectedNodes.get(currentNodeId);
  const neighbors = currentNode?.neighbors || [];

  interface Drawable {
    type: 'node' | 'connection' | 'player';
    id: string;
    ySort: number;
    zIndexOffset: number;
    element: React.ReactElement;
  }

  const drawables: Drawable[] = [];
  const processedConnections = new Set<string>();

  // A. Create Connection Drawables
  level.nodes.forEach(node => {
    const startPos = projectedNodes.get(node.id);
    if(!startPos) return;

    node.neighbors.forEach(neighborId => {
      const key = [node.id, neighborId].sort().join('-');
      if(processedConnections.has(key)) return;
      processedConnections.add(key);

      const endPos = projectedNodes.get(neighborId);
      if(endPos) {
        const midY = (startPos.y + endPos.y) / 2;
        
        drawables.push({
          type: 'connection',
          id: key,
          ySort: midY + (10 * scale),
          zIndexOffset: -50, // Connections usually below blocks
          element: (
             <line
              key={key}
              x1={startPos.x}
              y1={startPos.y}
              x2={endPos.x}
              y2={endPos.y}
              stroke={COLORS.path}
              strokeWidth={scaledPathWidth}
              strokeLinecap="round"
              className="transition-all duration-500"
            />
          )
        });
      }
    });
  });

  // B. Create Node Drawables
  level.nodes.forEach(node => {
    const pos = projectedNodes.get(node.id);
    if (!pos) return;

    const isNeighbor = neighbors.includes(node.id);
    const isGoal = node.id === level.endNodeId;
    const baseColor = node.color || COLORS.cubeTop;
    const offset = node.zIndexOffset || 0;

    drawables.push({
      type: 'node',
      id: node.id,
      ySort: pos.y,
      zIndexOffset: offset,
      element: (
        <g key={node.id} className="group">
          <IsoCube
            x={pos.x}
            y={pos.y}
            size={scaledCubeSize}
            height={scaledCubeHeight}
            baseColor={baseColor}
            style={{ 
              cursor: isNeighbor ? 'pointer' : 'default',
              opacity: 1
            }}
            onClick={() => isNeighbor && onNodeClick(node.id)}
            className="transition-transform duration-300"
          />
          {isGoal && (
             <motion.circle
                cx={pos.x}
                cy={pos.y - (10 * scale)}
                r={4 * scale}
                fill={COLORS.goal}
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ repeat: Infinity, duration: 1.5 }}
             />
          )}
        </g>
      )
    });
  });

  // C. Create Player Drawable
  if (currentNodePos) {
    const playerSortY = currentNodePos.y; 
    const playerOffset = (currentNode?.zIndexOffset || 0) + 1;

    drawables.push({
      type: 'player',
      id: 'player_obj',
      ySort: playerSortY,
      zIndexOffset: playerOffset,
      element: (
        <motion.g
          key="player"
          initial={false}
          animate={{
            x: currentNodePos.x,
            y: currentNodePos.y - (12 * scale), // Float slightly above
          }}
          transition={{
            type: "spring",
            stiffness: 100,
            damping: 20,
          }}
          style={{ pointerEvents: 'none' }}
        >
          <IsoCube
            x={0}
            y={0}
            size={10 * scale}
            height={12 * scale}
            baseColor={COLORS.playerTop}
          />
        </motion.g>
      )
    });
  }

  // 3. Sort Drawables (Painter's Algorithm)
  drawables.sort((a, b) => {
    const sortA = a.ySort + a.zIndexOffset;
    const sortB = b.ySort + b.zIndexOffset;
    return sortA - sortB;
  });

  return (
    <div 
        className="w-full h-full relative overflow-hidden bg-[#EAE5DC]"
        onTouchStart={handlePointerDown}
        onTouchEnd={handlePointerUp}
        onMouseDown={handlePointerDown}
        onMouseUp={handlePointerUp}
    >
      <svg width="100%" height="100%" className="absolute inset-0 pointer-events-auto select-none">
        <g className="transition-transform duration-700 ease-out origin-center">
          {drawables.map(d => d.element)}
        </g>
      </svg>
      
      <div className="absolute bottom-4 right-4 text-xs text-neutral-400 pointer-events-none select-none font-mono tracking-widest uppercase">
        Impossible Perspective
      </div>
    </div>
  );
};
