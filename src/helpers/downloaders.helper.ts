import { prepareTitle } from './formaters.helper';

const ytdl = require('ytdl-core');
const fs = require('fs');
const path = require('path');
const ffmpeg = require('fluent-ffmpeg');

const outputFolder = './src/tmp';

export const downloadAudio = (videoId: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    const videoUrl = `https://www.youtube.com/watch?v=${videoId}`;

    if (!fs.existsSync(outputFolder)) {
      fs.mkdirSync(outputFolder);
    }

    const options = {
      quality: 'highestaudio',
    };

    const originalAudioPath = path.join(
      outputFolder,
      `${videoId}_original.mp3`
    );
    const originalAudioOutput = fs.createWriteStream(originalAudioPath);

    const originalAudioStream = ytdl(videoUrl, options);
    let originalAudioTitle = '';
    ytdl.getBasicInfo(videoUrl).then((info: any) => {
      originalAudioTitle = prepareTitle(info.videoDetails.title);

      originalAudioStream.pipe(originalAudioOutput);

      originalAudioStream.on('finish', () => {
        const convertedAudioPath = path.join(
          outputFolder,
          `${originalAudioTitle}.mp3`
        );

        ffmpeg()
          .input(originalAudioPath)
          .audioCodec('libmp3lame')
          .audioQuality(2)
          .on('end', () => {
            fs.unlinkSync(originalAudioPath);
            resolve(convertedAudioPath);
          })
          .on('error', (error: any) => {
            console.error(`Error converting audio: ${error}`);
            reject(error);
          })
          .saveToFile(convertedAudioPath);
      });

      originalAudioStream.on('error', (error: any) => {
        console.error(`Error downloading original audio: ${error}`);
        reject(error);
      });
    });
  });
};
