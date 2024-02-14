import TelegramBotAPI from 'node-telegram-bot-api';

export const sendInvalidMessage = (bot: TelegramBotAPI, chatId: number) => {
  bot.sendMessage(
    chatId,
    '❌ *ERROR* ❌\nInvalid command\\. Please use one of the following commands:\n\n`/audio <YouTube URL>`\n`/video <YouTube URL>`',
    { parse_mode: 'MarkdownV2', disable_web_page_preview: true }
  );
};

export const sendInvalidUrlMessage = (bot: TelegramBotAPI, chatId: number) => {
  bot.sendMessage(
    chatId,
    '❌ *ERROR* ❌\nURL is not valid\\. Please be sure to send a valid YouTube URL\\.\n\nExamples:\n`https://www.youtube.com/watch?v=XXXXXXXXXXX`\n`https://youtu.be/XXXXXXXXXXX`',
    { parse_mode: 'MarkdownV2', disable_web_page_preview: true }
  );
};

export const sendErrorDuringDownloadMessage = (
  bot: TelegramBotAPI,
  chatId: number
) => {
  bot.sendMessage(
    chatId,
    '❌ *ERROR* ❌\nAn error occurred while downloading the video\\.\nPlease try again later\\.',
    { parse_mode: 'MarkdownV2', disable_web_page_preview: true }
  );
};

export const sendErrorDuringSendingMessage = (
  bot: TelegramBotAPI,
  chatId: number
) => {
  bot.sendMessage(
    chatId,
    '❌ *ERROR* ❌\nAn error occurred while sending the audio\\.\nPlease try again later\\.',
    { parse_mode: 'MarkdownV2', disable_web_page_preview: true }
  );
};
