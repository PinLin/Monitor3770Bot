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
  return {
    text: getText(props),
    keyboard: [
      [{ text: '🖥️ 命令' }, { text: '👤 使用者' }],
      [{ text: '🏙 開機' }, { text: '🌆 關機' }],
    ],
    inlineKeyboard: [
      [{ text: '🔁 重新整理', callback_data: BotAction.RefreshOverview }],
    ]
  };
}

function getText(props: OverviewViewProps) {
  const builder = [] as string[];
  builder.push("📊 狀態總覽");
  builder.push("");
  builder.push(`IP 位址： \`${props.ipAddress}\``);
  builder.push(`MAC 位址： \`${props.macAddress}\``);
  builder.push("");
  builder.push(`電源狀態：${props.isPowerOn ? "已開機 ☀️" : "已關機 🌙"}`);
  if (props.isPowerOn) {
    builder.push(`運作時間：${props.upTime.days} 天 ${props.upTime.hours} 時 ${props.upTime.minutes} 分 ${props.upTime.seconds} 秒`);
  }
  builder.push("");
  builder.push(`目前共有 ${props.onlineUserNumber} 位使用者登入`);
  builder.push("➖➖➖➖➖➖➖➖➖➖");

  return builder.join('\n');
}
