import TelegramBotAPI from 'node-telegram-bot-api';
import dotenv from 'dotenv';
import fs from 'fs';

import { getVideoId, validateUrl } from './helpers/url.helper';
import { downloadAudio } from './helpers/downloaders.helper';
import {
  sendErrorDuringDownloadMessage,
  sendErrorDuringSendingMessage,
  sendInvalidMessage,
  sendInvalidUrlMessage,
} from './helpers/errors.helper';
import { LOADING_SEQUENCE, URL_REGEX } from './helpers/consts.helper';

dotenv.config();
const token: string = process.env.TELEGRAM_TOKEN || '';

const bot: TelegramBotAPI = new TelegramBotAPI(token, { polling: true });

bot.on('message', (msg: TelegramBotAPI.Message) => {
  const chatId = msg.chat.id;
  const userInput: string = msg.text || '';

  if (
    !URL_REGEX.test(userInput) &&
    !userInput.includes('/audio') &&
    !userInput.includes('/video')
  ) {
    sendInvalidMessage(bot, chatId);
    return;
  }

  if (URL_REGEX.test(userInput) && !validateUrl(userInput)) {
    sendInvalidUrlMessage(bot, chatId);
    return;
  } else {
    bot.sendMessage(chatId, 'Processing...').then((processingMsg) => {
      const messageId: number | TelegramBotAPI.MessageId =
        processingMsg.message_id;
      simulateTaskProgress(chatId, messageId);

      if (!userInput.includes('/audio') && !userInput.includes('/video')) {
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
                          sendErrorDuringSendingMessage(bot, chatId);
                        });
                    } else {
                      sendErrorDuringDownloadMessage(bot, chatId);
                    }
                  })
                  .catch((error) => {
                    sendErrorDuringDownloadMessage(bot, chatId);
                  })
                  .finally(() => {
                    bot.deleteMessage(chatId, messageId);
                  });
              }
              if (chosenOption === `/video ${videoId}`) {
                bot.sendMessage(chatId, 'Video is not supported yet.');
              }
            });
          });
      }
      if (userInput.includes('/audio')) {
        const videoId: string = getVideoId(userInput);

        downloadAudio(videoId)
          .then((audioPath) => {
            if (fs.existsSync(audioPath)) {
              bot
                .sendAudio(chatId, audioPath)
                .then(() => {
                  fs.unlinkSync(audioPath);
                })
                .catch((error) => {
                  sendErrorDuringSendingMessage(bot, chatId);
                });
            } else {
              sendErrorDuringDownloadMessage(bot, chatId);
            }
          })
          .catch((error) => {
            sendErrorDuringDownloadMessage(bot, chatId);
          })
          .finally(() => {
            bot.deleteMessage(chatId, messageId);
          });
      }
    });
  }
});

const simulateTaskProgress = (
  chatId: number,
  messageId: number | TelegramBotAPI.MessageId
) => {
  let index = 0;
  const intervalId = setInterval(() => {
    const loadingText = `Processing ${LOADING_SEQUENCE[index]}`;
    bot
      .editMessageText(loadingText, {
        chat_id: chatId,
        message_id: messageId as number,
      })
      .catch((error) => {
        console.log('Parando el intervalo');
        clearInterval(intervalId);
      });

    index++;
    if (index >= LOADING_SEQUENCE.length) {
      index = 0;
    }
  }, 250);
};
