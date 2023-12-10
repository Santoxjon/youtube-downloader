import TelegramBotAPI from 'node-telegram-bot-api';
import dotenv from 'dotenv';
import fs from 'fs';

import { getVideoId, validateUrl } from './helpers/url.helper';
import { downloadAudio } from './helpers/downloaders.helper';
import { sendInvalidUrlMessage } from './helpers/messages.helper';
import { URL_REGEX } from './helpers/consts.helper';

dotenv.config();
const token: string = process.env.TELEGRAM_TOKEN || '';

const bot: TelegramBotAPI = new TelegramBotAPI(token, { polling: true });

bot.on('message', (msg: TelegramBotAPI.Message) => {
  const chatId = msg.chat.id;
  const userInput: string = msg.text || '';

  if (URL_REGEX.test(userInput) && !validateUrl(userInput)) {
    sendInvalidUrlMessage(bot, chatId);
    // return;
  } else {
    if (!userInput.includes('/audio') && !userInput.includes('/video')) {
      console.log('🦋 || file: index.ts:43 || bot.on || userInput:', userInput);
      const videoId: string = getVideoId(userInput);
      bot
        .sendMessage(chatId, 'Please choose an option:', {
          reply_markup: {
            keyboard: [
              [{ text: `/audio ${videoId}` }],
              [{ text: `/video ${videoId}` }],
            ],
            one_time_keyboard: true,
          },
        })
        .then((optionsMsg) => {
          // Delete the options message after the user chooses an option
          bot.once('message', async (choiceMsg: TelegramBotAPI.Message) => {
            const chosenOption = choiceMsg.text;
            if (chosenOption === `/audio ${videoId}`) {
              downloadAudio(videoId)
                .then((audioPath) => {
                  if (fs.existsSync(audioPath)) {
                    bot
                      .sendAudio(chatId, audioPath)
                      .then(() => {
                        fs.unlinkSync(audioPath);
                        bot.deleteMessage(chatId, optionsMsg.message_id);
                      })
                      .catch((error) => {
                        bot.sendMessage(chatId, 'Error downloading audio 😭');
                      });
                  } else {
                    bot.sendMessage(chatId, 'Error downloading audio 😭');
                  }
                })
                .catch((error) => {
                  console.warn(
                    '🦋 || file: index.ts:55 || bot.once || error:',
                    error
                  );
                });
            }
            if (chosenOption === `/video ${videoId}`) {
              bot.sendMessage(chatId, 'Video is not supported yet.');
            }
          });
        });
    }
  }
});
