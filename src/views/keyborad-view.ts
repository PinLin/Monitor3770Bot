import { TelegrafContext } from 'telegraf/typings/context';
import { KeyboardButton } from 'telegraf/typings/telegram-types';

export interface KeyboardViewProps {
  computerName: string;
  keyboard: KeyboardButton[][];
}

export function sendKeyboardView(ctx: TelegrafContext, props: KeyboardViewProps) {
  return ctx.reply(`🖥 *${props.computerName}*`, {
    parse_mode: 'Markdown',
    reply_markup: {
      resize_keyboard: true,
      keyboard: props.keyboard,
    },
  });
}
