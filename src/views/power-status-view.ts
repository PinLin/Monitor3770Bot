import { BotContext } from '../interfaces/bot-context';
import { UpTime } from '../models/up-time';
import { sendMachineNameView } from './machine-name-view';

export interface PowerStatusViewProps {
  machineName?: string;
  isPowerOn: boolean;
  upTime: UpTime;
}

export async function sendPowerStatusView(ctx: BotContext, props: PowerStatusViewProps) {
  const { text, keyboard, inlineKeyboard } = getMessageContent(props);
  await sendMachineNameView(ctx, {
    machineName: props.machineName,
    keyboard,
  });
  return ctx.reply(text, {
    reply_markup: {
      inline_keyboard: inlineKeyboard,
    },
  });
}

export async function editPowerStatusView(ctx: BotContext, props: PowerStatusViewProps) {
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
  const keyboard = [
    [{ text: '🏙 開機' }, { text: '🌆 關機' }],
    [{ text: '📊 總覽' }],
  ];
  const inlineKeyboard = [
    [{ text: '🔁 重新整理', callback_data: 'refreshPowerStatus' }],
  ];

  return { text, keyboard, inlineKeyboard };
}
