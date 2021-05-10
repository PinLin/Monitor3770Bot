import { BotContext } from '../../models/bot-context';

export interface PowerOnViewProps {
  success: boolean;
}

export function sendPowerOnView(ctx: BotContext, props: PowerOnViewProps) {
  const text = props.success ? "🏙 開機請求已送出，請等候電腦開機完成" : "🏙 開機請求送出失敗...";

  return ctx.reply(text, {
    reply_markup: {
      resize_keyboard: true,
      keyboard: [
        [{ text: '📊 總覽' }],
      ],
    },
  });
}
