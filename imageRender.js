import terminalImage from 'terminal-image';
import fetch from 'node-fetch';
import sharp from 'sharp';

export async function displayArtistImages(imageUrl1, imageUrl2)  {
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