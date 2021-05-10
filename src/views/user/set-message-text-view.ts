import { BotContext } from '../../interfaces/bot-context';

export interface SetMessageTextViewProps {
  username: string;
}

export function sendSetMessageTextView(ctx: BotContext, props: SetMessageTextViewProps) {
  return ctx.replyWithMarkdown('✉️ 訊息傳送\n' +
    '\n' +
    `要傳送什麼訊息給 *${props.username}* 呢？`, {
    reply_markup: {
      resize_keyboard: true,
      keyboard: [
        [{ text: '🔙 取消' }],
      ],
    },
  });
}
