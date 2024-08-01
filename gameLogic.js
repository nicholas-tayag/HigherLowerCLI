import chalk from 'chalk';
import inquirer from 'inquirer';
import chalkAnimation from 'chalk-animation';
import figlet from 'figlet';
import gradient from 'gradient-string';
import { createSpinner } from 'nanospinner';
import { fetchArtistsData } from './fetchArtists.js'; 
import terminalImage from 'terminal-image';
import fetch from 'node-fetch';
import sharp from 'sharp';

import { classicMode } from './classicMode.js';


let playerName;
let currentArtist = null;
let streak = 0;

const resolveAnimations = (ms = 2000) => new Promise(resolve => setTimeout(resolve, ms));
const spinner = createSpinner('loading next process');

async function startGame() {
  const welcomeMsg = chalkAnimation.rainbow('Welcome to the Higher Lower Game Spotify Version! \n');
  await resolveAnimations();
  welcomeMsg.stop();

  await mainMenu();
}

async function mainMenu() {
  console.clear();
  console.log(chalk.greenBright(figlet.textSync('Main Menu')));

  const options = [
    {
      name: 'Classic Mode - Guess which artist has more followers.',
      value: 'classic'
    },
    {
      name: 'Timed Mode - Answer under pressure with a timer.',
      value: 'timed'
    },
    {
      name: 'Leaderboard - View the top scores.',
      value: 'leaderboard'
    },
    {
      name: 'Exit',
      value: 'exit'
    }
  ];

  const choice = await inquirer.prompt({
    name: 'menu_choice',
    type: 'list',
    message: 'Choose an option:',
    choices: options
  });

  switch (choice.menu_choice) {
    case 'classic':
      await classicMode();
      break;
    case 'timed':
      await timedMode();
      break;
    case 'leaderboard':
      await showLeaderboard();
      break;
    case 'exit':
      console.log('Goodbye!');
      process.exit(0);
  }
}


export { startGame };