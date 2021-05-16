import { BotAction } from '../../enums/bot-action';
import { OnlineUser } from '../../models/online-user';

export interface UserStatusViewProps {
  onlineUsers: OnlineUser[];
}

export function getUserStatusView(props: UserStatusViewProps) {
  const text = "👤 使用者列表\n" +
    "\n" +
    (props.onlineUsers.length == 0 ? "目前沒有已登入的使用者\n" : "目前已登入的使用者：\n" + parseOnlineUsers(props.onlineUsers)) +
    "➖➖➖➖➖➖➖➖➖➖\n";
  const keyboard = [
    [{ text: '📊 總覽' }],
  ];
  const inlineKeyboard = [
    [{ text: '🔁 重新整理', callback_data: BotAction.RefreshUserStatus }],
  ];

  return { text, keyboard, inlineKeyboard };
}

function parseOnlineUsers(onlineUsers: UserStatusViewProps['onlineUsers']) {
  let result = "";
  let index = 1;
  for (const onlineUser of onlineUsers) {
    result += "\n";
    result += `${index}. *${onlineUser.name}*\n`;
    result += `    ${onlineUser.isConnected ? "🔷 已連線" : "🔶 中斷連線"} /message\\_${onlineUser.name}\n`;
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
