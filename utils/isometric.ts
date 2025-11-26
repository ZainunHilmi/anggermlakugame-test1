import { Vector3, Point2D } from '../types';
import { TILE_WIDTH, TILE_HEIGHT, Z_HEIGHT_SCALE } from '../constants';

/**
 * Projects a 3D grid coordinate to 2D screen space.
 * Formula mimics an Orthographic Isometric camera.
 */
export const projectToScreen = (pos: Vector3, centerX: number, centerY: number): Point2D => {
  // Standard isometric projection
  // x moves down-right, y moves down-left, z moves up
  const isoX = (pos.x - pos.y) * TILE_WIDTH;
  const isoY = (pos.x + pos.y) * TILE_HEIGHT - (pos.z * Z_HEIGHT_SCALE);

  return {
    x: centerX + isoX,
    y: centerY + isoY,
  };
};

/**
 * Checks if two nodes are visually connected based on the illusion.
 * In a dynamic system (like the user asked for in Unity), this would use screen distance.
 */
export const getDistance2D = (p1: Point2D, p2: Point2D): number => {
  return Math.sqrt(Math.pow(p2.x - p1.x, 2) + Math.pow(p2.y - p1.y, 2));
};
