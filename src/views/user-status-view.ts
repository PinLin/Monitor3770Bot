import { TelegrafContext } from 'telegraf/typings/context';
import { OnlineUser } from '../models/online-user';

interface UserStatusViewProps {
  onlineUsers: OnlineUser[];
}

export function sendUserStatusView(ctx: TelegrafContext, props: UserStatusViewProps) {
  const { text, inlineKeyboard } = getMessageContent(props);
  return ctx.reply(text, {
    parse_mode: 'Markdown',
    reply_markup: {
      inline_keyboard: inlineKeyboard,
    },
  });
}

export async function editUserStatusView(ctx: TelegrafContext, props: UserStatusViewProps) {
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

function getMessageContent(props: UserStatusViewProps) {
  const text = "👤 使用者列表\n" +
    "\n" +
    (props.onlineUsers.length == 0 ? "目前沒有已登入的使用者\n" : "目前已登入的使用者：\n" + parseOnlineUsers(props.onlineUsers)) +
    `➖➖➖➖➖➖➖➖➖➖\n`;
  const inlineKeyboard = [
    [{ text: '🔁 重新整理', callback_data: 'refreshUserStatus' }],
  ];

  return { text, inlineKeyboard };
}

function parseOnlineUsers(onlineUsers: UserStatusViewProps['onlineUsers']) {
  let result = "";
  let index = 1;
  for (const onlineUser of onlineUsers) {
    result += "\n";
    result += `${index}. *${onlineUser.name}*\n`;
    result += onlineUser.isConnected ? "    🔷 已連線\n" : "    🔶 中斷連線\n";
    result += `    登入於 ${onlineUser.loginTime.toLocaleString([], {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: 'numeric',
      hour12: false,
    })}\n`;

    index += 1;
  }

  return result;
}
