import { BotContext } from '../interfaces/bot-context';

export interface PowerOffViewProps {
  success: boolean;
  minutes: number;
}

export function sendPowerOffView(ctx: BotContext, props: PowerOffViewProps) {
  let text: string;
  if (props.success) {
    if (props.minutes > 0) {
      text = `🌆 關機請求已送出，電腦將在 ${props.minutes} 分鐘後關機`;
    } else {
      text = "🌆 關機請求已送出，電腦將立即關機";
    }
  } else {
    text = "🌆 關機請求送出失敗...";
  }

  return ctx.reply(text, {
    reply_markup: {
      resize_keyboard: true,
      keyboard: [
        [{ text: '📊 總覽' }],
      ],
    },
  });
}
