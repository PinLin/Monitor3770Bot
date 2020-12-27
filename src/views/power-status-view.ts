import { TelegrafContext } from 'telegraf/typings/context';
import { UpTime } from '../models/up-time';

export interface PowerStatusViewProps {
  isPowerOn: boolean;
  upTime: UpTime;
}

export function sendPowerStatusView(ctx: TelegrafContext, props: PowerStatusViewProps) {
  const { text, inlineKeyboard } = getMessageContent(props);
  return ctx.reply(text, {
    reply_markup: {
      inline_keyboard: inlineKeyboard,
    },
  });
}

export async function editPowerStatusView(ctx: TelegrafContext, props: PowerStatusViewProps) {
  try {
    const { text, inlineKeyboard } = getMessageContent(props);
    return await ctx.editMessageText(text, {
      reply_markup: {
        inline_keyboard: inlineKeyboard,
      },
    });
  } catch (e) {
  } finally {
    ctx.answerCbQuery("重新整理完畢");
  }
}

function getMessageContent(props: PowerStatusViewProps) {
  const text = "⚡️ 電源狀態\n" +
    "\n" +
    `電源狀態：${props.isPowerOn ? "已開機 ☀️" : "已關機 🌙"}\n` +
    `運作時間：${props.upTime.days} 天 ${props.upTime.hours} 時 ${props.upTime.minutes} 分 ${props.upTime.seconds} 秒\n` +
    "➖➖➖➖➖➖➖➖➖➖\n";
  const inlineKeyboard = [
    [{ text: '🔁 重新整理', callback_data: 'refreshPowerStatus' }],
  ];

  return { text, inlineKeyboard };
}
