import { BotContext } from '../interfaces/bot-context';
import { sendMachineNameView } from './machine-name-view';

export interface OverviewViewProps {
  machineName?: string;
  ipAddress: string;
  macAddress: string;
  isPowerOn: boolean;
  onlineUserNumber: number;
}

export async function sendOverviewView(ctx: BotContext, props: OverviewViewProps) {
  const { text, keyboard, inlineKeyboard } = getMessageContent(props);
  await sendMachineNameView(ctx, {
    machineName: props.machineName,
    keyboard,
  });
  return ctx.reply(text, {
    parse_mode: 'Markdown',
    reply_markup: {
      inline_keyboard: inlineKeyboard,
    },
  });
}

export async function editOverviewView(ctx: BotContext, props: OverviewViewProps) {
  try {
    const { text, inlineKeyboard } = getMessageContent(props);
    return await ctx.editMessageText(text, {
      parse_mode: 'Markdown',
      reply_markup: {
        inline_keyboard: inlineKeyboard,
      },
    });
  } catch (e) {
  } finally {
    ctx.answerCbQuery("重新整理完畢");
  }
}

function getMessageContent(props: OverviewViewProps) {
  const text = "📊 狀態總覽\n" +
    "\n" +
    `IP 位址： \`${props.ipAddress}\`\n` +
    `MAC 位址： \`${props.macAddress}\`\n` +
    "\n" +
    `電源狀態：${props.isPowerOn ? "已開機 ☀️" : "已關機 🌙"}\n` +
    "\n" +
    `目前共有 ${props.onlineUserNumber} 位使用者登入\n` +
    "➖➖➖➖➖➖➖➖➖➖\n";
  const keyboard = [
    [{ text: '⚡️ 電源' }, { text: '👤 使用者' }],
  ];
  const inlineKeyboard = [
    [{ text: '🔁 重新整理', callback_data: 'refreshOverview' }],
  ];

  return { text, keyboard, inlineKeyboard };
}
