
// Isometric projection constants
// Adjusting these changes the camera angle
export const TILE_WIDTH = 60;
export const TILE_HEIGHT = 30; // 2:1 ratio approximates standard isometric (30 degrees)
export const Z_HEIGHT_SCALE = 30;

// Cube dimensions
export const CUBE_SIZE = 20; // Half-width of the cube top face
export const CUBE_HEIGHT = 25; // Height of the vertical extrusion

export const COLORS = {
  background: '#EAE5DC', // Architectural Paper
  
  // Cube Faces - Warm Greys
  cubeTop: '#FFFFFF',    
  cubeLeft: '#8C8680',   
  cubeRight: '#BFB8B0',  
  
  // Path (matches cube top for continuity)
  path: '#FFFFFF', 
  
  // Player - Clay/Brick Red
  playerTop: '#E05242',   
  playerLeft: '#9E3529',  
  playerRight: '#C44335', 
  
  goal: '#E05242', 
};

export const ANIMATION_DURATION = 0.5; // Slightly slower for elegance
