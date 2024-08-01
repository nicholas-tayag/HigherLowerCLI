import { startGame } from './gameLogic.js';

// Start the game
startGame().catch(error => {
  console.error('An error occurred:', error);
});