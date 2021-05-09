import { BotContext } from '../interfaces/bot-context';

export interface NoPermissionViewProps {
  id: number;
}

export function sendNoPermissionView(ctx: BotContext, props: NoPermissionViewProps) {
  return ctx.reply(`🔒 此帳號（ \`${props.id}\` ）不在允許清單內，沒有權限使用。`, {
    parse_mode: 'Markdown',
    reply_markup: {
      remove_keyboard: true,
    },
  });
}
