import inquirer from 'inquirer';
import chalk from 'chalk';
import { fetchArtistsData } from './fetchArtists.js'; 
import { displayArtistImages } from './imageRender.js';

let playerName;
let currentArtist = null;
let streak = 0;

export async function classicMode() {
  await playerInfo();
  await askQuestion();
}

async function playerInfo() {
  const response = await inquirer.prompt({
    name: 'player_name',
    type: 'input',
    message: 'First, please enter your name: '
  });
  playerName = response.player_name;
  console.log(`Hello, ${playerName}! Let's start the game.`);
}


async function askQuestion() {
  const artistsData = await fetchArtistsData();
  if (!currentArtist) {
    currentArtist = artistsData[Math.floor(Math.random() * artistsData.length)];
  }
  
  let newArtist = artistsData[Math.floor(Math.random() * artistsData.length)];
  while (newArtist.id === currentArtist.id) {
    newArtist = artistsData[Math.floor(Math.random() * artistsData.length)];
  }

  await displayArtistImages(currentArtist.image, newArtist.image);

  const answer = await inquirer.prompt({
    name: 'artist_choice',
    type: 'list',
    message: `\n${chalk.bold('Who has more followers?')}`,
    choices: [
      { name: currentArtist.name, value: currentArtist.followers },
      { name: newArtist.name, value: newArtist.followers },
    ],
  });
  checkAnswer(answer.artist_choice, currentArtist, newArtist);
}

function checkAnswer(choice, artist1, artist2) {
  const correctAnswer = artist1.followers > artist2.followers ? artist1.followers : artist2.followers;
  if (choice === correctAnswer) {
    console.log(chalk.green('Correct!'));
    streak++;
    currentArtist = choice === artist1.followers ? artist1 : artist2;
    askQuestion();
  } else {
    wrongAnswer();
  }
}

function wrongAnswer() {
  console.log(`${chalk.bgRed('INCORRECT CHOICE')}`);
  console.log(`Your final streak was: ${streak}`);
  process.exit(1); // Exiting after showing the wrong answer
}

