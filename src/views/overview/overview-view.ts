import { BotAction } from '../../enums/bot-action';
import { UpTime } from '../../models/up-time';

export interface OverviewViewProps {
  ipAddress: string;
  macAddress: string;
  isPowerOn: boolean;
  upTime: UpTime;
  onlineUserNumber: number;
}

export function getOverviewView(props: OverviewViewProps) {
  const text = "📊 狀態總覽\n" +
    "\n" +
    `IP 位址： \`${props.ipAddress}\`\n` +
    `MAC 位址： \`${props.macAddress}\`\n` +
    "\n" +
    `電源狀態：${props.isPowerOn ? "已開機 ☀️" : "已關機 🌙"}\n` +
    `運作時間：${props.upTime.days} 天 ${props.upTime.hours} 時 ${props.upTime.minutes} 分 ${props.upTime.seconds} 秒\n` +
    "\n" +
    `目前共有 ${props.onlineUserNumber} 位使用者登入\n` +
    "➖➖➖➖➖➖➖➖➖➖\n";
  const keyboard = [
    [{ text: '🖥️ 命令' }, { text: '👤 使用者' }],
    [{ text: '🏙 開機' }, { text: '🌆 關機' }],
  ];
  const inlineKeyboard = [
    [{ text: '🔁 重新整理', callback_data: BotAction.RefreshOverview }],
  ];

  return { text, keyboard, inlineKeyboard };
}
