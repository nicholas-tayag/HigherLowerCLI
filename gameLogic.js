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


let playerName;
let currentArtist = null;
let streak = 0;

const resolveAnimations = (ms = 2000) => new Promise(resolve => setTimeout(resolve, ms));
const spinner = createSpinner('loading next process');

function wrongAnswer() {
    spinner.warn({ text: `${chalk.bgRed('INCORRECT CHOICE')}` });
    console.log(`Your final streak was: ${streak}`);
  }

async function startGame() {
  const welcomeMsg = chalkAnimation.rainbow('Welcome to the Higher Lower Game Spotify Ver., \n');
  await resolveAnimations();
  welcomeMsg.stop();

  console.log(`
    ${chalk.bgGreenBright('Let the game begin!')}
    You will guess which artist has more followers on Spotify.
    Make the right choice to continue, or the game ends.
  `);
  
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

async function displayArtistImages(imageUrl1, imageUrl2) {
  try {
    const fetchImage = async (url) => {
      const response = await fetch(url);
      const arrayBuffer = await response.arrayBuffer();
      return Buffer.from(arrayBuffer);
    };

    const buffer1 = await fetchImage(imageUrl1);
    const buffer2 = await fetchImage(imageUrl2);

    const resizedBuffer1 = await sharp(buffer1)
      .resize(50, 50)
      .png({ quality: 100 })
      .toBuffer();

    const resizedBuffer2 = await sharp(buffer2)
      .resize(50, 50)
      .png({ quality: 100 })
      .toBuffer();

    const combinedBuffer = await sharp({
      create: {
        width: 100,
        height: 50,
        channels: 4,
        background: { r: 255, g: 255, b: 255, alpha: 0 }
      }
    })
      .composite([
        { input: resizedBuffer1, left: 0, top: 0 },
        { input: resizedBuffer2, left: 50, top: 0 }
      ])
      .png()
      .toBuffer();

    console.log(await terminalImage.buffer(combinedBuffer));
  } catch (error) {
    console.error('Error fetching or displaying images:', error);
  }
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
// TESTING CODE:
//   if (process.argv.includes('--test')) {
//     startGame().then(console.log);
//   }

export { startGame };