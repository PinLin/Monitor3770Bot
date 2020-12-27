import { TelegrafContext } from 'telegraf/typings/context';

export interface OverviewViewProps {
  ip: string;
  isPowerOn: boolean;
  onlineUserNumber: number;
}

export function sendOverviewView(ctx: TelegrafContext, props: OverviewViewProps) {
  const { text, inlineKeyboard } = getMessageContent(props);
  return ctx.reply(text, {
    parse_mode: 'Markdown',
    reply_markup: {
      inline_keyboard: inlineKeyboard,
    },
  });
}

export async function editOverviewView(ctx: TelegrafContext, props: OverviewViewProps) {
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
    `IP： \`${props.ip}\`\n` +
    "\n" +
    `電源狀態：${props.isPowerOn ? "已開機 ☀️" : "已關機 🌙"}\n` +
    "\n" +
    `目前共有 ${props.onlineUserNumber} 位使用者登入\n` +
    "➖➖➖➖➖➖➖➖➖➖\n";
  const inlineKeyboard = [
    [{ text: '🔁 重新整理', callback_data: 'refreshOverview' }],
  ];

  return { text, inlineKeyboard };
}
