import { BotContext } from '../../interfaces/bot-context';

export interface SendMessageViewProps {
  success: boolean;
}

export function sendSendMessageView(ctx: BotContext, props: SendMessageViewProps) {
  const text = props.success ? "✉️ 訊息傳送成功！" : "✉️ 訊息傳送失敗...";

  return ctx.reply(text, {
    reply_markup: {
      resize_keyboard: true,
      keyboard: [
        [{ text: '📊 總覽' }],
      ],
    },
  });
}
