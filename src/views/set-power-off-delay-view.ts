import { BotContext } from '../interfaces/bot-context';

export function sendSetPowerOffDelayView(ctx: BotContext) {
  return ctx.reply('🌆 關機\n' +
    '\n' +
    '希望幾分鐘後關機呢？', {
    reply_markup: {
      resize_keyboard: true,
      keyboard: [
        [{ text: '🔙 取消' }],
        [{ text: '10 分鐘' }, { text: '5 分鐘' }, { text: '🚨 馬上' }],
      ],
    },
  });
}
