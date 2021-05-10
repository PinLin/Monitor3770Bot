import { BotContext } from '../../models/bot-context';

export interface CancelPowerOffViewProps {
  success: boolean;
}

export function sendCancelPowerOffView(ctx: BotContext, props: CancelPowerOffViewProps) {
  const text = props.success ? "🔄 重設關機請求已送出，電腦將會保持開機狀態" : "🔄 重設關機請求送出失敗...";

  return ctx.reply(text, {
    reply_markup: {
      resize_keyboard: true,
      keyboard: [
        [{ text: '📊 總覽' }],
      ],
    },
  });
}
