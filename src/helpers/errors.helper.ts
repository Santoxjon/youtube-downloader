import TelegramBotAPI from 'node-telegram-bot-api';

export const sendInvalidUrlMessage = (bot: TelegramBotAPI, chatId: number) => {
  bot.sendMessage(
    chatId,
    '❌ *ERROR* ❌\nURL is not valid\\. Please be sure to send a valid YouTube URL\\.\n\nExamples:\n`https://www.youtube.com/watch?v=XXXXXXXXXXX`\n`https://youtu.be/XXXXXXXXXXX`',
    { parse_mode: 'MarkdownV2', disable_web_page_preview: true }
  );
};
