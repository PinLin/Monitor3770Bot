import { BotContext } from '../../models/bot-context';

export function sendStartInputCommandView(ctx: BotContext) {
  return ctx.reply('🖥️ 命令\n' +
    '\n' +
    '請輸入您的命令。', {
    reply_markup: {
      resize_keyboard: true,
      keyboard: [
        [{ text: '🔙 取消' }],
      ],
    },
  });
}
